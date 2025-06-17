'use server';

/**
 * @fileOverview An AI explanation agent that explains why the AI selected specific bible verses for a user query using OpenRouter.
 *
 * - explainVerseSelection - A function that handles the verse selection explanation process.
 * - ExplainVerseSelectionInput - The input type for the explainVerseSelection function.
 * - ExplainVerseSelectionOutput - The return type for the explainVerseSelection function.
 */

import {createOpenRouterClient} from '@/ai/openrouter';
import {z} from 'zod';

const ExplainVerseSelectionInputSchema = z.object({
  query: z.string().describe('The original user query.'),
  verses: z.array(z.string()).describe('The list of bible verses selected by the AI.'),
});
export type ExplainVerseSelectionInput = z.infer<typeof ExplainVerseSelectionInputSchema>;

const ExplainVerseSelectionOutputSchema = z.object({
  explanation: z.string().describe('The explanation of why the AI selected the given verses for the given query.'),
});
export type ExplainVerseSelectionOutput = z.infer<typeof ExplainVerseSelectionOutputSchema>;

export async function explainVerseSelection(input: ExplainVerseSelectionInput): Promise<ExplainVerseSelectionOutput> {
  const prompt = `You are an AI expert in understanding the Bible. A user has asked the query: {{{query}}}. You have selected the following verses: {{{verses}}}. 

The output MUST be a JSON object with an "explanation" field containing your explanation.

Example output format:
{
  "explanation": "These verses were selected because they directly address the theme of hope and trust in God's plan, which is central to your query about finding purpose in difficult times."
}

Explain why you selected these verses in relation to the query. Be concise and clear in your explanation.

User Query: {{{query}}}
Selected Verses: {{{verses}}}`;

  try {
    const openRouter = createOpenRouterClient();
    const result = await openRouter.generateStructured<ExplainVerseSelectionOutput>(
      prompt,
      ExplainVerseSelectionOutputSchema,
      input
    );
    
    return result;
  } catch (error) {
    console.error('Error in explainVerseSelection:', error);
    // Fallback explanation
    return {
      explanation: "These verses were selected based on their relevance to your query and their ability to provide spiritual guidance and comfort."
    };
  }
}
