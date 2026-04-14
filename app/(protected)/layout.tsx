"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils/cn";

/**
 * Protected layout – Wraps all authenticated routes.
 * Provides Sidebar (desktop) + Topbar + main content area.
 */
export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);

	return (
		<div className="min-h-screen">
			<Sidebar />
			<div
				className={cn(
					"transition-all duration-300 ease-in-out",
					"lg:ml-[var(--sidebar-width)]",
					sidebarCollapsed && "lg:ml-[var(--sidebar-collapsed-width)]",
				)}
			>
				<Topbar />
				<main className="p-4 md:p-6 lg:p-8 max-w-[1600px]">{children}</main>
			</div>
		</div>
	);
}
