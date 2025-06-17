"use client";

import React from 'react';
import { motion } from 'framer-motion';
import BibleReaderMobile from './bible-reader-mobile';
import { BibleReader as BibleReaderDesktop } from './bible-reader-desktop';

export default function BibleReader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Mobile Layout */}
      <div className="md:hidden">
        <BibleReaderMobile />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <BibleReaderDesktop />
      </div>
    </motion.div>
  );
} 