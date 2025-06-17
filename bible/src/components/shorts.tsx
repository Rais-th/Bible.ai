"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ShortsMobile from './shorts-mobile';
import ShortsDesktop from './shorts-desktop';

export default function Shorts() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Mobile Layout */}
      <div className="md:hidden">
        <ShortsMobile />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <ShortsDesktop />
      </div>
    </motion.div>
  );
}
