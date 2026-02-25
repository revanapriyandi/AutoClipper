import { describe, it, expect } from 'vitest';
import { generateCandidates } from './segmentation';

describe('AI Segmentation Logic', () => {
  it('should generate valid candidate segments from a raw Word transcript', () => {
    // Mock Word array with 1 second gaps to simulate a fast speaker
    const mockTranscript = [
      { word: "hello", punctuated_word: "Hello", start: 0, end: 1, confidence: 1 },
      { word: "everyone", punctuated_word: "everyone.", start: 1, end: 2, confidence: 1 },
      { word: "this", punctuated_word: "This", start: 3, end: 4, confidence: 1 }, // 1s silence gap
      { word: "is", punctuated_word: "is", start: 4, end: 5, confidence: 1 },
      { word: "a", punctuated_word: "a", start: 5, end: 6, confidence: 1 },
      { word: "test", punctuated_word: "test.", start: 6, end: 7, confidence: 1 },
    ];

    const mockSegments = [{ 
      start: 0, 
      end: 7, 
      text: "Hello everyone. This is a test.", 
      words: mockTranscript 
    }];

    const candidates = generateCandidates(mockSegments, {
      minDurationSec: 2,
      idealDurationSec: 5,
      maxDurationSec: 10,
    });

    expect(candidates).toBeDefined();
    // We expect candidates to exist since the array duration is 7 seconds 
    // and min limit is 2 seconds
    expect(candidates.length).toBeGreaterThan(0);

    const firstCandidate = candidates[0];
    
    // Check timing boundaries
    expect(firstCandidate.startMs).toBeGreaterThanOrEqual(0);
    expect(firstCandidate.endMs).toBeLessThanOrEqual(10000);
    
    // Check that Karaoke chunks were generated
    expect(firstCandidate.chunks).toBeDefined();
    expect(firstCandidate.chunks.length).toBeGreaterThan(0);
    
    // Check that the word-level timings mapped correctly
    expect(firstCandidate.chunks[0].words).toBeDefined();
    expect(firstCandidate.chunks[0].words.length).toBeGreaterThan(0);
    expect(firstCandidate.chunks[0].words[0].text).toBe("Hello");
  });

  it('should ignore candidates smaller than minDurationSec', () => {
    const briefTranscript = [
      { word: "wait", punctuated_word: "Wait!", start: 0, end: 0.5, confidence: 1 },
    ];

    const mockSegments = [{ 
      start: 0, 
      end: 0.5, 
      text: "Wait!", 
      words: briefTranscript 
    }];

    const candidates = generateCandidates(mockSegments, {
      minDurationSec: 2,
      idealDurationSec: 5,
      maxDurationSec: 10,
    });

    // Should return no candidates because the 0.5s duration is below 2s MinDuration
    expect(candidates.length).toBe(0);
  });
});
