"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MessageCircle, CheckCircle } from 'lucide-react';
import { Video } from '@/data/videos';

interface ShortsExploreProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

const categories = [
  "All",
  "Faith & Worship", 
  "Preaching",
  "Testimonies",
  "Prayer",
  "Bible Study",
  "Miracles",
  "Prophecy",
  "Healing"
];

export default function ShortsExplore({ videos, onVideoSelect }: ShortsExploreProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleVideos, setVisibleVideos] = useState(15);

  const loadMoreVideos = () => {
    setVisibleVideos(prev => Math.min(prev + 15, videos.length));
  };

  const displayedVideos = videos.slice(0, visibleVideos);

  return (
    <div className="flex-1 bg-black text-white h-screen overflow-y-auto pt-16 px-4">
      {/* Header Section - Reduced spacing */}
      <motion.div 
        className="mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold mb-1">Explore Holy Shorts</h1>
        <p className="text-neutral-400 text-sm">Discover inspiring spiritual content from amazing creators</p>
      </motion.div>

      {/* Category Tabs - Reduced spacing */}
      <motion.div 
        className="mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Video Grid - Optimized for viewport */}
      <motion.div 
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {displayedVideos.map((video, index) => (
          <motion.div
            key={video.id}
            className="group cursor-pointer"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + (index * 0.01) }}
            whileHover={{ y: -4 }}
            onClick={() => onVideoSelect(video)}
          >
            <div className="relative aspect-[9/16] bg-neutral-900 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
              {/* Video Thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-600/20">
                <img
                  src={`https://img.youtube.com/vi/${video.videoUrl.split('/').pop()}/maxresdefault.jpg`}
                  alt={video.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to a default thumbnail if YouTube thumbnail fails
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face';
                  }}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
                  </motion.div>
                </div>

                {/* Video Stats */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center justify-between text-white text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{video.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{video.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info - Reduced spacing */}
            <div className="mt-2 px-1">
              <p className="text-xs text-white font-medium line-clamp-2 mb-1 group-hover:text-red-400 transition-colors">
                {video.description}
              </p>
              <div className="flex items-center space-x-1.5">
                <img
                  src={video.avatar}
                  alt={video.username}
                  className="w-4 h-4 rounded-full"
                />
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-neutral-300 font-medium">@{video.username}</span>
                  {video.verified && (
                    <CheckCircle className="h-3 w-3 text-blue-500" fill="currentColor" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Button - Reduced spacing */}
      {visibleVideos < videos.length && (
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <motion.button
            onClick={loadMoreVideos}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full font-medium text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Videos
          </motion.button>
        </motion.div>
      )}
    </div>
  );
} 