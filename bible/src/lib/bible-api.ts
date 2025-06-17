interface BibleVerse {
  reference: string;
  text: string;
  translation_id: string;
  translation_name: string;
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
}

interface BibleApiResponse {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
}

// Book name mappings for the API
const BOOK_ID_MAPPING: { [key: string]: string } = {
  'Genesis': 'GEN',
  'Exodus': 'EXO',
  'Leviticus': 'LEV',
  'Numbers': 'NUM',
  'Deuteronomy': 'DEU',
  'Joshua': 'JOS',
  'Judges': 'JDG',
  'Ruth': 'RUT',
  '1 Samuel': '1SA',
  '2 Samuel': '2SA',
  '1 Kings': '1KI',
  '2 Kings': '2KI',
  '1 Chronicles': '1CH',
  '2 Chronicles': '2CH',
  'Ezra': 'EZR',
  'Nehemiah': 'NEH',
  'Esther': 'EST',
  'Job': 'JOB',
  'Psalms': 'PSA',
  'Proverbs': 'PRO',
  'Ecclesiastes': 'ECC',
  'Song of Solomon': 'SNG',
  'Isaiah': 'ISA',
  'Jeremiah': 'JER',
  'Lamentations': 'LAM',
  'Ezekiel': 'EZK',
  'Daniel': 'DAN',
  'Hosea': 'HOS',
  'Joel': 'JOL',
  'Amos': 'AMO',
  'Obadiah': 'OBA',
  'Jonah': 'JON',
  'Micah': 'MIC',
  'Nahum': 'NAM',
  'Habakkuk': 'HAB',
  'Zephaniah': 'ZEP',
  'Haggai': 'HAG',
  'Zechariah': 'ZEC',
  'Malachi': 'MAL',
  'Matthew': 'MAT',
  'Mark': 'MRK',
  'Luke': 'LUK',
  'John': 'JHN',
  'Acts': 'ACT',
  'Romans': 'ROM',
  '1 Corinthians': '1CO',
  '2 Corinthians': '2CO',
  'Galatians': 'GAL',
  'Ephesians': 'EPH',
  'Philippians': 'PHP',
  'Colossians': 'COL',
  '1 Thessalonians': '1TH',
  '2 Thessalonians': '2TH',
  '1 Timothy': '1TI',
  '2 Timothy': '2TI',
  'Titus': 'TIT',
  'Philemon': 'PHM',
  'Hebrews': 'HEB',
  'James': 'JAS',
  '1 Peter': '1PE',
  '2 Peter': '2PE',
  '1 John': '1JN',
  '2 John': '2JN',
  '3 John': '3JN',
  'Jude': 'JUD',
  'Revelation': 'REV'
};

export class BibleAPI {
  private baseUrl = 'https://bible-api.com';
  private translation: string;

  constructor(translation: string = 'web') {
    this.translation = translation;
  }

  private getBookId(bookName: string): string {
    const bookId = BOOK_ID_MAPPING[bookName];
    if (!bookId) {
      throw new Error(`Invalid book name: ${bookName}`);
    }
    return bookId;
  }

  async getVerse(reference: string): Promise<BibleVerse | null> {
    try {
      const encodedRef = encodeURIComponent(reference);
      const url = `${this.baseUrl}/${encodedRef}?translation=${this.translation}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Error fetching verse ${reference}:`, response.statusText);
        return null;
      }

      const data: BibleApiResponse = await response.json();
      if (!data.verses || data.verses.length === 0) {
        return null;
      }

      return {
        ...data.verses[0],
        text: data.text.trim(),
        reference: data.reference
      };
    } catch (error) {
      console.error('Error fetching verse:', error);
      return null;
    }
  }

  async getVerses(references: string[]): Promise<BibleVerse[]> {
    const verses = await Promise.all(
      references.map(ref => this.getVerse(ref))
    );
    return verses.filter((verse): verse is BibleVerse => verse !== null);
  }

  // Get a random verse
  async getRandomVerse(bookIds?: string): Promise<BibleVerse | null> {
    try {
      const url = bookIds 
        ? `${this.baseUrl}/data/${this.translation}/random/${bookIds}`
        : `${this.baseUrl}/data/${this.translation}/random`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Error fetching random verse:', response.statusText);
        return null;
      }

      const data: BibleApiResponse = await response.json();
      if (!data.verses || data.verses.length === 0) {
        return null;
      }

      return {
        ...data.verses[0],
        text: data.text.trim(),
        reference: data.reference
      };
    } catch (error) {
      console.error('Error fetching random verse:', error);
      return null;
    }
  }

  // Get a specific chapter
  async getChapter(bookName: string, chapter: number): Promise<BibleVerse[]> {
    try {
      // Format the reference as "Book+Chapter" (e.g., "Genesis+1")
      const reference = `${bookName}+${chapter}`;
      const encodedRef = encodeURIComponent(reference);
      const url = `${this.baseUrl}/${encodedRef}?translation=${this.translation}`;
      
      console.log('Fetching chapter from URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching chapter ${bookName} ${chapter}:`, errorText);
        return [];
      }

      const data: BibleApiResponse = await response.json();
      return data.verses || [];
    } catch (error) {
      console.error('Error fetching chapter:', error);
      return [];
    }
  }
}

// Export a default instance with the World English Bible translation
export const bibleApi = new BibleAPI('web'); 