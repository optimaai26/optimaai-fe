import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { ApiResponse, PaginatedResponse, Dataset } from '@/types';

const QUERY_KEY = ['datasets'] as const;

export function useDatasets(page = 1, pageSize = 20) {
    return useQuery({
        queryKey: [...QUERY_KEY, { page, pageSize }],
        queryFn: () => apiClient.get<PaginatedResponse<Dataset>>(`/datasets?page=${page}&pageSize=${pageSize}`),
    });
}

export function useDataset(id: string) {
    return useQuery({
        queryKey: [...QUERY_KEY, id],
        queryFn: () => apiClient.get<ApiResponse<Dataset>>(`/datasets/${id}`),
        enabled: !!id,
    });
}

export function useCreateDataset() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Partial<Dataset>) => apiClient.post<ApiResponse<Dataset>>('/datasets', payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
}

export function useDeleteDataset() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiClient.delete(`/datasets/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
}

export function useUpdateDataset() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: { id: string; name?: string; description?: string; status?: Dataset['status'] }) =>
            apiClient.patch<ApiResponse<Dataset>>(`/datasets/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}
