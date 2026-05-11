'use client';

/**
 * features/insights/InsightsPageClient.tsx
 *
 * RAG-powered Q&A console with session-scoped chat history. Conversations
 * are persisted to sessionStorage so refreshing the tab keeps the history,
 * but closing the tab wipes it. Each browser tab gets its own session --
 * opening Insights in a new tab starts blank.
 */

import { BrainCircuit, Database, FileText, Loader2, Send, Sparkles, Trash2 } from 'lucide-react';
import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { MarkdownContent } from '@/components/data-display/MarkdownContent';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/features/auth/AuthProvider';
import { type RagAnswer, useAskKb, useKbStats } from '@/features/knowledge-base/useKnowledgeBase';

interface ChatTurn {
  id: string;
  question: string;
  answer?: RagAnswer;
  error?: string;
  timestamp: number;
}

const SUGGESTED_QUESTIONS = [
  'What caused the biggest revenue drop last quarter?',
  'Which customer segment has the highest churn risk?',
  'Summarise the key findings from my uploaded data.',
  'What does the growth model predict for next quarter?',
];

// Versioned key so we can break compatibility cleanly if the ChatTurn
// shape ever changes.
const CHAT_STORAGE_KEY = 'optimaai:insights:chat:v1';

/* ------------------------------------------------------------------ */
/* useSessionChat — sessionStorage-backed chat state                    */
/* ------------------------------------------------------------------ */
/**
 * Behaviour:
 *  - Server render → starts with [] (sessionStorage doesn't exist on server)
 *  - First client render → also starts with [] (must match server for
 *    hydration to succeed without warnings)
 *  - First useEffect → reads sessionStorage and replaces state if there's
 *    saved data. THIS is when navigated-back-to chats reappear.
 *  - State change → writes sessionStorage (only after the hydration read,
 *    so we don't clobber saved data with [] on the very first effect run)
 *  - clearTurns() → wipes both state and storage
 *  - Tab close → browser wipes sessionStorage automatically
 *
 * Why not `useState(readFromStorage)` lazy initialiser? Because that
 * causes server/client HTML mismatch when there's saved data — the
 * server renders empty state, the client renders chat bubbles, React
 * complains and discards the client tree.
 *
 * Why this works for navigation: every time the component mounts (whether
 * on initial page load or remount after navigating away and back), the
 * useEffect runs and re-reads sessionStorage. The storage was written
 * during the previous mount's lifetime, so the new mount picks it up.
 */
function useSessionChat() {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  // `loaded` flips to true once we've completed the storage read.
  // We use it to gate the persistence writes -- otherwise the first
  // `setTurns([])` from the initial render would overwrite the saved
  // data before we got a chance to read it.
  const [loaded, setLoaded] = useState(false);

  // Read sessionStorage on mount. Runs on every mount of the component,
  // including after client-side navigation back to this page.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTurns(parsed as ChatTurn[]);
        }
      }
    } catch {
      // Corrupt JSON or storage disabled -- start fresh
    }
    setLoaded(true);
  }, []);

  // Persist on every change, but only after the initial read has
  // completed. This prevents the empty-array initial state from
  // clobbering saved data.
  useEffect(() => {
    if (!loaded) return;
    try {
      window.sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(turns));
    } catch {
      // Storage full or disabled -- continue silently
    }
  }, [turns, loaded]);

  const clearTurns = useCallback(() => {
    setTurns([]);
    try {
      window.sessionStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { turns, setTurns, clearTurns, loaded };
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export function InsightsPageClient() {
  const { user } = useAuth();
  const askKb = useAskKb();
  const { data: stats } = useKbStats();

  const [question, setQuestion] = useState('');
  const { turns, setTurns, clearTurns, loaded } = useSessionChat();

  const role = user?.role?.name ?? 'business analyst';
  const hasKnowledge = (stats?.total_chunks ?? 0) > 0;

  const submit = async (text: string) => {
    const q = text.trim();
    if (!q || askKb.isPending) return;

    const turnId = crypto.randomUUID();
    setTurns((prev) => [...prev, { id: turnId, question: q, timestamp: Date.now() }]);
    setQuestion('');

    try {
      const answer = await askKb.mutateAsync({ question: q, role });
      setTurns((prev) => prev.map((t) => (t.id === turnId ? { ...t, answer } : t)));
    } catch (err) {
      setTurns((prev) =>
        prev.map((t) =>
          t.id === turnId
            ? {
                ...t,
                error: err instanceof Error ? err.message : 'Request failed',
              }
            : t,
        ),
      );
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit(question);
  };

  const onClear = () => {
    if (turns.length === 0) return;
    const ok = window.confirm(
      'Clear the entire chat history for this session? This cannot be undone.',
    );
    if (ok) clearTurns();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="AI Strategic Insights"
        description="Ask any business question — answers come from your uploaded data."
      />

      {/* Knowledge base status bar */}
      <div className="glass-card rounded-xl p-4 border border-border flex items-center gap-4 text-sm">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Database className="w-4 h-4" />
        </div>
        {hasKnowledge ? (
          <div className="flex-1 flex flex-wrap gap-x-6 gap-y-1 text-muted-foreground">
            <span>
              <strong className="text-foreground">{stats?.total_chunks ?? 0}</strong> chunks indexed
            </span>
            <span>
              <strong className="text-foreground">{stats?.sources.length ?? 0}</strong> sources
            </span>
            <span>
              <strong className="text-foreground">{stats?.categories.length ?? 0}</strong>{' '}
              categories
            </span>
          </div>
        ) : (
          <p className="flex-1 text-muted-foreground">
            No data indexed yet. Upload a file on the{' '}
            <a href="/datasets" className="text-primary underline">
              Datasets
            </a>{' '}
            page first.
          </p>
        )}

        {/* Clear chat — only visible when there's something to clear.
                    Gated on `loaded` to avoid hydration mismatch: server
                    renders without this button, client must too until the
                    storage read completes. */}
        {loaded && turns.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-danger/50 hover:bg-danger/5 transition"
            title="Clear chat history for this session"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear chat
          </button>
        )}
      </div>

      {/* Chat transcript */}
      <div className="glass-card rounded-2xl border border-border p-6 min-h-[400px] space-y-6">
        {!loaded ? (
          // Brief blank state during the initial storage read.
          // Avoids flashing the empty-state chips before saved
          // chat content appears.
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : turns.length === 0 ? (
          <EmptyState onPick={submit} disabled={!hasKnowledge} />
        ) : (
          turns.map((turn) => <ChatBubble key={turn.id} turn={turn} />)
        )}

        {askKb.isPending && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Thinking through your data…
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={onSubmit}
        className="glass-card rounded-2xl border border-border p-3 flex items-center gap-2 sticky bottom-4"
      >
        <BrainCircuit className="w-5 h-5 text-primary ml-2 shrink-0" />
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={
            hasKnowledge
              ? 'Ask anything about your business data…'
              : 'Upload data first, then ask a question'
          }
          disabled={!hasKnowledge || askKb.isPending}
          className="flex-1 bg-transparent border-0 outline-none text-sm px-2 py-2 disabled:opacity-50"
          aria-label="Ask a question"
        />
        <button
          type="submit"
          disabled={!question.trim() || !hasKnowledge || askKb.isPending}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Ask
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function EmptyState({ onPick, disabled }: { onPick: (q: string) => void; disabled: boolean }) {
  return (
    <div className="text-center py-10">
      <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
        <Sparkles className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg">Ask OptimaAi anything</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
        Your question will be answered using only the data you&apos;ve uploaded — no hallucinations,
        every claim cites a source.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mt-8">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => onPick(q)}
            className="text-left text-sm p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ turn }: { turn: ChatTurn }) {
  return (
    <div className="space-y-3">
      {/* User question — right-aligned, primary color bubble */}
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm leading-relaxed">
          {turn.question}
        </div>
      </div>

      {/* Answer — left-aligned, status-aware styling */}
      {turn.error ? (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            <span className="font-medium">⚠ Error: </span>
            {turn.error}
          </div>
        </div>
      ) : turn.answer ? (
        <AnswerCard answer={turn.answer} />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AnswerCard — status-aware                                            */
/* ------------------------------------------------------------------ */

function AnswerCard({ answer }: { answer: RagAnswer }) {
  // No-context: dashed border, muted styling
  if (answer.status === 'no_context') {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          {answer.answer}
        </div>
      </div>
    );
  }

  // General knowledge / casual: amber-tinted bubble, no sources panel
  if (answer.status === 'general_knowledge') {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-foreground">
          <MarkdownContent variant="compact">{answer.answer}</MarkdownContent>
        </div>
      </div>
    );
  }

  // Success: full bubble with sources panel
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-muted/40 px-4 py-3 text-sm text-foreground space-y-2">
        <MarkdownContent variant="compact">{answer.answer}</MarkdownContent>

        {answer.sources && answer.sources.length > 0 && (
          <div className="pt-3 mt-2 border-t border-border flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 mr-1">
              <FileText className="w-3 h-3" />
              Sources:
            </span>
            {Array.from(new Set(answer.sources)).map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-background border border-border">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
