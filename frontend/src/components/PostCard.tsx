'use client';

import React from 'react';
import { Post } from '../lib/types';
import { 
  Building2, 
  GraduationCap, 
  ThumbsUp, 
  MessageSquare, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  Briefcase,
  Route
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  onUpvote: (e: React.MouseEvent) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick, onUpvote }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#132247]/95 border border-slate-200/90 dark:border-teal-800/80 hover:border-[#007b88] dark:hover:border-[#007b88] rounded-3xl p-6 cursor-pointer relative group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-[#007b88]/20"
    >
      <div>
        
        <div className="flex flex-wrap items-center gap-2 mb-3.5">
          {post.company && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-[#007b88] text-white border border-teal-400/40">
              <Building2 className="w-3.5 h-3.5 text-[#facc15]" />
              {post.company.name}
            </span>
          )}

          {post.college && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-500/40">
              <GraduationCap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
              {post.college.name}
            </span>
          )}

          <span className={`flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-black ${
            post.result === 'SELECTED'
              ? 'pill-selected'
              : post.result === 'REJECTED'
              ? 'pill-rejected'
              : 'pill-awaiting'
          }`}>
            {post.result === 'SELECTED' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {post.result === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
            {post.result === 'AWAITING' && <Clock className="w-3.5 h-3.5" />}
            {post.result}
          </span>

          <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 dark:bg-[#081226] text-slate-700 dark:text-teal-200 border border-slate-200 dark:border-teal-900">
            {post.interviewMode.replace('_', ' ')}
          </span>
        </div>

        
        <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#007b88] dark:group-hover:text-[#facc15] transition-colors leading-snug mb-2 line-clamp-2 font-display">
          {post.title}
        </h3>

        
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-teal-200 mb-5 font-semibold">
          <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-[#007b88] dark:text-[#facc15]" /> {post.roleApplied}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#007b88] dark:text-teal-300 font-extrabold">
            <Route className="w-3.5 h-3.5 text-[#007b88] dark:text-teal-400" /> {post.roundsCount} Interview Rounds
          </span>
        </div>
      </div>

      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-teal-900/60 text-xs text-slate-600 dark:text-teal-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#007b88] text-white font-black flex items-center justify-center text-xs shadow-md">
            {post.author.name.charAt(0)}
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white block">{post.author.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(e);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all ${
              post.isUpvoted
                ? 'bg-[#007b88] text-white shadow-md border border-teal-400/40'
                : 'bg-slate-100 dark:bg-[#081226] text-slate-700 dark:text-teal-200 hover:bg-slate-200 dark:hover:bg-teal-900/40 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-teal-900'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5 text-[#007b88] dark:text-[#facc15]" />
            {post.upvoteCount}
          </button>

          <span className="flex items-center gap-1 font-bold text-slate-600 dark:text-teal-300"><MessageSquare className="w-3.5 h-3.5 text-[#007b88] dark:text-teal-400" /> {post.commentCount}</span>

          <span className="flex items-center gap-1 text-[#007b88] dark:text-[#facc15] font-black group-hover:translate-x-1 transition-transform ml-1">
            View <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};


