'use client';

import { QueryClientProvider } from '@/lib/api/query-client';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { useEffect, useState, type ReactNode } from 'react';

function MswProvider({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(process.env.NODE_ENV !== 'development');

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        let active = true;

        async function initMsw() {
            const { worker } = await import('@/mocks/browser');
            await worker.start({
                onUnhandledRequest: 'bypass',
                serviceWorker: {
                    url: '/mockServiceWorker.js',
                },
            });

            if (active) {
                setReady(true);
            }
        }

        initMsw().catch(() => {
            if (active) {
                setReady(true);
            }
        });

        return () => {
            active = false;
        };
    }, []);

    if (!ready) {
        return null;
    }

    return <>{children}</>;
}

/**
 * Providers - Single client-side wrapper for all context providers.
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
                <MswProvider>
                    <AuthProvider>{children}</AuthProvider>
                </MswProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
