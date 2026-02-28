/**
 * electron/handlers/supabase.js (Phase 8 — Client Approval Portal)
 *
 * Handles pushing local generated .mp4 files directly into a configured
 * Supabase Storage bucket and generating standard public URLs mapping to
 * ReviewLink records in Prisma.
 */

const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const keytar = require('keytar');
const prisma = require('../prisma');

const SERVICE_NAME = 'AutoClipperApp';

async function getSetting(key, fallback = '') {
  const val = await keytar.getPassword(SERVICE_NAME, key);
  return val || fallback;
}

// Ensure Supabase is configured
async function getSupabaseClient() {
  const url = await getSetting('supabase_url');
  const key = await getSetting('supabase_anon_key');
  if (!url || !key) return null;
  return createClient(url, key);
}

// ── IPC Handlers ─────────────────────────────────────────────────────────────

ipcMain.handle('supabase:createReviewLink', async (_, { projectId, clipId, localFilePath }) => {
  try {
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File not found: ${localFilePath}`);
    }

    const supabase = await getSupabaseClient();
    if (!supabase) {
      throw new Error("Supabase URL or Anon Key is missing in Settings.");
    }

    const fileName = path.basename(localFilePath);
    const bucketName = 'review_assets'; // hardcoded bucket target for approvals
    const storagePath = `${Date.now()}_${fileName}`;
    const fileBuffer = fs.readFileSync(localFilePath);

    // 1. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, fileBuffer, {
        contentType: 'video/mp4',
        upsert: false
      });

    if (uploadError) {
      // If the bucket doesn't exist, we might try to create it here if the API key has
      // rights, but usually it requires service-role. Assume the bucket exists.
      throw new Error(`Storage error: ${uploadError.message}`);
    }

    // 2. Generate Public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Create ReviewLink in Prisma
    const reviewLink = await prisma.reviewLink.create({
      data: {
        projectId,
        clipId,
        cloudUrl: publicUrl,
        status: "PENDING",
      }
    });

    return { success: true, reviewLink };
  } catch (e) {
    console.error('[Supabase ReviewLink]', e.message);
    return { success: false, error: e.message };
  }
});

ipcMain.handle('supabase:getReviewLinks', async (_, { projectId }) => {
  try {
    const where = {};
    if (projectId) where.projectId = projectId;

    const links = await prisma.reviewLink.findMany({
      where,
      include: {
        clip: true,
        project: true
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, links };
  } catch (e) {
    console.error('[Supabase getReviewLinks]', e.message);
    return { success: false, error: e.message };
  }
});

ipcMain.handle('supabase:deleteReviewLink', async (_, { id }) => {
  try {
    // Optionally delete from bucket as well
    const link = await prisma.reviewLink.findUnique({ where: { id } });
    if (!link) throw new Error("Link not found");

    const supabase = await getSupabaseClient();
    if (supabase) {
      // attempt to delete based on the url
      const urlParts = link.cloudUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('review_assets').remove([fileName]).catch(() => {});
    }

    await prisma.reviewLink.delete({ where: { id } });
    return { success: true };
  } catch (e) {
    console.error('[Supabase deleteReviewLink]', e.message);
    return { success: false, error: e.message };
  }
});

ipcMain.handle('supabase:updateReviewStatus', async (_, { id, status, comments }) => {
  try {
    const updated = await prisma.reviewLink.update({
      where: { id },
      data: { status, comments, updatedAt: new Date() }
    });
    return { success: true, link: updated };
  } catch (e) {
    console.error('[Supabase updateReviewStatus]', e.message);
    return { success: false, error: e.message };
  }
});

module.exports = {};
