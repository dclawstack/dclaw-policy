'use client';

import { useState, useEffect } from 'react';
import { getAttestation, submitAttestation, type AttestationData, type AttestationPolicy } from '@/lib/api';
import {
  CheckSquare, CheckCircle2, Clock, Users, AlertTriangle,
  Loader2, ChevronRight, Bell,
} from 'lucide-react';

function ComplianceBar({ rate }: { rate: number }) {
  const color = rate >= 90 ? 'bg-emerald-500' : rate >= 70 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${rate}%` }} />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${rate >= 90 ? 'text-emerald-400' : rate >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
        {rate}%
      </span>
    </div>
  );
}

function PolicyRow({ policy, onAttest }: { policy: AttestationPolicy; onAttest: (id: string) => void }) {
  const [loading, setLoading] = useState(false);
  const due = new Date(policy.due_date);
  const overdue = !policy.attested && due < new Date();
  const dueSoon = !policy.attested && !overdue && due < new Date(Date.now() + 7 * 86400000);

  async function handleAttest() {
    setLoading(true);
    try {
      await onAttest(policy.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 border-b border-border/60 last:border-0 hover:bg-secondary/10 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-foreground truncate">{policy.title}</p>
          {overdue && (
            <span className="inline-flex items-center gap-1 text-xs bg-red-400/10 border border-red-400/20 text-red-400 px-2 py-0.5 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-3 h-3" /> Overdue
            </span>
          )}
          {dueSoon && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-400/10 border border-amber-400/20 text-amber-400 px-2 py-0.5 rounded-lg flex-shrink-0">
              <Bell className="w-3 h-3" /> Due soon
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {policy.employees_attested}/{policy.employees_total}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Due {due.toLocaleDateString()}</span>
          <span>{policy.department}</span>
        </div>
        <div className="mt-2">
          <ComplianceBar rate={policy.compliance_rate} />
        </div>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        {policy.attested ? (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">Attested {policy.attested_at ? new Date(policy.attested_at).toLocaleDateString() : ''}</span>
          </div>
        ) : (
          <button
            onClick={handleAttest}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all btn-glow"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckSquare className="w-3.5 h-3.5" />}
            Attest
          </button>
        )}
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5">
          Details <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function AttestationPage() {
  const [data, setData] = useState<AttestationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAttestation().then(setData).finally(() => setLoading(false));
  }, []);

  async function handleAttest(policyId: string) {
    await submitAttestation(policyId);
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        policies: prev.policies.map(p =>
          p.id === policyId
            ? { ...p, attested: true, attested_at: new Date().toISOString(), compliance_rate: 100, employees_attested: p.employees_total }
            : p
        ),
        pending_count: Math.max(0, prev.pending_count - 1),
        overall_compliance: Math.min(100, prev.overall_compliance + 5),
      };
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading attestation data…
      </div>
    );
  }

  if (!data) return null;

  const overallColor = data.overall_compliance >= 90 ? 'text-emerald-400' : data.overall_compliance >= 70 ? 'text-amber-400' : 'text-red-400';
  const overallBg = data.overall_compliance >= 90 ? 'from-emerald-500' : data.overall_compliance >= 70 ? 'from-amber-500' : 'from-red-500';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Employee Attestation</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Track policy acknowledgements across your organisation</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Overall Compliance</span>
            <CheckCircle2 className={`w-4 h-4 ${overallColor}`} />
          </div>
          <div className="flex items-end gap-2">
            <p className={`text-4xl font-black ${overallColor}`}>{data.overall_compliance}%</p>
          </div>
          <div className="mt-3 bg-secondary rounded-full h-2 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${overallBg} to-cyan-500 transition-all duration-700`} style={{ width: `${data.overall_compliance}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-4xl font-black text-amber-400">{data.pending_count}</p>
          <p className="text-xs text-muted-foreground mt-2">policies awaiting attestation</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Policies</span>
            <CheckSquare className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-4xl font-black text-blue-400">{data.policies.length}</p>
          <p className="text-xs text-muted-foreground mt-2">requiring attestation</p>
        </div>
      </div>

      {/* Policy List */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-secondary/20">
          <h3 className="text-sm font-semibold text-foreground">Policy Attestation Status</h3>
        </div>
        {data.policies.map(policy => (
          <PolicyRow key={policy.id} policy={policy} onAttest={handleAttest} />
        ))}
      </div>

      <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400 flex-shrink-0" />
          Automated reminders are sent 7 days before the due date and again when overdue. Employees receive email and in-app notifications.
        </p>
      </div>
    </div>
  );
}
