import { describe, it, expect } from 'vitest';
import { buildPrompt } from './scoring';

describe('AI LLM Scoring Logic', () => {
  it('should generate a valid system prompt including transcript details', () => {
    const transcript = "This is a viral hook that catches attention, then delivers exactly what it promised with a strong payoff.";

    const prompt = buildPrompt(transcript);

    expect(prompt).toContain(transcript);
    expect(prompt).toContain("hook");
    expect(prompt).toContain("clarity");
    expect(prompt).toContain("payoff");
    expect(prompt).toContain("JSON");
  });
});
