'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Shield, FileText, LayoutDashboard, Settings, Bell, ArrowLeft,
  GitBranch, Activity, CheckSquare, Search, Cpu, AlertTriangle,
  Zap, Menu, X, Send,
} from 'lucide-react';

const NAV_ITEMS = [
  { Icon: LayoutDashboard, label: 'Overview',     href: '/dashboard' },
  { Icon: FileText,        label: 'Policies',     href: '/dashboard/policies' },
  { Icon: Cpu,             label: 'AI Copilot',   href: '/dashboard/copilot' },
  { Icon: CheckSquare,     label: 'Attestation',  href: '/dashboard/attestation' },
  { Icon: Search,          label: 'Search',       href: '/dashboard/search' },
  { Icon: AlertTriangle,   label: 'Gap Analysis', href: '/dashboard/gap-analysis' },
  { Icon: GitBranch,       label: 'Versions',     href: '/dashboard/versions' },
  { Icon: Send,            label: 'Distribution', href: '/dashboard/distribution' },
  { Icon: Activity,        label: 'Incidents',    href: '/dashboard/incidents' },
  { Icon: Settings,        label: 'Settings',     href: '/dashboard/settings' },
];

function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col w-60 flex-shrink-0 border-r border-border bg-card/50 ${mobile ? '' : 'min-h-screen sticky top-0'}`}>
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-sm">
          DClaw <span className="text-gradient font-bold">Policy</span>
        </span>
        {mobile && (
          <button className="ml-auto p-1 text-muted-foreground hover:text-foreground" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <item.Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 p-3.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/8 border border-blue-500/20 flex-shrink-0">
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full overflow-y-auto">
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border glass flex items-center justify-between px-6 gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <h1 className="text-sm font-semibold text-foreground hidden sm:block">Policy Workspace</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
