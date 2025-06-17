"use client";

import React from 'react';
import { Heart, MessageCircle, Share2, PlusCircle, Music, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ShortsMobile() {
  const router = useRouter();

  const handleBackToHome = () => {
    // Add a small delay for visual feedback before navigation
    setTimeout(() => {
      router.push('/');
    }, 150);
  };

  return (
    <motion.div 
      className="relative h-screen w-screen bg-black overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Video Background Placeholder */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/path/to/your/short.mp4"
        loop
        autoPlay
        muted
      >
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end p-4 text-white">
        {/* Back Button - Top Left */}
        <motion.button
          onClick={handleBackToHome}
          className="absolute top-0 left-4 pt-8 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200 ease-out"
          aria-label="Go back to Home"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ChevronLeft className="h-7 w-7 text-white" />
        </motion.button>

        {/* Header (Following / For You) - Mobile Only */}
        <motion.div 
          className="absolute top-0 left-0 right-0 pt-8 flex justify-center space-x-6 text-lg font-semibold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className="text-white text-opacity-60">Following</span>
          <span className="text-white">For You</span>
        </motion.div>

        {/* User Info & Action Buttons */}
        <motion.div 
          className="flex justify-between items-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {/* User Info */}
          <div className="flex flex-col mb-16">
            <span className="font-bold text-lg">@craig_love</span>
            <p className="text-sm mt-1">The most satisfying Job #fyp #satisfying #roadmarking</p>
            <div className="flex items-center mt-2">
              <Music className="h-4 w-4 mr-2" />
              <span className="text-sm">Roddy Roundicch - The Rou</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-6 mb-16">
            {/* User Profile */}
            <div className="relative flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gray-400 border-2 border-white"></div>
              <div className="absolute -bottom-2 bg-red-500 rounded-full h-6 w-6 flex items-center justify-center border-2 border-black">
                <PlusCircle className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Likes */}
            <div className="flex flex-col items-center">
              <Heart className="h-8 w-8" />
              <span className="text-xs">328.7K</span>
            </div>

            {/* Comments */}
            <div className="flex flex-col items-center">
              <MessageCircle className="h-8 w-8" />
              <span className="text-xs">578</span>
            </div>

            {/* Shares */}
            <div className="flex flex-col items-center">
              <Share2 className="h-8 w-8" />
              <span className="text-xs">Share</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-0 w-full h-8 bg-black flex justify-center items-center">
        <div className="w-36 h-1 bg-white rounded-full"></div>
      </div>
    </motion.div>
  );
} 