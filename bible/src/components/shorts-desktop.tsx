"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Home,
  Compass,
  Users,
  Upload,
  Radio,
  User,
  ChevronUp,
  ChevronDown,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react';
import { FloatingNavbar } from '@/components/floating-navbar';
import { ThemeToggle } from '@/components/theme-toggle';
import ShortsExplore from './shorts-explore';
import ShortsUpload from './shorts-upload';
import { allPlaceholderVideos, shuffleVideos, Video } from '@/data/videos';
import Image from 'next/image';

const sidebarItems = [
  { icon: 'custom', label: "Shorts", active: true, view: 'shorts' as const },
  { icon: Compass, label: "Explore", active: false, view: 'explore' as const },
  { icon: Users, label: "Following", active: false, view: null },
  { icon: Upload, label: "Upload", active: false, view: 'upload' as const },
  { icon: Radio, label: "AI Creator", active: false, view: null },
];

export default function ShortsDesktop() {
  // State for managing videos (both placeholder and user-uploaded)
  const [allVideos, setAllVideos] = useState<Video[]>(allPlaceholderVideos);
  
  // State to track if component has mounted (to avoid hydration mismatch)
  const [isMounted, setIsMounted] = useState(false);
  
  // Use non-randomized videos initially to prevent hydration mismatch
  const [randomizedVideos, setRandomizedVideos] = useState<Video[]>(allPlaceholderVideos);
  
  // Start with index 0 to ensure consistent SSR/client rendering
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Handle client-side mounting and randomization
  useEffect(() => {
    setIsMounted(true);
    // Only randomize after component mounts on client
    const shuffled = shuffleVideos(allVideos);
    setRandomizedVideos(shuffled);
    // Set random starting index only after mounting
    setCurrentVideoIndex(Math.floor(Math.random() * allVideos.length));
  }, []);
  
  // Update randomized videos when allVideos changes (but only after mount)
  useEffect(() => {
    if (isMounted) {
      setRandomizedVideos(shuffleVideos(allVideos));
    }
  }, [allVideos, isMounted]);
  
  // Ensure currentVideoIndex is valid when videos array changes
  useEffect(() => {
    if (currentVideoIndex >= randomizedVideos.length) {
      setCurrentVideoIndex(0);
    }
  }, [randomizedVideos.length, currentVideoIndex]);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'shorts' | 'explore' | 'upload'>('shorts');
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);

  // Ensure we have a valid current video
  const currentVideo = randomizedVideos[currentVideoIndex] || randomizedVideos[0];

  // Create a ref to track the current iframe for YouTube API control
  const [currentVideoKey, setCurrentVideoKey] = useState<string>('');

  // Update video key when current video changes
  useEffect(() => {
    if (currentVideo) {
      const videoId = currentVideo.videoUrl.split('/').pop() || '';
      setCurrentVideoKey(`player_${videoId}_${currentVideoIndex}`);
      setVideoAspectRatio(null); // Reset aspect ratio when video changes
    }
  }, [currentVideo, currentVideoIndex]);

  // Function to control YouTube player
  const controlYouTubePlayer = useCallback((action: 'mute' | 'unmute' | 'play' | 'pause' | 'getAspectRatio') => {
    const iframe = document.querySelector(`iframe[data-video-key="${currentVideoKey}"]`) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      try {
        // YouTube Player API postMessage format
        const commands = {
          'mute': '{"event":"command","func":"mute","args":""}',
          'unmute': '{"event":"command","func":"unMute","args":""}',
          'play': '{"event":"command","func":"playVideo","args":""}',
          'pause': '{"event":"command","func":"pauseVideo","args":""}',
          'getAspectRatio': '{"event":"command","func":"getVideoContentRect","args":""}' // Custom command to get dimensions
        };
        
        iframe.contentWindow.postMessage(commands[action], '*');
        
        // Also try the alternative format for core commands
        if (action !== 'getAspectRatio') {
          setTimeout(() => {
            iframe.contentWindow?.postMessage(`{"event":"command","func":"${action === 'mute' ? 'mute' : action === 'unmute' ? 'unMute' : action === 'play' ? 'playVideo' : 'pauseVideo'}","args":""}`, 'https://www.youtube.com');
          }, 100);
        }
        
      } catch (error) {
        console.log('YouTube player control not available:', error);
      }
    }
  }, [currentVideoKey]);

  // Listen for YouTube player ready events and dimension changes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'onReady') {
          // Player is ready, request video dimensions
          controlYouTubePlayer('getAspectRatio');
        } else if (data.event === 'infoDelivery' && data.info && data.info.videoContentRect) {
          // Received video content rect, calculate aspect ratio
          const { width, height } = data.info.videoContentRect;
          if (width && height) {
            setVideoAspectRatio(width / height);
            console.log('Detected video aspect ratio:', width / height);
          }
        } else if (data.event === 'onStateChange') {
          // YouTube player is communicating
          console.log('YouTube player event:', data);
        }
      } catch (error) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [controlYouTubePlayer]);

  // Initialize YouTube player communication when video changes
  useEffect(() => {
    if (currentVideoKey && isMounted) {
      const iframe = document.querySelector(`iframe[data-video-key="${currentVideoKey}"]`) as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        // Initialize listening for events
        setTimeout(() => {
          iframe.contentWindow?.postMessage('{"event":"listening","id":"' + currentVideoKey + '"}', '*');
        }, 1000);
      }
    }
  }, [currentVideoKey, isMounted]);

  const togglePlay = useCallback(() => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    controlYouTubePlayer(newPlayState ? 'play' : 'pause');
  }, [isPlaying, controlYouTubePlayer]);

  const toggleMute = useCallback(() => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    controlYouTubePlayer(newMuteState ? 'mute' : 'unmute');
  }, [isMuted, controlYouTubePlayer]);

  // Function to handle adding new videos
  const handleVideoAdd = (newVideo: Video) => {
    setAllVideos(prev => [newVideo, ...prev]); // Add to beginning of array
    // Reset to first video (which will be the new video) when a new video is added
    setCurrentVideoIndex(0);
    console.log('New video added:', newVideo);
  };

  // Function to handle video selection from Explore page
  const handleVideoSelect = (selectedVideo: Video) => {
    // Find the index of the selected video in the randomized videos array
    const videoIndex = randomizedVideos.findIndex(video => video.id === selectedVideo.id);
    
    if (videoIndex !== -1) {
      // Set the current video index to the selected video
      setCurrentVideoIndex(videoIndex);
    } else {
      // If video not found in current array, add it and set as current
      setAllVideos(prev => [selectedVideo, ...prev]);
      setCurrentVideoIndex(0);
    }
    
    // Switch to Shorts view
    setActiveView('shorts');
    console.log('Video selected from Explore:', selectedVideo);
  };

  // Navigation functions
  const handleNextVideo = useCallback(() => {
    // Hide scroll hint when user uses navigation buttons
    if (showScrollHint) {
      setShowScrollHint(false);
    }
    setCurrentVideoIndex((prev) => (prev + 1) % randomizedVideos.length);
  }, [randomizedVideos.length, showScrollHint]);

  const handlePrevVideo = useCallback(() => {
    // Hide scroll hint when user uses navigation buttons
    if (showScrollHint) {
      setShowScrollHint(false);
    }
    setCurrentVideoIndex((prev) => (prev - 1 + randomizedVideos.length) % randomizedVideos.length);
  }, [randomizedVideos.length, showScrollHint]);

  // Add scroll and keyboard event listeners
  useEffect(() => {
    if (!isMounted || activeView !== 'shorts') return;

    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;
    let scrollAccumulator = 0;
    const scrollThreshold = 100; // Minimum scroll distance to trigger navigation
    let lastScrollTime = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Hide scroll hint when user starts scrolling
      if (showScrollHint) {
        setShowScrollHint(false);
      }
      
      const currentTime = Date.now();
      const timeDelta = currentTime - lastScrollTime;
      lastScrollTime = currentTime;
      
      // If we're already scrolling, ignore rapid scroll events
      if (isScrolling) return;
      
      // Accumulate scroll delta
      scrollAccumulator += Math.abs(e.deltaY);
      
      // Reset accumulator if too much time has passed (new scroll gesture)
      if (timeDelta > 150) {
        scrollAccumulator = Math.abs(e.deltaY);
      }
      
      // Only trigger navigation if we've accumulated enough scroll
      if (scrollAccumulator >= scrollThreshold) {
        isScrolling = true;
        scrollAccumulator = 0;
        
        if (e.deltaY > 0) {
          // Scrolling down - next video
          handleNextVideo();
        } else if (e.deltaY < 0) {
          // Scrolling up - previous video
          handlePrevVideo();
        }
        
        // Reset scrolling flag after a longer delay to prevent rapid navigation
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 800); // Increased from 500ms to 800ms for slower navigation
      } else {
        // If we haven't reached threshold, set a shorter timeout to reset accumulator
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          scrollAccumulator = 0;
        }, 200);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeView !== 'shorts') return;
      
      // Hide scroll hint when user starts using keyboard
      if (showScrollHint) {
        setShowScrollHint(false);
      }
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handlePrevVideo();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleNextVideo();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handlePrevVideo();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleNextVideo();
          break;
        case ' ': // Spacebar for play/pause
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(scrollTimeout);
    };
  }, [isMounted, activeView, handleNextVideo, handlePrevVideo, togglePlay, toggleMute]);

  // Re-shuffle videos when switching back to Shorts page
  const handleViewChange = (view: 'shorts' | 'explore' | 'upload') => {
    if (view === 'shorts' && activeView !== 'shorts' && isMounted) {
      // Re-shuffle videos and start with a new random video when returning to Shorts
      const newShuffled = shuffleVideos(allVideos);
      setRandomizedVideos(newShuffled);
      setCurrentVideoIndex(Math.floor(Math.random() * newShuffled.length));
    }
    setActiveView(view);
  };

  // Show scroll hint after initial load, then hide it
  useEffect(() => {
    if (isMounted && activeView === 'shorts') {
      setShowScrollHint(true);
      const timer = setTimeout(() => {
        setShowScrollHint(false);
      }, 3000); // Show for 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isMounted, activeView]);

  // Debug: Log current state
  console.log('Current video index:', currentVideoIndex);
  console.log('Total videos:', randomizedVideos.length);
  console.log('Current video:', currentVideo);

  return (
    <motion.div 
      className="h-screen bg-black text-white flex overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Keep existing navbar */}
      <FloatingNavbar />
      <div className="absolute top-4 right-4 z-50 print:hidden">
        <ThemeToggle />
      </div>

      {/* Left Sidebar - Reduced width and padding */}
        <motion.div 
        className="w-56 bg-black border-r border-neutral-800 flex flex-col pt-16"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
        {/* Holy Shorts Logo - Reduced padding */}
        <div className="p-4">
          <h1 className="text-xl font-bold">Holy Shorts</h1>
        </div>

        {/* Navigation Items - Reduced padding */}
        <nav className="flex-1 px-3">
          {sidebarItems.map((item, index) => (
        <motion.div 
              key={item.label}
              className={`flex items-center space-x-3 p-2.5 rounded-lg mb-1.5 cursor-pointer transition-colors ${
                activeView === item.view
                  ? 'bg-red-600/20 text-red-500 border-r-2 border-red-500' 
                  : 'hover:bg-neutral-800 text-neutral-300'
              }`}
              whileHover={{ x: 4 }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
              onClick={() => item.view && handleViewChange(item.view)}
            >
              {item.icon === 'custom' ? (
                <Image
                  src="/shorts.png"
                  alt="Shorts"
                  width={20}
                  height={20}
                  className={`transition-all duration-200 ${
                    activeView === item.view ? 'brightness-0 saturate-100 invert-0 sepia-100 hue-rotate-0 brightness-200 contrast-200' : ''
                  }`}
                />
              ) : (
                <item.icon className="h-5 w-5" />
              )}
              <span className="font-medium text-sm">{item.label}</span>
            </motion.div>
          ))}
        </nav>

        {/* Login Button - Reduced padding */}
        <div className="p-3">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-3 rounded-lg font-medium text-sm transition-colors">
            Log in
          </button>
        </div>

        {/* Footer Links - Reduced padding and font size */}
        <div className="p-3 text-xs text-neutral-500 space-y-0.5">
          <div>Company</div>
          <div>Program</div>
          <div>Terms & Policies</div>
          <div>© 2025 Holy Shorts</div>
        </div>
        </motion.div>

      {/* Main Content Area */}
      {activeView === 'shorts' ? (
        <div className="flex-1 flex justify-center items-center relative px-4 h-full">
          {/* Show loading or error state if no video */}
          {!currentVideo ? (
            <div className="text-center">
              <p className="text-neutral-400 text-lg">Loading videos...</p>
            </div>
          ) : (
            <>
              {/* Video Container - Optimized for viewport */}
        <motion.div 
                className={`group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out ${
                  videoAspectRatio !== null 
                    ? (videoAspectRatio < 1 ? 'w-[500px] h-[888px]' : 'w-[1200px] h-[675px]') 
                    : 'w-[500px] h-[888px]' // Default to vertical if aspect ratio not yet detected
                }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                key={currentVideo.id} // Add key to trigger re-animation on video change
              >
                {/* Video Element */}
                <iframe
                    className="w-full h-full object-cover"
                  src={`${currentVideo.videoUrl}?autoplay=1&mute=1&loop=1&playlist=${currentVideo.videoUrl.split('/').pop()}&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  data-video-key={currentVideoKey}
                />

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
                  {/* Video info overlay removed to allow access to YouTube controls */}
                  </div>

                {/* Scroll Hint Overlay */}
                {showScrollHint && (
                  <motion.div
                    className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="text-center text-white"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center space-x-2 text-lg font-medium">
                          <ChevronUp className="h-5 w-5 animate-bounce" />
                          <span>Scroll or use arrow keys</span>
                          <ChevronDown className="h-5 w-5 animate-bounce" />
                        </div>
                        <div className="text-sm text-neutral-300 flex items-center space-x-4">
                          <span>↑↓ Navigation</span>
                          <span>Space = Pause</span>
                          <span>M = Mute</span>
                        </div>
                      </div>
                    </motion.div>
                    </motion.div>
                  )}
              </motion.div>

              {/* Navigation Arrows - Far Right Side of Screen */}
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
                {/* Previous Video (Up Arrow) */}
                <motion.button
                  onClick={handlePrevVideo}
                  className="p-3 bg-neutral-800/80 hover:bg-neutral-700 rounded-full transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronUp className="h-6 w-6 text-white" />
                </motion.button>

                {/* Next Video (Down Arrow) */}
                <motion.button
                  onClick={handleNextVideo}
                  className="p-3 bg-neutral-800/80 hover:bg-neutral-700 rounded-full transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronDown className="h-6 w-6 text-white" />
                </motion.button>
              </div>

              {/* Right Action Buttons - Adjusted positioning */}
              <motion.div 
                className={`absolute top-[30%] transform -translate-y-1/2 flex flex-col space-y-6 ${
                  videoAspectRatio !== null 
                    ? (videoAspectRatio < 1 ? 'left-[calc(50%+270px)]' : 'left-[calc(50%+620px)]') 
                    : 'left-[calc(50%+270px)]' // Default to vertical video position
                }`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {/* User Avatar - Smaller */}
                <div className="relative">
                  <img
                    src={currentVideo.avatar}
                    alt={currentVideo.username}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>

                {/* Action Buttons - Smaller */}
                {[
                  { icon: Heart, count: currentVideo.likes, action: 'like' },
                  { icon: MessageCircle, count: currentVideo.comments, action: 'comment' },
                  { icon: Share2, count: currentVideo.shares, action: 'share' }
                ].map((item, index) => (
                  <motion.div
                    key={item.action}
                    className="flex flex-col items-center space-y-1.5"
                    onHoverStart={() => setHoveredAction(item.action)}
                    onHoverEnd={() => setHoveredAction(null)}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                  >
                    <motion.button
                      className={`p-3 rounded-full transition-colors ${
                        hoveredAction === item.action ? 'bg-neutral-700' : 'bg-neutral-800/80'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="h-6 w-6" />
                    </motion.button>
                    <span className="text-xs text-neutral-300 font-medium">{item.count}</span>
                  </motion.div>
                ))}

                {/* Mute/Unmute Button */}
                <motion.div
                  className="flex flex-col items-center space-y-1.5"
                  onHoverStart={() => setHoveredAction('mute')}
                  onHoverEnd={() => setHoveredAction(null)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + (3 * 0.05) }}
                >
                  <motion.button
                    onClick={toggleMute}
                    className={`p-3 rounded-full transition-colors ${
                      hoveredAction === 'mute' ? 'bg-neutral-700' : 'bg-neutral-800/80'
                    } ${isMuted ? 'bg-red-600/80 hover:bg-red-600' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="h-6 w-6 text-white" />
                    ) : (
                      <Volume2 className="h-6 w-6" />
                    )}
                  </motion.button>
                  <span className="text-xs text-neutral-300 font-medium">
                    {isMuted ? 'Muted' : 'Sound'}
                  </span>
                </motion.div>
              </motion.div>
            </>
          )}
          </div>
      ) : activeView === 'upload' ? (
        <ShortsUpload onVideoAdd={handleVideoAdd} />
      ) : (
        <ShortsExplore videos={allVideos} onVideoSelect={handleVideoSelect} />
      )}
    </motion.div>
  );
} 