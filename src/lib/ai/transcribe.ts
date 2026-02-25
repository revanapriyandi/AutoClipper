import { createClient } from "@deepgram/sdk";
import fs from "fs";

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  words: TranscriptWord[];
}

export async function transcribeWithDeepgram(
  audioPath: string, 
  apiKey: string
): Promise<TranscriptSegment[]> {
  const deepgram = createClient(apiKey);
  const audioBuffer = fs.readFileSync(audioPath);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    audioBuffer,
    {
      model: "nova-2",
      smart_format: true,
      punctuate: true,
      utterances: true,
    }
  );

  if (error) {
    throw new Error(`Deepgram transcription failed: ${error.message}`);
  }

  const results = result?.results;
  if (!results || !results.utterances) {
    throw new Error("No utterances returned from Deepgram.");
  }

  // Map deepgram utterances into our generic segment format
  const segments: TranscriptSegment[] = results.utterances.map((utt: { start: number; end: number; transcript: string; words: { word: string; start: number; end: number; confidence: number; punctuated_word?: string }[] }) => ({
    start: utt.start || 0,
    end: utt.end || 0,
    text: utt.transcript || "",
    words: (utt.words || []).map((w) => ({
      word: w.word,
      start: w.start,
      end: w.end,
      confidence: w.confidence,
      punctuated_word: w.punctuated_word || w.word,
    })),
  }));

  return segments;
}
