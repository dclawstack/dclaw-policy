'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPolicies, type PolicyDoc } from '@/lib/api';
import {
  FileText, Plus, Search, Filter, ChevronRight,
  AlertTriangle, CheckCircle2, Clock, GitBranch,
  Loader2, Zap,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:     { label: 'Draft',      color: 'text-slate-400',   bg: 'bg-slate-400/10',   border: 'border-slate-400/20' },
  in_review: { label: 'In Review',  color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20' },
  approved:  { label: 'Approved',   color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  published: { label: 'Published',  color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/20' },
  retired:   { label: 'Retired',    color: 'text-zinc-400',    bg: 'bg-zinc-400/10',    border: 'border-zinc-400/20' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-lg border font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    getPolicies().then(setPolicies).finally(() => setLoading(false));
  }, []);

  const filtered = policies.filter(p => {
    const q = query.toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || (p.department ?? '').toLowerCase().includes(q);
    const matchS = !statusFilter || p.status === statusFilter;
    return matchQ && matchS;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Policies</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your organisation's policy library</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all btn-glow"
        >
          <Plus className="w-4 h-4" /> New Policy
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search policies…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = policies.filter(p => p.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(s => s === key ? '' : key)}
              className={`rounded-xl border p-3 text-left transition-all ${statusFilter === key ? `${cfg.bg} ${cfg.border}` : 'border-border bg-card hover:bg-secondary/40'}`}
            >
              <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading policies…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No policies found</p>
          <p className="text-sm mt-1">Try adjusting your filters or create a new policy</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Policy</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Version</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Department</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Issues</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.owner ?? 'Unassigned'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="font-mono text-xs text-muted-foreground">{p.version ?? '1.0'}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground">{p.department ?? '—'}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        {p.conflict_flags.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-red-400">
                            <AlertTriangle className="w-3 h-3" /> {p.conflict_flags.length}
                          </span>
                        )}
                        {p.coverage_gaps.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                            <Zap className="w-3 h-3" /> {p.coverage_gaps.length} gaps
                          </span>
                        )}
                        {p.conflict_flags.length === 0 && p.coverage_gaps.length === 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Clean
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/dashboard/versions?id=${p.id}`} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        View <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><GitBranch className="w-3.5 h-3.5" /> Version-controlled</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Auto-archiving enabled</span>
      </div>
    </div>
  );
}
