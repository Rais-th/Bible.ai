// Centralized video data for Holy Shorts
// This file contains all placeholder videos before users start posting

export interface Video {
  id: number;
  videoUrl: string;
  username: string;
  verified: boolean;
  description: string;
  likes: string;
  comments: string;
  bookmarks: string;
  shares: string;
  avatar: string;
}

// Joshua Selman Videos
const joshuaSelmanVideos: Video[] = [
  {
    id: 2,
    videoUrl: "https://www.youtube.com/embed/uB1EUHtZzq4",
    username: "joshuaselman",
    verified: true,
    description: "The Koinonia Experience - Walking in Divine Fellowship ✨ #koinonia #fellowship #grace",
    likes: "1.2M",
    comments: "18.7K",
    bookmarks: "156.3K",
    shares: "78.9K",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 7,
    videoUrl: "https://www.youtube.com/embed/uB1EUHtZzq4",
    username: "joshuaselman",
    verified: true,
    description: "Understanding Grace - The Unmerited Favor of God 🙌 #grace #mercy #understanding",
    likes: "1.1M",
    comments: "22.1K",
    bookmarks: "145.2K",
    shares: "73.5K",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 15,
    videoUrl: "https://www.youtube.com/embed/uB1EUHtZzq4",
    username: "joshuaselman",
    verified: true,
    description: "The Mystery of Faith - Walking in the Supernatural 🔥 #faith #supernatural #mystery",
    likes: "892K",
    comments: "15.3K",
    bookmarks: "112.8K",
    shares: "58.4K",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  }
];

// Joel Osteen Videos
const joelOsteenVideos: Video[] = [
  {
    id: 3,
    videoUrl: "https://www.youtube.com/embed/gTgcGlnK1kk",
    username: "joelosteen",
    verified: true,
    description: "Your Best Life Starts Today! Favor is Coming Your Way 🌟 #favor #breakthrough #hope",
    likes: "2.1M",
    comments: "24.5K",
    bookmarks: "198.7K",
    shares: "112.3K",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 8,
    videoUrl: "https://www.youtube.com/embed/gTgcGlnK1kk",
    username: "joelosteen",
    verified: true,
    description: "God's Got Something Better - Don't Settle for Less! 🎯 #better #upgrade #destiny",
    likes: "1.7M",
    comments: "19.3K",
    bookmarks: "178.9K",
    shares: "95.7K",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 16,
    videoUrl: "https://www.youtube.com/embed/gTgcGlnK1kk",
    username: "joelosteen",
    verified: true,
    description: "Declare Victory Over Your Life Today! 🏆 #victory #declaration #overcome",
    likes: "1.4M",
    comments: "21.7K",
    bookmarks: "167.2K",
    shares: "89.3K",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  }
];

// TD Jakes Videos
const tdJakesVideos: Video[] = [
  {
    id: 4,
    videoUrl: "https://www.youtube.com/embed/gTgcGlnK1kk",
    username: "tdjakes",
    verified: true,
    description: "Woman Thou Art Loosed - Breaking Every Chain 💪 #freedom #deliverance #empowerment",
    likes: "1.8M",
    comments: "31.2K",
    bookmarks: "167.8K",
    shares: "89.4K",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 9,
    videoUrl: "https://www.youtube.com/embed/gTgcGlnK1kk",
    username: "tdjakes",
    verified: true,
    description: "Instinct to Destiny - Trust Your God-Given Intuition 🧭 #instinct #destiny #calling",
    likes: "1.4M",
    comments: "27.8K",
    bookmarks: "134.6K",
    shares: "82.1K",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 17,
    videoUrl: "https://www.youtube.com/embed/gTgcGlnK1kk",
    username: "tdjakes",
    verified: true,
    description: "Crushing the Enemy - Spiritual Warfare Victory ⚔️ #warfare #victory #enemy",
    likes: "1.6M",
    comments: "25.9K",
    bookmarks: "149.1K",
    shares: "76.8K",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?w=40&h=40&fit=crop&crop=face",
  }
];

// David Oyedepo Videos
const davidOyedepoVideos: Video[] = [
  {
    id: 5,
    videoUrl: "https://www.youtube.com/embed/27wYDautyaI",
    username: "davidoyedepo",
    verified: true,
    description: "Faith That Moves Mountains - Winners Never Quit! 🏔️ #faith #victory #winners",
    likes: "934K",
    comments: "15.6K",
    bookmarks: "123.4K",
    shares: "67.8K",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 10,
    videoUrl: "https://www.youtube.com/embed/27wYDautyaI",
    username: "davidoyedepo",
    verified: true,
    description: "The Power of Covenant - Walking in Divine Agreement 📜 #covenant #agreement #power",
    likes: "823K",
    comments: "13.7K",
    bookmarks: "98.5K",
    shares: "52.3K",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 18,
    videoUrl: "https://www.youtube.com/embed/27wYDautyaI",
    username: "davidoyedepo",
    verified: true,
    description: "Prosperity with Purpose - God's Plan for Abundance 💰 #prosperity #abundance #purpose",
    likes: "1.2M",
    comments: "19.4K",
    bookmarks: "134.7K",
    shares: "71.2K",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  }
];

// Uebert Angel Videos
const uebertAngelVideos: Video[] = [
  {
    id: 6,
    videoUrl: "https://www.youtube.com/embed/lPITd9j2xEc",
    username: "uebertangel",
    verified: true,
    description: "Prophetic Declarations Over Your Life 🔥 #prophecy #miracles #supernatural",
    likes: "756K",
    comments: "9.8K",
    bookmarks: "87.3K",
    shares: "41.6K",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 11,
    videoUrl: "https://www.youtube.com/embed/lPITd9j2xEc",
    username: "uebertangel",
    verified: true,
    description: "Supernatural Breakthrough - Miracles Are Your Portion! ⚡ #breakthrough #miracles #supernatural",
    likes: "692K",
    comments: "11.4K",
    bookmarks: "76.8K",
    shares: "38.9K",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 19,
    videoUrl: "https://www.youtube.com/embed/lPITd9j2xEc",
    username: "uebertangel",
    verified: true,
    description: "The Spirit of Excellence - Rising Above Mediocrity ⭐ #excellence #rise #mediocrity",
    likes: "584K",
    comments: "8.7K",
    bookmarks: "65.2K",
    shares: "34.1K",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  }
];

// Combine all videos into one array
export const allPlaceholderVideos: Video[] = [
  ...joshuaSelmanVideos,
  ...joelOsteenVideos,
  ...tdJakesVideos,
  ...davidOyedepoVideos,
  ...uebertAngelVideos
];

// Fisher-Yates shuffle algorithm for randomizing videos
export function shuffleVideos<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random videos for the Shorts feed
export function getRandomVideosForShorts(count: number = 12): Video[] {
  return shuffleVideos(allPlaceholderVideos).slice(0, count);
}

// Get videos by specific creator
export function getVideosByCreator(username: string): Video[] {
  return allPlaceholderVideos.filter(video => video.username === username);
}

// Get random video for starting the feed
export function getRandomStartingVideo(): Video {
  return allPlaceholderVideos[Math.floor(Math.random() * allPlaceholderVideos.length)];
} 