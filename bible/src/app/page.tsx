"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NebulaBackground } from '@/components/nebula-background';
import { SearchBar } from '@/components/search-bar';
import { SuggestionButton } from '@/components/suggestion-button';
import { VerseResultSnippet } from '@/components/verse-result-snippet';
import { AiExplanationModal } from '@/components/ai-explanation-modal';
import { ThemeToggle } from '@/components/theme-toggle';
import { FloatingNavbar } from '@/components/floating-navbar';
import { aiVerseSelection, type AiVerseSelectionInput } from '@/ai/flows/ai-verse-selection';
import { getVersesDetails, type Verse } from '@/lib/bible';
import { AlertCircle, Info, Sparkles, Heart, BookOpen, Search, Zap, Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePathname } from 'next/navigation';

const suggestionQueries = [
  "Feeling anxious",
  "Need guidance",
  "Looking for hope",
  "Forgiveness",
  "Strength in adversity",
  "Finding peace",
  "Love and relationships",
  "Purpose in life"
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedQuery, setDisplayedQuery] = useState('');
  const [verses, setVerses] = useState<Omit<Verse, 'verseNumber'>[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [explanationModalData, setExplanationModalData] = useState<{ query: string; verses: string[] } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setDisplayedQuery(query);
    setIsLoadingSearch(true);
    setError(null);
    setVerses([]);

    try {
      const input: AiVerseSelectionInput = { query };
      const result = await aiVerseSelection(input);
      if (result.verses && result.verses.length > 0) {
        const verseDetails = getVersesDetails(result.verses);
        setVerses(verseDetails);
      } else {
        setError("No verses found for this query. Try being more specific or rephrasing.");
      }
    } catch (err) {
      console.error("Error fetching verses:", err);
      setError("An error occurred while searching for verses. Please try again.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    handleSearch(query);
  };

  const openExplanationModal = (verseRef?: string) => {
    if (searchQuery && verses.length > 0) {
      setExplanationModalData({
        query: searchQuery,
        verses: verses.map(v => v.reference),
      });
      setIsExplanationModalOpen(true);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative min-h-screen flex flex-col text-foreground dark:text-white overflow-x-hidden pt-8 sm:pt-12 md:pt-16"
      >
      <FloatingNavbar />
      <NebulaBackground
        lightImageUrl="/Whitegrey.png"
        darkImageUrl="/Darkwall.png"
      />

        <div className="absolute top-4 right-4 z-50 print:hidden">
        <ThemeToggle />
      </div>

        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 md:px-12 lg:px-16"
        >
          <div className="w-full max-w-7xl mx-auto text-center space-y-8 sm:space-y-12 md:space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 sm:space-y-6 md:space-y-8"
            >
              <div className="relative">
                <motion.h1
                  className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-light text-neutral-800 dark:bg-gradient-to-r dark:from-white dark:via-gray-400 dark:to-white dark:bg-clip-text dark:text-transparent tracking-tight leading-none"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
          >
            Bible.ai
          </motion.h1>
              </div>

          <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl text-neutral-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed px-4"
          >
            Discover relevant Bible verses for your life questions and situations through the power of AI.
          </motion.p>
            </motion.div>

            <div className="max-w-4xl mx-auto px-4">
        <SearchBar onSearch={handleSearch} isLoading={isLoadingSearch} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="space-y-6 sm:space-y-8 md:space-y-10"
            >
              <AnimatePresence>
                {!displayedQuery && !verses.length && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 max-w-5xl mx-auto px-4"
        >
                    {suggestionQueries.map((query, index) => (
                      <motion.div
                        key={query}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.9 + (index * 0.1),
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <SuggestionButton
                          text={query}
                          onClick={() => handleSuggestionClick(query)}
                        />
                      </motion.div>
          ))}
        </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {(displayedQuery || verses.length > 0 || error) && (
          <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto px-4 space-y-6 sm:space-y-8 md:space-y-10"
                  >
        {error && (
          <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto"
          >
                        <Alert variant="destructive" className="text-base sm:text-lg">
                          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                          <AlertTitle className="text-lg sm:text-xl">Error</AlertTitle>
                          <AlertDescription className="text-base sm:text-lg">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {!isLoadingSearch && verses.length === 0 && displayedQuery && !error && (
           <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto"
          >
                        <Alert variant="default" className="bg-muted/70 dark:bg-neutral-800/50 border-border text-muted-foreground dark:border-neutral-700/80 dark:text-neutral-400 text-base sm:text-lg">
                          <Info className="h-5 w-5 sm:h-6 sm:w-6" />
                          <AlertTitle className="text-lg sm:text-xl">No Results</AlertTitle>
                          <AlertDescription className="text-base sm:text-lg">
                            No verses found for this query. Try being more specific or rephrasing.
                          </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {verses.length > 0 && (
                      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                        className="w-full"
                      >
                        <div className="grid grid-cols-1 gap-4 max-w-6xl mx-auto">
                          {verses.map(verse => (
                            <VerseResultSnippet
                              key={verse.reference}
                              verse={verse}
                              onExplain={() => openExplanationModal(verse.reference)}
                            />
            ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 py-16 sm:py-20 md:py-24 lg:py-32 px-6 sm:px-8 md:px-12 lg:px-16"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-neutral-800 dark:text-gray-200 mb-4 sm:mb-6 md:mb-8">
                Make disciples of all nations
              </h2>
              <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-neutral-600 dark:text-gray-300 max-w-4xl mx-auto px-4">
                Spreading God's word and wisdom to every corner of the earth through technology
              </p>
            </motion.div>
          </div>
          </motion.section>

      {explanationModalData && (
        <AiExplanationModal
          isOpen={isExplanationModalOpen}
          onClose={() => setIsExplanationModalOpen(false)}
          query={explanationModalData.query}
          verses={explanationModalData.verses}
        />
      )}
      </motion.div>
    </AnimatePresence>
  );
}
