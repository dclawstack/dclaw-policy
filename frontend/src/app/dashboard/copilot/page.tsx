'use client';

import { useState, useRef, useEffect } from 'react';
import { policyCopilotChat, type ChatMessage } from '@/lib/api';
import {
  Cpu, Send, Loader2, Copy, CheckCheck, Sparkles, User,
  FileText, ChevronDown,
} from 'lucide-react';

const STARTER_PROMPTS = [
  'Draft a remote work policy for our company',
  'Create a data retention policy aligned to GDPR',
  'Write an information security policy for SOC 2',
  'Build a vendor management policy framework',
  'Draft an acceptable use policy for IT resources',
  'Analyse my existing policy for compliance gaps',
];

function MessageBubble({ msg, onCopy }: { msg: ChatMessage & { draft?: string; suggestions?: string[] }; onCopy: (text: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [showDraft, setShowDraft] = useState(false);

  function handleCopy(text: string) {
    onCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (msg.role === 'user') {
    return (
      <div className="flex justify-end gap-3 mb-4">
        <div className="max-w-[80%] bg-blue-500/20 border border-blue-500/25 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm text-foreground/90 leading-relaxed">{msg.content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Cpu className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-secondary/40 border border-border rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{msg.content}</p>

          {(msg as any).suggestions && (
            <div className="mt-3 pt-3 border-t border-border/60">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Suggestions:</p>
              <div className="flex flex-wrap gap-1.5">
                {(msg as any).suggestions.map((s: string, i: number) => (
                  <span key={i} className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2 py-1 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {(msg as any).draft && (
          <div className="mt-2 bg-card border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setShowDraft(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="w-4 h-4 text-blue-400" />
                Policy Draft Generated
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={e => { e.stopPropagation(); handleCopy((msg as any).draft); }}
                  className="p-1.5 hover:bg-secondary/60 rounded-lg transition-colors"
                >
                  {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showDraft ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {showDraft && (
              <div className="px-4 pb-4 border-t border-border">
                <pre className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed mt-3 font-mono overflow-x-auto">
                  {(msg as any).draft}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<(ChatMessage & { draft?: string; suggestions?: string[] })[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Policy Copilot. I can help you draft new policies, analyze existing ones for compliance gaps, and answer questions about regulatory requirements.\n\nTry asking me to draft a specific policy, or use one of the prompts below to get started.',
      suggestions: ['Draft a remote work policy', 'Analyze for GDPR compliance', 'Create a security policy'],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = { role: 'user', content };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await policyCopilotChat(nextMessages.map(m => ({ role: m.role, content: m.content })));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.message,
        draft: res.draft,
        suggestions: res.suggestions,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card/30 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">AI Policy Copilot</h2>
              <p className="text-xs text-muted-foreground">Draft, analyse, and improve policies with AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-emerald-400/10 border border-emerald-400/25 text-emerald-400 px-2.5 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-dot" />
            AI Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} onCopy={handleCopy} />
          ))}
          {loading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div className="bg-secondary/40 border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating response…
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Starter prompts */}
      {messages.length === 1 && (
        <div className="px-6 pb-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Quick prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-xs bg-secondary/50 hover:bg-secondary border border-border hover:border-blue-500/30 text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-5 pt-3 border-t border-border bg-card/30 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask me to draft a policy, analyze compliance gaps, or answer questions…"
              rows={2}
              className="w-full rounded-xl bg-secondary/40 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none pr-14 leading-relaxed"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="absolute right-3 bottom-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Send className="w-3.5 h-3.5 text-white" />}
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 max-w-4xl mx-auto">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
