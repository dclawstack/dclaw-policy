'use client';

import { useState, useEffect } from 'react';
import { getPolicies, runGapAnalysis, type PolicyDoc, type GapAnalysisResult, type GapItem } from '@/lib/api';
import {
  AlertTriangle, CheckCircle2, Minus, Loader2, ChevronRight,
  BarChart3, Zap, Target, FileText,
} from 'lucide-react';

const FRAMEWORK_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  GDPR:     { color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/20' },
  'ISO 27001': { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  'SOC 2':  { color: 'text-cyan-400',   bg: 'bg-cyan-400/10',   border: 'border-cyan-400/20' },
  HIPAA:    { color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/20' },
  'NIST CSF': { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
};

const STATUS_CONFIG: Record<string, { Icon: typeof CheckCircle2; color: string; label: string }> = {
  covered: { Icon: CheckCircle2, color: 'text-emerald-400', label: 'Covered' },
  partial:  { Icon: Minus,        color: 'text-amber-400',   label: 'Partial' },
  missing:  { Icon: AlertTriangle, color: 'text-red-400',    label: 'Missing' },
};

function GapRow({ gap }: { gap: GapItem }) {
  const [open, setOpen] = useState(false);
  const sc = STATUS_CONFIG[gap.status];
  const fc = FRAMEWORK_COLORS[gap.framework] ?? { color: 'text-muted-foreground', bg: 'bg-secondary/40', border: 'border-border' };
  return (
    <div className="border-b border-border/60 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary/10 transition-colors text-left"
      >
        <span className={`inline-flex text-xs px-2 py-0.5 rounded-lg border font-medium flex-shrink-0 ${fc.color} ${fc.bg} ${fc.border}`}>
          {gap.framework}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate">{gap.requirement}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <sc.Icon className={`w-4 h-4 ${sc.color}`} />
          <span className={`text-xs font-medium ${sc.color}`}>{sc.label}</span>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-secondary/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-blue-400 font-medium">Suggestion: </span>
            {gap.suggestion}
          </p>
        </div>
      )}
    </div>
  );
}

export default function GapAnalysisPage() {
  const [policies, setPolicies] = useState<PolicyDoc[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [result, setResult] = useState<GapAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  useEffect(() => {
    getPolicies().then(p => { setPolicies(p); if (p.length > 0) setSelectedId(p[0].id); })
      .finally(() => setLoadingPolicies(false));
  }, []);

  async function analyze() {
    if (!selectedId) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await runGapAnalysis(selectedId);
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  const coverageColor = result
    ? result.coverage_score >= 85 ? 'text-emerald-400' : result.coverage_score >= 65 ? 'text-amber-400' : 'text-red-400'
    : 'text-muted-foreground';

  const byStatus = result ? {
    covered: result.gaps.filter(g => g.status === 'covered').length,
    partial:  result.gaps.filter(g => g.status === 'partial').length,
    missing:  result.gaps.filter(g => g.status === 'missing').length,
  } : null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">AI Policy Gap Analysis</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Compare policies against GDPR, HIPAA, SOC 2, and ISO 27001 requirements</p>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground/80 mb-2">Select Policy</label>
            {loadingPolicies ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : (
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
              >
                {policies.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-end">
            <button
              onClick={analyze}
              disabled={loading || !selectedId || loadingPolicies}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all btn-glow"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</>
              ) : (
                <><Zap className="w-4 h-4" /> Run Gap Analysis</>
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-blue-400" />
          Frameworks checked: GDPR · HIPAA · SOC 2 Type II · ISO 27001 · NIST CSF
        </p>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Score Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="rounded-2xl border border-border bg-card p-5 sm:col-span-1 col-span-2">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Coverage Score</p>
              <p className={`text-5xl font-black ${coverageColor}`}>{result.coverage_score}%</p>
              <div className="mt-3 bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${result.coverage_score >= 85 ? 'bg-emerald-500' : result.coverage_score >= 65 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${result.coverage_score}%` }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Covered</span>
              </div>
              <p className="text-3xl font-black text-emerald-400">{byStatus?.covered}</p>
            </div>
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Minus className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">Partial</span>
              </div>
              <p className="text-3xl font-black text-amber-400">{byStatus?.partial}</p>
            </div>
            <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400 font-medium">Missing</span>
              </div>
              <p className="text-3xl font-black text-red-400">{byStatus?.missing}</p>
            </div>
          </div>

          {/* Gap Details */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-border bg-secondary/20 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Requirement Coverage</h3>
            </div>
            {result.gaps.map((gap, i) => <GapRow key={i} gap={gap} />)}
          </div>

          {/* Recommendations */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" /> AI Recommendations
            </h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-blue-400 font-bold">
                    {i + 1}
                  </div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Initial state */}
      {!result && !loading && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <p className="font-medium text-foreground">Select a policy and run analysis</p>
          <p className="text-sm mt-1 max-w-md mx-auto">Our AI will compare your policy against multiple regulatory frameworks and identify coverage gaps with actionable recommendations.</p>
        </div>
      )}
    </div>
  );
}
