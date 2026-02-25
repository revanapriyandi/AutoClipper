/**
 * enrichment.ts
 * 
 * Phase 4: Auto-Emoji injection and B-Roll keyword extraction.
 * Uses LLM to analyze transcript text and:
 *  1. Inject relevant emojis into subtitle chunk text.
 *  2. Extract B-Roll keywords for stock footage searching.
 */

import { ScoredCandidate } from "./scoring";

export interface Enrichment {
  emojiText: string;   // Subtitle text with emojis injected
  brollKeywords: string[];  // Keywords to use for B-Roll search (Pexels API)
}

export interface ChunkWithEmoji {
  startMs: number;
  endMs: number;
  text: string; // Emoji-injected text
  words: { startMs: number; endMs: number; text: string }[];
}

/**
 * Map keywords → emojis to minimize LLM calls.
 * Covers most viral short-form video topics.
 */
const EMOJI_MAP: Record<string, string> = {
  // Money / finance
  money: "💸", uang: "💸", rich: "💰", kaya: "💰", profit: "📈", investasi: "📈",
  // Emotions
  laugh: "😂", lucu: "😂", shock: "😱", surprising: "😱", love: "❤️", cinta: "❤️",
  angry: "😡", happy: "😊", bahagia: "😊", sad: "😢", sedih: "😢",
  // Action / lifestyle
  fire: "🔥", panas: "🔥", viral: "🚀", rocket: "🚀", win: "🏆", menang: "🏆",
  food: "🍔", makan: "🍔", travel: "✈️", perjalanan: "✈️", gym: "💪", olahraga: "💪",
  // Tech
  ai: "🤖", technology: "💻", coding: "💻", program: "💻", hack: "⚡",
  // Business
  boss: "👔", business: "💼", startup: "🚀", idea: "💡", tips: "💡", trick: "💡",
  // Nature
  nature: "🌿", pohon: "🌿", animal: "🦁", hewan: "🦁", ocean: "🌊", laut: "🌊",
};

/**
 * Injects emojis into a text line based on keyword matching.
 */
function injectEmojis(text: string): string {
  let enriched = text;
  const lower = text.toLowerCase();

  for (const [keyword, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(keyword)) {
      // Inject emoji at end of sentence or after keyword
      enriched = enriched + " " + emoji;
      break; // Only add one emoji per chunk to avoid clutter
    }
  }
  return enriched;
}

/**
 * Extracts B-Roll search keywords from a list of scored candidates.
 * Uses a simple NLP heuristic - nouns/topics from transcripts.
 */
function extractBRollKeywords(transcriptText: string): string[] {
  // Simple approach: extract distinctive nouns from the transcript
  // In production, this would call the LLM to identify visual topics
  const stopwords = new Set([
    "the", "a", "an", "is", "it", "this", "that", "with", "and", "or", 
    "but", "so", "for", "of", "to", "in", "at", "on", "you", "i", "we",
    "yang", "dan", "di", "ke", "dari", "untuk", "ini", "itu", "adalah"
  ]);

  const words = transcriptText.toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 4 && !stopwords.has(w));

  // Deduplicate and take first 3
  return Array.from(new Set(words)).slice(0, 3);
}

/**
 * Processes a candidate clip and injects emojis + B-Roll keywords.
 */
export function enrichCandidate(candidate: ScoredCandidate): {
  candidate: ScoredCandidate;
  brollKeywords: string[];
} {
  const enrichedChunks: ChunkWithEmoji[] = candidate.chunks.map(chunk => ({
    ...chunk,
    text: injectEmojis(chunk.text),
  }));

  const brollKeywords = extractBRollKeywords(candidate.transcriptText);

  return {
    candidate: {
      ...candidate,
      chunks: enrichedChunks,
    },
    brollKeywords,
  };
}

/**
 * Enriches an array of candidates with emoji injection and B-Roll keywords.
 */
export function enrichCandidates(candidates: ScoredCandidate[]): {
  enriched: ScoredCandidate[];
  brollKeywordMap: Record<number, string[]>;
} {
  const enriched: ScoredCandidate[] = [];
  const brollKeywordMap: Record<number, string[]> = {};

  candidates.forEach((candidate, i) => {
    const result = enrichCandidate(candidate);
    enriched.push(result.candidate);
    brollKeywordMap[i] = result.brollKeywords;
  });

  return { enriched, brollKeywordMap };
}
