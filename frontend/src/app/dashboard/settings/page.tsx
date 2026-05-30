'use client';

import { useState } from 'react';
import {
  Settings, User, Bell, Shield, Key, Building2,
  CheckCircle2, Save, Loader2,
} from 'lucide-react';

function Section({ title, icon: Icon, children }: { title: string; icon: typeof Settings; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden mb-5">
      <div className="px-5 py-4 border-b border-border bg-secondary/20 flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/60 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5.5 rounded-full transition-all flex-shrink-0 relative mt-0.5 ${checked ? 'bg-blue-500' : 'bg-secondary border border-border'}`}
        style={{ height: '22px', minWidth: '40px' }}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({
    policyUpdates: true, approvalRequests: true, conflictAlerts: true,
    attestationReminders: true, distributionReports: false, incidentAlerts: true,
  });

  function handleSave() {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 800);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and workspace preferences</p>
      </div>

      <Section title="Profile" icon={User}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            U
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">User</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Full name', placeholder: 'Your name', value: '' },
            { label: 'Email address', placeholder: 'your@company.com', value: '' },
            { label: 'Job title', placeholder: 'e.g. Compliance Manager', value: '' },
            { label: 'Department', placeholder: 'e.g. Legal', value: '' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label}</label>
              <input
                type="text"
                placeholder={f.placeholder}
                defaultValue={f.value}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Organisation" icon={Building2}>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Organisation name', placeholder: 'Acme Corp' },
            { label: 'Industry', placeholder: 'e.g. Financial Services' },
            { label: 'Headquarters', placeholder: 'e.g. London, UK' },
            { label: 'Regulatory frameworks', placeholder: 'GDPR, SOC 2, ISO 27001' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label}</label>
              <input
                type="text"
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Notifications" icon={Bell}>
        <Toggle label="Policy updates" desc="Notify when policies are created or modified" checked={notifs.policyUpdates} onChange={v => setNotifs(n => ({ ...n, policyUpdates: v }))} />
        <Toggle label="Approval requests" desc="Notify when policies are submitted for your review" checked={notifs.approvalRequests} onChange={v => setNotifs(n => ({ ...n, approvalRequests: v }))} />
        <Toggle label="Conflict alerts" desc="Notify when AI detects policy conflicts" checked={notifs.conflictAlerts} onChange={v => setNotifs(n => ({ ...n, conflictAlerts: v }))} />
        <Toggle label="Attestation reminders" desc="Reminders for pending policy acknowledgements" checked={notifs.attestationReminders} onChange={v => setNotifs(n => ({ ...n, attestationReminders: v }))} />
        <Toggle label="Distribution reports" desc="Weekly summary of distribution campaign performance" checked={notifs.distributionReports} onChange={v => setNotifs(n => ({ ...n, distributionReports: v }))} />
        <Toggle label="Incident alerts" desc="Immediate notification for critical and high severity incidents" checked={notifs.incidentAlerts} onChange={v => setNotifs(n => ({ ...n, incidentAlerts: v }))} />
      </Section>

      <Section title="Security" icon={Shield}>
        <div className="space-y-4">
          <Toggle label="Two-factor authentication" desc="Require 2FA for all sign-ins" checked={true} onChange={() => {}} />
          <Toggle label="Session timeout" desc="Automatically sign out after 30 minutes of inactivity" checked={false} onChange={() => {}} />
          <div className="pt-2">
            <button className="inline-flex items-center gap-2 bg-secondary/40 hover:bg-secondary border border-border text-foreground px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Key className="w-4 h-4" /> Change Password
            </button>
          </div>
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all btn-glow"
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save changes</>}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
