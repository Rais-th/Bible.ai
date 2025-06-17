
"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface SuggestionButtonProps {
  text: string;
  onClick: () => void;
}

export function SuggestionButton({ text, onClick }: SuggestionButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Button
        variant="outline"
        onClick={onClick}
        className="bg-white/80 dark:bg-white/10 backdrop-blur-md border-slate-300/70 dark:border-white/10 rounded-full text-neutral-700 dark:text-white hover:bg-slate-100/90 dark:hover:bg-white/15 px-4 py-2 text-sm shadow-md"
      >
        {text}
      </Button>
    </motion.div>
  );
}
