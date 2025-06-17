"use client";

import { FloatingNavbar } from "@/components/floating-navbar";
import { useState } from "react";
import { Heart, MessageCircle, Share, Music } from "lucide-react"; // Import necessary icons

export default function ShortsPage() {
  const [currentVideo, setCurrentVideo] = useState({
    id: "1",
    src: "https://videos.pexels.com/video-files/5042686/5042686-uhd_2160_3840_25fps.mp4", // Placeholder video
    user: "@craig_love",
    description: "The most satisfying Job #fyp #satisfying #roadmarking",
    likes: "328.7K",
    comments: "578",
    shares: "Share",
    music: "Roddy Roundicch - The Rou",
    userAvatar: "/images/avatar.jpg", // Placeholder for user avatar
  });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black flex flex-col justify-between">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={currentVideo.src}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4 text-white">
        {/* Header (Following/For You) - Mobile Only for now, Desktop will use FloatingNavbar */}
        <div className="flex justify-center pt-8 md:hidden">
          <div className="flex space-x-4 text-lg font-semibold">
            <span className="text-white/60">Following</span>
            <span className="text-white">For You</span>
          </div>
        </div>

        <div className="flex flex-col justify-end flex-grow">
          <div className="flex items-end justify-between">
            {/* Info Section */}
            <div className="mb-4">
              <p className="text-lg font-bold">{currentVideo.user}</p>
              <p className="text-sm">{currentVideo.description}</p>
              <div className="flex items-center text-sm mt-1">
                <Music className="h-4 w-4 mr-2" />
                <span>{currentVideo.music}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center space-y-6 mb-4">
              {/* User Profile */}
              <div className="relative">
                <img
                  src={currentVideo.userAvatar}
                  alt="User Avatar"
                  className="h-12 w-12 rounded-full border-2 border-white"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full h-5 w-5 flex items-center justify-center text-white text-xs">
                  +
                </div>
              </div>

              {/* Likes */}
              <div className="flex flex-col items-center">
                <Heart className="h-8 w-8" />
                <span className="text-xs font-semibold">{currentVideo.likes}</span>
              </div>
              {/* Comments */}
              <div className="flex flex-col items-center">
                <MessageCircle className="h-8 w-8" />
                <span className="text-xs font-semibold">{currentVideo.comments}</span>
              </div>
              {/* Shares */}
              <div className="flex flex-col items-center">
                <Share className="h-8 w-8" />
                <span className="text-xs font-semibold">{currentVideo.shares}</span>
              </div>
              {/* Disc - Placeholder */}
              <div className="h-12 w-12 rounded-full bg-gray-500/50 flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Navbar */}
      <FloatingNavbar />
    </div>
  );
} 