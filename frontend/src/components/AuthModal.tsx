'use client';

import React, { useState } from 'react';
import { api } from '../lib/api';
import { User } from '../lib/types';
import { X, Lock, Mail, User as UserIcon, Sparkles, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialMode, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
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
        onSuccess(data.user, data.token);
      } else {
        const data = await api.signup({ name, email, password, status });
        localStorage.setItem('token', data.token);
        onSuccess(data.user, data.token);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-7 relative shadow-2xl animate-modalPop">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-800 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-3 border border-indigo-200 dark:border-indigo-500/30 shadow-xs">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back to PrepShare' : 'Join the Interview Network'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {mode === 'login'
              ? 'Sign in to access personalized college feed & bookmark posts'
              : 'Create a free account to read & share verified interview experiences'}
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl mb-5 border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Register Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-indigo-500"
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
            className="btn-click-effect w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 mt-3 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In to Account' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 p-3 bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-800 rounded-2xl text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between font-medium">
          <span>Demo Admin: <strong>admin@interview.com</strong></span>
          <button
            type="button"
            onClick={() => { setEmail('admin@interview.com'); setPassword('password123'); }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
          >
            Quick Fill Admin
          </button>
        </div>
      </div>
    </div>
  );
};
