"use client"

import * as React from "react"
import { User, ArrowLeft, Camera } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ProfileToggle() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('English');
  const [selectedTranslation, setSelectedTranslation] = React.useState('KJV');
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [view, setView] = React.useState('main'); // 'main', 'profile', 'settings', 'editProfile', 'changePassword', 'changeProfilePicture', 'suggestFeature'
  const [username, setUsername] = React.useState('John Doe');
  const [email, setEmail] = React.useState('john.doe@example.com');
  const [newUsername, setNewUsername] = React.useState(username);
  const [newEmail, setNewEmail] = React.useState(email);
  const [profilePicture, setProfilePicture] = React.useState<string | null>(null);
  const [newProfilePicture, setNewProfilePicture] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [suggestion, setSuggestion] = React.useState('');
  const [showShorts, setShowShorts] = React.useState(true);

  React.useEffect(() => {
    const storedShowShorts = localStorage.getItem('showShorts');
    setShowShorts(storedShowShorts ? JSON.parse(storedShowShorts) : true);
  }, []);

  React.useEffect(() => {
    // Reset view when dropdown is closed
    if (!isOpen) {
      const timer = setTimeout(() => {
        setView('main')
        setNewProfilePicture(null);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLanguage = () => {
    setSelectedLanguage(prev => prev === 'English' ? 'French' : 'English');
  };

  const toggleTranslation = () => {
    setSelectedTranslation(prev => prev === 'KJV' ? 'NIV' : 'KJV');
  };

  const handleAuthClick = () => {
    setIsLoggedIn(prev => !prev);
    setIsOpen(false);
  };
  
  const motionProps = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.15, ease: "easeInOut" },
  };

  const SubMenuHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="flex items-center px-2 py-2 border-b border-border/70 dark:border-neutral-700/60">
      <button onClick={onBack} className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"><ArrowLeft size={16}/></button>
      <p className="font-semibold text-sm text-center flex-grow pr-8">{title}</p>
    </div>
  );

  const handleShowShortsToggle = () => {
    const newValue = !showShorts;
    setShowShorts(newValue);
    localStorage.setItem('showShorts', JSON.stringify(newValue));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white/80 dark:bg-white/15 backdrop-blur-sm border-slate-300/70 dark:border-white/20 hover:bg-slate-100/90 dark:hover:bg-white/25 text-neutral-700 dark:text-white shadow-md">
          <User className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Profile</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-neutral-800 border-border/70 dark:border-neutral-700/60 p-0 overflow-hidden">
        <AnimatePresence mode="wait">
           {isLoggedIn ? (
            <div key={view}>
              {view === 'main' && (
                <motion.div {...motionProps}>
                  <DropdownMenuItem onSelect={e => e.preventDefault()} onClick={() => setView('profile')} className="text-sm text-neutral-700 dark:text-neutral-200 hover:!bg-neutral-100 dark:hover:!bg-neutral-700 focus:!bg-neutral-100 dark:focus:!bg-neutral-700 cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={e => e.preventDefault()} onClick={() => setView('settings')} className="text-sm text-neutral-700 dark:text-neutral-200 hover:!bg-neutral-100 dark:hover:!bg-neutral-700 focus:!bg-neutral-100 dark:focus:!bg-neutral-700 cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                  <div className="border-t border-border/70 dark:border-neutral-700/60 my-1" />
                  <DropdownMenuItem onClick={handleAuthClick} className="text-sm text-red-600 dark:text-red-500 hover:!bg-neutral-100 dark:hover:!bg-neutral-700 focus:!bg-neutral-100 dark:focus:!bg-neutral-700 cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </motion.div>
              )}

              {view === 'profile' && (
                <motion.div {...motionProps}>
                  <SubMenuHeader title="Profile" onBack={() => setView('main')} />
                  <div className="py-2 text-sm text-neutral-700 dark:text-neutral-200">
                    <div className="flex items-center px-4 py-2">
                      <div className="relative w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 mr-3">
                        {profilePicture ? (
                          <img src={profilePicture} alt={username} className="rounded-full w-full h-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-neutral-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800 dark:text-white">{username}</p>
                        <p className="text-xs text-muted-foreground dark:text-neutral-400">{email}</p>
                      </div>
                    </div>
                    <div className="border-t border-border/70 dark:border-neutral-700/60 my-1" />
                    <div onClick={() => setView('changeProfilePicture')} className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                      Profile Picture
                    </div>
                    <div onClick={() => { setNewUsername(username); setNewEmail(email); setView('editProfile'); }} className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                      Name / Email
                    </div>
                    <div onClick={() => setView('changePassword')} className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                      Password
                    </div>
                  </div>
                </motion.div>
              )}

              {view === 'settings' && (
                <motion.div {...motionProps}>
                  <SubMenuHeader title="Settings" onBack={() => setView('main')} />
                  <div className="py-2 text-sm text-neutral-700 dark:text-neutral-200">
                    <div 
                      onClick={toggleLanguage} 
                      className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                      App Language: {selectedLanguage}
                    </div>
                    <div 
                      onClick={toggleTranslation} 
                      className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                      Bible Version: {selectedTranslation}
                    </div>
                    <div className="border-t border-border/70 dark:border-neutral-700/60 my-1" />
                    <div className="flex items-center justify-between px-4 py-2">
                      <Label htmlFor="shorts-toggle" className="font-normal cursor-pointer">
                        Enable Shorts
                      </Label>
                      <Switch
                        id="shorts-toggle"
                        checked={showShorts}
                        onCheckedChange={handleShowShortsToggle}
                      />
                    </div>
                    <div className="border-t border-border/70 dark:border-neutral-700/60 my-1" />
                    <div 
                      onClick={() => setView('suggestFeature')} 
                      className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                      Suggest a feature
                    </div>
                  </div>
                </motion.div>
              )}

              {view === 'editProfile' && (
                <motion.div {...motionProps}>
                  <SubMenuHeader title="Edit Name / Email" onBack={() => setView('profile')} />
                  <div className="p-4 space-y-3">
                    <Input type="text" placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="text-sm" />
                    <Input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="text-sm" />
                    <Button onClick={() => { setUsername(newUsername); setEmail(newEmail); setView('profile'); }} className="w-full">Save</Button>
                  </div>
                </motion.div>
              )}

              {view === 'changePassword' && (
                <motion.div {...motionProps}>
                  <SubMenuHeader title="Change Password" onBack={() => setView('profile')} />
                  <div className="p-4 space-y-3">
                    <Input type="password" placeholder="Current Password" className="text-sm" />
                    <Input type="text" placeholder="New Password" className="text-sm" autoComplete="new-password" />
                    <Input type="text" placeholder="Confirm New Password" className="text-sm" autoComplete="new-password" />
                    <Button onClick={() => setView('profile')} className="w-full">Save Changes</Button>
                  </div>
                </motion.div>
              )}

              {view === 'suggestFeature' && (
                <motion.div {...motionProps}>
                  <SubMenuHeader title="Suggest a Feature" onBack={() => setView('settings')} />
                  <div className="p-4 space-y-3">
                    <Textarea
                      placeholder="Tell us what you'd like to see!"
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      className="text-sm min-h-[100px]"
                    />
                    <Button
                      onClick={() => {
                        // Here you would typically handle the submission, e.g., send to a server
                        console.log('Feature suggestion:', suggestion);
                        setSuggestion('');
                        setView('settings');
                        // Maybe show a 'Thank you' toast
                      }}
                      disabled={!suggestion.trim()}
                      className="w-full"
                    >
                      Submit
                    </Button>
                  </div>
                </motion.div>
              )}

              {view === 'changeProfilePicture' && (
                <motion.div {...motionProps}>
                  <SubMenuHeader title="Change Profile Picture" onBack={() => { setView('profile'); setNewProfilePicture(null); }} />
                  <div className="p-4 space-y-4 flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                       <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                        {newProfilePicture ? (
                          <img src={newProfilePicture} alt="Preview" className="w-full h-full object-cover" />
                        ) : profilePicture ? (
                          <img src={profilePicture} alt={username} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-12 w-12 text-neutral-500" />
                        )}
                      </div>
                      <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-white dark:bg-neutral-900 p-1.5 rounded-full shadow-md border border-border/70 dark:border-neutral-700/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                     <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button 
                      onClick={() => { 
                        if (newProfilePicture) {
                          setProfilePicture(newProfilePicture); 
                          setNewProfilePicture(null);
                        }
                        setView('profile'); 
                      }} 
                      disabled={!newProfilePicture}
                      className="w-full"
                    >
                      Save
                    </Button>
                  </div>
                </motion.div>
              )}

            </div>
          ) : (
            <motion.div {...motionProps}>
              <DropdownMenuItem onClick={handleAuthClick} className="text-sm text-neutral-700 dark:text-neutral-200 hover:!bg-neutral-100 dark:hover:!bg-neutral-700 focus:!bg-neutral-100 dark:focus:!bg-neutral-700 cursor-pointer">
                Login
              </DropdownMenuItem>
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 