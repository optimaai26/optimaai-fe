"use client";

import {
	Activity,
	DollarSign,
	Loader2,
	Lock,
	TrendingUp,
	Users,
} from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { KpiCard } from "@/components/data-display/KpiCard";
import { SmartChart } from "@/components/data-display/SmartChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { RequestAccessModal } from "@/features/access-requests/RequestAccessModal";
import { useAuth } from "@/features/auth/AuthProvider";
import { useDashboard } from "@/features/dashboard/useDashboard";
import { useRbac } from "@/hooks/useRbac";
import { useUiStore } from "@/lib/stores/ui-store";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
	DollarSign,
	Users,
	Activity,
	TrendingUp,
};

export function DashboardPageClient() {
	const { data, isLoading, isError } = useDashboard();
	const { user } = useAuth();
	const { hasPermission } = useRbac();
	const { viewScope } = useUiStore();
	const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

	if (isLoading)
		return (
			<div className="min-h-[40vh] flex items-center justify-center">
				<Loader2 className="w-6 h-6 animate-spin" />
			</div>
		);
	if (isError || !data)
		return (
			<div className="text-sm text-danger">Failed to load dashboard data.</div>
		);

	const isDepartmentScope = viewScope === "department";
	const isLocked = isDepartmentScope && !hasPermission("view:department");

	if (isLocked) {
		return (
			<div className="animate-fade-in">
				<PageHeader
					title="Dashboard"
					description="Overview of your key business metrics and AI insights."
				/>
				<div className="glass-card rounded-xl p-10 flex flex-col items-center justify-center text-center border-dashed mt-8 min-h-[400px]">
					<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
						<Lock className="w-8 h-8 text-muted-foreground" />
					</div>
					<h2 className="text-xl font-semibold mb-2">Restricted Access</h2>
					<p className="text-muted-foreground max-w-md mx-auto mb-8">
						You do not have the required permissions to view department-level
						aggregated insights. Please request elevated access from your
						organization administrator.
					</p>
					<button
						onClick={() => setIsRequestModalOpen(true)}
						className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm"
					>
						Request Access
					</button>
				</div>
				<RequestAccessModal
					isOpen={isRequestModalOpen}
					onClose={() => setIsRequestModalOpen(false)}
				/>
			</div>
		);
	}

	return (
		<div className="animate-fade-in">
			<PageHeader
				title="Dashboard"
				description="Overview of your key business metrics and AI insights."
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{(data.data?.kpis ?? []).map((kpi) => (
					<KpiCard
						key={kpi.id}
						title={kpi.title}
						value={kpi.value}
						changePercent={kpi.changePercent}
						trend={kpi.trend}
						icon={kpi.icon ? iconMap[kpi.icon] : undefined}
					/>
				))}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{(data.data?.charts ?? []).map((chartConfig, i) => (
					<SmartChart key={`chart-${i}`} config={chartConfig} />
				))}
			</div>
			<div className="glass-card rounded-xl p-6">
				<h3 className="font-semibold mb-4">Recent Activity</h3>
				<div className="space-y-3">
					{(data.data?.recentActivity ?? []).map((item) => (
						<div key={item.id} className="flex items-center gap-3 py-2">
							<div className={`w-2 h-2 rounded-full ${item.color}`} />
							<span className="text-sm">{item.action}</span>
							<span className="text-xs text-muted-foreground ml-auto">
								{item.time}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
