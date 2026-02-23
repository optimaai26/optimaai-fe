'use client';

import { QueryClient, QueryClientProvider as TanStackProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

/** Default TanStack Query configuration */
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                gcTime: 5 * 60 * 1000, // 5 minutes
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always create a new client
        return makeQueryClient();
    }
    // Browser: reuse the same client
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}

interface QueryClientProviderProps {
    children: ReactNode;
}

export function QueryClientProvider({ children }: QueryClientProviderProps) {
    const [queryClient] = useState(() => getQueryClient());

    return (
        <TanStackProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
    );
}
