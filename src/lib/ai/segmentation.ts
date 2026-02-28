import { TranscriptSegment, TranscriptWord } from "./transcribe";

export interface ClipCandidate {
  startMs: number;
  endMs: number;
  wordCount: number;
  transcriptText: string;
  chunks: { 
    startMs: number; 
    endMs: number; 
    text: string; 
    words: { startMs: number; endMs: number; text: string }[];
  }[];
}

export interface CandidateGenerationOptions {
  minDurationSec: number;
  idealDurationSec: number;
  maxDurationSec: number;
}

/**
 * Finds natural boundaries (punctuation or long silences) to snap the clip cleanly.
 */
function isBoundaryWord(word: TranscriptWord, nextWord?: TranscriptWord): boolean {
  // Punctuation check (including Japanese/Chinese full width punctuation)
  const hasPunctuation = /[.!?。！？]/.test(word.punctuated_word);
  
  // Silence check (if gap between this word and next is > 0.8 seconds)
  const isSilence = nextWord ? (nextWord.start - word.end) > 0.8 : true;

  return hasPunctuation || isSilence;
}

/**
 * Generates valid clip candidates from a transcript using a sliding window.
 */
export function generateCandidates(
  segments: TranscriptSegment[], 
  options: CandidateGenerationOptions
): ClipCandidate[] {
  const candidates: ClipCandidate[] = [];
  
  // Flatten all words from all segments
  const allWords = segments.flatMap(s => s.words);
  if (allWords.length === 0) return [];

  const minMs = options.minDurationSec * 1000;
  const maxMs = options.maxDurationSec * 1000;
  
  // Sliding window parameters
  const stepMs = 5000; // Slide window every 5 seconds

  let currentStartIdx = 0;

  while (currentStartIdx < allWords.length) {
    const startWord = allWords[currentStartIdx];
    let endIdx = currentStartIdx;
    
    // Find potential endpoint satisfying min/max duration
    while (endIdx < allWords.length) {
      const endWord = allWords[endIdx];
      const durationMs = (endWord.end - startWord.start) * 1000;

      const isAtMaxDuration = durationMs >= maxMs;
      const isNaturalBoundary = durationMs >= minMs && isBoundaryWord(endWord, allWords[endIdx + 1]);

      if (isNaturalBoundary || isAtMaxDuration) {
          const slice = allWords.slice(currentStartIdx, endIdx + 1);
          
          // Chunk words into subtitle lines (e.g. max 5 words or 30 chars)
          const chunks: { 
            startMs: number; 
            endMs: number; 
            text: string; 
            words: { startMs: number; endMs: number; text: string }[] 
          }[] = [];

          let currentChunkWords: typeof slice = [];
          
          for (let i = 0; i < slice.length; i++) {
            currentChunkWords.push(slice[i]);
            const textSoFar = currentChunkWords.map(w => w.punctuated_word).join(" ");
            
            // Break chunk if we hit max words, max chars, or sentence boundary
            if (
              currentChunkWords.length >= 6 || 
              textSoFar.length >= 35 || 
              /[.!?]/.test(slice[i].punctuated_word) ||
              i === slice.length - 1
            ) {
              chunks.push({
                startMs: Math.floor(currentChunkWords[0].start * 1000),
                endMs: Math.floor(currentChunkWords[currentChunkWords.length - 1].end * 1000),
                text: textSoFar,
                words: currentChunkWords.map(cw => ({
                  startMs: Math.floor(cw.start * 1000),
                  endMs: Math.floor(cw.end * 1000),
                  text: cw.punctuated_word
                }))
              });
              currentChunkWords = [];
            }
          }

          candidates.push({
            startMs: Math.floor(startWord.start * 1000),
            endMs: Math.floor(endWord.end * 1000),
            wordCount: slice.length,
            transcriptText: slice.map(w => w.punctuated_word).join(" "),
            chunks,
          });
          break; // Found a valid end for this start point
      }

      if (durationMs > maxMs) {
        break; // Stop looking if we exceed max duration
      }
      
      endIdx++;
    }

    // Advance start index forward slightly to find next candidate (overlapping allowed)
    // Find the next word that starts roughly `stepMs` after the current start
    const targetStartMs = startWord.start * 1000 + stepMs;
    while (currentStartIdx < allWords.length && (allWords[currentStartIdx].start * 1000) < targetStartMs) {
      currentStartIdx++;
    }
  }

  return candidates;
}
