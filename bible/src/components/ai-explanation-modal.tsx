"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { explainVerseSelection, type ExplainVerseSelectionInput } from '@/ai/flows/ai-explanation-modal';
import { Loader2 } from 'lucide-react';

interface AiExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  verses: string[]; // verse references
}

export function AiExplanationModal({ isOpen, onClose, query, verses }: AiExplanationModalProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && query && verses.length > 0) {
      const fetchExplanation = async () => {
        setIsLoading(true);
        setError(null);
        setExplanation(null);
        try {
          const input: ExplainVerseSelectionInput = { query, verses };
          const result = await explainVerseSelection(input);
          setExplanation(result.explanation);
        } catch (err) {
          console.error("Error fetching AI explanation:", err);
          setError("Sorry, I couldn't generate an explanation at this time. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchExplanation();
    }
  }, [isOpen, query, verses]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-background/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-border/70 dark:border-neutral-700/60 text-foreground dark:text-white rounded-[2rem] sm:rounded-[2.5rem] p-8 shadow-2xl max-w-4xl w-[95vw] md:w-full [&>button]:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <DialogHeader className="mb-8">
            <DialogTitle className="text-4xl sm:text-5xl font-light text-center text-neutral-800 dark:text-gray-200 mb-4">
              AI Explanation
            </DialogTitle>
            <DialogDescription className="text-center text-lg sm:text-xl text-neutral-600 dark:text-gray-400">
              Understanding the AI's verse selection for your query
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 sm:p-8 bg-background/90 dark:bg-neutral-900/85 backdrop-blur-md border border-border/70 dark:border-neutral-700/60 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl"
            >
              {isLoading && (
                <div className="flex items-center justify-center p-8 text-muted-foreground dark:text-gray-400">
                  <Loader2 className="h-8 w-8 animate-spin mr-3" />
                  <span className="text-lg">Generating explanation...</span>
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-[1.5rem]">
                  <p className="text-red-700 dark:text-red-400 text-lg">{error}</p>
                </div>
              )}
              {explanation && (
                <p className="text-lg sm:text-xl text-muted-foreground dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {explanation}
                </p>
              )}
            </motion.section>
          </div>

          <DialogFooter className="mt-8 flex justify-center items-center w-full">
            <Button 
              onClick={onClose} 
              className="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-neutral-300 rounded-full px-8 py-3 text-lg font-medium transition-all duration-200 mx-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
