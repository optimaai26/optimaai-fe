'use client';

import { QueryClientProvider } from '@/lib/api/query-client';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/features/auth/AuthProvider';
import type { ReactNode } from 'react';

/**
 * Providers – Single client-side wrapper for all context providers.
 * Keeps the root layout clean by isolating "use client" boundaries here.
 */
export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryClientProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
