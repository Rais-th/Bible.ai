interface Bible {
  id: string;
  name: string;
  nameLocal: string;
  abbreviation: string;
  abbreviationLocal: string;
  language: {
    id: string;
    name: string;
    nameLocal: string;
    script: string;
    scriptDirection: string;
  };
  copyrightStatement?: string;
}

interface Book {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
}

interface Chapter {
  id: string;
  bibleId: string;
  bookId: string;
  number: string;
  position?: number;
}

interface ChapterContent {
  id: string;
  bibleId: string;
  bookId: string;
  number: string;
  content: string;
  next?: {
    id: string;
    number: string;
    bookId: string;
  };
  previous?: {
    id: string;
    number: string;
    bookId: string;
  };
}

interface Verse {
  id: string;
  orgId: string;
  bookId: string;
  chapterId: string;
  bibleId: string;
  content?: string;
}

interface SearchResult {
  id: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  text: string;
  reference: string;
}

interface ApiBibleResponse<T> {
  data: T;
  meta?: {
    fums?: string;
    fumsId?: string;
    fumsJsInclude?: string;
    fumsJs?: string;
    fumsNoScript?: string;
  };
}

export class ApiBibleService {
  private baseUrl = 'https://api.scripture.api.bible/v1';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_API_BIBLE_KEY || '';
    if (!this.apiKey) {
      console.warn('API.Bible API key not found. Please set NEXT_PUBLIC_API_BIBLE_KEY environment variable.');
    }
  }

  private async makeRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'api-key': this.apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API.Bible Error (${response.status}):`, errorText);
      throw new Error(`API.Bible request failed: ${response.status} ${response.statusText}`);
    }

    const data: ApiBibleResponse<T> = await response.json();
    return data.data;
  }

  async getBibles(language?: string): Promise<Bible[]> {
    const params: Record<string, string> = {};
    if (language) {
      params.language = language;
    }
    
    return this.makeRequest<Bible[]>('/bibles', params);
  }

  async getBible(bibleId: string): Promise<Bible> {
    return this.makeRequest<Bible>(`/bibles/${bibleId}`);
  }

  async getBooks(bibleId: string, includeChapters = false): Promise<Book[]> {
    const params: Record<string, string> = {};
    if (includeChapters) {
      params['include-chapters'] = 'true';
    }
    
    return this.makeRequest<Book[]>(`/bibles/${bibleId}/books`, params);
  }

  async getBook(bibleId: string, bookId: string, includeChapters = false): Promise<Book> {
    const params: Record<string, string> = {};
    if (includeChapters) {
      params['include-chapters'] = 'true';
    }
    
    return this.makeRequest<Book>(`/bibles/${bibleId}/books/${bookId}`, params);
  }

  async getChapters(bibleId: string, bookId: string): Promise<Chapter[]> {
    return this.makeRequest<Chapter[]>(`/bibles/${bibleId}/books/${bookId}/chapters`);
  }

  async getChapter(
    bibleId: string, 
    chapterId: string, 
    options: {
      contentType?: 'html' | 'json' | 'text';
      includeNotes?: boolean;
      includeTitles?: boolean;
      includeChapterNumbers?: boolean;
      includeVerseNumbers?: boolean;
      includeVerseSpans?: boolean;
    } = {}
  ): Promise<ChapterContent> {
    const params: Record<string, string> = {};
    
    if (options.contentType) {
      params['content-type'] = options.contentType;
    }
    if (options.includeNotes !== undefined) {
      params['include-notes'] = options.includeNotes.toString();
    }
    if (options.includeTitles !== undefined) {
      params['include-titles'] = options.includeTitles.toString();
    }
    if (options.includeChapterNumbers !== undefined) {
      params['include-chapter-numbers'] = options.includeChapterNumbers.toString();
    }
    if (options.includeVerseNumbers !== undefined) {
      params['include-verse-numbers'] = options.includeVerseNumbers.toString();
    }
    if (options.includeVerseSpans !== undefined) {
      params['include-verse-spans'] = options.includeVerseSpans.toString();
    }

    return this.makeRequest<ChapterContent>(`/bibles/${bibleId}/chapters/${chapterId}`, params);
  }

  async getVerses(bibleId: string, chapterId: string): Promise<Verse[]> {
    return this.makeRequest<Verse[]>(`/bibles/${bibleId}/chapters/${chapterId}/verses`);
  }

  async getVerse(
    bibleId: string, 
    verseId: string,
    options: {
      contentType?: 'html' | 'json' | 'text';
      includeNotes?: boolean;
      includeTitles?: boolean;
      includeChapterNumbers?: boolean;
      includeVerseNumbers?: boolean;
      includeVerseSpans?: boolean;
    } = {}
  ): Promise<Verse & { content: string }> {
    const params: Record<string, string> = {};
    
    if (options.contentType) {
      params['content-type'] = options.contentType;
    }
    if (options.includeNotes !== undefined) {
      params['include-notes'] = options.includeNotes.toString();
    }
    if (options.includeTitles !== undefined) {
      params['include-titles'] = options.includeTitles.toString();
    }
    if (options.includeChapterNumbers !== undefined) {
      params['include-chapter-numbers'] = options.includeChapterNumbers.toString();
    }
    if (options.includeVerseNumbers !== undefined) {
      params['include-verse-numbers'] = options.includeVerseNumbers.toString();
    }
    if (options.includeVerseSpans !== undefined) {
      params['include-verse-spans'] = options.includeVerseSpans.toString();
    }

    return this.makeRequest<Verse & { content: string }>(`/bibles/${bibleId}/verses/${verseId}`, params);
  }

  async search(
    bibleId: string, 
    query: string, 
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<SearchResult[]> {
    const params: Record<string, string> = {
      query: query,
    };
    
    if (options.limit !== undefined) {
      params.limit = options.limit.toString();
    }
    if (options.offset !== undefined) {
      params.offset = options.offset.toString();
    }

    return this.makeRequest<SearchResult[]>(`/bibles/${bibleId}/search`, params);
  }

  // Helper method to find Bible by language and name
  async findBible(language: string, namePattern?: string): Promise<Bible | null> {
    try {
      const bibles = await this.getBibles(language);
      
      if (!namePattern) {
        return bibles.length > 0 ? bibles[0] : null;
      }
      
      // Try to find by name pattern (case insensitive)
      const pattern = namePattern.toLowerCase();
      const found = bibles.find(bible => 
        bible.name.toLowerCase().includes(pattern) ||
        bible.nameLocal.toLowerCase().includes(pattern) ||
        bible.abbreviation.toLowerCase().includes(pattern) ||
        bible.abbreviationLocal.toLowerCase().includes(pattern)
      );
      
      return found || null;
    } catch (error) {
      console.error('Error finding Bible:', error);
      return null;
    }
  }

  // Helper method to get book ID from book name
  async findBookId(bibleId: string, bookName: string): Promise<string | null> {
    try {
      const books = await this.getBooks(bibleId);
      
      const found = books.find(book => 
        book.name.toLowerCase() === bookName.toLowerCase() ||
        book.nameLong.toLowerCase() === bookName.toLowerCase() ||
        book.abbreviation.toLowerCase() === bookName.toLowerCase()
      );
      
      return found?.id || null;
    } catch (error) {
      console.error('Error finding book:', error);
      return null;
    }
  }
}

// Export a default instance
export const apiBibleService = new ApiBibleService(); 