/**
 * features/knowledge-base/useKnowledgeBase.ts
 *
 * TanStack Query hooks that wrap the FastAPI /api/v1/kb/* endpoints
 * exposed by app/routes/kb_routes.py. Mirrors the pattern used in
 * features/datasets/useDatasets.ts so it plugs into the existing app.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface RagAnswer {
  status: 'success' | 'no_context' | 'general_knowledge' | 'failed';
  answer: string;
  sources: string[];
  chunks_used?: number;
  question: string;
  complete?: boolean;
}

export interface KbStats {
  total_chunks: number;
  sources: string[];
  categories: string[];
}

export interface IngestResult {
  status: string;
  chunks?: number;
  source?: string;
  category?: string;
  filename?: string;
}

export interface AskParams {
  question: string;
  category?: string;
  role?: string;
}

export interface IngestTextParams {
  text: string;
  source?: string;
  category?: string;
}

/* ------------------------------------------------------------------ */
/* Query keys                                                          */
/* ------------------------------------------------------------------ */

const KB_KEY = ['kb'] as const;
const STATS_KEY = [...KB_KEY, 'stats'] as const;

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

/** GET /kb/stats — chunk count, sources, categories */
export function useKbStats() {
  return useQuery<KbStats>({
    queryKey: STATS_KEY,
    queryFn: () => apiClient.get<KbStats>('/kb/stats'),
    staleTime: 30_000,
  });
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

/** POST /kb/ask — the core RAG question-answer call */
export function useAskKb() {
  return useMutation<RagAnswer, Error, AskParams>({
    mutationFn: ({ question, category, role = 'business analyst' }) =>
      apiClient.post<RagAnswer>('/kb/ask', {
        question,
        category,
        role,
      }),
  });
}

/** POST /kb/ingest/text — drop a raw note into the KB */
export function useIngestText() {
  const qc = useQueryClient();
  return useMutation<IngestResult, Error, IngestTextParams>({
    mutationFn: ({ text, source = 'manual_entry', category = 'general' }) =>
      apiClient.post<IngestResult>('/kb/ingest/text', {
        text,
        source,
        category,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STATS_KEY });
    },
  });
}

/** POST /kb/ingest/file — upload a CSV / XLSX / PDF / TXT directly to the KB */
export function useIngestFile() {
  const qc = useQueryClient();
  return useMutation<IngestResult, Error, { file: File; category?: string }>({
    mutationFn: ({ file, category = 'general' }) => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', category);
      // apiClient skips JSON Content-Type when body is FormData
      return apiClient.post<IngestResult>(
        `/kb/ingest/file?category=${encodeURIComponent(category)}`,
        fd as unknown as Record<string, unknown>,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STATS_KEY });
    },
  });
}

/** POST /kb/ingest/kpis — auto-ingest the latest ML evaluation snapshot */
export function useIngestKpis() {
  const qc = useQueryClient();
  return useMutation<IngestResult, Error, void>({
    mutationFn: () => apiClient.post<IngestResult>('/kb/ingest/kpis'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STATS_KEY });
    },
  });
}

/** DELETE /kb/source — remove all chunks from a single source */
export function useDeleteKbSource() {
  const qc = useQueryClient();
  return useMutation<{ status: string; deleted: number }, Error, string>({
    mutationFn: (source) =>
      apiClient.delete<{ status: string; deleted: number }>('/kb/source', {
        body: { source } as unknown as BodyInit,
      } as unknown as RequestInit),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STATS_KEY });
    },
  });
}

/** DELETE /kb/clear — wipe the entire KB (admin only) */
export function useClearKb() {
  const qc = useQueryClient();
  return useMutation<{ status: string }, Error, void>({
    mutationFn: () => apiClient.delete<{ status: string }>('/kb/clear'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STATS_KEY });
    },
  });
}
