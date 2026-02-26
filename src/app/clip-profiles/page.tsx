"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Trash, Layers, CheckCircle2, Palette } from "lucide-react";

interface ClipProfile {
  id: string;
  name: string;
  configJson: string;
  createdAt: string;
}

interface ProfileConfig {
  minDurationSec: number;
  maxDurationSec: number;
  idealDurationSec: number;
  platform: string;
  format: string;
  fontFamily: string;
  primaryColor: string;
  outlineColor: string;
  alignment: string;
  notes: string;
}

const DEFAULT_CONFIG: ProfileConfig = {
  minDurationSec: 15,
  maxDurationSec: 60,
  idealDurationSec: 30,
  platform: "youtube",
  format: "9:16",
  fontFamily: "Impact",
  primaryColor: "&H0000FFFF",
  outlineColor: "&H00000000",
  alignment: "2",
  notes: "",
};

export default function ClipProfilesPage() {
  const [profiles, setProfiles] = useState<ClipProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [cfg, setCfg] = useState<ProfileConfig>(DEFAULT_CONFIG);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const api = typeof window !== "undefined" ? window.electronAPI : undefined;

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    try {
      // Use ClipProfile table through a custom IPC handler we'll add to db.js
      const res = await (api as unknown as { dbGetClipProfiles?: () => Promise<{ success: boolean; profiles?: ClipProfile[] }> })?.dbGetClipProfiles?.();
      if (res?.success && res.profiles) setProfiles(res.profiles);
    } catch {}
    setLoading(false);
  }, [api]);

  useEffect(() => { loadProfiles(); }, [loadProfiles]);

  const show = (text: string, ok = true) => {
    setNotice({ text, ok });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleCreate = async () => {
    if (!name.trim()) { show("Profile name is required.", false); return; }
    setSaving(true);
    try {
      const res = await (api as unknown as { dbCreateClipProfile?: (d: { name: string; configJson: string }) => Promise<{ success: boolean; error?: string }> })?.dbCreateClipProfile?.({
        name: name.trim(),
        configJson: JSON.stringify(cfg),
      });
      if (res?.success) {
        show(`Profile "${name}" created!`);
        setName("");
        setCfg(DEFAULT_CONFIG);
        loadProfiles();
      } else {
        show(res?.error || "Failed to create profile", false);
      }
    } catch {
      show("Error creating profile", false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await (api as unknown as { dbDeleteClipProfile?: (id: string) => Promise<{ success: boolean }> })?.dbDeleteClipProfile?.(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
      show("Profile deleted.");
    } catch {}
  };

  const handleApply = (profile: ClipProfile) => {
    try {
      const parsed = JSON.parse(profile.configJson) as ProfileConfig;
      setCfg({ ...DEFAULT_CONFIG, ...parsed });
      setName(profile.name + " (copy)");
      setCopiedId(profile.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  return (
    <div className="grid gap-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Layers className="h-7 w-7 text-primary" />
          Clip Profiles
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Simpan konfigurasi clip lengkap (durasi, style, platform) dan terapkan ke project baru dengan satu klik.
        </p>
      </div>

      {notice && (
        <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg border ${notice.ok ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
          <CheckCircle2 className="h-4 w-4" />
          {notice.text}
        </div>
      )}

      {/* Create Profile Form */}
      <Card>
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle>Create New Profile</CardTitle>
          <CardDescription>Define reusable settings for clip generation and styling.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          <div className="space-y-2">
            <Label className="font-semibold text-sm">Profile Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 'Podcast Shorts 9:16'" className="max-w-sm" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Clip Duration */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Min Duration (s)</Label>
              <Input type="number" value={cfg.minDurationSec} onChange={e => setCfg(p => ({ ...p, minDurationSec: +e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Max Duration (s)</Label>
              <Input type="number" value={cfg.maxDurationSec} onChange={e => setCfg(p => ({ ...p, maxDurationSec: +e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Ideal Duration (s)</Label>
              <Input type="number" value={cfg.idealDurationSec} onChange={e => setCfg(p => ({ ...p, idealDurationSec: +e.target.value }))} />
            </div>

            {/* Platform & Format */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Target Platform</Label>
              <select value={cfg.platform} onChange={e => setCfg(p => ({ ...p, platform: e.target.value }))} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="youtube">YouTube Shorts</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram Reels</option>
                <option value="all">All Platforms</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Export Format</Label>
              <select value={cfg.format} onChange={e => setCfg(p => ({ ...p, format: e.target.value }))} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="9:16">9:16 Vertical</option>
                <option value="16:9">16:9 Landscape</option>
                <option value="1:1">1:1 Square</option>
                <option value="4:5">4:5 Portrait</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Font Family</Label>
              <select value={cfg.fontFamily} onChange={e => setCfg(p => ({ ...p, fontFamily: e.target.value }))} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                {["Impact", "Arial", "Roboto", "Montserrat", "Comic Sans MS"].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Karaoke Color</Label>
              <select value={cfg.primaryColor} onChange={e => setCfg(p => ({ ...p, primaryColor: e.target.value }))} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="&H0000FFFF">Yellow</option>
                <option value="&H0000FF00">Green</option>
                <option value="&H00FF0000">Blue</option>
                <option value="&H00FFFFFF">White</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Outline Color</Label>
              <select value={cfg.outlineColor} onChange={e => setCfg(p => ({ ...p, outlineColor: e.target.value }))} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="&H00000000">Black</option>
                <option value="&H00FFFFFF">White</option>
                <option value="&H000000FF">Red</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">Alignment</Label>
              <select value={cfg.alignment} onChange={e => setCfg(p => ({ ...p, alignment: e.target.value }))} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                <option value="2">Bottom Center</option>
                <option value="8">Top Center</option>
                <option value="5">Middle Center</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Notes</Label>
            <Input value={cfg.notes} onChange={e => setCfg(p => ({ ...p, notes: e.target.value }))} placeholder="Optional — describe when to use this profile" />
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 justify-end p-4">
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Profile
          </Button>
        </CardFooter>
      </Card>

      {/* Profile List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Saved Profiles</h3>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading profiles...
          </div>
        ) : profiles.length === 0 ? (
          <Card className="border-dashed bg-muted/10 flex flex-col items-center justify-center py-14">
            <Palette className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">No profiles saved yet. Create one above.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map(p => {
              let cfg_parsed: Partial<ProfileConfig> = {};
              try { cfg_parsed = JSON.parse(p.configJson); } catch {}
              return (
                <Card key={p.id} className={`hover:border-primary/40 transition-colors group ${copiedId === p.id ? "border-green-500/50 bg-green-500/5" : ""}`}>
                  <CardHeader className="pb-3 bg-muted/20 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base truncate">{p.name}</CardTitle>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id)}>
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {cfg_parsed.platform && <Badge variant="secondary" className="text-[10px]">{cfg_parsed.platform}</Badge>}
                      {cfg_parsed.format && <Badge variant="outline" className="text-[10px]">{cfg_parsed.format}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2 pt-4 pb-3">
                    {cfg_parsed.minDurationSec !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{cfg_parsed.minDurationSec}s – {cfg_parsed.maxDurationSec}s</span>
                      </div>
                    )}
                    {cfg_parsed.fontFamily && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Font</span>
                        <span className="font-medium">{cfg_parsed.fontFamily}</span>
                      </div>
                    )}
                    {cfg_parsed.notes && (
                      <p className="text-muted-foreground/70 italic line-clamp-2 pt-1 border-t border-border/50">{cfg_parsed.notes}</p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 pb-3 px-4">
                    <Button variant="secondary" size="sm" className="w-full text-xs h-7" onClick={() => handleApply(p)}>
                      {copiedId === p.id ? <><CheckCircle2 className="h-3 w-3 mr-1 text-green-400" /> Applied!</> : "Apply to Form"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
