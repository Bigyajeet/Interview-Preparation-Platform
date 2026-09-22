'use client';

import React from 'react';
import { User } from '../lib/types';
import { GraduationCap, Building2, TrendingUp, Sparkles, ShieldCheck, Route, ArrowRight } from 'lucide-react';

interface PersonalizedRailsProps {
  user: User | null;
  onSelectCompany: (companyId: string) => void;
  onSelectCollege: (collegeId: string) => void;
}

export const PersonalizedRails: React.FC<PersonalizedRailsProps> = ({
  user,
  onSelectCompany,
  onSelectCollege
}) => {
  return (
    <div id="personalized-profile-rail" className="space-y-6">
      
      
      {user && (user.college || user.currentCompany) && (
        <div className="bg-[#132247]/95 border border-teal-800/80 backdrop-blur-md rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-[#facc15] font-black text-xs uppercase tracking-wider">
            <Route className="w-4 h-4 text-[#facc15]" /> Personalized Pathways
          </div>

          {user.college && (
            <div>
              <p className="text-[11px] text-teal-200 mb-1 font-semibold">Pathways from your college:</p>
              <button
                onClick={() => user.collegeId && onSelectCollege(user.collegeId)}
                className="w-full text-left flex items-center justify-between p-3 rounded-2xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-black transition-all shadow-md"
              >
                <span className="truncate">{user.college.name}</span>
                <GraduationCap className="w-4 h-4 shrink-0 text-purple-300" />
              </button>
            </div>
          )}

          {user.currentCompany && (
            <div>
              <p className="text-[11px] text-teal-200 mb-1 font-semibold">Target company pathway:</p>
              <div className="p-3 rounded-2xl bg-[#007b88]/30 border border-teal-500/40 text-white text-xs font-black flex items-center justify-between shadow-md">
                <span>{user.currentCompany}</span>
                <Building2 className="w-4 h-4 text-[#facc15]" />
              </div>
            </div>
          )}
        </div>
      )}

      
      <div className="bg-[#132247]/95 border border-teal-800/80 backdrop-blur-md rounded-3xl p-6 shadow-xl">
        <h4 className="text-xs font-black text-[#facc15] uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#facc15]" /> Trending Career Pathways
        </h4>

        <div className="space-y-2">
          {[
            { name: 'Google', count: '380+ Interview Pathways', color: 'text-sky-300', bg: 'bg-sky-950/60 border border-sky-500/30' },
            { name: 'Microsoft', count: '240+ Interview Pathways', color: 'text-[#facc15]', bg: 'bg-amber-950/60 border border-amber-500/30' },
            { name: 'TCS (Tata Consultancy)', count: '195+ Interview Pathways', color: 'text-purple-300', bg: 'bg-purple-950/60 border border-purple-500/30' },
            { name: 'Amazon', count: '310+ Interview Pathways', color: 'text-amber-300', bg: 'bg-amber-950/60 border border-amber-500/30' },
            { name: 'Infosys', count: '160+ Interview Pathways', color: 'text-teal-300', bg: 'bg-teal-950/60 border border-teal-500/30' },
          ].map((comp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#081226] cursor-pointer transition-all border border-transparent hover:border-teal-800/80 group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black text-teal-400 w-4">0{idx + 1}</span>
                <div>
                  <h5 className="text-xs font-black text-white group-hover:text-[#facc15] transition-colors">{comp.name}</h5>
                  <p className="text-[10px] text-teal-300/80 font-semibold">{comp.count}</p>
                </div>
              </div>
              <div className={`p-1.5 rounded-xl ${comp.bg}`}>
                <Route className={`w-3.5 h-3.5 ${comp.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="bg-[#132247]/95 border border-teal-800/80 backdrop-blur-md rounded-3xl p-6 text-xs text-teal-200 space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-white font-black">
          <ShieldCheck className="w-4.5 h-4.5 text-[#facc15]" />
          Verified Interview Pathways
        </div>
        <p className="text-[11px] leading-relaxed text-teal-300/80 font-medium">
          All pathways are reviewed for accuracy. Candidate identity is kept private on anonymous posts.
        </p>
      </div>

    </div>
  );
};

