import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { Dataset, PaginatedResponse, ApiResponse } from '@/types';

/* ==========================================
 * Dataset Query Hooks
 * TanStack Query wrappers for datasets CRUD
 * ========================================== */

const QUERY_KEY = ['datasets'] as const;

/** Fetch paginated datasets list */
export function useDatasets(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...QUERY_KEY, { page, pageSize }],
        queryFn: () =>
            apiClient.get<PaginatedResponse<Dataset>>(`/datasets?page=${page}&pageSize=${pageSize}`),
    });
}

/** Fetch single dataset by ID */
export function useDataset(id: string) {
    return useQuery({
        queryKey: [...QUERY_KEY, id],
        queryFn: () => apiClient.get<ApiResponse<Dataset>>(`/datasets/${id}`),
        enabled: !!id,
    });
}

/** Delete a dataset */
export function useDeleteDataset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/datasets/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}

/** Update dataset metadata */
export function useUpdateDataset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...data }: { id: string; name?: string; description?: string }) =>
            apiClient.patch<ApiResponse<Dataset>>(`/datasets/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}

/** Create a dataset */
export function useCreateDataset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>) =>
            apiClient.post<ApiResponse<Dataset>>('/datasets', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}

