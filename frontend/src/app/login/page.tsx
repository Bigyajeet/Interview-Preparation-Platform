'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { Header } from '../../components/Header';
import { Lock, Mail, User as UserIcon, ArrowRight, Route, Waves, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'STUDENT' | 'FRESHER' | 'EMPLOYEE'>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const data = await api.login({ email, password });
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        const data = await api.signup({ name, email, password, status });
        localStorage.setItem('token', data.token);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-pathways-pattern bg-[#0b132b] text-white relative overflow-x-hidden">
      
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
        <svg className="w-[200%] h-96 absolute top-0 left-0 animate-river-primary" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="riverGradLogin1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#007b88" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path fill="url(#riverGradLogin1)" d="M0,160 C320,300 420,40 740,160 C1060,280 1180,60 1440,160 L1440,320 L0,320 Z"></path>
        </svg>

        <svg className="w-[200%] h-96 absolute top-12 left-0 animate-river-secondary" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="riverGradLogin2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#007b88" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path fill="url(#riverGradLogin2)" d="M0,192 C400,80 550,280 900,140 C1250,0 1350,220 1440,192 L1440,320 L0,320 Z"></path>
        </svg>
      </div>

      
      <Header
        user={null}
        activeCategory="all"
        setActiveCategory={(cat) => router.push(`/?category=${cat}`)}
        searchQuery=""
        setSearchQuery={() => {}}
      />

      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12 relative z-10">
        <div className="w-full max-w-md bg-[#132247]/95 border border-teal-800/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#007b88] via-[#facc15] to-[#007b88]" />

          
          <div className="text-center mb-6 pt-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#007b88] text-[#facc15] mb-3 shadow-lg border border-teal-400/30">
              <Route className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight font-display">
              {mode === 'login' ? 'Sign In to Interview Pathways' : 'Register Account'}
            </h1>
            <p className="text-xs text-teal-200 font-semibold mt-1">
              {mode === 'login'
                ? 'Access authentic round breakdowns, upvote roadmaps, and join Q&A'
                : 'Create your account to share placement experiences'}
            </p>
          </div>

          
          <div className="flex bg-[#081226] p-1.5 rounded-full mb-6 border border-teal-900/80">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-black rounded-full transition-all ${
                mode === 'login'
                  ? 'bg-[#007b88] text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-black rounded-full transition-all ${
                mode === 'signup'
                  ? 'bg-[#007b88] text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Register Account
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-950/80 border border-rose-600/60 text-rose-200 rounded-2xl text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-black text-teal-200 mb-1.5 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#081226] border border-teal-800/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white font-bold placeholder-slate-500 focus:outline-none focus:border-[#007b88] focus:ring-2 focus:ring-[#007b88]/40"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-teal-200 mb-1.5 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#081226] border border-teal-800/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white font-bold placeholder-slate-500 focus:outline-none focus:border-[#007b88] focus:ring-2 focus:ring-[#007b88]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-teal-200 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#081226] border border-teal-800/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white font-bold placeholder-slate-500 focus:outline-none focus:border-[#007b88] focus:ring-2 focus:ring-[#007b88]/40"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-black text-teal-200 mb-1.5 uppercase tracking-wide">Current Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#081226] border border-teal-800/80 rounded-xl px-3.5 py-3 text-xs text-white font-black focus:outline-none focus:border-[#007b88]"
                >
                  <option value="STUDENT">Student (Currently in College)</option>
                  <option value="FRESHER">Fresher (Actively Job Hunting)</option>
                  <option value="EMPLOYEE">Working Professional / Employee</option>
                </select>
              </div>
            )}

            
            <button
              type="submit"
              disabled={loading}
              className="btn-gfi-yellow w-full py-3.5 rounded-full text-xs font-black shadow-xl flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          
          <div className="mt-6 p-3.5 bg-[#081226] border border-teal-800/60 rounded-2xl text-[11px] text-teal-200 flex items-center justify-between font-bold">
            <span>Demo Admin: <strong className="text-white">admin@interview.com</strong></span>
            <button
              type="button"
              onClick={() => { setEmail('admin@interview.com'); setPassword('password123'); setMode('login'); }}
              className="text-[#facc15] hover:underline font-black"
            >
              Quick Fill Admin
            </button>
          </div>

        </div>
      </main>

      
      <footer className="bg-[#050b1a] text-white py-8 border-t border-teal-900/60 text-center text-xs text-teal-300 font-medium relative z-10">
        <p>© 2026 PrepShare Pathways.</p>
      </footer>

    </div>
  );
}

