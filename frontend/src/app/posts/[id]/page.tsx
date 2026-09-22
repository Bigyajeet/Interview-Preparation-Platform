'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post, Comment, User, RoundBreakdown } from '../../../lib/types';
import { api } from '../../../lib/api';
import { Header } from '../../../components/Header';
import { 
  ArrowLeft, 
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
  MessageSquare,
  Route,
  Share2,
  Waves
} from 'lucide-react';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [commentText, setCommentText] = useState('');
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    api.getMe().then(setCurrentUser).catch(() => setCurrentUser(null));
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
      setError(err.message || 'Failed to load pathway details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!currentUser) return router.push('/login');
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
    if (!currentUser) return router.push('/login');
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
    if (!currentUser) return router.push('/login');
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
    if (!currentUser) return router.push('/login');
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
        <div className="space-y-4">
          {parsed.map((rd, i) => (
            <div key={i} className="bg-[#081226] border border-teal-800/80 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-[#007b88] text-[#facc15] border border-teal-400/30">
                  {rd.round}
                </span>
              </div>
              <p className="text-sm text-slate-100 font-semibold whitespace-pre-line leading-relaxed pt-1">
                {rd.description}
              </p>
            </div>
          ))}
        </div>
      );
    } catch {
      return <p className="text-sm text-slate-100 font-semibold whitespace-pre-line leading-relaxed">{post.body}</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-pathways-pattern bg-[#0b132b] text-white relative overflow-x-hidden">
      
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
        <svg className="w-[200%] h-96 absolute top-0 left-0 animate-river-primary" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="riverGradPost1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#007b88" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path fill="url(#riverGradPost1)" d="M0,160 C320,300 420,40 740,160 C1060,280 1180,60 1440,160 L1440,320 L0,320 Z"></path>
        </svg>
      </div>

      
      <Header
        user={currentUser}
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

        {loading ? (
          <div className="py-24 text-center text-teal-300 text-xs font-extrabold uppercase tracking-wider animate-pulse">
            Loading pathway roadmap...
          </div>
        ) : error || !post ? (
          <div className="py-12 text-center text-rose-400 text-xs font-black">{error || 'Post not found'}</div>
        ) : (
          <div className="bg-[#132247]/95 border border-teal-800/80 backdrop-blur-md p-8 rounded-3xl space-y-8 shadow-2xl relative overflow-hidden">
            
            
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#007b88] via-[#facc15] to-[#007b88]" />

            
            <div className="space-y-4 border-b border-teal-900/60 pb-6 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                {post.company && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[#007b88] text-white border border-teal-400/40">
                    <Building2 className="w-4 h-4 text-[#facc15]" />
                    {post.company.name}
                  </span>
                )}
                {post.college && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-purple-900/60 text-purple-200 border border-purple-500/40">
                    <GraduationCap className="w-4 h-4 text-purple-300" />
                    {post.college.name}
                  </span>
                )}
                <span className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black ${
                  post.result === 'SELECTED'
                    ? 'pill-selected'
                    : post.result === 'REJECTED'
                    ? 'pill-rejected'
                    : 'pill-awaiting'
                }`}>
                  {post.result === 'SELECTED' && <CheckCircle2 className="w-4 h-4" />}
                  {post.result === 'REJECTED' && <XCircle className="w-4 h-4" />}
                  {post.result === 'AWAITING' && <Clock className="w-4 h-4" />}
                  {post.result}
                </span>

                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#081226] text-teal-200 border border-teal-900">
                  {post.interviewMode.replace('_', ' ')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug font-display">{post.title}</h1>

              
              <div className="flex items-center justify-between text-xs text-teal-200 pt-2 border-t border-teal-900/60 font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#007b88] text-white font-black flex items-center justify-center text-xs shadow-md">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-black text-white block text-sm">{post.author.name}</span>
                    <span className="text-[10px] text-teal-300/70 block font-medium">
                      Published {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-teal-200 font-bold">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-[#facc15]" /> {post.viewCount} views</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4 text-[#facc15]" /> {post.commentCount} comments</span>
                </div>
              </div>
            </div>

            
            <div>
              <h3 className="text-xs font-black text-[#facc15] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Route className="w-4 h-4 text-[#facc15]" /> Round-by-Round Breakdown ({post.roundsCount} Rounds)
              </h3>
              {renderRounds()}
            </div>

            
            <div className="flex items-center justify-between py-4 border-y border-teal-900/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpvote}
                  className={`btn-click-effect flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                    post.isUpvoted
                      ? 'bg-[#007b88] text-white shadow-md border border-teal-400/40'
                      : 'bg-[#081226] text-white hover:bg-teal-950/60 border border-teal-800'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 text-[#facc15]" />
                  <span>Upvote ({post.upvoteCount})</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`btn-click-effect flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition-all ${
                    post.isBookmarked
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                      : 'bg-[#081226] text-slate-300 hover:text-white border border-teal-900'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-[#facc15]" />
                  <span>Save Pathway</span>
                </button>
              </div>

              <button
                onClick={() => setShowReport(true)}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-rose-400 transition-all"
              >
                <Flag className="w-4 h-4" /> Report
              </button>
            </div>

            
            <div className="space-y-6 pt-2">
              <h3 className="text-lg font-black text-white flex items-center gap-2 font-display">
                Discussion & Q&A ({comments.length})
              </h3>

              
              <div className="flex items-center gap-2 bg-[#081226] border border-teal-800/80 rounded-2xl p-2.5">
                <input
                  type="text"
                  placeholder={currentUser ? "Ask a question about this interview pathway..." : "Sign in to join the Q&A discussion"}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-2 font-bold"
                />
                <button
                  onClick={() => handleAddComment()}
                  className="btn-gfi-yellow p-2.5 rounded-xl font-black text-slate-950"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              
              <div className="space-y-4">
                {comments.map((comm) => (
                  <div key={comm.id} className="bg-[#081226] border border-teal-800/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#007b88] text-white font-black flex items-center justify-center text-[10px]">
                          {comm.author.name.charAt(0)}
                        </div>
                        <span className="font-extrabold text-white">{comm.author.name}</span>
                      </div>
                      <span className="text-[10px] text-teal-300/60 font-medium">
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-bold">{comm.body}</p>

                    <button
                      onClick={() => setReplyParentId(replyParentId === comm.id ? null : comm.id)}
                      className="text-[11px] text-[#facc15] hover:underline font-black"
                    >
                      Reply
                    </button>

                    
                    {replyParentId === comm.id && (
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 bg-[#0e1c3a] border border-teal-700/80 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(comm.id)}
                          className="bg-[#007b88] text-white px-4 py-2 rounded-xl text-xs font-black"
                        >
                          Reply
                        </button>
                      </div>
                    )}

                    
                    {comm.replies && comm.replies.length > 0 && (
                      <div className="ml-4 pl-3 border-l-2 border-teal-800/80 space-y-2 pt-2">
                        {comm.replies.map(rep => (
                          <div key={rep.id} className="text-xs space-y-1">
                            <span className="font-black text-[#facc15]">{rep.author.name}: </span>
                            <span className="text-slate-200 font-bold">{rep.body}</span>
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

      </main>

      
      <footer className="bg-[#050b1a] text-white py-8 border-t border-teal-900/60 text-center text-xs text-teal-300 font-medium mt-12 relative z-10">
        <p>© 2026 PrepShare Pathways.</p>
      </footer>

    </div>
  );
}

