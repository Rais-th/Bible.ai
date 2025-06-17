
"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface NebulaBackgroundProps {
  imageUrl?: string; // For a fixed image, takes precedence
  lightImageUrl?: string;
  darkImageUrl?: string;
}

// Helper to get initial image based on default theme (from ThemeProvider)
// This is a best-effort guess before client-side theme is fully resolved.
const getInitialImageUrl = ({ imageUrl, lightImageUrl, darkImageUrl }: NebulaBackgroundProps): string => {
  if (imageUrl) return imageUrl;

  // ThemeProvider defaultTheme is "dark" in src/app/layout.tsx
  const defaultThemeIsDark = true; 

  if (defaultThemeIsDark && darkImageUrl) return darkImageUrl;
  if (!defaultThemeIsDark && lightImageUrl) return lightImageUrl;
  
  // Fallbacks if default theme doesn't match provided images or if no theme-specific images are given
  if (darkImageUrl) return darkImageUrl;
  if (lightImageUrl) return lightImageUrl;
  
  return '/grainy-gradient-bg.png'; // Final fallback
};

export function NebulaBackground({ imageUrl, lightImageUrl, darkImageUrl }: NebulaBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(() =>
    getInitialImageUrl({ imageUrl, lightImageUrl, darkImageUrl })
  );
  const [imageOpacity, setImageOpacity] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let newImgUrl = '/grainy-gradient-bg.png'; 

    if (imageUrl) {
      newImgUrl = imageUrl;
    } else if (resolvedTheme === 'dark' && darkImageUrl) {
      newImgUrl = darkImageUrl;
    } else if (resolvedTheme === 'light' && lightImageUrl) {
      newImgUrl = lightImageUrl;
    } else {
      // Fallback logic if a specific theme image isn't provided for the current theme
      if (resolvedTheme === 'dark' && lightImageUrl) newImgUrl = lightImageUrl; // Prefer any available image
      else if (resolvedTheme === 'light' && darkImageUrl) newImgUrl = darkImageUrl;
      else if (darkImageUrl) newImgUrl = darkImageUrl; // Fallback to dark if available
      else if (lightImageUrl) newImgUrl = lightImageUrl; // Then to light if available
    }

    if (newImgUrl !== currentImageUrl) {
      setImageOpacity(0); // Start fade out
      setTimeout(() => {
        setCurrentImageUrl(newImgUrl);
        // Fade in will be handled by the subsequent opacity update or initial load logic
      }, 300); // Duration for fade out, image will be swapped, then fade in starts
    }
  }, [resolvedTheme, imageUrl, lightImageUrl, darkImageUrl, mounted, currentImageUrl]);

  useEffect(() => {
    if (mounted) {
      // This effect ensures fade-in after currentImageUrl is updated or for initial load
      const fadeInTimeout = setTimeout(() => {
        setImageOpacity(1);
      }, 50); // Short delay to allow image URL to propagate if changed
      return () => clearTimeout(fadeInTimeout);
    }
  }, [currentImageUrl, mounted]);


  if (!mounted) {
    // Render nothing server-side or until mounted to prevent flash.
    return null; 
  }

  return (
    <div
      key={currentImageUrl} 
      className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${currentImageUrl})`,
        opacity: imageOpacity,
        transition: 'opacity 0.5s ease-in-out',
      }}
      aria-hidden="true"
    />
  );
}
