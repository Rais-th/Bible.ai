'use server';

/**
 * @fileOverview This file defines a flow for suggesting relevant Bible verses based on a user query using OpenRouter.
 *
 * - aiVerseSelection - A function that takes a user query and returns a list of relevant Bible verses.
 * - AiVerseSelectionInput - The input type for the aiVerseSelection function.
 * - AiVerseSelectionOutput - The return type for the aiVerseSelection function.
 */

import {createOpenRouterClient} from '@/ai/openrouter';
import {z} from 'zod';

const AiVerseSelectionInputSchema = z.object({
  query: z
    .string()
    .describe("A query related to a life situation or topic for which the user wants to find relevant Bible verses."),
});
export type AiVerseSelectionInput = z.infer<typeof AiVerseSelectionInputSchema>;

const AiVerseSelectionOutputSchema = z.object({
  verses: z.array(
    z.string().describe("A relevant Bible verse reference (e.g., 'John 3:16').")
  ).describe("A list of Bible verse references relevant to the user's query."),
});
export type AiVerseSelectionOutput = z.infer<typeof AiVerseSelectionOutputSchema>;

export async function aiVerseSelection(input: AiVerseSelectionInput): Promise<AiVerseSelectionOutput> {
  const prompt = `Return a JSON object with a "verses" array containing Bible verse references that are deeply relevant to this query: {{{query}}}

Example format:
{
  "verses": ["John 3:16", "Romans 8:28", "Philippians 4:13"]
}

Return ONLY the JSON object. No explanations or additional text.`;

  try {
    const openRouter = createOpenRouterClient();
    const result = await openRouter.generateStructured<AiVerseSelectionOutput>(
      prompt,
      AiVerseSelectionOutputSchema,
      input
    );
    
    return result;
  } catch (error) {
    console.error('Error in aiVerseSelection:', error);
    // Fallback with some default verses
    return {
      verses: ["Jeremiah 29:11", "Philippians 4:13", "Romans 8:28"]
    };
  }
}
