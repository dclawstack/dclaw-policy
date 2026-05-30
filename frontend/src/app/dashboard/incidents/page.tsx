'use client';

import { useState, useEffect } from 'react';
import { getIncidents, type Incident } from '@/lib/api';
import {
  Activity, AlertTriangle, CheckCircle2, Clock, FileText,
  Loader2, Plus, ChevronDown, GitBranch, Zap,
} from 'lucide-react';

const SEVERITY: Record<string, { color: string; bg: string; border: string; label: string }> = {
  critical: { color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/20',    label: 'Critical' },
  high:     { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', label: 'High' },
  medium:   { color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20',  label: 'Medium' },
  low:      { color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/20',   label: 'Low' },
};

const STATUS: Record<string, { Icon: typeof CheckCircle2; color: string; label: string }> = {
  open:         { Icon: AlertTriangle, color: 'text-red-400',    label: 'Open' },
  under_review: { Icon: Clock,         color: 'text-amber-400',  label: 'Under Review' },
  resolved:     { Icon: CheckCircle2,  color: 'text-emerald-400',label: 'Resolved' },
};

function IncidentRow({ incident }: { incident: Incident & { linked_policy_names?: string[] } }) {
  const [expanded, setExpanded] = useState(false);
  const sv = SEVERITY[incident.severity] ?? SEVERITY.medium;
  const st = STATUS[incident.status] ?? STATUS.open;
  const linked = (incident as any).linked_policy_names ?? incident.linked_policies;

  return (
    <div className="border-b border-border/60 last:border-0">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-4 px-5 py-4 hover:bg-secondary/10 transition-colors text-left"
      >
        <div className={`w-8 h-8 rounded-lg ${sv.bg} border ${sv.border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <AlertTriangle className={`w-4 h-4 ${sv.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-foreground">{incident.title}</p>
            <span className={`inline-flex text-xs px-2 py-0.5 rounded-lg border font-medium ${sv.color} ${sv.bg} ${sv.border}`}>
              {sv.label}
            </span>
            {incident.review_triggered && (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-400/10 border border-purple-400/20 text-purple-400 px-2 py-0.5 rounded-lg">
                <Zap className="w-3 h-3" /> Review triggered
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <st.Icon className={`w-3.5 h-3.5 ${st.color}`} />
              <span className={st.color}>{st.label}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(incident.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {linked.length} linked polic{linked.length === 1 ? 'y' : 'ies'}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="px-5 pb-5 bg-secondary/5 ml-12 space-y-4">
          <p className="text-sm text-foreground/80 leading-relaxed">{incident.description}</p>
          {linked.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Linked Policies requiring review</p>
              <div className="flex flex-wrap gap-2">
                {linked.map((p: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg">
                    <FileText className="w-3 h-3" /> {p}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            {incident.status !== 'resolved' && (
              <button className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all btn-glow">
                Start Policy Review
              </button>
            )}
            <button className="text-xs bg-secondary/40 hover:bg-secondary border border-border text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg transition-all">
              {incident.status === 'resolved' ? 'View Resolution' : 'Mark Resolved'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<(Incident & { linked_policy_names?: string[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'under_review' | 'resolved'>('all');

  useEffect(() => {
    getIncidents().then(setIncidents).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.status === filter);

  const counts = {
    open:         incidents.filter(i => i.status === 'open').length,
    under_review: incidents.filter(i => i.status === 'under_review').length,
    resolved:     incidents.filter(i => i.status === 'resolved').length,
    critical:     incidents.filter(i => i.severity === 'critical').length,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Incident-Linked Policy Review</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Incidents trigger mandatory policy reviews to prevent recurrence</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all btn-glow">
          <Plus className="w-4 h-4" /> Log Incident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
          <AlertTriangle className="w-5 h-5 text-red-400 mb-2" />
          <p className="text-3xl font-black text-red-400">{counts.open}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Open</p>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
          <Clock className="w-5 h-5 text-amber-400 mb-2" />
          <p className="text-3xl font-black text-amber-400">{counts.under_review}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Under review</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-3xl font-black text-emerald-400">{counts.resolved}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Resolved</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <Activity className="w-5 h-5 text-purple-400 mb-2" />
          <p className="text-3xl font-black text-purple-400">{counts.critical}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Critical severity</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(['all', 'open', 'under_review', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                : 'bg-secondary/40 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {f === 'all' ? 'All' : f === 'under_review' ? 'Under Review' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Incidents List */}
      {loading ? (
        <div className="flex items-center gap-2 py-10 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading incidents…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-foreground">No incidents found</p>
          <p className="text-sm mt-1">
            {filter === 'all' ? 'No incidents have been logged yet.' : `No ${filter.replace('_', ' ')} incidents.`}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {filtered.map(i => <IncidentRow key={i.id} incident={i} />)}
        </div>
      )}

      <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs text-muted-foreground space-y-1.5">
        <p className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          Critical and High severity incidents automatically trigger policy reviews for all linked policies.
        </p>
        <p className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          Policy reviews create new draft versions with the incident as the change rationale.
        </p>
      </div>
    </div>
  );
}
