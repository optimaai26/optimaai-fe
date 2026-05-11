import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { MappingSuggestion, ModelKind, PredictionResult, SavedMapping } from '@/types';

/** One row from an aggregate table (customer or monthly) */
export interface AggregateRow {
  label: string;
  features: Record<string, string | number | boolean | null>;
}

export interface AggregateRowsResponse {
  upload_id: number;
  model_kind: ModelKind;
  table: string | null;
  rows: AggregateRow[];
}

// ── Batch result types ─────────────────────────────────────

export interface MonthlyPoint {
  month: string;
  predicted_revenue?: number;
  actual_revenue?: number;
}

export interface BatchRevenueSummary {
  n_rows: number;
  errors: number;
  total_predicted: number;
  avg_row_predicted: number;
  monthly_actual: MonthlyPoint[];
  forward_forecast: Array<{ month: string; predicted_revenue: number }>;
  forecast_note: string | null;
  unit: string;
}

export interface BatchChurnRow {
  customer_id: string;
  churn_probability: number;
  risk_level: 'low' | 'medium' | 'high';
}

export interface BatchChurnSummary {
  n_customers: number;
  errors: number;
  risk_counts: { high: number; medium: number; low: number };
  rows: BatchChurnRow[];
}

export interface BatchGrowthSummary {
  n_months_actual: number;
  n_months_forecast: number;
  actual: Array<{ month: string; actual_revenue: number }>;
  forecast: Array<{ month: string; predicted_revenue: number }>;
  unit: string;
}

export interface BatchResult<T> {
  prediction_id: number;
  model_kind: ModelKind;
  summary: T;
  created_at: string;
}

// ══════════════════════════════════════════════════════
//  Single-row hooks (kept for backwards compat)
// ══════════════════════════════════════════════════════

export function useSuggestMapping(uploadId: number | null, modelKind: ModelKind) {
  return useQuery({
    queryKey: ['mapping', 'suggest', uploadId, modelKind],
    queryFn: async () => {
      if (uploadId === null) throw new Error('No upload selected');
      return apiClient.post<MappingSuggestion>(
        `/mapping/suggest/${uploadId}?model_kind=${modelKind}`,
        {},
      );
    },
    enabled: uploadId !== null,
  });
}

export function useSuggestAllMappings(uploadId: number | null) {
  return useQueries({
    queries: (['revenue', 'churn', 'growth'] as ModelKind[]).map((kind) => ({
      queryKey: ['mapping', 'suggest', uploadId, kind],
      queryFn: async () => {
        if (uploadId === null) throw new Error('No upload selected');
        return apiClient.post<MappingSuggestion>(
          `/mapping/suggest/${uploadId}?model_kind=${kind}`,
          {},
        );
      },
      enabled: uploadId !== null,
    })),
    combine: (results) => {
      const allDone = results.every((r) => !r.isLoading && !r.isFetching);
      const anyError = results.some((r) => r.isError);
      const allHaveData = results.every((r) => r.data !== undefined);
      return {
        isLoading: !allDone,
        isError: anyError,
        data:
          allDone && !anyError && allHaveData
            ? (results.map((r) => r.data) as MappingSuggestion[])
            : null,
      };
    },
  });
}

export function useAggregateRows(uploadId: number | null, modelKind: ModelKind | null) {
  return useQuery({
    queryKey: ['mapping', 'aggregate-rows', uploadId, modelKind],
    queryFn: () => {
      if (uploadId === null || !modelKind) {
        throw new Error('Upload ID and model kind required');
      }
      return apiClient.get<AggregateRowsResponse>(
        `/mapping/aggregate-rows/${uploadId}/${modelKind}`,
      );
    },
    enabled:
      uploadId !== null && modelKind !== null && (modelKind === 'churn' || modelKind === 'growth'),
  });
}

export function useSaveMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      upload_id: number;
      model_kind: ModelKind;
      mapping: Record<string, string | null>;
    }) => apiClient.post<SavedMapping>('/mapping/save', payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ['mapping', 'saved', vars.upload_id, vars.model_kind],
      });
    },
  });
}

export function useRunPrediction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      upload_id: number;
      model_kind: ModelKind;
      user_features: Record<string, unknown>;
    }) => apiClient.post<PredictionResult>('/mapping/predict', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    },
  });
}

// ══════════════════════════════════════════════════════
//  Batch hooks
// ══════════════════════════════════════════════════════

export function useBatchRevenue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uploadId: number) =>
      apiClient.post<BatchResult<BatchRevenueSummary>>(
        `/mapping/predict-batch/revenue/${uploadId}`,
        {},
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    },
  });
}

export function useBatchChurn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uploadId: number) =>
      apiClient.post<BatchResult<BatchChurnSummary>>(
        `/mapping/predict-batch/churn/${uploadId}`,
        {},
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    },
  });
}

export function useBatchGrowth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uploadId: number) =>
      apiClient.post<BatchResult<BatchGrowthSummary>>(
        `/mapping/predict-batch/growth/${uploadId}`,
        {},
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    },
  });
}
