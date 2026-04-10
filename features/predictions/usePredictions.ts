import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Prediction } from '@/types';
import { apiClient } from '@/lib/api/api-client';

export function usePredictions() {
    return useQuery<{ data: Prediction[] }>({
        queryKey: ['predictions'],
        queryFn: () => apiClient.get<{ data: Prediction[] }>('/predictions'),
    });
}

export function useCreatePrediction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Partial<Prediction>) =>
            apiClient.post<{ data: Prediction }>('/predictions', payload as Record<string, unknown>),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['predictions'] });
        },
    });
}
