import { ClipCandidate } from "./segmentation";

// We assume global window.electronAPI is defined in a definitive types file or page.tsx is satisfying it.
// To avoid TS interface collisions, we use \`any\` cast for the API boundary safely since preload.js injects it.

export interface AiScores {
  hook: number;
  clarity: number;
  payoff: number;
  standalone: number;
  explanation: string;
}

export interface ScoredCandidate extends ClipCandidate {
  scores: AiScores;
  totalScore: number;
}

/**
 * Builds the generic LLM prompt for evaluating a clip.
 */
export function buildPrompt(transcript: string) {
  return `
You are an expert AI video editor for TikTok/Shorts/Reels. Given the following transcript segment, rate it from 0-25 for each category:
1. Hook: Does the start immediately grab attention?
2. Clarity: Is the message clear and easy to understand without extra context?
3. Payoff: Is there a satisfying punchline, lesson, or conclusion at the end?
4. Standalone: Does the clip make sense as an independent video?

Also provide a 1-sentence explanation of your rating.
Return ONLY valid JSON matching this schema:
{
  "hook": number,
  "clarity": number,
  "payoff": number,
  "standalone": number,
  "explanation": "string"
}

Transcript:
"""
${transcript}
"""
`;
}

/**
 * Sends prompt to OpenAI or Ollama via Electron IPC securely.
 */
async function callLlm(prompt: string): Promise<AiScores> {
  // Simple fallback mock if running outside electron (e.g. browser preview mode)
  const isElectron = typeof window !== "undefined" && "electronAPI" in window;
  if (!isElectron) {
    console.warn("Electron API not found, returning mock scores.");
    return {
      hook: 15,
      clarity: 15,
      payoff: 15,
      standalone: 15,
      explanation: "Fallback/Mock response since Electron IPC is missing.",
    };
  }

  const api = (window as unknown as { 
    electronAPI: { aiScore: (prompt: string, provider: string) => Promise<{ success: boolean; scores?: AiScores; error?: string }> }
  }).electronAPI;

  // Attempt Local AI first (Local-first mindset as per user)
  let result = await api.aiScore(prompt, "local");

  // If local fails, fallback to Cloud (OpenAI)
  if (!result.success) {
    console.warn("Local AI failed, falling back to OpenAI...");
    result = await api.aiScore(prompt, "openai");
  }

  if (result.success && result.scores) {
    return result.scores;
  }

  throw new Error(`LLM Scoring failed: ${result.error}`);
}

/**
 * Scores a batch of candidates and returns the top ones.
 */
export async function scoreCandidates(candidates: ClipCandidate[], limit = 5): Promise<ScoredCandidate[]> {
  const scoredDefferred = candidates.map(async (c) => {
    const prompt = buildPrompt(c.transcriptText);
    const scores = await callLlm(prompt);
    const totalScore = scores.hook + scores.clarity + scores.payoff + scores.standalone;
    return { ...c, scores, totalScore };
  });

  const scored = await Promise.all(scoredDefferred);
  // Sort descending 
  scored.sort((a, b) => b.totalScore - a.totalScore);
  return scored.slice(0, limit);
}

/**
 * Scores a single candidate. Returns null if scoring fails.
 */
export async function scoreCandidate(candidate: ClipCandidate): Promise<ScoredCandidate | null> {
  try {
    const prompt = buildPrompt(candidate.transcriptText);
    const scores = await callLlm(prompt);
    const totalScore = scores.hook + scores.clarity + scores.payoff + scores.standalone;
    return { ...candidate, scores, totalScore };
  } catch {
    return null;
  }
}
