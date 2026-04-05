import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { ApiResponse, Insight } from '@/types';

export function useInsights() {
    return useQuery({
        queryKey: ['insights'],
        queryFn: () => apiClient.get<ApiResponse<Insight[]>>('/insights'),
    });
}
