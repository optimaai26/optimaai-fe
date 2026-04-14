"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Error boundary for protected routes.
 * Catches React errors and displays a friendly recovery UI.
 */
export default function ProtectedError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
			<div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mb-6">
				<AlertTriangle className="w-8 h-8 text-danger" />
			</div>

			<h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
			<p className="text-muted-foreground mb-6 max-w-md">
				An unexpected error occurred. Please try again or contact support if
				this persists.
			</p>

			{process.env.NODE_ENV === "development" && (
				<pre className="text-xs text-left bg-muted p-4 rounded-lg mb-6 max-w-lg overflow-auto">
					{error.message}
				</pre>
			)}

			<button type="button"
				onClick={reset}
				className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
			>
				<RefreshCw className="w-4 h-4" />
				Try Again
			</button>
		</div>
	);
}
