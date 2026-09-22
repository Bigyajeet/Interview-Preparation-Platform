'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { Header } from '../../components/Header';
import { College, Company, CategoryType, InterviewMode, InterviewResult } from '../../lib/types';
import { X, Plus, Trash2, Building2, GraduationCap, EyeOff, Sparkles, Route, ArrowLeft, Waves } from 'lucide-react';

function ShareExperienceContent() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [roleApplied, setRoleApplied] = useState('');
  const [interviewMode, setInterviewMode] = useState<InterviewMode>('ON_CAMPUS');
  const [result, setResult] = useState<InterviewResult>('SELECTED');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [categories, setCategories] = useState<CategoryType[]>(['COMPANY', 'FRESHER']);

  const [companySearch, setCompanySearch] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  const [collegeSearch, setCollegeSearch] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('');

  const [rounds, setRounds] = useState<Array<{ round: string; description: string }>>([
    { round: 'Round 1: Online Assessment (90 mins)', description: 'Two graph algorithms and sliding window optimization problems...' },
    { round: 'Round 2: Technical Interview (DSA & OOP)', description: 'Tree traversal, binary search, and OOP design questions...' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (companySearch.trim().length > 1) {
      api.getCompanies(companySearch).then(setCompanies).catch(() => {});
    }
  }, [companySearch]);

  useEffect(() => {
    if (collegeSearch.trim().length > 1) {
      api.getColleges(collegeSearch).then(setColleges).catch(() => {});
    }
  }, [collegeSearch]);

  const toggleCategory = (cat: CategoryType) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter(c => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const addRound = () => {
    setRounds([...rounds, { round: `Round ${rounds.length + 1}: Technical`, description: '' }]);
  };

  const updateRound = (index: number, field: 'round' | 'description', value: string) => {
    const updated = [...rounds];
    updated[index][field] = value;
    setRounds(updated);
  };

  const removeRound = (index: number) => {
    if (rounds.length > 1) {
      setRounds(rounds.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newPost = await api.createPost({
        title,
        body: rounds,
        categories,
        companyId: selectedCompanyId || undefined,
        collegeId: selectedCollegeId || undefined,
        roleApplied,
        interviewMode,
        roundsCount: rounds.length,
        result,
        isAnonymous
      });

      router.push(`/posts/${newPost.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to publish pathway experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-pathways-pattern bg-[#0b132b] text-white relative overflow-x-hidden">
      
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
        <svg className="w-[200%] h-96 absolute top-0 left-0 animate-river-primary" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="riverGradShare1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#007b88" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path fill="url(#riverGradShare1)" d="M0,160 C320,300 420,40 740,160 C1060,280 1180,60 1440,160 L1440,320 L0,320 Z"></path>
        </svg>
      </div>

      
      <Header
        user={null}
        activeCategory="all"
        setActiveCategory={(cat) => router.push(`/?category=${cat}`)}
        searchQuery=""
        setSearchQuery={() => {}}
      />

      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-black text-[#facc15] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </button>

        
        <div className="bg-[#132247]/95 border border-teal-800/80 backdrop-blur-md p-8 rounded-3xl mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#007b88] via-[#facc15] to-[#007b88]" />
          
          <div className="flex items-center gap-2 text-[#facc15] font-extrabold text-xs uppercase tracking-wider mb-2">
            <Route className="w-4 h-4" /> Share Placement Pathway
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">
            Publish Interview & Placement Roadmap
          </h1>
          <p className="text-xs text-teal-200 font-semibold mt-1">
            Help students, freshers, and peers prepare by detailing your interview rounds and questions asked.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-950/80 border border-rose-600/60 text-rose-200 rounded-2xl text-xs font-extrabold">
            {error}
          </div>
        )}

        
        <form onSubmit={handleSubmit} className="bg-[#132247]/95 border border-teal-800/80 backdrop-blur-md p-8 rounded-3xl space-y-6 shadow-2xl">
          
          
          <div>
            <label className="block text-xs font-black text-teal-200 mb-1.5 uppercase tracking-wide">Pathway Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Google SDE-1 Interview Experience — On-campus 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#081226] border border-teal-800/80 rounded-2xl px-4 py-3.5 text-sm text-white font-bold placeholder-slate-500 focus:outline-none focus:border-[#007b88] focus:ring-2 focus:ring-[#007b88]/40"
            />
          </div>

          
          <div>
            <label className="block text-xs font-black text-teal-200 mb-2 uppercase tracking-wide">Categories Tagged *</label>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => toggleCategory('COMPANY')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  categories.includes('COMPANY')
                    ? 'bg-[#007b88] text-white shadow-md border border-teal-400/40'
                    : 'bg-[#081226] border border-teal-900 text-slate-300'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#facc15]" /> Company Tagged
              </button>

              <button
                type="button"
                onClick={() => toggleCategory('COLLEGE')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  categories.includes('COLLEGE')
                    ? 'bg-purple-600 text-white shadow-md border border-purple-400/40'
                    : 'bg-[#081226] border border-teal-900 text-slate-300'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-300" /> College Tagged
              </button>

              <button
                type="button"
                onClick={() => toggleCategory('FRESHER')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  categories.includes('FRESHER')
                    ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/40'
                    : 'bg-[#081226] border border-teal-900 text-slate-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-300" /> Fresher Relevant
              </button>
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-teal-200 mb-1.5 uppercase tracking-wide">Target Company</label>
              <input
                type="text"
                placeholder="Search company (Google, TCS)..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="w-full bg-[#081226] border border-teal-800/80 rounded-xl px-3.5 py-3 text-xs text-white font-bold placeholder-slate-500 focus:outline-none focus:border-[#007b88]"
              />
              {companies.length > 0 && (
                <div className="mt-1 max-h-32 overflow-y-auto bg-[#081226] border border-teal-800 rounded-xl divide-y divide-teal-900/60 shadow-xl">
                  {companies.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setSelectedCompanyId(c.id); setCompanySearch(c.name); setCompanies([]); }}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-teal-200 hover:bg-[#007b88] hover:text-white"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-teal-200 mb-1.5 uppercase tracking-wide">College / Institution</label>
              <input
                type="text"
                placeholder="Search college (IIT Bombay, BITS)..."
                value={collegeSearch}
                onChange={(e) => setCollegeSearch(e.target.value)}
                className="w-full bg-[#081226] border border-teal-800/80 rounded-xl px-3.5 py-3 text-xs text-white font-bold placeholder-slate-500 focus:outline-none focus:border-[#007b88]"
              />
              {colleges.length > 0 && (
                <div className="mt-1 max-h-32 overflow-y-auto bg-[#081226] border border-teal-800 rounded-xl divide-y divide-teal-900/60 shadow-xl">
                  {colleges.map(col => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => { setSelectedCollegeId(col.id); setCollegeSearch(col.name); setColleges([]); }}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-teal-200 hover:bg-[#007b88] hover:text-white"
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-teal-200 mb-1.5 uppercase tracking-wide">Role Applied For *</label>
              <input
                type="text"
                required
                placeholder="e.g. SDE-1 / Analyst"
                value={roleApplied}
                onChange={(e) => setRoleApplied(e.target.value)}
                className="w-full bg-[#081226] border border-teal-800/80 rounded-xl px-3.5 py-3 text-xs text-white font-bold placeholder-slate-500 focus:outline-none focus:border-[#007b88]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-teal-200 mb-1.5 uppercase tracking-wide">Interview Mode</label>
              <select
                value={interviewMode}
                onChange={(e) => setInterviewMode(e.target.value as any)}
                className="w-full bg-[#081226] border border-teal-800/80 rounded-xl px-3.5 py-3 text-xs text-white font-black focus:outline-none focus:border-[#007b88]"
              >
                <option value="ON_CAMPUS">On-Campus Placement</option>
                <option value="OFF_CAMPUS">Off-Campus Application</option>
                <option value="REFERRAL">Employee Referral</option>
                <option value="WALK_IN">Walk-In Drive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-teal-200 mb-1.5 uppercase tracking-wide">Final Outcome</label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value as any)}
                className="w-full bg-[#081226] border border-teal-800/80 rounded-xl px-3.5 py-3 text-xs text-white font-black focus:outline-none focus:border-[#007b88]"
              >
                <option value="SELECTED">Selected / Offer Received</option>
                <option value="REJECTED">Rejected</option>
                <option value="AWAITING">Awaiting Result</option>
              </select>
            </div>
          </div>

          
          <div className="space-y-4 pt-4 border-t border-teal-900/60">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-[#facc15] uppercase tracking-wide">Round-by-Round Breakdown Builder</label>
              <button
                type="button"
                onClick={addRound}
                className="flex items-center gap-1 text-xs text-teal-300 font-black hover:underline"
              >
                <Plus className="w-4 h-4 text-[#facc15]" /> Add Round
              </button>
            </div>

            {rounds.map((rd, idx) => (
              <div key={idx} className="bg-[#081226] border border-teal-800/80 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={rd.round}
                    onChange={(e) => updateRound(idx, 'round', e.target.value)}
                    placeholder="Round Title (e.g., Round 1: OA)"
                    className="flex-1 bg-[#0e1c3a] border border-teal-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#007b88]"
                  />
                  {rounds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRound(idx)}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={rd.description}
                  onChange={(e) => updateRound(idx, 'description', e.target.value)}
                  placeholder="Details of questions asked, topics covered, DSA algorithms, and preparation tips..."
                  className="w-full bg-[#0e1c3a] border border-teal-700/80 rounded-xl p-3.5 text-xs text-white font-medium placeholder-slate-500 focus:outline-none focus:border-[#007b88]"
                />
              </div>
            ))}
          </div>

          
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-teal-900/60">
            <label className="flex items-center gap-2 text-xs text-teal-200 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-teal-800 text-[#007b88] focus:ring-[#007b88]"
              />
              <EyeOff className="w-4 h-4 text-[#facc15]" />
              Post Anonymously (Hide identity on feed)
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-gfi-yellow px-9 py-3.5 rounded-full text-xs font-black shadow-xl disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Pathway ✨'}
            </button>
          </div>

        </form>

      </main>

      
      <footer className="bg-[#050b1a] text-white py-8 border-t border-teal-900/60 text-center text-xs text-teal-300 font-medium mt-12 relative z-10">
        <p>© 2026 PrepShare Pathways.</p>
      </footer>

    </div>
  );
}

export default function ShareExperiencePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b132b] text-white p-8 text-center text-xs font-black animate-pulse">Loading Share Experience...</div>}>
      <ShareExperienceContent />
    </Suspense>
  );
}

