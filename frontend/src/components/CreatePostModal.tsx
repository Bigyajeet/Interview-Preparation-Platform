'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Post, College, Company, CategoryType, InterviewMode, InterviewResult } from '../lib/types';
import { X, Plus, Trash2, Building2, GraduationCap, EyeOff, Sparkles } from 'lucide-react';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
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
    { round: 'Round 1: Online Assessment', description: 'Describe questions, difficulty, and time limit...' },
    { round: 'Round 2: Technical Interview', description: 'Describe DSA/System design questions asked...' }
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

      onPostCreated(newPost);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-gray-800 p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Share Interview Experience
          </div>
          <h2 className="text-xl font-bold text-white">Help Peers Prepare & Succeed</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Experience Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Google SDE-1 Interview Experience — On-campus 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Categories (Select all that apply) *</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggleCategory('COMPANY')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  categories.includes('COMPANY')
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-gray-800 bg-gray-900 text-gray-400'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Company Tagged
              </button>

              <button
                type="button"
                onClick={() => toggleCategory('COLLEGE')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  categories.includes('COLLEGE')
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-gray-800 bg-gray-900 text-gray-400'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> College Tagged
              </button>

              <button
                type="button"
                onClick={() => toggleCategory('FRESHER')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  categories.includes('FRESHER')
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-gray-800 bg-gray-900 text-gray-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Fresher Relevant
              </button>
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Target Company</label>
              <input
                type="text"
                placeholder="Search company (Google, TCS)..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              {companies.length > 0 && (
                <div className="mt-1 max-h-28 overflow-y-auto bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
                  {companies.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setSelectedCompanyId(c.id); setCompanySearch(c.name); setCompanies([]); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">College / Institution</label>
              <input
                type="text"
                placeholder="Search college (IIT Bombay, BITS)..."
                value={collegeSearch}
                onChange={(e) => setCollegeSearch(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              {colleges.length > 0 && (
                <div className="mt-1 max-h-28 overflow-y-auto bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
                  {colleges.map(col => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => { setSelectedCollegeId(col.id); setCollegeSearch(col.name); setColleges([]); }}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800"
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Role Applied For *</label>
              <input
                type="text"
                required
                placeholder="e.g. SDE-1 / Analyst"
                value={roleApplied}
                onChange={(e) => setRoleApplied(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Interview Mode</label>
              <select
                value={interviewMode}
                onChange={(e) => setInterviewMode(e.target.value as any)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ON_CAMPUS">On-Campus Placement</option>
                <option value="OFF_CAMPUS">Off-Campus Application</option>
                <option value="REFERRAL">Employee Referral</option>
                <option value="WALK_IN">Walk-In Drive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Final Outcome</label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value as any)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="SELECTED">Selected / Offer Received</option>
                <option value="REJECTED">Rejected</option>
                <option value="AWAITING">Awaiting Result</option>
              </select>
            </div>
          </div>

          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-200">Round-by-Round Breakdown</label>
              <button
                type="button"
                onClick={addRound}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Round
              </button>
            </div>

            {rounds.map((rd, idx) => (
              <div key={idx} className="bg-gray-900/60 border border-gray-800 p-3 rounded-xl space-y-2 relative">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={rd.round}
                    onChange={(e) => updateRound(idx, 'round', e.target.value)}
                    placeholder="Round Title (e.g., Round 1: OA)"
                    className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  {rounds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRound(idx)}
                      className="text-gray-500 hover:text-red-400 p-1 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={rd.description}
                  onChange={(e) => updateRound(idx, 'description', e.target.value)}
                  placeholder="Details of questions asked, difficulty level, topics covered, and key tips..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>

          
          <div className="pt-2 flex items-center justify-between border-t border-gray-800">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded bg-gray-900 border-gray-800 text-indigo-600 focus:ring-indigo-500"
              />
              <EyeOff className="w-4 h-4 text-indigo-400" />
              Post Anonymously (Hide identity on feed while keeping moderation safety)
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold px-6 py-2 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Experience ✨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
