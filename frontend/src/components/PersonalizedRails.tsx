'use client';

import React from 'react';
import { User } from '../lib/types';
import { 
  GraduationCap, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Route, 
  User as UserIcon, 
  Briefcase, 
  Edit3
} from 'lucide-react';

interface PersonalizedRailsProps {
  user: User | null;
  onSelectCompany: (companyId: string) => void;
  onSelectCollege: (collegeId: string) => void;
  onEditProfile?: () => void;
  onOpenAuth?: () => void;
}

export const PersonalizedRails: React.FC<PersonalizedRailsProps> = ({
  user,
  onSelectCompany,
  onSelectCollege,
  onEditProfile,
  onOpenAuth
}) => {
  let parsedLookingFor: string[] = [];
  if (user?.lookingFor) {
    try {
      parsedLookingFor = typeof user.lookingFor === 'string' ? JSON.parse(user.lookingFor) : user.lookingFor;
    } catch {
      parsedLookingFor = [];
    }
  }

  return (
    <div id="personalized-profile-rail" className="space-y-6">
      {user ? (
        <div className="bg-white/95 dark:bg-[#132247]/95 border border-slate-200/90 dark:border-teal-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl dark:shadow-2xl transition-colors space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#007b88] dark:text-[#facc15] font-black text-xs uppercase tracking-wider">
              <UserIcon className="w-4 h-4 text-[#007b88] dark:text-[#facc15]" />
              <span>User Profile Details</span>
            </div>
            {user.role === 'ADMIN' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300">
                ADMIN
              </span>
            )}
          </div>

          <div className="flex items-start gap-3.5 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-[#007b88] text-white font-black text-xl flex items-center justify-center shadow-lg border border-teal-400/40 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-black text-slate-900 dark:text-white truncate">{user.name}</h3>
              <p className="text-xs text-slate-500 dark:text-teal-200 font-medium truncate">{user.email}</p>
              
              <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-[#007b88] dark:text-[#facc15]">
                {user.status === 'STUDENT' ? '🎓 Student' : user.status === 'FRESHER' ? '⚡ Fresher' : '💼 Working Professional'}
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-teal-900/60 text-xs">
            {user.college && (
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/30 text-slate-800 dark:text-purple-200 space-y-1">
                <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 font-black text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" /> College Details
                  </span>
                  {user.graduationYear && <span>Class of {user.graduationYear}</span>}
                </div>
                <p className="font-extrabold truncate">{user.college.name}</p>
                {user.degree && <p className="text-[11px] text-slate-600 dark:text-purple-300/80 font-medium">{user.degree}</p>}
              </div>
            )}

            {(user.currentCompany || user.currentRole) && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081226] border border-slate-200 dark:border-teal-800/80 text-slate-800 dark:text-white space-y-1">
                <div className="flex items-center justify-between text-[#007b88] dark:text-[#facc15] font-black text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" /> Career Experience
                  </span>
                  {user.yearsExperience !== undefined && user.yearsExperience !== null && (
                    <span>{user.yearsExperience} yrs exp</span>
                  )}
                </div>
                {user.currentRole && <p className="font-extrabold">{user.currentRole}</p>}
                {user.currentCompany && (
                  <p className="text-[11px] text-slate-600 dark:text-teal-200 font-medium">{user.currentCompany}</p>
                )}
              </div>
            )}

            {parsedLookingFor.length > 0 && (
              <div className="pt-1">
                <p className="text-[11px] font-black text-slate-600 dark:text-teal-200 mb-1.5 uppercase tracking-wide">Goals & Preferences:</p>
                <div className="flex flex-wrap gap-1.5">
                  {parsedLookingFor.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 dark:bg-[#07132b] text-slate-700 dark:text-teal-200 border border-slate-200 dark:border-teal-800/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onEditProfile}
            className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-[#081226] hover:bg-slate-200 dark:hover:bg-[#007b88] border border-slate-200 dark:border-teal-800 text-[#007b88] dark:text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#007b88] dark:text-[#facc15]" />
            <span>Update Profile Details</span>
          </button>
        </div>
      ) : (
        <div className="bg-white/95 dark:bg-[#132247]/95 border border-slate-200/90 dark:border-teal-800/80 backdrop-blur-md rounded-3xl p-6 text-center space-y-3 shadow-xl dark:shadow-2xl transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-[#081226] border border-teal-200 dark:border-teal-800 text-[#007b88] dark:text-[#facc15] flex items-center justify-center mx-auto">
            <UserIcon className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white">Your Profile</h4>
          <p className="text-xs text-slate-600 dark:text-teal-200 font-medium">Sign in to view your profile details, customize college feed, and save interview roadmaps.</p>
          <button
            onClick={onOpenAuth}
            className="btn-gfi-yellow w-full py-2.5 rounded-full text-xs font-black shadow-md inline-block"
          >
            Sign In to Account
          </button>
        </div>
      )}

      {user && (user.college || user.currentCompany) && (
        <div className="bg-white/95 dark:bg-[#132247]/95 border border-slate-200/90 dark:border-teal-800/80 backdrop-blur-md rounded-3xl p-5 space-y-3 shadow-xl dark:shadow-2xl transition-colors">
          <div className="flex items-center gap-2 text-[#007b88] dark:text-[#facc15] font-black text-xs uppercase tracking-wider">
            <Route className="w-4 h-4 text-[#007b88] dark:text-[#facc15]" /> Personalized Quick Links
          </div>

          {user.college && (
            <div>
              <p className="text-[11px] text-slate-600 dark:text-teal-200 mb-1 font-semibold">Pathways from your college:</p>
              <button
                onClick={() => user.collegeId && onSelectCollege(user.collegeId)}
                className="w-full text-left flex items-center justify-between p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-500/40 text-purple-900 dark:text-purple-200 text-xs font-black transition-all shadow-md"
              >
                <span className="truncate">{user.college.name}</span>
                <GraduationCap className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-300" />
              </button>
            </div>
          )}

          {user.currentCompany && (
            <div>
              <p className="text-[11px] text-slate-600 dark:text-teal-200 mb-1 font-semibold">Target company pathway:</p>
              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-[#007b88]/30 border border-teal-200 dark:border-teal-500/40 text-slate-900 dark:text-white text-xs font-black flex items-center justify-between shadow-md">
                <span>{user.currentCompany}</span>
                <Building2 className="w-4 h-4 text-[#007b88] dark:text-[#facc15]" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white/95 dark:bg-[#132247]/95 border border-slate-200/90 dark:border-teal-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl dark:shadow-2xl transition-colors">
        <h4 className="text-xs font-black text-[#007b88] dark:text-[#facc15] uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#007b88] dark:text-[#facc15]" /> Trending Career Pathways
        </h4>

        <div className="space-y-2">
          {[
            { name: 'Google', count: '380+ Interview Pathways', color: 'text-sky-600 dark:text-sky-300', bg: 'bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-500/30' },
            { name: 'Microsoft', count: '240+ Interview Pathways', color: 'text-amber-600 dark:text-[#facc15]', bg: 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/30' },
            { name: 'TCS (Tata Consultancy)', count: '195+ Interview Pathways', color: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30' },
            { name: 'Amazon', count: '310+ Interview Pathways', color: 'text-orange-600 dark:text-amber-300', bg: 'bg-orange-50 dark:bg-amber-950/60 border border-orange-200 dark:border-amber-500/30' },
            { name: 'Infosys', count: '160+ Interview Pathways', color: 'text-teal-600 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/30' },
          ].map((comp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-[#081226] cursor-pointer transition-all border border-transparent hover:border-slate-200 dark:hover:border-teal-800/80 group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black text-[#007b88] dark:text-teal-400 w-4">0{idx + 1}</span>
                <div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#007b88] dark:group-hover:text-[#facc15] transition-colors">{comp.name}</h5>
                  <p className="text-[10px] text-slate-500 dark:text-teal-300/80 font-semibold">{comp.count}</p>
                </div>
              </div>
              <div className={`p-1.5 rounded-xl ${comp.bg}`}>
                <Route className={`w-3.5 h-3.5 ${comp.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/95 dark:bg-[#132247]/95 border border-slate-200/90 dark:border-teal-800/80 backdrop-blur-md rounded-3xl p-6 text-xs text-slate-700 dark:text-teal-200 space-y-2 shadow-xl dark:shadow-2xl transition-colors">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black">
          <ShieldCheck className="w-4.5 h-4.5 text-[#007b88] dark:text-[#facc15]" />
          Verified Interview Pathways
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-teal-300/80 font-medium">
          All pathways are reviewed for accuracy. Candidate identity is kept private on anonymous posts.
        </p>
      </div>
    </div>
  );
};
