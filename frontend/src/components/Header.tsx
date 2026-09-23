'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../lib/types';
import { 
  Building2, 
  GraduationCap, 
  Sparkles, 
  Search, 
  PlusCircle, 
  LogOut, 
  ShieldAlert,
  Compass,
  Route,
  User as UserIcon,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  user: User | null;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenPostModal?: () => void;
  onOpenOnboarding?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  onOpenAuth,
  onOpenPostModal,
  onOpenOnboarding,
  onLogout
}) => {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initial = saved || 'dark';
    setTheme(initial);
    if (initial === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogoClick = () => {
    setActiveCategory('all');
    router.push('/');
  };

  const handleShareClick = () => {
    if (onOpenPostModal) {
      onOpenPostModal();
    } else {
      router.push('/share');
    }
  };

  const handleSignInClick = () => {
    if (onOpenAuth) {
      onOpenAuth('login');
    } else {
      router.push('/login');
    }
  };

  const handleRegisterClick = () => {
    if (onOpenAuth) {
      onOpenAuth('signup');
    } else {
      router.push('/signup');
    }
  };

  const handleNavCategory = (cat: string) => {
    setActiveCategory(cat);
    router.push(`/?category=${cat}`);
    setTimeout(() => {
      const el = document.getElementById('pathways-feed');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0b132b]/95 backdrop-blur-md border-b border-slate-200 dark:border-teal-900/60 py-3 transition-colors text-slate-900 dark:text-white" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4" suppressHydrationWarning>
        <div className="w-full md:w-auto flex items-center justify-between gap-3">
          <div 
            className="bg-slate-50 dark:bg-[#0f1d3a] border border-slate-200 dark:border-teal-800/80 shadow-md hover:border-[#007b88] px-3.5 py-2 rounded-2xl flex items-center gap-2.5 cursor-pointer transition-all"
            onClick={handleLogoClick}
          >
            <div className="w-9 h-9 rounded-xl bg-[#007b88] text-[#facc15] font-extrabold flex items-center justify-center shadow-md">
              <Route className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="font-black text-lg tracking-tight text-[#007b88] dark:text-white block">
                PrepShare
              </span>
              <span className="font-extrabold text-xs tracking-wide text-amber-600 dark:text-[#facc15] uppercase block -mt-1">
                Pathways
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              suppressHydrationWarning
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-teal-700/80 bg-slate-100 dark:bg-[#0f1d3a] text-slate-700 dark:text-[#facc15]"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#facc15]" /> : <Moon className="w-4 h-4 text-[#007b88]" />}
            </button>
            <button
              onClick={handleShareClick}
              className="btn-gfi-yellow px-3.5 py-2 rounded-full text-xs font-black"
            >
              + Share
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-100 dark:bg-[#0f1d3a] border border-slate-200 dark:border-teal-800/80 px-2.5 py-1.5 rounded-full shadow-md dark:shadow-black/20" suppressHydrationWarning>
          <button
            suppressHydrationWarning
            onClick={() => handleNavCategory('all')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-[#007b88] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#007b88] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-teal-900/40'
            }`}
          >
            All Pathways
          </button>
          
          <button
            suppressHydrationWarning
            onClick={() => handleNavCategory('company')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black transition-all whitespace-nowrap ${
              activeCategory === 'company'
                ? 'bg-[#007b88] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#007b88] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-teal-900/40'
            }`}
          >
            Company Pathways
          </button>

          <button
            suppressHydrationWarning
            onClick={() => handleNavCategory('college')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black transition-all whitespace-nowrap ${
              activeCategory === 'college'
                ? 'bg-[#007b88] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#007b88] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-teal-900/40'
            }`}
          >
            College Pathways
          </button>

          <button
            suppressHydrationWarning
            onClick={() => handleNavCategory('fresher')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black transition-all whitespace-nowrap ${
              activeCategory === 'fresher'
                ? 'bg-[#007b88] text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:text-[#007b88] dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-teal-900/40'
            }`}
          >
            Fresher Pathways
          </button>
        </nav>

        <div className="flex-1 max-w-xs relative hidden xl:block">
          <Search className="w-4 h-4 text-teal-600 dark:text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            suppressHydrationWarning
            type="text"
            placeholder="Search company, college, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-[#07132b] border border-slate-200 dark:border-teal-800/80 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#007b88] font-bold transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5" suppressHydrationWarning>
          <button
            suppressHydrationWarning
            onClick={toggleTheme}
            className="p-2 rounded-full border border-slate-200 dark:border-teal-700/80 bg-slate-100 dark:bg-[#0f1d3a] text-slate-700 dark:text-[#facc15] hover:bg-slate-200 dark:hover:bg-teal-900/50 transition-all shadow-xs"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#facc15]" />
            ) : (
              <Moon className="w-4 h-4 text-[#007b88]" />
            )}
          </button>

          <button
            suppressHydrationWarning
            onClick={handleShareClick}
            className="btn-gfi-yellow px-4 sm:px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Share Experience</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-teal-800/60 pl-3" suppressHydrationWarning>
              <button
                suppressHydrationWarning
                onClick={() => {
                  if (onOpenOnboarding) {
                    onOpenOnboarding();
                  }
                  const el = document.getElementById('personalized-profile-rail');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-9 h-9 rounded-full bg-[#007b88] hover:bg-teal-600 text-white font-black flex items-center justify-center text-sm shadow-md border border-teal-400/40 transition-all hover:scale-105 cursor-pointer"
                title={`${user.name} — Click to view & edit profile`}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                <a
                  href="/admin"
                  className="p-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/40 rounded-full transition-all hover:bg-amber-100 dark:hover:bg-amber-900/60"
                  title="Admin Moderation Portal"
                >
                  <ShieldAlert className="w-4 h-4" />
                </a>
              )}

              <button
                suppressHydrationWarning
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full transition-all"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2" suppressHydrationWarning>
              <button
                suppressHydrationWarning
                onClick={handleSignInClick}
                className="text-slate-800 dark:text-white hover:text-[#007b88] dark:hover:text-[#facc15] font-black px-3 py-1.5 rounded-full text-xs transition-all"
              >
                Sign In
              </button>
              <button
                suppressHydrationWarning
                onClick={handleRegisterClick}
                className="bg-[#007b88] text-white hover:bg-teal-600 px-4 py-2 rounded-full text-xs font-black shadow-md transition-all border border-teal-400/30"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
