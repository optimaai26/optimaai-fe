import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { ApiResponse, Role } from '@/types';

export function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: () => apiClient.get<ApiResponse<Role[]>>('/roles'),
    });
}
