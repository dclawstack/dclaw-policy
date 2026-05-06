'use client';

import { useState } from 'react';
import { api, PolicyDoc } from '@/lib/api';

export default function DashboardPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<PolicyDoc | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    try {
      const doc = await api<PolicyDoc>('/policies', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      });
      setResult(doc);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#3B82F6]">Policy Workspace</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Policy title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            placeholder="Enter policy title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Policy content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            placeholder="Enter policy content"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="inline-flex items-center rounded-lg bg-[#3B82F6] px-5 py-2.5 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Analyzing...' : 'Analyze Policy'}
        </button>
      </div>

      {result && (
        <div className="space-y-4 rounded-xl border border-slate-200 p-4 bg-slate-50">
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Coverage gaps</h2>
            <ul className="mt-1 list-disc list-inside text-slate-800">
              {result.coverage_gaps.map((gap, i) => (
                <li key={i}>{gap}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Conflict flags</h2>
            <ul className="mt-1 list-disc list-inside text-slate-800">
              {result.conflict_flags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Version history</h2>
            <p className="mt-1 text-slate-800">v1.0 — Initial draft</p>
            <p className="mt-1 text-slate-800">v0.9 — Preliminary review</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Approval status</h2>
            <span className="mt-1 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
              {result.approval_status}
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
