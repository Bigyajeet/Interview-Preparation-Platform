'use client';

import React, { useState, useEffect } from 'react';
import { Report } from '../../lib/types';
import { api } from '../../lib/api';
import { ShieldAlert, ArrowLeft, RefreshCw, Route, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<'OPEN' | 'REVIEWED' | 'DISMISSED'>('OPEN');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports(statusFilter);
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reports. Ensure you are logged in as Admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId: string, action?: 'FLAG_POST' | 'REMOVE_POST') => {
    try {
      await api.updateReportStatus(reportId, 'REVIEWED', action);
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-pathways-pattern bg-white text-slate-900 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        
        <div className="flex items-center justify-between bg-[#0b132b] text-white p-6 rounded-3xl border border-emerald-500/20 shadow-xl">
          <div className="flex items-center gap-3">
            <a href="/" className="p-2 text-slate-300 hover:text-white rounded-xl bg-[#131f42] border border-slate-700/80 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-emerald-400" /> Pathways Moderator Portal
              </div>
              <h1 className="text-2xl font-black text-white">Content Safety & Reports Queue</h1>
            </div>
          </div>

          <button
            onClick={fetchReports}
            className="btn-click-effect flex items-center gap-1.5 text-xs text-[#0b132b] bg-[#facc15] hover:bg-[#eab308] px-4 py-2 rounded-full font-black shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
          </button>
        </div>

        
        <div className="flex gap-2 border-b border-slate-200 pb-3">
          {(['OPEN', 'REVIEWED', 'DISMISSED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all ${
                statusFilter === st
                  ? 'bg-[#007b88] text-white shadow-md'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st} Reports
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold">
            {error}
          </div>
        )}

        
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs font-extrabold tracking-wider uppercase animate-pulse">Loading reports queue...</div>
        ) : reports.length === 0 ? (
          <div className="pathways-card p-12 text-center text-slate-500 text-xs font-bold rounded-3xl border border-slate-200">
            No {statusFilter.toLowerCase()} reports in queue. Pathways content is clean! 🎉
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(rep => (
              <div key={rep.id} className="pathways-card p-6 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 font-extrabold uppercase tracking-wider">
                    Reason: {rep.reason}
                  </span>
                  <span className="text-slate-400 font-medium">
                    Reported by {rep.reportedBy.name} ({new Date(rep.createdAt).toLocaleDateString()})
                  </span>
                </div>

                {rep.post && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-400 font-bold text-[10px] uppercase">Reported Post Title:</p>
                    <p className="font-extrabold text-slate-900 text-sm">{rep.post.title}</p>
                    <p className="text-slate-500 text-[10px] font-medium">Author: {rep.post.author.name} • Status: {rep.post.status}</p>
                  </div>
                )}

                {rep.comment && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-400 font-bold text-[10px] uppercase">Reported Comment Body:</p>
                    <p className="text-slate-800 font-medium">{rep.comment.body}</p>
                  </div>
                )}

                {statusFilter === 'OPEN' && (
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleAction(rep.id)}
                      className="px-4 py-2 rounded-full text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => handleAction(rep.id, 'FLAG_POST')}
                      className="px-4 py-2 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200"
                    >
                      Flag Pathway
                    </button>
                    <button
                      onClick={() => handleAction(rep.id, 'REMOVE_POST')}
                      className="px-4 py-2 rounded-full text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white"
                    >
                      Remove Pathway Completely
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
