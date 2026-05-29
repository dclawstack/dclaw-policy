'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Zap,
  AlertTriangle,
  GitBranch,
  CheckSquare,
  Activity,
  Clock,
  Cpu,
  Building2,
  Layers,
  Twitter,
  Github,
  Linkedin,
  FileText,
  Star,
  CheckCircle2,
  BarChart3,
  Bell,
  Play,
  Mail,
  Search,
} from 'lucide-react';

/* ─── Data ────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Product',  href: '#product' },
  { label: 'Why Us',   href: '#why-us' },
  { label: 'FAQ',      href: '#faq' },
];

const FEATURES = [
  {
    Icon: Search,
    title: 'AI Policy Analysis',
    description:
      'Leverage large language models to automatically analyse policy documents, identify gaps, and surface actionable improvement suggestions.',
    accent: 'from-blue-500/20 to-blue-600/5',
    icon: 'text-blue-400',
    glow: 'group-hover:shadow-blue-500/10',
  },
  {
    Icon: AlertTriangle,
    title: 'Conflict Detection',
    description:
      'Instantly detect contradictions and overlaps between policies across departments and versions before they cause compliance issues.',
    accent: 'from-red-500/20 to-red-600/5',
    icon: 'text-red-400',
    glow: 'group-hover:shadow-red-500/10',
  },
  {
    Icon: GitBranch,
    title: 'Version Control',
    description:
      'Full change history, branching, and diff visualisation — Git-like control adapted for non-technical policy teams.',
    accent: 'from-purple-500/20 to-purple-600/5',
    icon: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/10',
  },
  {
    Icon: CheckSquare,
    title: 'Approval Workflows',
    description:
      'Configurable multi-stakeholder review chains with notifications, SLA escalation, and a full audit trail for every decision.',
    accent: 'from-green-500/20 to-green-600/5',
    icon: 'text-green-400',
    glow: 'group-hover:shadow-green-500/10',
  },
  {
    Icon: Activity,
    title: 'Compliance Monitoring',
    description:
      'Real-time dashboards tracking your compliance posture with automated risk scoring against GDPR, HIPAA, and SOC 2.',
    accent: 'from-cyan-500/20 to-cyan-600/5',
    icon: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/10',
  },
  {
    Icon: Clock,
    title: 'Immutable Audit Trail',
    description:
      'Tamper-proof logs capturing every policy action, approval, and change — ready for regulatory review at any time.',
    accent: 'from-amber-500/20 to-amber-600/5',
    icon: 'text-amber-400',
    glow: 'group-hover:shadow-amber-500/10',
  },
];

const WHY_US = [
  {
    Icon: Cpu,
    metric: '10×',
    title: 'AI-Powered',
    description: 'Faster analysis via LLMs trained on regulatory frameworks worldwide.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    Icon: Zap,
    metric: '< 2s',
    title: 'Real-Time',
    description: 'Conflict detection and compliance scoring delivered in under two seconds.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    Icon: Building2,
    metric: '99.9%',
    title: 'Enterprise-Ready',
    description: 'SLA-backed uptime with SOC 2 Type II compliance and enterprise SSO.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    Icon: Layers,
    metric: '1M+',
    title: 'Infinitely Scalable',
    description: 'Policies processed monthly on cloud-native Kubernetes infrastructure.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
];

const FAQS = [
  {
    q: 'What types of policies can DClaw Policy manage?',
    a: 'DClaw Policy handles any organisational policy type — HR policies, IT security, compliance frameworks, data governance, operational procedures, and more. Our AI understands a wide range of regulatory standards including GDPR, HIPAA, SOC 2, and ISO 27001.',
  },
  {
    q: 'How does the AI conflict detection work?',
    a: 'Our model performs semantic analysis across your entire policy corpus, identifying contradictions, overlapping obligations, and coverage gaps. Unlike keyword matching, it grasps the intent behind policy language and only flags meaningful conflicts that warrant human review.',
  },
  {
    q: 'Is DClaw Policy suitable for enterprise deployments?',
    a: 'Absolutely. DClaw Policy ships with SSO (SAML/OIDC), RBAC, on-premise deployment options, an API-first architecture, and a dedicated SLA. We are SOC 2 Type II certified and can execute BAAs for healthcare customers.',
  },
  {
    q: 'How does version control for policies work?',
    a: 'Every policy change is versioned with a full history of edits, authors, and approval decisions. You can diff any two versions, restore previous drafts, and create branches — all through a familiar workflow adapted for non-technical users.',
  },
  {
    q: 'What approval workflows can I configure?',
    a: 'You can build multi-level approval chains with any combination of approvers — individuals, teams, or roles. Sequential and parallel approvals, delegation, escalation rules, and SLA-based reminders are all built in.',
  },
  {
    q: 'Can DClaw Policy integrate with our existing tools?',
    a: 'Yes. We provide REST APIs, webhooks, and pre-built integrations for Slack, Microsoft Teams, Jira, and ServiceNow. Our SDK makes custom integrations straightforward.',
  },
];

const STATS = [
  { value: '50K+',  label: 'Policies Managed' },
  { value: '500+',  label: 'Enterprises' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '< 2s',  label: 'AI Analysis Time' },
];

const PIPELINE_STEPS = [
  { n: '01', label: 'Document Ingestion',   sub: 'PDF, DOCX, Markdown, plain text', Icon: FileText,     color: 'blue' },
  { n: '02', label: 'AI Semantic Parsing',  sub: 'Entity extraction, obligation map', Icon: Cpu,        color: 'purple' },
  { n: '03', label: 'Conflict Detection',   sub: 'Cross-corpus contradiction scan', Icon: AlertTriangle, color: 'red' },
  { n: '04', label: 'Compliance Scoring',   sub: 'GDPR, HIPAA, SOC 2 frameworks', Icon: BarChart3,     color: 'green' },
  { n: '05', label: 'Workflow Trigger',     sub: 'Approval routing, notifications', Icon: Bell,         color: 'cyan' },
];

const COLOR_MAP: Record<string, string> = {
  blue:   'bg-blue-500/10   border-blue-500/20   text-blue-400',
  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  red:    'bg-red-500/10    border-red-500/20    text-red-400',
  green:  'bg-green-500/10  border-green-500/20  text-green-400',
  cyan:   'bg-cyan-500/10   border-cyan-500/20   text-cyan-400',
};

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function DashboardPreview() {
  return (
    <div className="relative animate-float">
      <div className="absolute inset-0 bg-blue-500/8 rounded-3xl blur-3xl scale-110 pointer-events-none" />
      <div className="relative card-border glow-card p-5 w-full max-w-sm sm:max-w-md">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 mb-5">
          <span className="w-3 h-3 rounded-full bg-red-400/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <span className="w-3 h-3 rounded-full bg-green-400/70" />
          <span className="ml-auto text-[11px] text-muted-foreground font-mono">DClaw Policy · Workspace</span>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { v: '142', l: 'Active',    c: 'text-blue-400' },
            { v: '3',   l: 'Conflicts', c: 'text-amber-400' },
            { v: '98%', l: 'Compliant', c: 'text-emerald-400' },
          ].map(s => (
            <div key={s.l} className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-2 py-2.5 text-center">
              <p className={`text-base font-bold ${s.c}`}>{s.v}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Policy rows */}
        <div className="space-y-1.5 mb-4">
          {[
            { name: 'Data Retention Policy v3.1',   badge: 'Approved',  bc: 'bg-emerald-400/12 text-emerald-400 border-emerald-400/20' },
            { name: 'Access Control Framework',     badge: 'In Review', bc: 'bg-blue-400/12 text-blue-400 border-blue-400/20' },
            { name: 'Incident Response Policy',     badge: 'Draft',     bc: 'bg-slate-400/12 text-slate-400 border-slate-400/20' },
            { name: 'GDPR Compliance Guide',        badge: 'Conflict',  bc: 'bg-red-400/12 text-red-400 border-red-400/20' },
          ].map(p => (
            <div key={p.name} className="flex items-center justify-between bg-white/[0.025] border border-white/[0.05] rounded-lg px-3 py-1.5 gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-foreground/75 truncate">{p.name}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium flex-shrink-0 ${p.bc}`}>{p.badge}</span>
            </div>
          ))}
        </div>

        {/* AI strip */}
        <div className="flex items-center gap-2.5 bg-blue-500/8 border border-blue-500/20 rounded-xl px-3 py-2.5">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-dot flex-shrink-0" />
          <span className="text-[11px] text-blue-300 flex-1">AI flagged 3 clauses in GDPR guide — review suggested</span>
          <ArrowRight className="w-3 h-3 text-blue-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

function Navbar({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-border/60' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center transition-shadow group-hover:shadow-lg group-hover:shadow-blue-500/25">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-foreground">
            DClaw <span className="text-gradient font-bold">Policy</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-5 py-2 rounded-xl font-semibold transition-all btn-glow"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-b border-border">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 mt-3 border-t border-border space-y-2">
              <Link href="/dashboard" className="block text-sm text-center text-muted-foreground hover:text-foreground py-2">
                Sign In
              </Link>
              <Link href="/dashboard" className="block text-sm text-center bg-blue-500 hover:bg-blue-400 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-border-subtle overflow-hidden">
      <button
        className="w-full flex items-start justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors gap-4"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-sm sm:text-base font-medium text-foreground leading-snug">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-border bg-white/[0.01]">
          <p className="text-sm text-muted-foreground leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar scrolled={scrolled} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 hero-bg grid-pattern">
        {/* Ambient orbs */}
        <div className="orb absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/6" />
        <div className="orb absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/5" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3.5 py-1.5 text-sm text-blue-300 mb-7">
                <Zap className="w-3.5 h-3.5" />
                <span>AI-Powered Governance Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                Policy management{' '}
                <span className="text-gradient-white block">built for scale</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-9 max-w-lg">
                Govern, analyze, and enforce organisational policies with AI-powered conflict detection,
                automated workflows, and real-time compliance monitoring — all in one platform.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all btn-glow shadow-xl shadow-blue-500/15"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#product"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/70 border border-border text-foreground px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <Play className="w-4 h-4 text-muted-foreground" /> Watch Demo
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>Trusted by 500+ enterprises worldwide</span>
              </div>
            </div>

            {/* Right: mock UI */}
            <div className="flex justify-center lg:justify-end animate-fade-in delay-300">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ─────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-gradient mb-1">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              Everything for{' '}
              <span className="text-gradient">policy governance</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete suite to create, manage, analyse, and enforce organisational policies at any scale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="card-border p-6 card-hover group glow-card cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <f.Icon className={`w-5 h-5 ${f.icon}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                <span className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-4 transition-colors cursor-pointer">
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Showcase ──────────────────────────────────────────────── */}
      <section id="product" className="py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Product Showcase</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-5">
                Intelligent policy analysis{' '}
                <span className="text-gradient">in seconds</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Upload any policy document and watch our AI instantly map relationships, detect conflicts,
                score compliance risk, and suggest remediation — zero configuration required.
              </p>
              <ul className="space-y-3 mb-9">
                {[
                  'Semantic conflict detection across your full policy corpus',
                  'Automated coverage gap analysis against regulatory frameworks',
                  'Risk scoring and prioritisation for compliance teams',
                  'Natural language summaries for non-technical stakeholders',
                  'Integrated workflow triggers on policy change events',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold transition-all btn-glow"
              >
                Try the Workspace <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: pipeline diagram */}
            <div className="card-border p-6 glow-card">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
                Policy Analysis Pipeline — live
              </div>
              <div className="space-y-3">
                {PIPELINE_STEPS.map((step, idx) => {
                  const cls = COLOR_MAP[step.color];
                  const [bg, border, text] = cls.split(/\s+/);
                  return (
                    <div key={step.n} className="relative">
                      <div className={`flex items-center gap-3 bg-card border rounded-xl px-4 py-3 ${border}`}>
                        <span className="text-xs font-mono text-muted-foreground w-6 flex-shrink-0">{step.n}</span>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                          <step.Icon className={`w-4 h-4 ${text}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{step.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{step.sub}</p>
                        </div>
                      </div>
                      {idx < PIPELINE_STEPS.length - 1 && (
                        <div className="absolute left-[2.55rem] top-full w-px h-3 bg-border" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Us ───────────────────────────────────────────────────────── */}
      <section id="why-us" className="py-24 section-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Why DClaw Policy</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              Built for the <span className="text-gradient">enterprise</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Purpose-built for organisations that take policy governance seriously.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {WHY_US.map(c => (
              <div key={c.title} className="card-border p-7 text-center card-hover glow-card group">
                <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <c.Icon className={`w-7 h-7 ${c.color}`} />
                </div>
                <p className={`text-4xl font-black mb-1 ${c.color}`}>{c.metric}</p>
                <h3 className="font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>

          {/* Trusted-by strip */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-7">Trusted by leading organisations</p>
            <div className="flex flex-wrap justify-center gap-10 opacity-25">
              {['ACME CORP', 'TECHFLOW', 'NOVASYS', 'MERIDIAN', 'APEX INC', 'COREDATA'].map(n => (
                <span key={n} className="text-sm font-bold tracking-widest text-foreground">{n}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              Frequently asked <span className="text-gradient">questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/4 pointer-events-none" />
        <div className="orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card-border p-10 sm:p-16 rounded-3xl glow-card">
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Get Started</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4 leading-tight">
              Govern with{' '}
              <span className="text-gradient">confidence</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-9 max-w-xl mx-auto">
              Start your free trial today. No credit card required. Full-featured access for 30 days.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all btn-glow shadow-xl shadow-blue-500/20"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="mailto:hello@dclaw.io"
                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/70 border border-border text-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                <Mail className="w-5 h-5 text-muted-foreground" /> Contact Sales
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {['No credit card required', '30-day free trial', 'SOC 2 compliant', 'Enterprise SSO'].map(item => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">DClaw <span className="text-gradient font-bold">Policy</span></span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">
                AI-powered policy governance for the modern enterprise. Analyse, enforce, and evolve your policies at scale.
              </p>
              <div className="flex gap-2.5">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/70 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {[
              { title: 'Product', links: [{ l: 'Features', h: '#features' }, { l: 'Pricing', h: '#' }, { l: 'Changelog', h: '#' }, { l: 'Roadmap', h: '#' }] },
              { title: 'Company', links: [{ l: 'About', h: '#' }, { l: 'Blog', h: '#' }, { l: 'Careers', h: '#' }, { l: 'Contact', h: '#contact' }] },
              { title: 'Legal',   links: [{ l: 'Privacy Policy', h: '#' }, { l: 'Terms of Service', h: '#' }, { l: 'Security', h: '#' }, { l: 'SOC 2', h: '#' }] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-foreground mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link.l}>
                      <a href={link.h} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} DClaw Policy. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built on the <span className="text-gradient font-medium">DClaw Platform</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
