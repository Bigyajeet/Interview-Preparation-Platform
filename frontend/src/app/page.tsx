'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Post, College, Company } from '../lib/types';
import { api } from '../lib/api';
import { Header } from '../components/Header';
import { PostCard } from '../components/PostCard';
import { PersonalizedRails } from '../components/PersonalizedRails';
import { OnboardingModal } from '../components/OnboardingModal';

import { 
  Building2, 
  GraduationCap, 
  Sparkles, 
  RefreshCw,
  SlidersHorizontal,
  Route
} from 'lucide-react';

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialSplash, setInitialSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialSplash(false);
    }, 750);
    return () => clearTimeout(timer);
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('');
  const [modeFilter, setModeFilter] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recent');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && ['all', 'company', 'college', 'fresher'].includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    api.getMe()
      .then(u => {
        if (u) {
          setUser(u);
          const dismissed = localStorage.getItem('onboarding_dismissed_' + u.id);
          if (!u.collegeId && !u.currentCompany && u.status === 'STUDENT' && !dismissed) {
            setShowOnboarding(true);
          }
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));

    api.getCompanies().then(setCompanies).catch(() => {});
    api.getColleges().then(setColleges).catch(() => {});
  }, []);

  useEffect(() => {
    fetchFeed(true);
  }, [activeCategory, searchQuery, selectedCompanyId, selectedCollegeId, modeFilter, resultFilter, sortBy]);

  const fetchFeed = async (reset: boolean = false) => {
    setLoading(true);
    try {
      const res = await api.getPosts({
        category: activeCategory !== 'all' ? activeCategory : undefined,
        companyId: selectedCompanyId || undefined,
        collegeId: selectedCollegeId || undefined,
        mode: modeFilter || undefined,
        result: resultFilter || undefined,
        search: searchQuery || undefined,
        sort: sortBy,
        cursor: reset ? undefined : (nextCursor || undefined)
      });

      if (reset) {
        setPosts(res.posts);
      } else {
        setPosts(prev => [...prev, ...res.posts]);
      }
      setNextCursor(res.nextCursor);
    } catch (err) {
      console.error('Fetch feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvoteInFeed = async (postId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await api.toggleUpvote(postId);
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, isUpvoted: res.upvoted, upvoteCount: res.upvoteCount };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToFeed = () => {
    const el = document.getElementById('pathways-feed');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (initialSplash) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-sans transition-colors bg-pathways-pattern">
        <div className="flex flex-col items-center justify-center space-y-4 text-center p-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-[#007b88] text-[#facc15] font-extrabold flex items-center justify-center shadow-2xl border border-teal-400/40 animate-bounce">
            <Route className="w-11 h-11" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#007b88] dark:text-white font-display">
              PrepShare
            </h1>
            <p className="text-xs sm:text-sm font-extrabold tracking-widest text-amber-600 dark:text-[#facc15] uppercase mt-1">
              Career Pathways
            </p>
          </div>
          <div className="w-48 h-2 bg-slate-200 dark:bg-teal-900/60 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#007b88] via-[#facc15] to-[#007b88] w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors relative bg-pathways-pattern bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white">
      <Header
        user={user}
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          setSelectedCompanyId('');
          setSelectedCollegeId('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onLogout={() => {
          localStorage.removeItem('token');
          setUser(null);
        }}
      />

      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b132b] text-center overflow-hidden border-b border-slate-200 dark:border-teal-900/60 transition-colors">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
          <svg className="w-[200%] h-full absolute top-0 left-0 animate-river-primary" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <defs>
              <linearGradient id="riverGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#007b88" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path fill="url(#riverGrad1)" d="M0,160 C320,300 420,40 740,160 C1060,280 1180,60 1440,160 L1440,320 L0,320 Z"></path>
          </svg>

          <svg className="w-[200%] h-full absolute top-8 left-0 animate-river-secondary" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <defs>
              <linearGradient id="riverGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#007b88" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path fill="url(#riverGrad2)" d="M0,192 C400,80 550,280 900,140 C1250,0 1350,220 1440,192 L1440,320 L0,320 Z"></path>
          </svg>

          <div className="absolute top-1/3 left-0 w-3 h-3 rounded-full bg-[#06b6d4] blur-xs animate-river-stream opacity-80" />
          <div className="absolute top-1/2 left-0 w-4 h-4 rounded-full bg-[#10b981] blur-xs animate-river-stream animation-delay-2000 opacity-70" />
          <div className="absolute top-2/3 left-0 w-2 h-2 rounded-full bg-[#38bdf8] blur-xs animate-river-stream animation-delay-4000 opacity-90" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] font-display">
            Interview Experience <br />
            <span className="text-[#007b88] dark:text-[#facc15]">Career Pathways</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-teal-200 font-semibold leading-relaxed max-w-3xl mx-auto">
            This comprehensive guide is designed for university students, recent graduates, and career switchers preparing for tech & placement interviews. Details insights into skills required, round breakdowns, and questions asked across top companies and colleges.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToFeed}
              className="btn-gfi-yellow px-9 py-4 text-base font-black shadow-xl inline-flex items-center gap-2.5"
            >
              <Route className="w-5 h-5 text-slate-950" />
              <span>Explore Career Maps</span>
            </button>

            <button
              onClick={() => user ? router.push('/share') : router.push('/login')}
              className="bg-[#007b88] hover:bg-teal-600 text-white px-8 py-4 rounded-full text-base font-black shadow-xl border border-teal-400/40 inline-flex items-center gap-2"
            >
              <span>Share Experience</span>
            </button>
          </div>
        </div>

        <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-left relative z-10">
          <div 
            onClick={() => { setActiveCategory('company'); scrollToFeed(); }}
            className="bg-white/90 dark:bg-[#132247]/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200 dark:border-teal-800/80 hover:border-[#007b88] shadow-md dark:shadow-xl flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="p-3 rounded-2xl bg-[#007b88] text-[#facc15]">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Company Tagged</h4>
              <p className="text-xs text-slate-600 dark:text-teal-200 font-medium">Google, TCS, Infosys, Microsoft, Amazon</p>
            </div>
          </div>

          <div 
            onClick={() => { setActiveCategory('college'); scrollToFeed(); }}
            className="bg-white/90 dark:bg-[#132247]/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200 dark:border-teal-800/80 hover:border-purple-500 shadow-md dark:shadow-xl flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">College Archives</h4>
              <p className="text-xs text-slate-600 dark:text-teal-200 font-medium">IIT Bombay, BITS Pilani, NIT Trichy, DU</p>
            </div>
          </div>

          <div 
            onClick={() => { setActiveCategory('fresher'); scrollToFeed(); }}
            className="bg-white/90 dark:bg-[#132247]/90 backdrop-blur-md p-5 rounded-3xl border border-slate-200 dark:border-teal-800/80 hover:border-emerald-500 shadow-md dark:shadow-xl flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Fresher Guides</h4>
              <p className="text-xs text-slate-600 dark:text-teal-200 font-medium">First-time placement & SDE-1 roadmaps</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#007b88] text-white relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight font-display">
              What Are
            </h2>
            <div className="gfi-highlight-box text-2xl sm:text-4xl font-black">
              Interview Pathways?
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-teal-50 font-medium leading-relaxed">
            <p>
              <strong className="text-[#facc15] font-extrabold">Company Pathways (Direct Hiring Drives)</strong> provide step-by-step interview breakdowns for top employers like Google, TCS, Infosys, Microsoft, and Amazon. Gain deep insights into technical rounds, coding problem difficulties, and system design expectations.
            </p>
            <p>
              <strong className="text-[#facc15] font-extrabold">College Pathways (University Placements)</strong> are tagged by university alumni and campus candidates from top institutes (IITs, BITS, NITs, VTU, DU). Understand on-campus cutoffs, shortlist criteria, and HR questions.
            </p>
            <p>
              <strong className="text-[#facc15] font-extrabold">Fresher Pathways (First-Time Candidates)</strong> detail dedicated roadmaps for first-time job hunters, entry-level SDE-1 roles, and internships with candidate advice on preparation strategies.
            </p>
          </div>
        </div>
      </section>

      <main id="pathways-feed" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 font-display">
              {activeCategory === 'company' && <Building2 className="w-6 h-6 text-[#007b88] dark:text-[#facc15]" />}
              {activeCategory === 'college' && <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
              {activeCategory === 'fresher' && <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
              {activeCategory === 'all' ? 'All Interview Pathways' : `${activeCategory.toUpperCase()} Pathways`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-teal-200 font-semibold mt-0.5">
              Explore authentic placement experience maps and round breakdown questions
            </p>
          </div>

          <button
            onClick={() => fetchFeed(true)}
            className="btn-click-effect flex items-center gap-2 text-xs font-black text-[#007b88] dark:text-[#facc15] bg-white dark:bg-[#132247] border border-slate-200 dark:border-teal-800 hover:border-[#007b88] px-4 py-2.5 rounded-full shadow-md transition-all self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#007b88] dark:text-[#facc15]" /> Refresh Feed
          </button>
        </div>

        <div className="bg-white dark:bg-[#132247]/95 border border-slate-200/90 dark:border-teal-800/80 backdrop-blur-md rounded-3xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-md dark:shadow-xl" suppressHydrationWarning>
          <div className="flex flex-wrap items-center gap-2.5 text-xs" suppressHydrationWarning>
            <span className="text-slate-600 dark:text-teal-200 font-extrabold flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-4 h-4 text-[#007b88] dark:text-[#facc15]" /> Pathways Filters:
            </span>

            <select
              suppressHydrationWarning
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="bg-slate-50 dark:bg-[#081226] border border-slate-200 dark:border-teal-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#007b88] transition-all cursor-pointer"
            >
              <option value="">All Companies</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select
              suppressHydrationWarning
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="bg-slate-50 dark:bg-[#081226] border border-slate-200 dark:border-teal-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#007b88] transition-all cursor-pointer"
            >
              <option value="">All Colleges</option>
              {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select
              suppressHydrationWarning
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#081226] border border-slate-200 dark:border-teal-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#007b88] transition-all cursor-pointer"
            >
              <option value="">All Modes</option>
              <option value="ON_CAMPUS">On-Campus Placement</option>
              <option value="OFF_CAMPUS">Off-Campus Drive</option>
              <option value="REFERRAL">Employee Referral</option>
              <option value="WALK_IN">Walk-In Drive</option>
            </select>

            <select
              suppressHydrationWarning
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#081226] border border-slate-200 dark:border-teal-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#007b88] transition-all cursor-pointer"
            >
              <option value="">All Outcomes</option>
              <option value="SELECTED">Selected / Offer</option>
              <option value="REJECTED">Rejected</option>
              <option value="AWAITING">Awaiting Result</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs" suppressHydrationWarning>
            <span className="text-slate-600 dark:text-teal-200 font-extrabold">Sort by:</span>
            <select
              suppressHydrationWarning
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-[#081226] border border-slate-200 dark:border-teal-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-black focus:outline-none focus:border-[#007b88] transition-all cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="upvoted">Most Upvoted</option>
              <option value="commented">Most Discussed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {loading && posts.length === 0 ? (
              <div className="py-24 text-center text-teal-600 dark:text-teal-300 text-xs font-extrabold tracking-wider uppercase animate-pulse">Loading interview pathways...</div>
            ) : posts.length === 0 ? (
              <div className="bg-white dark:bg-[#132247]/95 border border-slate-200 dark:border-teal-800/80 backdrop-blur-md rounded-3xl p-12 text-center space-y-4 shadow-xl">
                <p className="text-base font-black text-slate-900 dark:text-white">No interview pathways match this search.</p>
                <p className="text-xs text-slate-500 dark:text-teal-200 font-medium max-w-sm mx-auto">Be the first candidate to publish your placement roadmap!</p>
                <button
                  onClick={() => router.push(user ? '/share' : '/login')}
                  className="btn-gfi-yellow px-6 py-3 rounded-full text-xs font-black inline-block shadow-lg"
                >
                  Share Pathway Now ✨
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5">
                  {posts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={() => router.push(`/posts/${post.id}`)}
                      onUpvote={() => handleUpvoteInFeed(post.id)}
                    />
                  ))}
                </div>

                {nextCursor && (
                  <div className="pt-6 text-center">
                    <button
                      onClick={() => fetchFeed(false)}
                      className="btn-click-effect bg-white dark:bg-[#132247] hover:bg-slate-50 dark:hover:bg-[#007b88] text-[#007b88] dark:text-white border border-slate-200 dark:border-teal-800 px-8 py-3 rounded-full text-xs font-black shadow-lg transition-all"
                    >
                      Load More Pathways ↓
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <PersonalizedRails
              user={user}
              onSelectCompany={(compId) => setSelectedCompanyId(compId)}
              onSelectCollege={(colId) => setSelectedCollegeId(colId)}
              onEditProfile={() => setShowOnboarding(true)}
              onOpenAuth={() => router.push('/login')}
            />
          </div>
        </div>
      </main>

      <footer className="bg-[#074e57] dark:bg-[#050b1a] text-white py-12 relative z-10 border-t border-teal-600/30 dark:border-teal-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#007b88] text-[#facc15] font-extrabold flex items-center justify-center shadow-md">
                <Route className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">Interview Career Pathways</span>
            </div>
            <p className="text-xs text-teal-200 max-w-md font-medium leading-relaxed">
              Designed for university students, freshers, and career switchers preparing for tech placement drives. Explore authentic round roadmaps and interview questions.
            </p>
          </div>

          <div className="md:col-span-6 flex flex-col md:items-end justify-center space-y-3 text-xs text-teal-200">
            <div className="flex gap-4 font-bold">
              <button onClick={() => { setActiveCategory('company'); scrollToFeed(); }} className="hover:text-[#facc15]">Company Pathways</button>
              <span>|</span>
              <button onClick={() => { setActiveCategory('college'); scrollToFeed(); }} className="hover:text-[#facc15]">College Pathways</button>
              <span>|</span>
              <button onClick={() => { setActiveCategory('fresher'); scrollToFeed(); }} className="hover:text-[#facc15]">Fresher Pathways</button>
            </div>
            <p className="text-[11px] text-teal-300/80 font-medium">© 2026 PrepShare Pathways.</p>
          </div>
        </div>
      </footer>

      {showOnboarding && user && (
        <OnboardingModal
          user={user}
          onClose={() => {
            if (user) {
              localStorage.setItem('onboarding_dismissed_' + user.id, 'true');
            }
            setShowOnboarding(false);
          }}
          onUpdated={(u) => {
            if (u) {
              localStorage.setItem('onboarding_dismissed_' + u.id, 'true');
            }
            setUser(u);
            fetchFeed(true);
          }}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-sans transition-colors bg-pathways-pattern">
        <div className="flex flex-col items-center justify-center space-y-4 text-center p-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-[#007b88] text-[#facc15] font-extrabold flex items-center justify-center shadow-2xl border border-teal-400/40 animate-bounce">
            <Route className="w-11 h-11" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#007b88] dark:text-white font-display">
              PrepShare
            </h1>
            <p className="text-xs sm:text-sm font-extrabold tracking-widest text-amber-600 dark:text-[#facc15] uppercase mt-1">
              Career Pathways
            </p>
          </div>
          <div className="w-48 h-2 bg-slate-200 dark:bg-teal-900/60 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#007b88] via-[#facc15] to-[#007b88] w-full animate-pulse" />
          </div>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
