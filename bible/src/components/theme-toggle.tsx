"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProfileToggle } from "@/components/profile-toggle"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <ProfileToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-white/80 dark:bg-white/15 backdrop-blur-sm border-slate-300/70 dark:border-white/20 hover:bg-slate-100/90 dark:hover:bg-white/25 text-neutral-700 dark:text-white shadow-md">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground dark:bg-neutral-800 dark:border-neutral-700 dark:text-white">
          <DropdownMenuItem onClick={() => setTheme("light")} className="hover:!bg-accent dark:hover:!bg-neutral-700 focus:!bg-accent dark:focus:!bg-neutral-700">
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:!bg-accent dark:hover:!bg-neutral-700 focus:!bg-accent dark:focus:!bg-neutral-700">
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="hover:!bg-accent dark:hover:!bg-neutral-700 focus:!bg-accent dark:focus:!bg-neutral-700">
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
