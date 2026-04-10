import { useQuery } from '@tanstack/react-query';
import type { Role } from '@/types';
import { apiClient } from '@/lib/api/api-client';

export function useRoles() {
    return useQuery<{ data: Role[] }>({
        queryKey: ['roles'],
        queryFn: () => apiClient.get<{ data: Role[] }>('/roles'),
    });
}
