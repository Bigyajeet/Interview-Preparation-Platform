'use client';

import React, { useState, useEffect } from 'react';
import { User, College, UserStatus } from '../lib/types';
import { api } from '../lib/api';
import { X, Check, Building2, GraduationCap, Briefcase, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  user: User;
  onClose: () => void;
  onUpdated: (user: User) => void;
}

const LOOKING_FOR_OPTIONS = [
  'Interview experiences to prepare',
  'On/off-campus placement info',
  'Referrals',
  'Networking with peers',
  'Sharing my own experience',
  'Just exploring'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onClose, onUpdated }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [status, setStatus] = useState<UserStatus>(user.status || 'STUDENT');
  
  const [collegeSearch, setCollegeSearch] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(user.collegeId || '');
  const [manualCollegeName, setManualCollegeName] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(user.graduationYear || 2025);
  const [degree, setDegree] = useState(user.degree || '');

  const [currentCompany, setCurrentCompany] = useState(user.currentCompany || '');
  const [yearsExperience, setYearsExperience] = useState<number>(user.yearsExperience || 1);
  const [currentRole, setCurrentRole] = useState(user.currentRole || '');

  const [lookingFor, setLookingFor] = useState<string[]>(
    user.lookingFor ? JSON.parse(user.lookingFor) : []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (collegeSearch.trim().length > 1) {
      api.getColleges(collegeSearch).then(setColleges).catch(() => {});
    }
  }, [collegeSearch]);

  const toggleGoal = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter(o => o !== option));
    } else {
      setLookingFor([...lookingFor, option]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const updated = await api.updateProfile({
        status,
        collegeId: selectedCollegeId || undefined,
        graduationYear,
        degree,
        currentCompany,
        yearsExperience,
        currentRole,
        lookingFor: JSON.stringify(lookingFor) as any
      });

      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-gray-800 p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        
        <div className="mb-6">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Complete Your Profile
          </div>
          <h2 className="text-xl font-bold text-white">Personalize Your Experience</h2>
          <p className="text-xs text-gray-400 mt-1">
            This information powers your feed recommendations and highlights posts from your college or company.
          </p>
        </div>

        
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-3">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 text-xs font-medium ${step === 1 ? 'text-indigo-400' : 'text-gray-500'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>1</span>
            Role Status
          </button>
          <div className="h-[1px] w-8 bg-gray-800" />
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 text-xs font-medium ${step === 2 ? 'text-indigo-400' : 'text-gray-500'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>2</span>
            Background
          </button>
          <div className="h-[1px] w-8 bg-gray-800" />
          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-2 text-xs font-medium ${step === 3 ? 'text-indigo-400' : 'text-gray-500'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>3</span>
            Interests
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        
        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-300">Which best describes your current status?</label>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setStatus('STUDENT')}
                className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all ${
                  status === 'STUDENT'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/10'
                    : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Student</h4>
                  <p className="text-xs text-gray-400">Currently enrolled in college preparing for upcoming placements</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus('FRESHER')}
                className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all ${
                  status === 'FRESHER'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/10'
                    : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Fresher</h4>
                  <p className="text-xs text-gray-400">Recently graduated, actively applying & interviewing for job roles</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus('EMPLOYEE')}
                className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all ${
                  status === 'EMPLOYEE'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/10'
                    : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Working Professional / Employee</h4>
                  <p className="text-xs text-gray-400">Currently employed, looking to switch roles or share insights</p>
                </div>
              </button>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        
        {step === 2 && (
          <div className="space-y-4">
            {(status === 'STUDENT' || status === 'FRESHER') ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">College / University Name</label>
                  <input
                    type="text"
                    placeholder="Type to search college (e.g., IIT Bombay, BITS Pilani)..."
                    value={collegeSearch}
                    onChange={(e) => setCollegeSearch(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                  {colleges.length > 0 && (
                    <div className="mt-1 max-h-36 overflow-y-auto bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
                      {colleges.map(col => (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => {
                            setSelectedCollegeId(col.id);
                            setCollegeSearch(col.name);
                            setColleges([]);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 transition-all flex items-center justify-between"
                        >
                          <span>{col.name}</span>
                          <span className="text-[10px] text-gray-500">{col.city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Graduation Year</label>
                    <input
                      type="number"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(parseInt(e.target.value, 10))}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Degree / Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech CSE"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Current Company</label>
                  <input
                    type="text"
                    placeholder="e.g., Google, Microsoft, TCS"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(parseInt(e.target.value, 10))}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Current Role / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. SDE-2"
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-gray-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        
        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-gray-300">What are you looking for on PrepShare?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LOOKING_FOR_OPTIONS.map((option) => {
                const isSelected = lookingFor.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleGoal(option)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 font-medium'
                        : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isSelected ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-gray-700 bg-gray-800'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-gray-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {loading ? 'Saving Profile...' : 'Save & Explore Feed ✨'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
