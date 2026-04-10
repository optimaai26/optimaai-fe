import { useQuery } from '@tanstack/react-query';
import type { Insight } from '@/types';
import { apiClient } from '@/lib/api/api-client';

export function useInsights() {
    return useQuery<{ data: Insight[] }>({
        queryKey: ['insights'],
        queryFn: () => apiClient.get<{ data: Insight[] }>('/insights'),
    });
}
