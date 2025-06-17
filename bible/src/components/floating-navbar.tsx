"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, PlaySquare, ScrollText } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType | 'shorts-image' | 'bible-image';
  href: string;
}

const allNavItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Compass, href: '/' },
  { id: 'shorts', label: 'Shorts', icon: 'shorts-image', href: '/shorts' },
  { id: 'bible', label: 'Bible', icon: 'bible-image', href: '/bible' },
];

export function FloatingNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItem[]>(allNavItems);
  const [activeId, setActiveId] = useState(navItems[0].id);

  useEffect(() => {
    const updateNavItems = () => {
      const storedShowShorts = localStorage.getItem('showShorts');
      const showShorts = storedShowShorts ? JSON.parse(storedShowShorts) : true;
      setNavItems(showShorts ? allNavItems : allNavItems.filter(item => item.id !== 'shorts'));
    };

    updateNavItems(); // Set initial state

    window.addEventListener('storage', updateNavItems); // Listen for changes

    return () => {
      window.removeEventListener('storage', updateNavItems); // Cleanup
    };
  }, []);

  useEffect(() => {
    const currentNavItem = navItems.find(item => {
      if (item.href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(item.href);
    });

    if (currentNavItem) {
      setActiveId(currentNavItem.id);
    } else if (pathname === '/') {
      // Find the home item in the potentially filtered list
      const homeItem = navItems.find(item => item.id === 'home');
      if (homeItem) {
        setActiveId(homeItem.id);
      }
    }
  }, [pathname, navItems]);

  const commonButtonClasses = "relative flex flex-col items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const commonActivePillClasses = "absolute inset-0 -z-10";

  // Check if we're on the shorts page to adjust positioning
  const isOnShortsPage = pathname.startsWith('/shorts');

  return (
    <>
      {/* Mobile: Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 print:hidden">
        <div className="flex justify-around items-center bg-background/90 dark:bg-neutral-900/85 backdrop-blur-md border-t border-border/70 dark:border-neutral-700/60 shadow-t-xl h-16">
          {navItems.map((item) => (
            <Link
              key={`mobile-${item.id}`}
              href={item.href}
              prefetch={true}
              className={`${commonButtonClasses} h-full w-full p-2
                ${activeId === item.id ? 'text-primary dark:text-white font-medium' : 'text-muted-foreground hover:text-foreground dark:text-neutral-400 dark:hover:text-white'}
              `}
              aria-current={activeId === item.id ? "page" : undefined}
            >
              {item.icon === 'bible-image' ? (
                <Image src="/bible.png" alt="Bible" width={24} height={24} className="mb-0.5" style={{ objectFit: 'contain' }} />
              ) : item.icon === 'shorts-image' ? (
                <Image src="/shorts.png" alt="Shorts" width={24} height={24} className="mb-0.5" style={{ objectFit: 'contain' }} />
              ) : (
                <item.icon className="h-6 w-6 shrink-0 mb-0.5" />
              )}
              <span className={`text-xs ${activeId === item.id ? 'text-primary dark:text-white' : 'text-muted-foreground hover:text-foreground dark:text-neutral-400'}`}>{item.label}</span>
              {activeId === item.id && (
                <motion.div
                  layoutId="active-nav-pill-mobile-unique" 
                  className={`${commonActivePillClasses} bg-primary/10 dark:bg-neutral-700/70`}
                  style={{ borderRadius: '12px' }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: Top Floating Pill - Adjusted for sidebar */}
      <div className={`hidden md:flex fixed top-6 z-50 print:hidden ${
        isOnShortsPage 
          ? 'left-1/2 transform -translate-x-1/2 ml-32' // Offset by half sidebar width (256px / 2 = 128px = ml-32)
          : 'left-1/2 transform -translate-x-1/2'
      }`}>
        <div className="flex items-center space-x-1 bg-white/80 dark:bg-neutral-800/60 backdrop-blur-lg border border-slate-300/70 dark:border-neutral-700/50 rounded-full p-1 sm:p-1.5 shadow-xl">
          {navItems.map((item) => (
            <Link
              key={`desktop-${item.id}`}
              href={item.href}
              prefetch={true}
              className={`${commonButtonClasses} px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-sm 
                ${activeId === item.id ? 'text-primary dark:text-white font-medium' : 'text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-white'}
              `}
              aria-current={activeId === item.id ? "page" : undefined}
            >
              <div className="flex items-center space-x-2">
                {item.icon === 'bible-image' ? (
                  <Image src="/bible.png" alt="Bible" width={20} height={20} style={{ objectFit: 'contain' }} />
                ) : item.icon === 'shorts-image' ? (
                  <Image src="/shorts.png" alt="Shorts" width={20} height={20} style={{ objectFit: 'contain' }} />
                ) : (
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                )}
                <span className="truncate">{item.label}</span>
              </div>

              {activeId === item.id && (
                <motion.div
                  layoutId="active-nav-pill-desktop-unique" 
                  className={`${commonActivePillClasses} bg-primary/10 dark:bg-neutral-600/80 rounded-full`}
                  style={{ borderRadius: 9999 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
