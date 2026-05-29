'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api, PolicyDoc } from '@/lib/api';
import {
  Shield,
  FileText,
  LayoutDashboard,
  Settings,
  Bell,
  ArrowLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  GitBranch,
  Activity,
  Plus,
  Zap,
} from 'lucide-react';

/* ─── Sidebar ──────────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { Icon: LayoutDashboard, label: 'Overview',  href: '/dashboard', active: true },
  { Icon: FileText,        label: 'Policies',  href: '#' },
  { Icon: Activity,        label: 'Analytics', href: '#' },
  { Icon: GitBranch,       label: 'Versions',  href: '#' },
  { Icon: Settings,        label: 'Settings',  href: '#' },
];

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r border-border bg-card/50 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-sm">
          DClaw <span className="text-gradient font-bold">Policy</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              item.active
                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            <item.Icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Upgrade callout */}
      <div className="m-3 p-3.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/8 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-semibold text-blue-300">Pro Plan</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">
          Unlock AI conflict detection and bulk analysis.
        </p>
        <button className="w-full text-xs bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/25 text-blue-300 rounded-lg px-3 py-1.5 transition-colors">
          Upgrade
        </button>
      </div>
    </aside>
  );
}

/* ─── Mini stat card ──────────────────────────────────────────────────────── */

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
    >
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

/* ─── Result panel ───────────────────────────────────────────────────────── */

function ResultPanel({ result }: { result: PolicyDoc }) {
  const sections = [
    {
      title: 'Coverage Gaps',
      Icon: AlertTriangle,
      items: result.coverage_gaps,
      color: 'text-amber-400',
      bg: 'bg-amber-400/8',
      border: 'border-amber-400/20',
    },
    {
      title: 'Conflict Flags',
      Icon: AlertTriangle,
      items: result.conflict_flags,
      color: 'text-red-400',
      bg: 'bg-red-400/8',
      border: 'border-red-400/20',
    },
  ];

  return (
    <div className="space-y-5 mt-6">
      {sections.map(s => (
        <div key={s.title} className={`rounded-xl border ${s.border} ${s.bg} p-4`}>
          <div className={`flex items-center gap-2 text-sm font-semibold ${s.color} mb-3`}>
            <s.Icon className="w-4 h-4" /> {s.title}
          </div>
          {s.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">None detected.</p>
          ) : (
            <ul className="space-y-1.5">
              {s.items.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
            <GitBranch className="w-4 h-4" /> Version History
          </div>
          <div className="space-y-1 text-sm text-foreground/70">
            <p className="flex gap-2"><span className="font-mono text-xs text-blue-400">v1.0</span> Initial draft</p>
            <p className="flex gap-2"><span className="font-mono text-xs text-muted-foreground">v0.9</span> Preliminary review</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
            <CheckCircle2 className="w-4 h-4" /> Approval Status
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium border ${
              result.approval_status === 'approved'
                ? 'bg-emerald-400/12 text-emerald-400 border-emerald-400/25'
                : result.approval_status === 'rejected'
                ? 'bg-red-400/12 text-red-400 border-red-400/25'
                : 'bg-amber-400/12 text-amber-400 border-amber-400/25'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {result.approval_status}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [result,  setResult]  = useState<PolicyDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleAnalyze() {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const doc = await api<PolicyDoc>('/policies', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      });
      setResult(doc);
    } catch {
      setError('Analysis failed. Ensure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 border-b border-border glass flex items-center justify-between px-6 gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Policy Workspace</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Analyse and manage policy documents</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to home
            </Link>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 max-w-5xl w-full mx-auto">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard value="142" label="Active Policies"    color="text-blue-400" />
            <StatCard value="3"   label="Open Conflicts"     color="text-amber-400" />
            <StatCard value="98%" label="Compliance Score"   color="text-emerald-400" />
            <StatCard value="12"  label="Pending Approvals"  color="text-purple-400" />
          </div>

          {/* Workspace card */}
          <div
            className="rounded-2xl border border-border p-6 sm:p-8"
            style={{ background: 'hsl(var(--card))' }}
          >
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">New Policy Analysis</h2>
                  <p className="text-xs text-muted-foreground">Paste or type a policy document to begin</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-2.5 py-1.5 border border-border">
                <Zap className="w-3 h-3 text-blue-400" />
                AI-powered
              </div>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Policy title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Data Retention Policy v3.1"
                  className="w-full rounded-xl bg-secondary/40 border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Policy content
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={8}
                  placeholder="Paste or type your policy document here…"
                  className="w-full rounded-xl bg-secondary/40 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleAnalyze}
                disabled={loading || !title.trim() || !content.trim()}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-blue-500/40 disabled:to-blue-600/40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all btn-glow shadow-lg shadow-blue-500/15"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</>
                ) : (
                  <><Zap className="w-4 h-4" /> Analyse Policy</>
                )}
              </button>
            </div>

            {/* Results */}
            {result && <ResultPanel result={result} />}
          </div>

          {/* Recent activity */}
          <div className="mt-6 rounded-2xl border border-border p-6" style={{ background: 'hsl(var(--card))' }}>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Policy approved',       doc: 'Data Retention Policy v3.1', time: '2 min ago',   color: 'text-emerald-400', Icon: CheckCircle2 },
                { action: 'Conflict detected',     doc: 'GDPR Compliance Guide',      time: '18 min ago',  color: 'text-red-400',     Icon: AlertTriangle },
                { action: 'New version created',   doc: 'Access Control Framework',   time: '1 hour ago',  color: 'text-blue-400',    Icon: GitBranch },
                { action: 'Review requested',      doc: 'Incident Response Policy',   time: '3 hours ago', color: 'text-purple-400',  Icon: Clock },
              ].map(item => (
                <div key={item.doc} className="flex items-center gap-3 py-2 border-b border-border/60 last:border-0">
                  <div className={`w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0`}>
                    <item.Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 truncate">{item.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.doc}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
