"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload as UploadIcon, 
  Youtube, 
  User, 
  Type, 
  Eye, 
  Check,
  X,
  Plus
} from 'lucide-react';

interface VideoData {
  videoUrl: string;
  username: string;
  description: string;
  isVertical: boolean;
  avatar: string;
}

interface ShortsUploadProps {
  onVideoAdd?: (video: any) => void;
}

// Function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return '';
}

// Function to convert YouTube URL to embed format
function convertToEmbedUrl(url: string): string {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

// Function to get YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// Generate random engagement numbers
function generateRandomEngagement() {
  const likes = Math.floor(Math.random() * 2000) + 100;
  const comments = Math.floor(Math.random() * 50) + 5;
  const shares = Math.floor(Math.random() * 100) + 10;
  
  return {
    likes: likes > 1000 ? `${(likes/1000).toFixed(1)}K` : likes.toString(),
    comments: comments > 1000 ? `${(comments/1000).toFixed(1)}K` : comments.toString(),
    shares: shares > 1000 ? `${(shares/1000).toFixed(1)}K` : shares.toString()
  };
}

export default function ShortsUpload({ onVideoAdd }: ShortsUploadProps) {
  const [formData, setFormData] = useState<VideoData>({
    videoUrl: '',
    username: '',
    description: '',
    isVertical: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'YouTube URL is required';
    } else if (!getYouTubeVideoId(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid YouTube URL';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Generate engagement numbers automatically
      const engagement = generateRandomEngagement();
      const videoId = getYouTubeVideoId(formData.videoUrl);
      const embedUrl = convertToEmbedUrl(formData.videoUrl);

      const newVideo = {
        id: Date.now(), // Simple ID generation
        videoUrl: embedUrl,
        username: formData.username,
        verified: Math.random() > 0.5, // Random verification status
        description: formData.description,
        likes: engagement.likes,
        comments: engagement.comments,
        bookmarks: Math.floor(Math.random() * 200) + 50 + 'K',
        shares: engagement.shares,
        avatar: formData.avatar,
        isVertical: formData.isVertical
      };

      // Call the callback to add video to the main feeds
      if (onVideoAdd) {
        onVideoAdd(newVideo);
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          videoUrl: '',
          username: '',
          description: '',
          isVertical: true,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
        });
        setSubmitSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error submitting video:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof VideoData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const videoId = getYouTubeVideoId(formData.videoUrl);
  const thumbnailUrl = videoId ? getYouTubeThumbnail(videoId) : '';

  if (submitSuccess) {
    return (
      <motion.div 
        className="min-h-screen bg-black text-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Check className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Video Uploaded Successfully!</h2>
          <p className="text-neutral-400 mb-6">Your video has been added to Holy Shorts</p>
          <motion.div
            className="w-16 h-1 bg-red-500 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex-1 min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <main className="pt-24 px-6 max-w-4xl mx-auto pb-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center mb-6 px-8 py-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-300 bg-clip-text text-transparent">
              Upload to Holy Shorts
            </h1>
          </div>
          <p className="text-neutral-400 text-xl mb-4">Share spiritual content with the community</p>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* YouTube URL Input */}
          <motion.div 
            className="space-y-3"
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <label className="flex items-center text-lg font-semibold">
              <Youtube className="h-6 w-6 text-red-500 mr-3" />
              YouTube Video URL
              <span className="text-red-500 ml-2">*</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                className={`w-full p-4 pl-14 bg-neutral-900/80 border-2 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                  errors.videoUrl ? 'border-red-500' : 'border-neutral-700 hover:border-neutral-600'
                }`}
              />
              <Youtube className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-neutral-500" />
              {videoId && (
                <motion.div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Check className="h-6 w-6 text-green-500" />
                </motion.div>
              )}
            </div>
            {errors.videoUrl && (
              <motion.p 
                className="text-red-500 text-sm flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <X className="h-4 w-4 mr-2" />
                {errors.videoUrl}
              </motion.p>
            )}
          </motion.div>

          {/* Video Preview */}
          {videoId && (
            <motion.div 
              className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 rounded-2xl p-8 border border-neutral-700/50 backdrop-blur-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Eye className="h-6 w-6 text-red-500 mr-3" />
                Video Preview
              </h3>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                  <motion.img
                    src={thumbnailUrl}
                    alt="Video thumbnail"
                    className="w-full aspect-video object-cover rounded-xl shadow-2xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop';
                    }}
                  />
                </div>
                <div className="lg:w-1/2 space-y-6">
                  <div>
                    <label className="block text-lg font-medium mb-4 text-neutral-200">Video Orientation</label>
                    <div className="flex space-x-4">
                      <motion.button
                        type="button"
                        onClick={() => handleInputChange('isVertical', true)}
                        className={`flex-1 px-6 py-4 rounded-xl transition-all duration-200 font-semibold text-lg ${
                          formData.isVertical 
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        📱 Vertical (9:16)
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => handleInputChange('isVertical', false)}
                        className={`flex-1 px-6 py-4 rounded-xl transition-all duration-200 font-semibold text-lg ${
                          !formData.isVertical 
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        🖥️ Horizontal (16:9)
                      </motion.button>
                    </div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-xl p-6">
                    <p className="text-sm text-neutral-400 mb-2">💡 <strong>Pro Tip:</strong></p>
                    <p className="text-sm text-neutral-300">
                      Choose the orientation that matches your video content for the best viewing experience on Holy Shorts.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Creator Details Section */}
          <motion.div 
            className="bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 rounded-2xl p-8 border border-neutral-700/50 backdrop-blur-sm space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold flex items-center">
              <User className="h-6 w-6 text-red-500 mr-3" />
              Creator Information
            </h3>
            
            {/* Username Input */}
            <div className="space-y-3">
              <label className="flex items-center text-lg font-medium text-neutral-200">
                Creator Username
                <span className="text-red-500 ml-2">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter creator username (e.g., @spiritualteacher)"
                  className={`w-full p-4 pl-14 bg-neutral-800/80 border-2 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                    errors.username ? 'border-red-500' : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-neutral-500" />
              </div>
              {errors.username && (
                <motion.p 
                  className="text-red-500 text-sm flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <X className="h-4 w-4 mr-2" />
                  {errors.username}
                </motion.p>
              )}
            </div>

            {/* Description Input */}
            <div className="space-y-3">
              <label className="flex items-center text-lg font-medium text-neutral-200">
                <Type className="h-5 w-5 text-red-500 mr-3" />
                Description
                <span className="text-red-500 ml-2">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add a compelling description with hashtags... 

Example: 'Powerful message about faith and hope 🙏 #faith #hope #spiritual #blessed'"
                rows={5}
                className={`w-full p-4 bg-neutral-800/80 border-2 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-500' : 'border-neutral-600 hover:border-neutral-500'
                }`}
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <motion.p 
                    className="text-red-500 text-sm flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {errors.description}
                  </motion.p>
                )}
                <p className="text-sm text-neutral-500 ml-auto">
                  {formData.description.length}/500 characters
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center shadow-2xl shadow-red-600/30"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Uploading to Holy Shorts...
              </>
            ) : (
              <>
                <Plus className="h-6 w-6 mr-3" />
                Add to Holy Shorts
              </>
            )}
          </motion.button>

          {/* Help Text */}
          <motion.div 
            className="text-center text-lg text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <p>By uploading, you agree to share spiritual content that inspires and uplifts the community.</p>
            <p className="text-sm text-neutral-600 mt-2">Engagement numbers (likes, comments, shares) will be automatically generated.</p>
          </motion.div>
        </motion.form>
      </main>
    </motion.div>
  );
} 