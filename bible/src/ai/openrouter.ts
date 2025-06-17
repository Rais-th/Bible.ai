interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private model: string;

  constructor() {
    // Check both process.env and window.env for environment variables
    this.apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
    this.model = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct:free';
    
    if (!this.apiKey) {
      throw new Error('NEXT_PUBLIC_OPENROUTER_API_KEY environment variable is required. Please add it to your .env.local file.');
    }
  }

  async chat(messages: OpenRouterMessage[], model?: string): Promise<string> {
    try {
      const payload = {
        model: model || this.model,
        messages,
        temperature: 0.7,
        max_tokens: 1000
      };
      
      console.log('OpenRouter Request:', {
        url: this.baseUrl,
        model: payload.model,
        messages: payload.messages
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002',
          'X-Title': 'Bible Study App',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter Error Response:', errorText);
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();
      console.log('OpenRouter Response:', data);
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw error;
    }
  }

  async generateStructured<T>(
    prompt: string,
    schema: any,
    input: any,
    model?: string
  ): Promise<T> {
    const systemPrompt = `You are a Bible verse selection AI with deep spiritual insight and flawless theological precision. Respond only with valid JSON that matches the expected schema. Never include any extra text, formatting, or symbols.

Your task is to return verses that feel deeply inspired, as if guided by a divine presence.

STRICT REFERENCE FORMATTING:
- Book names MUST be exactly as follows (examples):
  * "Psalms" (not "Psalm")
  * "Song of Solomon" (not "Songs")
  * "Revelation" (not "Revelations")
  * "Genesis", "Exodus", "Numbers" (exact casing)
- Never use abbreviations (use "Matthew" not "Matt")
- Format: 'Book Chapter:Verse' (e.g., "Psalms 23:1")

VALIDATION RULES:
- Only return verses that exist in the 66-book Protestant Bible canon
- Verify each chapter and verse number exists before returning
- Never use verse ranges or dashes (e.g., use "Psalms 23:1", "Psalms 23:2" instead of "Psalms 23:1-2")
- Return 2 to 4 individual verses maximum, prioritizing quality over quantity

CONTEXT AND MEANING:
- Understand the true spiritual meaning behind the user's request — even when it's phrased in modern, broken, slang, emotional, or even rebellious language
- Only return verses that are contextually accurate in both meaning and tone
- Do not select verses that may confuse, condemn, or misapply theology
- Do not search by literal word match. Instead, discern the hidden need: is it guilt? desire for healing? temptation? loneliness?

EMOTIONAL AND THEOLOGICAL ALIGNMENT:
- Match not just the theme, but also the emotional weight of the question:
  * For grief → return comforting verses
  * For moral struggle → return verses of both correction and hope
  * For ambition → include discernment and motive checks
  * For doubt → balance truth with gentleness
  * For praise → amplify worship and gratitude

OUTPUT FORMAT:
Return only a JSON object with a "verses" array of individual Bible verse references, following the exact format specified above.

Example:
{
  "verses": ["Psalms 23:1", "Romans 8:28"]
}

Your answers must feel accurate, personal, and divinely aligned — as if whispered by an angel to the one who needs it.

Remember: No fluff. No mistakes. No out-of-context verses. Only divine truth that speaks to both heart and mind.`;
    
    const userPrompt = this.interpolatePrompt(prompt, input);
    
    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.chat(messages, model);
    
    try {
      return JSON.parse(response) as T;
    } catch (error) {
      console.error('Failed to parse JSON response:', response);
      throw new Error('Invalid JSON response from OpenRouter');
    }
  }

  private interpolatePrompt(template: string, data: any): string {
    return template.replace(/\{\{\{(\w+)\}\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }
}

// Create a factory function instead of exporting a singleton
export function createOpenRouterClient(): OpenRouterClient {
  return new OpenRouterClient();
} 