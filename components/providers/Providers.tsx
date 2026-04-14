"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/Toast";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { QueryClientProvider } from "@/lib/api/query-client";

function MswProvider({ children }: { children: ReactNode }) {
	// MSW is opt-in via NEXT_PUBLIC_ENABLE_MSW=true.
	// Leave unset (or set to 'false') to hit the real backend instead.
	const isMockEnabled = process.env.NEXT_PUBLIC_ENABLE_MSW === "true";
	const [ready, setReady] = useState(!isMockEnabled);

	useEffect(() => {
		if (!isMockEnabled) {
			return;
		}

		let active = true;

		async function initMsw() {
			const { worker } = await import("@/mocks/browser");
			await worker.start({
				onUnhandledRequest: "bypass",
				serviceWorker: {
					url: "/mockServiceWorker.js",
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
	}, [isMockEnabled]);

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
					<AuthProvider>
						{children}
						<Toaster />
					</AuthProvider>
				</MswProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
