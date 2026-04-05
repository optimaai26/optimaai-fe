import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { ApiResponse, User } from '@/types';

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => apiClient.get<ApiResponse<User[]>>('/users'),
    });
}
