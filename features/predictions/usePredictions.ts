import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { ApiResponse, Prediction } from '@/types';

const QUERY_KEY = ['predictions'] as const;

export function usePredictions() {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => apiClient.get<ApiResponse<Prediction[]>>('/predictions'),
    });
}

export function usePrediction(id: string) {
    return useQuery({
        queryKey: [...QUERY_KEY, id],
        queryFn: () => apiClient.get<ApiResponse<Prediction>>(`/predictions/${id}`),
        enabled: !!id,
    });
}

export function useCreatePrediction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Partial<Prediction>) => apiClient.post<ApiResponse<Prediction>>('/predictions', payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
}
