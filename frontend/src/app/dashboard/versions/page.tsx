'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPolicies, getPolicyVersions, type PolicyDoc, type PolicyVersion } from '@/lib/api';
import {
  GitBranch, Clock, User, ChevronRight, Loader2,
  ChevronDown, CheckCircle2, ArrowLeftRight, FileText,
} from 'lucide-react';

function DiffView({ v1, v2 }: { v1: PolicyVersion; v2: PolicyVersion }) {
  const lines1 = v1.content.split('\n');
  const lines2 = v2.content.split('\n');
  return (
    <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden text-xs font-mono">
      <div className="bg-card p-4 overflow-x-auto">
        <div className="flex items-center gap-2 text-muted-foreground mb-3 font-sans text-xs">
          <GitBranch className="w-3.5 h-3.5" />
          <span>v{v1.version}</span>
          <span>·</span>
          <span>{new Date(v1.created_at).toLocaleDateString()}</span>
        </div>
        {lines1.map((line, i) => (
          <div key={i} className={`leading-5 px-1 rounded ${!lines2[i] ? 'bg-red-500/10 text-red-400' : line !== lines2[i] ? 'bg-amber-500/10 text-amber-300' : 'text-foreground/70'}`}>
            {line || ' '}
          </div>
        ))}
      </div>
      <div className="bg-card p-4 overflow-x-auto">
        <div className="flex items-center gap-2 text-muted-foreground mb-3 font-sans text-xs">
          <GitBranch className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-blue-400">v{v2.version}</span>
          <span>·</span>
          <span>{new Date(v2.created_at).toLocaleDateString()}</span>
        </div>
        {lines2.map((line, i) => (
          <div key={i} className={`leading-5 px-1 rounded ${!lines1[i] ? 'bg-emerald-500/10 text-emerald-400' : line !== lines1[i] ? 'bg-amber-500/10 text-amber-300' : 'text-foreground/70'}`}>
            {line || ' '}
          </div>
        ))}
      </div>
    </div>
  );
}

function VersionsContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get('id') ?? '';

  const [policies, setPolicies] = useState<PolicyDoc[]>([]);
  const [selectedId, setSelectedId] = useState(preselectedId);
  const [versions, setVersions] = useState<PolicyVersion[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');

  useEffect(() => {
    getPolicies().then(p => {
      setPolicies(p);
      if (!preselectedId && p.length > 0) setSelectedId(p[0].id);
    }).finally(() => setLoadingPolicies(false));
  }, [preselectedId]);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingVersions(true);
    setVersions([]);
    setExpandedVersion(null);
    setCompareMode(false);
    getPolicyVersions(selectedId).then(v => {
      setVersions(v);
      if (v.length >= 2) { setCompareA(v[0].id); setCompareB(v[1].id); }
    }).finally(() => setLoadingVersions(false));
  }, [selectedId]);

  const versionA = versions.find(v => v.id === compareA);
  const versionB = versions.find(v => v.id === compareB);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Version Control</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Full history, diffs, and change tracking for every policy</p>
      </div>

      {/* Policy Selector */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Policy</label>
            {loadingPolicies ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
            ) : (
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
              >
                {policies.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            )}
          </div>
          {versions.length >= 2 && (
            <div className="flex items-end">
              <button
                onClick={() => setCompareMode(v => !v)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                  compareMode
                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                Compare Versions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compare Mode */}
      {compareMode && versionA && versionB && (
        <div className="rounded-2xl border border-blue-500/20 bg-card p-5 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs text-muted-foreground mb-1.5">Base version</label>
              <select
                value={compareA}
                onChange={e => setCompareA(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm focus:outline-none"
              >
                {versions.map(v => <option key={v.id} value={v.id}>v{v.version} — {v.change_summary}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs text-muted-foreground mb-1.5">Compare to</label>
              <select
                value={compareB}
                onChange={e => setCompareB(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm focus:outline-none"
              >
                {versions.map(v => <option key={v.id} value={v.id}>v{v.version} — {v.change_summary}</option>)}
              </select>
            </div>
          </div>
          <DiffView v1={versionA} v2={versionB} />
          <div className="flex items-center gap-5 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20 inline-block" /> Added</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/20 inline-block" /> Removed</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/20 inline-block" /> Changed</span>
          </div>
        </div>
      )}

      {/* Version Timeline */}
      {loadingVersions ? (
        <div className="flex items-center gap-2 py-10 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading version history…
        </div>
      ) : versions.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-secondary/20">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-muted-foreground" /> Version History — {versions.length} versions
            </h3>
          </div>
          <div className="divide-y divide-border/60">
            {versions.map((v, idx) => (
              <div key={v.id} className="relative">
                <button
                  onClick={() => setExpandedVersion(e => e === v.id ? null : v.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary/10 transition-colors text-left"
                >
                  {/* Timeline line */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full border-2 ${idx === 0 ? 'border-blue-400 bg-blue-400' : 'border-border bg-secondary'}`} />
                    {idx < versions.length - 1 && <div className="w-px flex-1 bg-border min-h-[16px]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-sm font-bold text-blue-400">v{v.version}</span>
                      {idx === 0 && (
                        <span className="text-xs bg-blue-500/15 border border-blue-500/25 text-blue-300 px-2 py-0.5 rounded-lg">Latest</span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/80">{v.change_summary}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {v.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(v.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {idx < versions.length - 1 && (
                      <button
                        onClick={e => { e.stopPropagation(); setCompareA(v.id); setCompareB(versions[idx + 1].id); setCompareMode(true); }}
                        className="text-xs text-muted-foreground hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-blue-500/10"
                      >
                        Diff
                      </button>
                    )}
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedVersion === v.id ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {expandedVersion === v.id && (
                  <div className="px-12 pb-5 bg-secondary/5">
                    <div className="bg-card border border-border rounded-xl p-4 overflow-x-auto">
                      <p className="text-xs font-mono text-foreground/70 whitespace-pre-wrap leading-relaxed">{v.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Restore this version
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : selectedId && !loadingPolicies ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No version history available</p>
        </div>
      ) : null}

      {!selectedId && !loadingPolicies && (
        <div className="text-center py-16 text-muted-foreground">
          <GitBranch className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-foreground">Select a policy to view version history</p>
          <p className="text-sm mt-1">All policy changes are tracked with full attribution and diff support.</p>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
        All versions are immutably stored — restoring creates a new version, never overwrites history
      </div>
    </div>
  );
}

export default function VersionsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
      </div>
    }>
      <VersionsContent />
    </Suspense>
  );
}
