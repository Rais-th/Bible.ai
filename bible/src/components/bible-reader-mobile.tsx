"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { bibleService, type BibleVerse } from '@/lib/bible-service';
import { 
  BIBLE_STRUCTURE, 
  BOOK_CHAPTERS, 
  TRANSLATIONS,
  getLocalizedBookName,
  type BibleBook,
  type BibleTranslation 
} from '@/lib/bible-constants';
import { ChevronLeft, ChevronRight, ChevronDown, BookOpen, Minus, Plus, Globe2, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NebulaBackground } from '@/components/nebula-background';

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 28;
const DEFAULT_FONT_SIZE = 18;
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

export default function BibleReaderMobile() {
  const router = useRouter();
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [isTranslationSelectorOpen, setIsTranslationSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsPanelTop, setSettingsPanelTop] = useState(80); // Default fallback
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const bookSelectorRef = useRef<HTMLDivElement>(null);
  const translationSelectorRef = useRef<HTMLDivElement>(null);
  const titlePillRef = useRef<HTMLButtonElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Calculate settings panel position based on title pill
  useEffect(() => {
    const calculatePanelPosition = () => {
      if (titlePillRef.current) {
        const pillRect = titlePillRef.current.getBoundingClientRect();
        const pillBottom = pillRect.bottom;
        const pillTop = pillRect.top;
        
        // Position panel 8px below the pill
        const newTop = pillTop + pillRect.height + 8;
        setSettingsPanelTop(newTop);
      }
    };

    // Calculate on mount and when settings open
    if (isSettingsOpen) {
      calculatePanelPosition();
      
      // Recalculate on window resize
      window.addEventListener('resize', calculatePanelPosition);
      return () => window.removeEventListener('resize', calculatePanelPosition);
    }
  }, [isSettingsOpen]);

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
      if (!mainContentRef.current) return;
      
      const currentScrollY = mainContentRef.current.scrollTop;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      
      // Only trigger if scroll difference is significant (avoid micro-scrolls)
      if (scrollDifference > 10) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past threshold - hide navigation
          setIsNavVisible(false);
          setIsSettingsOpen(false); // Close settings when hiding
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show navigation
          setIsNavVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll, { passive: true });
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  // Initialize navigation visibility based on content
  useEffect(() => {
    if (verses.length > 0) {
      // Start with navigation visible when content loads
      setIsNavVisible(true);
      setLastScrollY(0);
    }
  }, [verses]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bookSelectorRef.current && !bookSelectorRef.current.contains(event.target as Node)) {
        setIsBookSelectorOpen(false);
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

  const handleBackToHome = () => {
    setTimeout(() => {
      router.push('/');
    }, 150);
  };

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setSelectedChapter('1'); // Reset to chapter 1 when book changes
    setIsBookSelectorOpen(false);
    setIsSettingsOpen(false); // Close settings panel
  };

  const handleTranslationSelect = (translation: BibleTranslation) => {
    setSelectedTranslation(translation);
    setIsTranslationSelectorOpen(false);
    setIsSettingsOpen(false); // Close settings panel
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

  const getBookName = (book: BibleBook) => {
    return getLocalizedBookName(book, selectedTranslation);
  };

  const getUIText = (key: string) => {
    const texts: Record<BibleTranslation, Record<string, string>> = {
      'web': {
        'chapter': 'Chapter',
        'previousChapter': 'Previous',
        'nextChapter': 'Next',
        'settings': 'Settings',
        'fontSize': 'Font Size',
        'translation': 'Translation',
        'book': 'Book',
        'noVerses': 'No verses found for this chapter.',
        'selectToRead': 'Select a book and chapter to begin reading.',
        'oldTestament': 'Old Testament',
        'newTestament': 'New Testament'
      },
      'lsg': {
        'chapter': 'Chapitre',
        'previousChapter': 'Précédent',
        'nextChapter': 'Suivant',
        'settings': 'Paramètres',
        'fontSize': 'Taille du texte',
        'translation': 'Traduction',
        'book': 'Livre',
        'noVerses': 'Aucun verset trouvé pour ce chapitre.',
        'selectToRead': 'Sélectionnez un livre et un chapitre pour commencer la lecture.',
        'oldTestament': 'Ancien Testament',
        'newTestament': 'Nouveau Testament'
      },
      'swa': {
        'chapter': 'Sura',
        'previousChapter': 'Iliyotangulia',
        'nextChapter': 'Inayofuata',
        'settings': 'Mipangilio',
        'fontSize': 'Ukubwa wa Maandishi',
        'translation': 'Tafsiri',
        'book': 'Kitabu',
        'noVerses': 'Hakuna mistari iliyopatikana kwa sura hii.',
        'selectToRead': 'Chagua kitabu na sura ili kuanza kusoma.',
        'oldTestament': 'Agano la Kale',
        'newTestament': 'Agano Jipya'
      },
      'lin': {
        'chapter': 'Chapitre',
        'previousChapter': 'Ya liboso',
        'nextChapter': 'Ya sima',
        'settings': 'Ba paramètres',
        'fontSize': 'Bonene ya makomi',
        'translation': 'Traduction',
        'book': 'Buku',
        'noVerses': 'Maloba te na chapitre oyo.',
        'selectToRead': 'Pona buku mpe chapitre mpo na kobanda kotanga.',
        'oldTestament': 'Boyokani ya Kala',
        'newTestament': 'Boyokani ya Sika'
      },
      'shi': {
        'chapter': 'Isomo',
        'previousChapter': 'Ly\'ibere',
        'nextChapter': 'Ly\'inyuma',
        'settings': 'Amategeko',
        'fontSize': 'Ubunene bw\'amashusho',
        'translation': 'Ubuhindurire',
        'book': 'Igitabo',
        'noVerses': 'Nta magambo y\'isomo iri.',
        'selectToRead': 'Gula igitabo n\'isomo kugira usomere.',
        'oldTestament': 'Isezerano ry\'Akale',
        'newTestament': 'Isezerano Ripya'
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
      className="fixed inset-0 h-screen w-screen bg-background text-foreground flex flex-col z-50 rounded-none"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Background */}
      <NebulaBackground
        lightImageUrl="/Whitegrey.png"
        darkImageUrl="/Darkwall.png"
      />

      {/* Title Pill - Center */}
      <motion.div 
        className="absolute top-6 sm:top-10 left-1.5 sm:left-3 right-1.5 sm:right-3 z-20 flex justify-center"
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ 
          opacity: isNavVisible ? 1 : 0, 
          y: isNavVisible ? 0 : -20, 
          scale: isNavVisible ? 1 : 0.9 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.button
          ref={titlePillRef}
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="bg-black/30 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl shadow-black/50 hover:bg-black/40 dark:hover:bg-black/50 hover:shadow-black/60 flex items-center rounded-full overflow-hidden transition-shadow duration-300 min-h-[60px] sm:min-h-[72px] px-5 sm:px-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout 
          animate={{ 
            borderRadius: isSettingsOpen ? '1.5rem 1.5rem 1rem 1rem' : '9999px', 
            width: isSettingsOpen ? 'calc(100% - 1rem)' : 'auto', 
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }} 
        >
          {/* Home Button Section */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleBackToHome();
            }}
            className="flex items-center justify-center px-4 sm:px-5 py-2 sm:py-3 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
          >
            <Home className="h-6 w-6 sm:h-7 sm:w-7 text-white/95 dark:text-white/90" />
          </div>

          {/* Professional Separator */}
          <div className="w-px h-8 sm:h-10 bg-white/20 dark:bg-white/15"></div>

          {/* Book & Chapter Section */}
          <div className="flex items-center px-4 sm:px-5 py-2 sm:py-3 min-w-0 flex-1">
            <span className="text-lg sm:text-xl font-semibold text-white/95 dark:text-white/90 truncate">
              {getBookName(selectedBook)} {selectedChapter}
            </span>
          </div>

          {/* Professional Separator */}
          <div className="w-px h-8 sm:h-10 bg-white/20 dark:bg-white/15"></div>

          {/* Translation Section */}
          <div className="flex items-center px-3 sm:px-4 py-2 sm:py-3">
            <span className="text-base sm:text-lg font-medium text-white/80 dark:text-white/75 uppercase tracking-wide">
              {selectedTranslation}
            </span>
          </div>

          {/* Settings Chevron Section */}
          <div className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3">
            <ChevronDown className={`h-5 w-5 sm:h-6 sm:w-6 text-white/95 dark:text-white/90 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
          </div>
        </motion.button>
      </motion.div>

      {/* Backdrop Overlay - Apple-style blur when settings open */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.8, transformOrigin: 'top' }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute left-2 sm:left-4 right-2 sm:right-4 z-50 bg-white/80 dark:bg-neutral-800/60 backdrop-blur-lg border border-slate-300/70 dark:border-neutral-700/50 rounded-3xl p-3 sm:p-4 shadow-xl"
            style={{ top: `${settingsPanelTop}px` }}
          >
            {/* Font Size Control */}
            <div className="mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-semibold mb-2 text-foreground text-center">{getUIText('fontSize')}</h3>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFontSize(Math.max(MIN_FONT_SIZE, fontSize - 1))}
                  className="text-foreground hover:bg-white/20 dark:hover:bg-neutral-700/50 p-1 sm:p-2 rounded-full"
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="text-xs sm:text-sm text-foreground px-2">{fontSize}px</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFontSize(Math.min(MAX_FONT_SIZE, fontSize + 1))}
                  className="text-foreground hover:bg-white/20 dark:hover:bg-neutral-700/50 p-1 sm:p-2 rounded-full"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Book/Chapter Navigation */}
            <div className="grid grid-cols-2 gap-1 sm:gap-2">
              {/* Book Selector */}
              <div className="relative" ref={bookSelectorRef}>
                <Button
                  variant="ghost"
                  className="w-full text-foreground text-xs hover:bg-white/20 dark:hover:bg-neutral-700/50 justify-start p-1 sm:p-2 rounded-2xl"
                  onClick={() => {
                    setIsBookSelectorOpen(!isBookSelectorOpen);
                    setIsTranslationSelectorOpen(false);
                  }}
                >
                  <span className="text-xs sm:text-sm mr-1">📖</span>
                  <span className="truncate text-xs sm:text-sm">{getBookName(selectedBook)}</span>
                </Button>
                <AnimatePresence>
                  {isBookSelectorOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-60 mt-1 w-full min-w-[240px] sm:min-w-[280px] max-w-[calc(100vw-1rem)] max-h-60 sm:max-h-80 overflow-y-auto bg-white/80 dark:bg-neutral-800/60 backdrop-blur-lg border border-slate-300/70 dark:border-neutral-700/50 rounded-2xl shadow-2xl p-1 sm:p-2 left-0"
                      style={{
                        right: 'auto',
                        transform: 'translateX(0)',
                      }}
                    >
                      {Object.entries(BIBLE_STRUCTURE).map(([testament, books]) => (
                        <div key={testament} className="mb-1 sm:mb-2">
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase px-1 sm:px-2 py-1">
                            {getTestamentName(testament)}
                          </h3>
                          {books.map((book) => (
                            <Button
                              key={book}
                              variant="ghost"
                              className={`w-full justify-start px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-foreground hover:bg-white/20 dark:hover:bg-neutral-700/50 rounded-xl ${selectedBook === book ? 'bg-white/30 dark:bg-neutral-700/70 font-semibold' : ''}`}
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

              {/* Translation Selector */}
              <div className="relative" ref={translationSelectorRef}>
                <Button
                  variant="ghost"
                  className="w-full text-foreground text-xs hover:bg-white/20 dark:hover:bg-neutral-700/50 justify-start p-1 sm:p-2 rounded-2xl"
                  onClick={() => {
                    setIsTranslationSelectorOpen(!isTranslationSelectorOpen);
                    setIsBookSelectorOpen(false);
                  }}
                >
                  <span className="text-xs sm:text-sm mr-1">🌐</span>
                  <span className="truncate text-xs sm:text-sm">{TRANSLATIONS[selectedTranslation].name}</span>
                </Button>
                <AnimatePresence>
                  {isTranslationSelectorOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-60 mt-1 w-full min-w-[280px] sm:min-w-[360px] max-w-[calc(100vw-1rem)] bg-white/80 dark:bg-neutral-800/60 backdrop-blur-lg border border-slate-300/70 dark:border-neutral-700/50 rounded-2xl shadow-2xl p-1 sm:p-2 right-0"
                      style={{
                        left: 'auto',
                        transform: 'translateX(0)',
                      }}
                    >
                      {Object.entries(TRANSLATIONS).map(([id, translation]) => (
                        <Button
                          key={id}
                          variant="ghost"
                          className={`w-full justify-start px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-foreground hover:bg-white/20 dark:hover:bg-neutral-700/50 rounded-xl ${selectedTranslation === id ? 'bg-white/30 dark:bg-neutral-700/70 font-semibold' : ''}`}
                          onClick={() => handleTranslationSelect(id as BibleTranslation)}
                        >
                          <span className="flex items-center">
                            {translation.name}
                            <span className="ml-1 sm:ml-2 text-xs text-muted-foreground">({translation.language})</span>
                          </span>
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className="flex-1 overflow-y-auto px-2 sm:px-4 pt-20 sm:pt-24 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        ref={mainContentRef}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
          </div>
        ) : verses.length > 0 ? (
          <div className="pb-24 sm:pb-28">
            <motion.div 
              className="bg-black/30 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {verses.map((verse, index) => (
                <motion.p 
                  key={verse.verse} 
                  className="text-white/95 dark:text-white/90 leading-relaxed"
                  style={{ fontSize: `${fontSize}px` }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + (index * 0.02) }}
                >
                  <span className="font-semibold text-white/60 mr-2">
                    {verse.verse}
                  </span>
                  {verse.text}
                </motion.p>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh] text-center">
            <div className="bg-black/30 dark:bg-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-white/10 shadow-2xl">
              <p className="text-white/80 dark:text-white/70 text-sm sm:text-base">
                {selectedBook && selectedChapter ? getUIText('noVerses') : getUIText('selectToRead')}
              </p>
            </div>
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
          exit={{
            opacity: 0,
            y: 20,
            scaleX: 0.3,
            scaleY: 0.1,
            borderRadius: "50px"
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.32, 0.72, 0, 1],
            opacity: { duration: 0.3 },
            y: { duration: 0.4 },
            scale: { duration: 0.6 },
            borderRadius: { duration: 0.5 }
          }}
          className="fixed bottom-3 left-4 right-4 z-20 bg-black/30 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full p-3 sm:p-4"
        >
          <motion.div 
            className="flex items-center justify-between w-full"
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
              className="flex-1 bg-white/15 hover:bg-white/25 disabled:bg-white/5 border border-white/20 text-white/95 disabled:text-white/40 disabled:opacity-40 text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">{getUIText('previousChapter')}</span>
              <span className="xs:hidden">{getUIText('previousChapter').split(' ')[0]}</span>
            </Button>

            <div className="text-center px-3 sm:px-4 flex-shrink-0">
              <p className="text-xs sm:text-sm text-white/80 font-medium">
                {getUIText('chapter')} {selectedChapter} / {BOOK_CHAPTERS[selectedBook]}
              </p>
            </div>

            <Button
              onClick={() => navigateChapter('next')}
              disabled={parseInt(selectedChapter) >= BOOK_CHAPTERS[selectedBook]}
              variant="ghost"
              className="flex-1 bg-white/15 hover:bg-white/25 disabled:bg-white/5 border border-white/20 text-white/95 disabled:text-white/40 disabled:opacity-40 text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span className="hidden xs:inline">{getUIText('nextChapter')}</span>
              <span className="xs:hidden">{getUIText('nextChapter').split(' ')[0]}</span>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 