import BibleReader from '@/components/bible-reader';
import { NebulaBackground } from '@/components/nebula-background';
import { FloatingNavbar } from '@/components/floating-navbar';
import { ThemeToggle } from '@/components/theme-toggle';

export default function BiblePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 text-white overflow-x-hidden">
      <div className="hidden md:block">
        <FloatingNavbar />
      </div>
      <NebulaBackground />
      <div className="absolute top-4 right-4 z-10 print:hidden md:top-6 md:right-6">
        <ThemeToggle />
      </div>
      <main className="w-full max-w-5xl mt-20 md:mt-28 z-10">
        <BibleReader />
      </main>
    </div>
  );
}
