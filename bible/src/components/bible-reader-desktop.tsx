"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { bibleService, type BibleVerse } from '@/lib/bible-service';
import { 
  BIBLE_STRUCTURE, 
  BOOK_CHAPTERS, 
  FRENCH_BOOK_NAMES,
  SWAHILI_BOOK_NAMES,
  LINGALA_BOOK_NAMES,
  SHI_BOOK_NAMES,
  TRANSLATIONS,
  getLocalizedBookName,
  type BibleBook,
  type BibleTranslation 
} from '@/lib/bible-constants';
import { ChevronDown, ChevronLeft, ChevronRight, Minus, Plus, BookOpen, Heart, Lightbulb, ALargeSmall, Globe2 } from 'lucide-react';
import { NebulaBackground } from '@/components/nebula-background';

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 32;
const DEFAULT_FONT_SIZE = 16;
const STORAGE_KEY = 'bible_reader_position';
const DEFAULT_POSITION = {
  book: 'Genesis' as BibleBook,
  chapter: '1',
  translation: 'web' as BibleTranslation
};

interface BiblePosition {
  book: BibleBook;
  chapter: string;
  translation: BibleTranslation;
}

export function BibleReader() {
  const [selectedBook, setSelectedBook] = useState<BibleBook>(DEFAULT_POSITION.book);
  const [selectedChapter, setSelectedChapter] = useState<string>(DEFAULT_POSITION.chapter);
  const [selectedTranslation, setSelectedTranslation] = useState<BibleTranslation>(DEFAULT_POSITION.translation);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('bible_font_size')) || DEFAULT_FONT_SIZE;
    }
    return DEFAULT_FONT_SIZE;
  });
  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [isChapterSelectorOpen, setIsChapterSelectorOpen] = useState(false);
  const [isFontSizeSelectorOpen, setIsFontSizeSelectorOpen] = useState(false);
  const [isTranslationSelectorOpen, setIsTranslationSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const bookSelectorRef = useRef<HTMLDivElement>(null);
  const chapterSelectorRef = useRef<HTMLDivElement>(null);
  const fontSizeSelectorRef = useRef<HTMLDivElement>(null);
  const translationSelectorRef = useRef<HTMLDivElement>(null);

  // Load saved position on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPosition = localStorage.getItem(STORAGE_KEY);
        if (savedPosition) {
          const { book, chapter, translation } = JSON.parse(savedPosition) as BiblePosition;
          if (book && chapter && BOOK_CHAPTERS[book] && TRANSLATIONS[translation]) {
            setSelectedBook(book);
            setSelectedChapter(chapter);
            setSelectedTranslation(translation);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading saved position:', error);
      }
      
      // Set default position if no valid saved position
      setSelectedBook(DEFAULT_POSITION.book);
      setSelectedChapter(DEFAULT_POSITION.chapter);
      setSelectedTranslation(DEFAULT_POSITION.translation);
    }
  }, []);

  // Save position whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedBook && selectedChapter) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          book: selectedBook,
          chapter: selectedChapter,
          translation: selectedTranslation
        }));
      } catch (error) {
        console.error('Error saving position:', error);
      }
    }
  }, [selectedBook, selectedChapter, selectedTranslation]);

  // Save font size whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bible_font_size', fontSize.toString());
    }
  }, [fontSize]);

  // Scroll detection for auto-hide/show navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      
      // Only trigger if scroll difference is significant (avoid micro-scrolls)
      if (scrollDifference > 10) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past threshold - hide navigation
          setIsNavVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show navigation
          setIsNavVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Initialize navigation visibility based on content
  useEffect(() => {
    if (verses.length > 0) {
      // Start with navigation visible when content loads
      setIsNavVisible(true);
      setLastScrollY(0);
    }
  }, [verses]);

  useEffect(() => {
    async function loadChapterVerses() {
      if (selectedBook && selectedChapter) {
        setIsLoading(true);
        try {
          const chapterVerses = await bibleService.getChapter(selectedBook, parseInt(selectedChapter), selectedTranslation);
          setVerses(chapterVerses);
        } catch (error) {
          console.error('Error loading verses:', error);
          setVerses([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setVerses([]);
      }
    }
    loadChapterVerses();
  }, [selectedBook, selectedChapter, selectedTranslation]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bookSelectorRef.current && !bookSelectorRef.current.contains(event.target as Node)) {
        setIsBookSelectorOpen(false);
      }
      if (chapterSelectorRef.current && !chapterSelectorRef.current.contains(event.target as Node)) {
        setIsChapterSelectorOpen(false);
      }
      if (fontSizeSelectorRef.current && !fontSizeSelectorRef.current.contains(event.target as Node)) {
        setIsFontSizeSelectorOpen(false);
      }
      if (translationSelectorRef.current && !translationSelectorRef.current.contains(event.target as Node)) {
        setIsTranslationSelectorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setSelectedChapter('1'); // Reset to chapter 1 when book changes
    setIsBookSelectorOpen(false);
  };

  const handleChapterSelect = (chapter: string) => {
    setSelectedChapter(chapter);
    setIsChapterSelectorOpen(false);
  };

  const handleTranslationSelect = (translation: BibleTranslation) => {
    setSelectedTranslation(translation);
    setIsTranslationSelectorOpen(false);
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    const currentChapter = parseInt(selectedChapter);
    const maxChapters = BOOK_CHAPTERS[selectedBook];
    
    if (direction === 'prev' && currentChapter > 1) {
      setSelectedChapter((currentChapter - 1).toString());
    } else if (direction === 'next' && currentChapter < maxChapters) {
      setSelectedChapter((currentChapter + 1).toString());
    }
  };

  // Generate array of chapters based on the selected book
  const availableChapters = selectedBook
    ? Array.from({ length: BOOK_CHAPTERS[selectedBook] }, (_, i) => (i + 1).toString())
    : [];

  // Get the book name in the current language
  const getBookName = (book: BibleBook) => {
    return getLocalizedBookName(book, selectedTranslation);
  };

  // Helper function for UI text localization
  const getUIText = (key: string) => {
    const texts: Record<BibleTranslation, Record<string, string>> = {
      'web': {
        'chapter': 'Chapter',
        'selectChapter': 'Select Chapter',
        'fontSize': 'Font Size',
        'previousChapter': 'Previous Chapter',
        'nextChapter': 'Next Chapter',
        'oldTestament': 'Old Testament',
        'newTestament': 'New Testament',
        'noVerses': 'No verses found for this chapter.',
        'selectToRead': 'Select a book and chapter to begin reading.'
      },
      'lsg': {
        'chapter': 'Chapitre',
        'selectChapter': 'Sélectionner un chapitre',
        'fontSize': 'Taille du texte',
        'previousChapter': 'Chapitre précédent',
        'nextChapter': 'Chapitre suivant',
        'oldTestament': 'Ancien Testament',
        'newTestament': 'Nouveau Testament',
        'noVerses': 'Aucun verset trouvé pour ce chapitre.',
        'selectToRead': 'Sélectionnez un livre et un chapitre pour commencer la lecture.'
      },
      'swa': {
        'chapter': 'Sura',
        'selectChapter': 'Chagua Sura',
        'fontSize': 'Ukubwa wa Maandishi',
        'previousChapter': 'Sura Iliyotangulia',
        'nextChapter': 'Sura Inayofuata',
        'oldTestament': 'Agano la Kale',
        'newTestament': 'Agano Jipya',
        'noVerses': 'Hakuna mistari iliyopatikana kwa sura hii.',
        'selectToRead': 'Chagua kitabu na sura ili kuanza kusoma.'
      },
      'lin': {
        'chapter': 'Chapitre',
        'selectChapter': 'Pona chapitre',
        'fontSize': 'Bonene ya makomi',
        'previousChapter': 'Chapitre ya liboso',
        'nextChapter': 'Chapitre ya sima',
        'oldTestament': 'Boyokani ya Kala',
        'newTestament': 'Boyokani ya Sika',
        'noVerses': 'Maloba te na chapitre oyo.',
        'selectToRead': 'Pona buku mpe chapitre mpo na kobanda kotanga.'
      },
      'shi': {
        'chapter': 'Isomo',
        'selectChapter': 'Gula isomo',
        'fontSize': 'Ubunene bw\'amashusho',
        'previousChapter': 'Isomo ly\'ibere',
        'nextChapter': 'Isomo ly\'inyuma',
        'oldTestament': 'Isezerano ry\'Akale',
        'newTestament': 'Isezerano Ripya',
        'noVerses': 'Nta magambo y\'isomo iri.',
        'selectToRead': 'Gula igitabo n\'isomo kugira usomere.'
      }
    };
    
    return texts[selectedTranslation]?.[key] || texts['web'][key] || key;
  };

  // Helper function for testament names
  const getTestamentName = (testament: string) => {
    if (testament === 'Old Testament') {
      return getUIText('oldTestament');
    } else if (testament === 'New Testament') {
      return getUIText('newTestament');
    }
    return testament;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-6 relative pb-32"
    >
      {/* Background */}
      <NebulaBackground
        lightImageUrl="/Whitegrey.png"
        darkImageUrl="/Darkwall.png"
      />

      {/* Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl relative z-20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Translation Selector */}
          <div className="relative" ref={translationSelectorRef}>
            <Button
              onClick={() => setIsTranslationSelectorOpen(!isTranslationSelectorOpen)}
              className="w-full lg:w-auto bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-6 py-2 flex items-center justify-between text-white"
            >
              <Globe2 className="h-5 w-5 mr-2" />
              {TRANSLATIONS[selectedTranslation].name}
              <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${isTranslationSelectorOpen ? 'rotate-180' : ''}`} />
            </Button>
            <AnimatePresence>
              {isTranslationSelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-40 mt-2 w-full lg:w-72 bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl p-2"
                >
                  {Object.entries(TRANSLATIONS).map(([id, translation]) => (
                    <Button
                      key={id}
                      variant="ghost"
                      className={`w-full justify-start px-3 py-2 text-sm text-white hover:bg-white/20 ${selectedTranslation === id ? 'bg-white/20 font-semibold' : ''}`}
                      onClick={() => handleTranslationSelect(id as BibleTranslation)}
                    >
                      <span className="flex items-center">
                        {translation.name}
                        <span className="ml-2 text-xs text-white/60">({translation.language})</span>
                      </span>
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Book Selector */}
          <div className="relative" ref={bookSelectorRef}>
            <Button
              onClick={() => setIsBookSelectorOpen(!isBookSelectorOpen)}
              className="w-full lg:w-auto bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-6 py-2 flex items-center justify-between text-white"
            >
              {getBookName(selectedBook)}
              <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${isBookSelectorOpen ? 'rotate-180' : ''}`} />
            </Button>
            <AnimatePresence>
              {isBookSelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-40 mt-2 w-full lg:w-72 max-h-80 overflow-y-auto bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl p-2 custom-scrollbar"
                >
                  {Object.entries(BIBLE_STRUCTURE).map(([testament, books]) => (
                    <div key={testament} className="mb-2">
                      <h3 className="text-xs font-semibold text-gray-300 uppercase px-2 py-1">
                        {getTestamentName(testament)}
                      </h3>
                      {books.map((book) => (
                        <Button
                          key={book}
                          variant="ghost"
                          className={`w-full justify-start px-3 py-2 text-sm text-white hover:bg-white/20 ${selectedBook === book ? 'bg-white/20 font-semibold' : ''}`}
                          onClick={() => handleBookSelect(book as BibleBook)}
                        >
                          {getBookName(book as BibleBook)}
                        </Button>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chapter Selector */}
          <div className="relative" ref={chapterSelectorRef}>
            <Button
              onClick={() => setIsChapterSelectorOpen(!isChapterSelectorOpen)}
              className="w-full lg:w-auto bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-6 py-2 flex items-center justify-between text-white"
              disabled={!selectedBook}
            >
              {selectedChapter ? 
                `${getUIText('chapter')} ${selectedChapter}` : 
                getUIText('selectChapter')}
              <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${isChapterSelectorOpen ? 'rotate-180' : ''}`} />
            </Button>
            <AnimatePresence>
              {isChapterSelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-40 mt-2 w-full lg:w-48 max-h-80 overflow-y-auto bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl p-2 custom-scrollbar"
                >
                  {availableChapters.map((chapter) => (
                    <Button
                      key={chapter}
                      variant="ghost"
                      className={`w-full justify-start px-3 py-2 text-sm text-white hover:bg-white/20 ${selectedChapter === chapter ? 'bg-white/20 font-semibold' : ''}`}
                      onClick={() => handleChapterSelect(chapter)}
                    >
                      {getUIText('chapter')} {chapter}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Font Size Control */}
          <div className="relative lg:ml-auto" ref={fontSizeSelectorRef}>
            <Button
              onClick={() => setIsFontSizeSelectorOpen(!isFontSizeSelectorOpen)}
              variant="outline"
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 flex items-center text-white"
            >
              <ALargeSmall className="h-5 w-5 mr-2" />
              {getUIText('fontSize')}
            </Button>
            <AnimatePresence>
              {isFontSizeSelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl p-4 z-40"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFontSize(Math.max(MIN_FONT_SIZE, fontSize - 1))}
                      className="text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-white">{fontSize}px</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFontSize(Math.min(MAX_FONT_SIZE, fontSize + 1))}
                      className="text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Slider
                    value={[fontSize]}
                    min={MIN_FONT_SIZE}
                    max={MAX_FONT_SIZE}
                    step={1}
                    onValueChange={(value) => setFontSize(value[0])}
                    className="w-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Bible Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 shadow-xl relative z-10"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : verses.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {getBookName(selectedBook)} {selectedChapter}
            </h2>
            <div className="space-y-4" style={{ fontSize: `${fontSize}px` }}>
              {verses.map((verse) => (
                <p key={verse.verse} className="text-white/90 leading-relaxed">
                  <span className="font-semibold text-white/60 mr-2">{verse.verse}</span>
                  {verse.text}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-white/60">
            {selectedBook && selectedChapter ? (
              <p>{getUIText('noVerses')}</p>
            ) : (
              <p>{getUIText('selectToRead')}</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Floating Navigation */}
      {selectedBook && selectedChapter && (
        <motion.div
          initial={{ 
            opacity: 0, 
            y: 20, 
            scaleX: 0.3, 
            scaleY: 0.1,
            borderRadius: "50px"
          }}
          animate={{ 
            opacity: isNavVisible ? 1 : 0, 
            y: isNavVisible ? 0 : 20,
            scaleX: isNavVisible ? 1 : 0.3,
            scaleY: isNavVisible ? 1 : 0.1,
            borderRadius: isNavVisible ? "48px" : "50px"
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.32, 0.72, 0, 1],
            opacity: { duration: 0.3 },
            y: { duration: 0.4 },
            scale: { duration: 0.6 },
            borderRadius: { duration: 0.5 }
          }}
          className="fixed bottom-6 left-0 right-0 mx-auto z-50 bg-black/30 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl shadow-black/50 rounded-full p-5 w-fit max-w-2xl"
        >
          <motion.div 
            className="flex items-center justify-between w-full gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: isNavVisible ? 1 : 0 }}
            transition={{ 
              duration: 0.3, 
              delay: isNavVisible ? 0.2 : 0,
              ease: "easeOut"
            }}
          >
            <Button
              onClick={() => navigateChapter('prev')}
              disabled={selectedChapter === '1'}
              variant="ghost"
              size="lg"
              className="bg-white/15 hover:bg-white/25 disabled:bg-white/5 border border-white/20 text-white/95 disabled:text-white/40 disabled:opacity-40 text-base px-6 py-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5 mr-3" />
              Previous
            </Button>

            <div className="text-center px-6 flex-shrink-0">
              <p className="text-base text-white/80 font-medium whitespace-nowrap">
                Chapter {selectedChapter} / {BOOK_CHAPTERS[selectedBook]}
              </p>
            </div>

            <Button
              onClick={() => navigateChapter('next')}
              disabled={parseInt(selectedChapter) >= BOOK_CHAPTERS[selectedBook]}
              variant="ghost"
              size="lg"
              className="bg-white/15 hover:bg-white/25 disabled:bg-white/5 border border-white/20 text-white/95 disabled:text-white/40 disabled:opacity-40 text-base px-6 py-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-3" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

