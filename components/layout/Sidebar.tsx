"use client";

import {
	Building2,
	ChevronLeft,
	Globe,
	Settings,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	ADMIN_NAV_ITEMS,
	NAV_SECTIONS,
	type NavItem,
} from "@/constants/navigation";
import { useRbac } from "@/hooks/useRbac";
import { useUiStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils/cn";

/* ==========================================
 * Sidebar Component
 * Desktop: fixed left panel, collapsible
 * Mobile: handled via Sheet in the Topbar
 * ========================================== */

function SidebarLink({
	item,
	collapsed,
}: {
	item: NavItem;
	collapsed: boolean;
}) {
	const pathname = usePathname();
	const isActive =
		pathname === item.href || pathname.startsWith(`${item.href}/`);

	return (
		<Link
			href={item.href}
			className={cn(
				"group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
				collapsed && "justify-center px-2",
				isActive
					? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300"
					: "text-muted-foreground hover:bg-muted hover:text-foreground",
			)}
			title={collapsed ? item.title : undefined}
		>
			<item.icon
				className={cn(
					"w-5 h-5 shrink-0 transition-colors",
					isActive
						? "text-primary-500"
						: "text-muted-foreground group-hover:text-foreground",
				)}
			/>
			{!collapsed && <span className="truncate">{item.title}</span>}
			{!collapsed && item.badge && (
				<span className="ml-auto text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 px-2 py-0.5 rounded-full">
					{item.badge}
				</span>
			)}
		</Link>
	);
}

export function Sidebar() {
	const { sidebarCollapsed, toggleSidebar, viewScope, setViewScope } =
		useUiStore();
	return (
		<aside
			className={cn(
				"hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r transition-all duration-300 ease-in-out",
				"bg-[var(--sidebar-bg)] border-[var(--sidebar-border)]",
				sidebarCollapsed
					? "w-[var(--sidebar-collapsed-width)]"
					: "w-[var(--sidebar-width)]",
			)}
		>
			{/* Logo + Collapse Toggle */}
			<div className="flex items-center justify-between h-20 px-4 border-b border-[var(--sidebar-border)]">
				{!sidebarCollapsed && (
					<Link href="/dashboard" className="flex items-center gap-2">
						<img src="/assets/logos/c3.svg" alt="OptimaAI Logo" className="h-12 w-auto" />
					</Link>
				)}
				{sidebarCollapsed && (
					<div className="mx-auto flex justify-center">
						<img src="/assets/logos/c4.svg" alt="Optima AI Icon" className="h-10 w-10 object-contain" />
					</div>
				)}
				<button
					type="button"
					onClick={toggleSidebar}
					className={cn(
						"p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
						sidebarCollapsed &&
							"absolute -right-3 top-5 bg-background border border-border shadow-sm",
					)}
					aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					suppressHydrationWarning
				>
					<ChevronLeft
						className={cn(
							"w-4 h-4 transition-transform",
							sidebarCollapsed && "rotate-180",
						)}
					/>
				</button>
			</div>



			{/* Navigation Sections */}
			<nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
				{NAV_SECTIONS.map((section) => (
					<div key={section.label}>
						{!sidebarCollapsed && (
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
								{section.label}
							</p>
						)}
						<div className="space-y-1">
							{section.items.map((item) => (
								<SidebarLink
									key={item.href}
									item={item}
									collapsed={sidebarCollapsed}
								/>
							))}
						</div>
					</div>
				))}


			</nav>

			{/* Settings Footer */}
			<div className="border-t border-[var(--sidebar-border)] p-3">
				<SidebarLink
					item={{ title: "Settings", href: "/settings", icon: Settings }}
					collapsed={sidebarCollapsed}
				/>
			</div>
		</aside>
	);
}
