import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils/cn";

interface KpiCardProps {
	title: string;
	value: string | number;
	changePercent?: number;
	trend: "up" | "down" | "neutral";
	icon?: ComponentType<{ className?: string }>;
	className?: string;
}

/**
 * KpiCard – Glassmorphism metric card with trend indicator.
 */
export function KpiCard({
	title,
	value,
	changePercent,
	trend,
	icon: Icon,
	className,
}: KpiCardProps) {
	const trendConfig = {
		up: {
			icon: TrendingUp,
			color: "text-success",
			bg: "bg-success/10",
			label: "increase",
		},
		down: {
			icon: TrendingDown,
			color: "text-danger",
			bg: "bg-danger/10",
			label: "decrease",
		},
		neutral: {
			icon: Minus,
			color: "text-muted-foreground",
			bg: "bg-muted",
			label: "no change",
		},
	};

	const { icon: TrendIcon, color, bg } = trendConfig[trend];

	return (
		<div
			className={cn(
				"glass-card rounded-xl p-5 group hover:border-primary-400/20 transition-all duration-300",
				className,
			)}
		>
			<div className="flex items-start justify-between mb-3">
				<p className="text-sm font-medium text-muted-foreground">{title}</p>
				{Icon && (
					<div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
						<Icon className="w-5 h-5 text-primary-400" />
					</div>
				)}
			</div>

			<p className="text-2xl font-bold tracking-tight mb-2">{value}</p>

			{changePercent !== undefined && (
				<div className="flex items-center gap-1.5">
					<span
						className={cn(
							"inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-xs font-medium",
							bg,
							color,
						)}
					>
						<TrendIcon className="w-3 h-3" />
						{Math.abs(changePercent)}%
					</span>
					<span className="text-xs text-muted-foreground">vs last month</span>
				</div>
			)}
		</div>
	);
}
