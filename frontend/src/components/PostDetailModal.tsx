'use client';

import React, { useState, useEffect } from 'react';
import { Post, Comment, User, RoundBreakdown } from '../lib/types';
import { api } from '../lib/api';
import { 
  X, 
  ThumbsUp, 
  Bookmark, 
  Flag, 
  Building2, 
  GraduationCap, 
  Eye, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface PostDetailModalProps {
  postId: string;
  currentUser: User | null;
  onClose: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  postId,
  currentUser,
  onClose,
  onOpenAuth
}) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [commentText, setCommentText] = useState('');
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const fetchPostAndComments = async () => {
    setLoading(true);
    try {
      const data = await api.getPostById(postId);
      setPost(data);
      const comms = await api.getComments(postId);
      setComments(comms);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!currentUser) return onOpenAuth('login');
    if (!post) return;

    try {
      const res = await api.toggleUpvote(post.id);
      setPost({
        ...post,
        isUpvoted: res.upvoted,
        upvoteCount: res.upvoteCount
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser) return onOpenAuth('login');
    if (!post) return;

    try {
      const res = await api.toggleBookmark(post.id);
      setPost({
        ...post,
        isBookmarked: res.bookmarked
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (parentId?: string) => {
    if (!currentUser) return onOpenAuth('login');
    const text = parentId ? replyText : commentText;
    if (!text.trim()) return;

    try {
      await api.createComment(postId, text, parentId);
      if (parentId) {
        setReplyText('');
        setReplyParentId(null);
      } else {
        setCommentText('');
      }
      const updated = await api.getComments(postId);
      setComments(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportSubmit = async () => {
    if (!currentUser) return onOpenAuth('login');
    if (!reportReason.trim()) return;

    try {
      await api.submitReport(postId, undefined, reportReason);
      setReportSuccess(true);
      setTimeout(() => {
        setShowReport(false);
        setReportSuccess(false);
        setReportReason('');
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const renderRounds = () => {
    if (!post) return null;
    try {
      const parsed: RoundBreakdown[] = JSON.parse(post.body);
      return (
        <div className="space-y-3">
          {parsed.map((rd, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  {rd.round}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">{rd.description}</p>
            </div>
          ))}
        </div>
      );
    } catch {
      return <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">{post.body}</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs font-semibold">Loading experience breakdown...</div>
        ) : error || !post ? (
          <div className="py-10 text-center text-rose-500 text-xs font-semibold">{error || 'Post not found'}</div>
        ) : (
          <div className="space-y-6">
            
            
            <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                {post.company && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-blue-500/15 dark:text-blue-300 border border-indigo-200/80 dark:border-blue-500/30">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400" />
                    {post.company.name}
                  </span>
                )}
                {post.college && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    {post.college.name}
                  </span>
                )}
                <span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${
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

                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {post.interviewMode.replace('_', ' ')}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">{post.title}</h1>

              
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{post.author.name}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Posted {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-slate-400" /> {post.viewCount} views</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4 text-slate-400" /> {post.commentCount} comments</span>
                </div>
              </div>
            </div>

            
            <div>
              <h3 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Round-by-Round Breakdown ({post.roundsCount} Rounds)
              </h3>
              {renderRounds()}
            </div>

            
            <div className="flex items-center justify-between py-3 border-y border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUpvote}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    post.isUpvoted
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Upvote ({post.upvoteCount})</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    post.isBookmarked
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </div>

              <button
                onClick={() => setShowReport(true)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600 p-2 rounded-xl transition-all"
                title="Report content"
              >
                <Flag className="w-3.5 h-3.5" /> Report
              </button>
            </div>

            
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Discussion & Questions ({comments.length})
              </h3>

              
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
                <input
                  type="text"
                  placeholder={currentUser ? "Ask a question or share advice..." : "Sign in to join the discussion"}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-transparent border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none px-2 font-medium"
                />
                <button
                  onClick={() => handleAddComment()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              
              <div className="space-y-3">
                {comments.map((comm) => (
                  <div key={comm.id} className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[11px]">
                          {comm.author.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{comm.author.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{comm.body}</p>

                    <button
                      onClick={() => setReplyParentId(replyParentId === comm.id ? null : comm.id)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                    >
                      Reply
                    </button>

                    
                    {replyParentId === comm.id && (
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(comm.id)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                        >
                          Reply
                        </button>
                      </div>
                    )}

                    
                    {comm.replies && comm.replies.length > 0 && (
                      <div className="ml-4 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-2 pt-2">
                        {comm.replies.map(rep => (
                          <div key={rep.id} className="text-xs space-y-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{rep.author.name}: </span>
                            <span className="text-slate-600 dark:text-slate-400 font-medium">{rep.body}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        
        {showReport && (
          <div className="absolute inset-0 bg-slate-900/90 rounded-3xl flex items-center justify-center p-6 z-20">
            <div className="w-full max-w-sm space-y-4 text-white">
              <h3 className="text-sm font-bold">Report Content to Moderators</h3>
              {reportSuccess ? (
                <div className="text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                  Report submitted. Moderators will review soon.
                </div>
              ) : (
                <>
                  <textarea
                    rows={3}
                    placeholder="Reason for report (e.g. spam, fake questions, inappropriate language)..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none font-medium"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setShowReport(false)}
                      className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReportSubmit}
                      className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-xl text-xs font-semibold"
                    >
                      Submit Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
