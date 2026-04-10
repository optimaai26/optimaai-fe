import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types';
import { apiClient } from '@/lib/api/api-client';

export function useUsers() {
    return useQuery<{ data: User[] }>({
        queryKey: ['users'],
        queryFn: () => apiClient.get<{ data: User[] }>('/users'),
    });
}
