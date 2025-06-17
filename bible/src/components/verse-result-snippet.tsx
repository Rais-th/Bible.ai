import { motion } from 'framer-motion';
import type { Verse } from '@/lib/bible';

interface VerseResultSnippetProps {
  verse: Omit<Verse, 'verseNumber'>;
  onExplain: () => void;
}

export function VerseResultSnippet({ verse, onExplain }: VerseResultSnippetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="w-full cursor-pointer bg-background/90 dark:bg-neutral-900/85 backdrop-blur-md border border-border/70 dark:border-neutral-700/60 rounded-2xl shadow-xl hover:bg-accent/70 dark:hover:bg-white/10 p-4 sm:p-6"
      onClick={onExplain}
    >
      <p className="text-xl sm:text-2xl font-semibold text-primary dark:text-white mb-2">{verse.reference}</p>
      <p className="text-base sm:text-lg text-foreground/80 dark:text-gray-300 line-clamp-2">{verse.text}</p>
    </motion.div>
  );
} 