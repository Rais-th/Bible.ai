import { createOpenRouterClient } from '@/ai/openrouter';
import { apiBibleService } from './api-bible-service';
import { 
  type BibleBook, 
  type BibleTranslation, 
  BOOK_ID_MAPPING, 
  BOOK_NAME_MAPPING,
  TRANSLATIONS
} from './bible-constants';

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface AIVerseResponse {
  verses: string[];
}

export class BibleService {
  private openRouter = createOpenRouterClient();
  private useApiBible = true; // Feature flag to switch between APIs

  // Get Bible ID for translation using hardcoded values
  private getBibleId(translation: BibleTranslation): string {
    return TRANSLATIONS[translation].apiBibleId;
  }

  // Parse HTML content from API.Bible to extract verses
  private parseApiBibleContent(htmlContent: string): BibleVerse[] {
    const verses: BibleVerse[] = [];
    
    try {
      // Strategy 1: Parse by verse spans - look for complete verse content
      const verseSpanRegex = /<span class="verse-span"[^>]*data-verse-id="[^"]*\.(\d+)"[^>]*>(.*?)<\/span>/g;
      let match;
      
      while ((match = verseSpanRegex.exec(htmlContent)) !== null) {
        const verseNumber = parseInt(match[1]);
        let verseContent = match[2];
        
        // Remove the verse number span but keep the rest
        verseContent = verseContent.replace(/<span[^>]*class="v"[^>]*>\d+<\/span>/g, '');
        
        // Clean up the text
        let verseText = verseContent
          .replace(/<[^>]*>/g, '') // Remove all HTML tags
          .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
          .replace(/&amp;/g, '&') // Replace &amp; with &
          .replace(/&lt;/g, '<') // Replace &lt; with <
          .replace(/&gt;/g, '>') // Replace &gt; with >
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        if (verseText && verseText.length > 1) {
          // Check if we already have this verse number, if so, append to it
          const existingVerse = verses.find(v => v.verse === verseNumber);
          if (existingVerse) {
            // Only append if the new text doesn't start with a number (to avoid duplication)
            if (!/^\d+/.test(verseText)) {
              existingVerse.text += ' ' + verseText;
            }
          } else {
            verses.push({
              verse: verseNumber,
              text: verseText
            });
          }
        }
      }
      
      // Strategy 2: If no verses found or verses are fragmented, try paragraph-based parsing
      if (verses.length === 0 || verses.some(v => v.text.length < 10)) {
        verses.length = 0; // Clear any fragmented results
        
        // Look for paragraph content and parse more carefully
        const paragraphs = htmlContent.match(/<p[^>]*class="p"[^>]*>([\s\S]*?)<\/p>/g) || [];
        
        for (const paragraph of paragraphs) {
          // Remove outer p tags
          let content = paragraph.replace(/<\/?p[^>]*>/g, '');
          
          // Find verse number patterns and collect text until next verse
          const versePattern = /<span[^>]*class="v"[^>]*>(\d+)<\/span>/g;
          const verseMatches = [...content.matchAll(versePattern)];
          
          for (let i = 0; i < verseMatches.length; i++) {
            const currentMatch = verseMatches[i];
            const nextMatch = verseMatches[i + 1];
            const verseNumber = parseInt(currentMatch[1]);
            
            // Extract text from current verse to next verse (or end)
            const startIndex = currentMatch.index! + currentMatch[0].length;
            const endIndex = nextMatch ? nextMatch.index! : content.length;
            
            let verseText = content.substring(startIndex, endIndex)
              .replace(/<[^>]*>/g, '') // Remove HTML tags
              .replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (verseText && verseText.length > 3) {
              verses.push({
                verse: verseNumber,
                text: verseText
              });
            }
          }
        }
      }
      
      // Strategy 3: Fallback - clean text parsing
      if (verses.length === 0) {
        const cleanContent = htmlContent
          .replace(/<[^>]*>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Look for verse patterns: number followed by text until next number
        const verseMatches = cleanContent.match(/(\d+)\s+([^0-9]+?)(?=\s+\d+\s+|$)/g);
        
        if (verseMatches) {
          for (const verseMatch of verseMatches) {
            const match = verseMatch.match(/^(\d+)\s+(.+)/);
            if (match) {
              const verseNumber = parseInt(match[1]);
              const verseText = match[2].trim();
              
              if (verseText && verseText.length > 5) {
                verses.push({
                  verse: verseNumber,
                  text: verseText
                });
              }
            }
          }
        }
      }
      
      // Clean up and deduplicate verses
      const cleanedVerses = verses.reduce((acc, verse) => {
        const existing = acc.find(v => v.verse === verse.verse);
        if (!existing) {
          // Clean the verse text to remove any leading numbers that might be duplicated
          let cleanText = verse.text.replace(/^\d+\s*/, '').trim();
          if (cleanText.length > 0) {
            acc.push({
              verse: verse.verse,
              text: cleanText
            });
          }
        } else {
          // If we have a duplicate, keep the longer version but clean it
          let cleanText = verse.text.replace(/^\d+\s*/, '').trim();
          if (cleanText.length > existing.text.length) {
            existing.text = cleanText;
          }
        }
        return acc;
      }, [] as BibleVerse[]);
      
      return cleanedVerses.sort((a, b) => a.verse - b.verse);
      
    } catch (error) {
      console.error('Error parsing API.Bible content:', error);
      return [];
    }
  }

  // Fallback to old API if needed
  private async getChapterFromOldApi(book: BibleBook, chapter: number, translation: BibleTranslation): Promise<BibleVerse[]> {
    const translationMap = {
      'web': 'web',
      'lsg': 'lsg'
    };
    
    const apiTranslation = translationMap[translation] || 'web';
    const url = `https://bible-api.com/${book}+${chapter}?translation=${apiTranslation}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch chapter: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.verses.map((verse: any) => ({
      verse: verse.verse,
      text: verse.text
    }));
  }

  async getChapter(book: BibleBook, chapter: number, translation: BibleTranslation = 'web'): Promise<BibleVerse[]> {
    if (!this.useApiBible) {
      return this.getChapterFromOldApi(book, chapter, translation);
    }

    try {
      const bibleId = this.getBibleId(translation);
      if (!bibleId) {
        console.warn(`No Bible ID found for translation: ${translation}, falling back to old API`);
        return this.getChapterFromOldApi(book, chapter, translation);
      }

      const bookId = BOOK_ID_MAPPING[book];
      if (!bookId) {
        throw new Error(`Unknown book: ${book}`);
      }

      // Construct chapter ID in the format expected by API.Bible
      const chapterId = `${bookId}.${chapter}`;

      // Get the chapter content from API.Bible using the correct method
      const chapterContent = await apiBibleService.getChapter(bibleId, chapterId, {
        contentType: 'html',
        includeVerseNumbers: true,
        includeVerseSpans: true
      });
      
      if (!chapterContent || !chapterContent.content) {
        console.warn('No content returned from API.Bible, falling back to old API');
        return this.getChapterFromOldApi(book, chapter, translation);
      }

      // Parse the HTML content to extract verses
      const verses = this.parseApiBibleContent(chapterContent.content);
      
      if (verses.length === 0) {
        console.warn('No verses parsed from API.Bible content, falling back to old API');
        return this.getChapterFromOldApi(book, chapter, translation);
      }

      return verses;

    } catch (error) {
      console.error('Error fetching from API.Bible:', error);
      console.log('Falling back to old API...');
      return this.getChapterFromOldApi(book, chapter, translation);
    }
  }

  async getVersesByAI(query: string): Promise<AIVerseResponse> {
    try {
      const response = await this.openRouter.chat([
        {
          role: 'system',
          content: `You are a wise Biblical scholar and spiritual guide with deep knowledge of Scripture. Your purpose is to help people find relevant Bible verses that speak to their hearts and situations.

CRITICAL FORMATTING RULES:
- ALWAYS format Bible references as: "Book Chapter:Verse" (e.g., "John 3:16", "Psalm 23:1", "Romans 8:28")
- Use the EXACT book names from the 66-book Protestant canon
- NEVER use abbreviations or alternative book names
- ALWAYS include chapter AND verse numbers
- Separate multiple verses with commas: "John 3:16, Romans 8:28"

RESPONSE GUIDELINES:
- Provide 2-4 relevant Bible verses maximum
- Choose verses that directly address the person's query
- Focus on hope, comfort, guidance, and God's love
- Avoid overly complex theological debates
- Speak with warmth and pastoral care

VALIDATION CHECKLIST:
✓ All references use exact book names (Genesis, Exodus, Matthew, etc.)
✓ All references include chapter:verse format
✓ Maximum 4 verses provided
✓ Verses directly relate to the query
✓ Response offers spiritual encouragement

Remember: You are ministering to someone seeking God's word. Let Scripture speak with power and love.`
        },
        {
          role: 'user',
          content: query
        }
      ], 'mistralai/mistral-7b-instruct:free');

      // Extract Bible references from the response
      const verseRegex = /([1-3]?\s*[A-Za-z]+)\s+(\d+):(\d+)/g;
      const verses: string[] = [];
      let match;

      while ((match = verseRegex.exec(response)) !== null) {
        const book = match[1].trim();
        const chapter = match[2];
        const verse = match[3];
        verses.push(`${book} ${chapter}:${verse}`);
      }

      return { verses: verses.slice(0, 4) }; // Limit to 4 verses
    } catch (error) {
      console.error('Error getting AI verses:', error);
      return { verses: [] };
    }
  }

  async explainVerse(reference: string, verse: string): Promise<string> {
    try {
      const response = await this.openRouter.chat([
        {
          role: 'system',
          content: `You are a compassionate Biblical scholar and spiritual counselor with deep theological knowledge and pastoral heart. Your role is to provide meaningful, accessible explanations of Scripture that nurture faith and understanding.

EXPLANATION APPROACH:
- Provide clear, accessible explanations suitable for all believers
- Include historical/cultural context when helpful
- Connect the verse to practical Christian living
- Emphasize God's love, grace, and faithfulness
- Use warm, encouraging language
- Keep explanations concise but meaningful (2-3 paragraphs maximum)

THEOLOGICAL FOUNDATION:
- Scripture is God's inspired Word
- Focus on the Gospel message of salvation through Christ
- Emphasize themes of hope, redemption, and God's character
- Avoid denominational controversies
- Present truth with love and humility

PASTORAL CARE:
- Speak as a caring shepherd to God's people
- Offer comfort and encouragement
- Help readers see how the verse applies to their lives
- Point toward Jesus Christ and His finished work
- Build faith and trust in God's promises

Remember: You are helping someone understand God's Word. Let your explanation be both scholarly and spiritually nourishing.`
        },
        {
          role: 'user',
          content: `Please explain this Bible verse: ${reference} - "${verse}"`
        }
      ], 'mistralai/mistral-7b-instruct:free');

      return response || 'Unable to provide explanation at this time.';
    } catch (error) {
      console.error('Error explaining verse:', error);
      return 'Unable to provide explanation at this time.';
    }
  }
}

// Export a default instance for backward compatibility
export const bibleService = new BibleService(); 