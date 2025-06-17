
// A very small subset of KJV for demonstration
const KJV_DATA: Record<string, Record<string, Record<string, string>>> = {
  "Genesis": {
    "1": {
      "1": "In the beginning God created the heaven and the earth.",
      "2": "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
      "3": "And God said, Let there be light: and there was light.",
    },
    "2": {
        "1": "Thus the heavens and the earth were finished, and all the host of them.",
        "2": "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.",
    }
  },
  "John": {
    "1": {
        "1": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "2": "The same was in the beginning with God.",
        "3": "All things were made by him; and without him was not any thing made that was made.",
    },
    "3": {
      "16": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
    },
    "14": {
      "6": "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me."
    }
  },
  "Psalms": {
    "23": {
        "1": "The LORD is my shepherd; I shall not want.",
        "2": "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
        "3": "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
        "4": "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
        "5": "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
        "6": "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever."
    },
    "119": {
      "105": "Thy word is a lamp unto my feet, and a light unto my path."
    }
  },
  "Philippians": {
    "4": {
      "13": "I can do all things through Christ which strengtheneth me."
    }
  },
  "Proverbs": {
    "3": {
      "5": "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
      "6": "In all thy ways acknowledge him, and he shall direct thy paths."
    }
  },
  "Romans": {
    "8": {
      "28": "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."
    }
  },
  "Isaiah": {
    "41": {
      "10": "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."
    }
  },
  "1 Corinthians": {
    "10": {
        "13": "There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able; but will with the temptation also make a way to escape, that ye may be able to bear it."
    }
  },
  "Ephesians": {
    "2": {
        "8": "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:",
        "9": "Not of works, lest any man should boast."
    }
  },
  "Matthew": {
      "11": {
          "28": "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
          "29": "Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls.",
          "30": "For my yoke is easy, and my burden is light."
      }
  }
};

export interface Verse {
  reference: string;
  text: string;
  verseNumber: string;
}

// Approximate grouping for demo purposes
const OLD_TESTAMENT_BOOKS = ["Genesis", "Psalms", "Proverbs", "Isaiah"];
const NEW_TESTAMENT_BOOKS = ["Matthew", "John", "Romans", "1 Corinthians", "Ephesians", "Philippians"];

export function getAvailableBooks() {
  return {
    "Ancien Testament": OLD_TESTAMENT_BOOKS.filter(book => KJV_DATA[book]),
    "Nouveau Testament": NEW_TESTAMENT_BOOKS.filter(book => KJV_DATA[book]),
  };
}

export function getChaptersForBook(bookName: string): string[] {
  if (KJV_DATA[bookName]) {
    return Object.keys(KJV_DATA[bookName]);
  }
  return [];
}

export function getVersesForChapter(bookName: string, chapterNumber: string): Verse[] {
  const verses: Verse[] = [];
  if (KJV_DATA[bookName] && KJV_DATA[bookName][chapterNumber]) {
    const chapterData = KJV_DATA[bookName][chapterNumber];
    for (const verseNum in chapterData) {
      verses.push({
        reference: `${bookName} ${chapterNumber}:${verseNum}`,
        text: chapterData[verseNum],
        verseNumber: verseNum,
      });
    }
  }
  return verses;
}


function parseVerseReference(reference: string): { book: string; chapter: string; verse: string } | null {
  const match = reference.match(/^(\d?\s?[A-Za-z]+)\s(\d+):(\d+)$/);
  if (!match) {
    const shortMatch = reference.match(/^([A-Za-z]+)\s(\d+):(\d+)$/);
    if (!shortMatch) return null;
    return { book: shortMatch[1].trim(), chapter: shortMatch[2], verse: shortMatch[3] };
  }
  return { book: match[1].trim(), chapter: match[2], verse: match[3] };
}

export function getVerseText(reference: string): string {
  const parsed = parseVerseReference(reference);
  if (!parsed) return "Invalid verse reference format.";

  const { book, chapter, verse } = parsed;
  const bookData = KJV_DATA[book];
  if (!bookData) return `Book "${book}" not found.`;

  const chapterData = bookData[chapter];
  if (!chapterData) return `Chapter ${chapter} in "${book}" not found.`;

  const verseText = chapterData[verse];
  if (!verseText) return `Verse ${verse} in "${book} ${chapter}" not found.`;

  return verseText;
}

// Kept for compatibility with existing AI search, but BibleReader will use getVersesForChapter
export function getVersesDetails(references: string[]): Omit<Verse, 'verseNumber'>[] {
  return references.map(ref => ({
    reference: ref,
    text: getVerseText(ref),
  }));
}
