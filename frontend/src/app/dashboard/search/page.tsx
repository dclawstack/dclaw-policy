'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchPolicies, type PolicyDoc } from '@/lib/api';
import {
  Search, FileText, Tag, Building2, Filter, X,
  CheckCircle2, AlertTriangle, Zap, Clock, ChevronRight, Loader2,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  draft:     'text-slate-400 bg-slate-400/10 border-slate-400/20',
  in_review: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  approved:  'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  published: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  retired:   'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft', in_review: 'In Review', approved: 'Approved', published: 'Published', retired: 'Retired',
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [results, setResults] = useState<PolicyDoc[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() && !statusFilter && !deptFilter) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const filters: Record<string, string> = {};
        if (statusFilter) filters.status = statusFilter;
        if (deptFilter) filters.department = deptFilter;
        const res = await searchPolicies(query, filters);
        setResults(res.results);
        setTotal(res.total);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, statusFilter, deptFilter]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function clearFilters() {
    setQuery('');
    setStatusFilter('');
    setDeptFilter('');
    setSearched(false);
    setResults([]);
    inputRef.current?.focus();
  }

  const hasFilters = query || statusFilter || deptFilter;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Policy Search</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Full-text and semantic search across your policy library</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by policy name, content, tags, or department…"
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-base"
        />
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground">Filters:</span>
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-secondary/40 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
        >
          <option value="">Any Status</option>
          <option value="draft">Draft</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="published">Published</option>
        </select>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-secondary/40 border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
        >
          <option value="">Any Department</option>
          <option value="Legal">Legal</option>
          <option value="IT">IT</option>
          <option value="Security">Security</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Operations">Operations</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Searching…
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total === 0 ? 'No results found' : `${total} result${total !== 1 ? 's' : ''} found`}
            {query && <span> for <span className="text-foreground font-medium">"{query}"</span></span>}
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          {results.map(policy => (
            <div key={policy.id} className="rounded-2xl border border-border bg-card p-5 hover:bg-secondary/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-4.5 h-4.5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">{policy.title}</h3>
                      <span className={`inline-flex text-xs px-2 py-0.5 rounded-lg border font-medium ${STATUS_COLORS[policy.status] ?? ''}`}>
                        {STATUS_LABELS[policy.status] ?? policy.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">{policy.content}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {policy.department}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> v{policy.version}</span>
                      {policy.tags?.map(tag => (
                        <span key={tag} className="flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {tag}
                        </span>
                      ))}
                    </div>
                    {(policy.conflict_flags.length > 0 || policy.coverage_gaps.length > 0) && (
                      <div className="flex items-center gap-3 mt-2">
                        {policy.conflict_flags.length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <AlertTriangle className="w-3 h-3" /> {policy.conflict_flags.length} conflict{policy.conflict_flags.length > 1 ? 's' : ''}
                          </span>
                        )}
                        {policy.coverage_gaps.length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-amber-400">
                            <Zap className="w-3 h-3" /> {policy.coverage_gaps.length} gap{policy.coverage_gaps.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Link
                  href={`/dashboard/versions?id=${policy.id}`}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                >
                  View <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-foreground">No policies match your search</p>
          <p className="text-sm mt-1">Try different keywords or remove filters</p>
          <button onClick={clearFilters} className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Clear all filters
          </button>
        </div>
      )}

      {/* Initial state */}
      {!searched && !loading && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-400" />
          </div>
          <p className="font-medium text-foreground">Search your policy library</p>
          <p className="text-sm mt-1 max-w-sm mx-auto">Type to search across policy titles, content, tags, and departments. Use filters to narrow results.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['GDPR', 'security', 'remote work', 'data retention', 'vendor'].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-xs bg-secondary/50 hover:bg-secondary border border-border text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
              >
                <Tag className="w-3 h-3" /> {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        Semantic search powered by AI embeddings for contextual matching
      </div>
    </div>
  );
}
