import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type {
  OdooConnectionInfo,
  OdooModel,
  OdooPreviewResponse,
  OdooStatus,
  OdooSyncRecord,
  OdooSyncRequest,
  OdooSyncResult,
} from '@/types/odoo';

/* ==========================================
 * Odoo Integration Hooks
 * TanStack Query wrappers for /api/v1/odoo/*
 * ========================================== */

const QUERY_KEY = ['odoo'] as const;

/** Fetch lightweight Odoo configuration + last-sync timestamp. */
export function useOdooStatus() {
  return useQuery<OdooStatus>({
    queryKey: [...QUERY_KEY, 'status'],
    queryFn: () => apiClient.get<OdooStatus>('/odoo/status'),
    // Status changes only when the user runs a sync, so a 30s stale
    // window is plenty and keeps the page snappy.
    staleTime: 30_000,
  });
}

/** List previous Odoo-sourced uploads for the current user. */
export function useOdooSyncs(limit = 50) {
  return useQuery<{ data: OdooSyncRecord[] }>({
    queryKey: [...QUERY_KEY, 'syncs', limit],
    queryFn: () => apiClient.get<{ data: OdooSyncRecord[] }>(`/odoo/syncs?limit=${limit}`),
  });
}

/** Live ping against Odoo (auth + record counts). */
export function useTestOdooConnection() {
  return useMutation<OdooConnectionInfo>({
    mutationFn: () => apiClient.post<OdooConnectionInfo>('/odoo/test-connection'),
  });
}

/** Trigger a sync (extract + preprocess + persist). */
export function useOdooSync() {
  const queryClient = useQueryClient();
  return useMutation<OdooSyncResult, Error, OdooSyncRequest>({
    mutationFn: (body) =>
      apiClient.post<OdooSyncResult>('/odoo/sync', body as Record<string, unknown>),
    onSuccess: () => {
      // A successful sync changes status (last_sync_at, sync_count),
      // adds a row to /odoo/syncs, and adds an `uploads` row that the
      // Datasets page lists. Invalidate all three.
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });
}

/** Preview a small sample of records from a chosen Odoo model. */
export function useOdooPreview(model: OdooModel, limit: number, enabled: boolean) {
  return useQuery<OdooPreviewResponse>({
    queryKey: [...QUERY_KEY, 'preview', model, limit],
    queryFn: () =>
      apiClient.get<OdooPreviewResponse>(`/odoo/preview?model=${model}&limit=${limit}`),
    enabled,
  });
}
