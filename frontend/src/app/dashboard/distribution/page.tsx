'use client';

import { useState, useEffect } from 'react';
import { getDistribution, type DistributionData, type DistributionCampaign } from '@/lib/api';
import {
  Send, Users, Eye, BookOpen, CheckSquare, Clock, CheckCircle2,
  Calendar, Loader2, Plus, BarChart3, TrendingUp,
} from 'lucide-react';

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">{pct}%</span>
    </div>
  );
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  active:    { label: 'Active',    color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/20' },
  scheduled: { label: 'Scheduled', color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20' },
};

function CampaignCard({ c }: { c: DistributionCampaign }) {
  const [expanded, setExpanded] = useState(false);
  const sc = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.active;
  const openRate = c.sent_to > 0 ? Math.round((c.opened / c.sent_to) * 100) : 0;
  const readRate = c.sent_to > 0 ? Math.round((c.read / c.sent_to) * 100) : 0;
  const ackRate  = c.sent_to > 0 ? Math.round((c.acknowledged / c.sent_to) * 100) : 0;

  return (
    <div className="border-b border-border/60 last:border-0">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-secondary/10 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Send className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-foreground truncate">{c.policy_title}</p>
            <span className={`inline-flex text-xs px-2 py-0.5 rounded-lg border font-medium ${sc.color} ${sc.bg} ${sc.border}`}>
              {sc.label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.sent_to} recipients</span>
            <span className="flex items-center gap-1">
              {c.status === 'scheduled' ? <Calendar className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {c.status === 'scheduled' ? 'Scheduled for' : 'Sent'} {new Date(c.sent_at).toLocaleDateString()}
            </span>
            <span>{c.groups.join(', ')}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          {c.status !== 'scheduled' && (
            <p className="text-lg font-bold text-foreground">{ackRate}%</p>
          )}
          <p className="text-xs text-muted-foreground">{c.status === 'scheduled' ? 'pending' : 'acknowledged'}</p>
        </div>
      </button>

      {expanded && c.status !== 'scheduled' && (
        <div className="px-5 pb-5 bg-secondary/5">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { Icon: Eye,        label: 'Opened',       value: c.opened,       total: c.sent_to, color: 'bg-cyan-500',    pct: openRate },
              { Icon: BookOpen,   label: 'Read',         value: c.read,         total: c.sent_to, color: 'bg-blue-500',    pct: readRate },
              { Icon: CheckSquare,label: 'Acknowledged', value: c.acknowledged, total: c.sent_to, color: 'bg-emerald-500', pct: ackRate },
            ].map(m => (
              <div key={m.label} className="bg-card border border-border rounded-xl p-3 text-center">
                <m.Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className="mt-2 bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Open rate</span><span>{openRate}%</span>
            </div>
            <ProgressBar value={c.opened} max={c.sent_to} color="bg-cyan-500" />
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 mb-1">
              <span>Read rate</span><span>{readRate}%</span>
            </div>
            <ProgressBar value={c.read} max={c.sent_to} color="bg-blue-500" />
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 mb-1">
              <span>Acknowledgement rate</span><span>{ackRate}%</span>
            </div>
            <ProgressBar value={c.acknowledged} max={c.sent_to} color="bg-emerald-500" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DistributionPage() {
  const [data, setData] = useState<DistributionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDistribution().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading distribution data…
      </div>
    );
  }

  const campaigns = data?.campaigns ?? [];
  const completed = campaigns.filter(c => c.status === 'completed');
  const active    = campaigns.filter(c => c.status === 'active');
  const scheduled = campaigns.filter(c => c.status === 'scheduled');
  const totalSent = campaigns.reduce((s, c) => s + c.sent_to, 0);
  const totalAck  = campaigns.reduce((s, c) => s + c.acknowledged, 0);
  const overallAck = totalSent > 0 ? Math.round((totalAck / totalSent) * 100) : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Policy Distribution</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Distribute policies and track delivery and acknowledgement</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all btn-glow">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-border bg-card p-5">
          <BarChart3 className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-3xl font-black text-blue-400">{campaigns.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total campaigns</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <Users className="w-5 h-5 text-cyan-400 mb-2" />
          <p className="text-3xl font-black text-cyan-400">{totalSent}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total recipients</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-3xl font-black text-emerald-400">{overallAck}%</p>
          <p className="text-xs text-muted-foreground mt-0.5">Acknowledgement rate</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <TrendingUp className="w-5 h-5 text-purple-400 mb-2" />
          <p className="text-3xl font-black text-purple-400">{active.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Active campaigns</p>
        </div>
      </div>

      {/* Active Campaigns */}
      {active.length > 0 && (
        <div className="rounded-2xl border border-blue-500/20 bg-card overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-blue-500/20 bg-blue-500/5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-dot" />
              Active Campaigns
            </h3>
          </div>
          {active.map(c => <CampaignCard key={c.id} c={c} />)}
        </div>
      )}

      {/* Scheduled */}
      {scheduled.length > 0 && (
        <div className="rounded-2xl border border-amber-500/20 bg-card overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-amber-500/20 bg-amber-500/5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" /> Scheduled
            </h3>
          </div>
          {scheduled.map(c => <CampaignCard key={c.id} c={c} />)}
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-secondary/20">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed ({completed.length})
            </h3>
          </div>
          {completed.map(c => <CampaignCard key={c.id} c={c} />)}
        </div>
      )}

      <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <Send className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          Distribution campaigns send email + in-app notifications. Recipients receive automated reminders every 3 days until they acknowledge.
        </p>
      </div>
    </div>
  );
}
