"use client";

import { Sparkles } from "lucide-react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { ChartConfig } from "@/types";

interface SmartChartProps {
	config: ChartConfig;
}

export function SmartChart({ config }: SmartChartProps) {
	const {
		title,
		type,
		data,
		xAxis,
		yAxis,
		colors = ["var(--primary)"],
		aiRecommended,
	} = config;

	// Safely assume first color maps to the Y-axis if not explicitly handled
	const mainColor = colors[0] || "var(--primary)";

	const renderChart = () => {
		switch (type) {
			case "bar":
				return (
					<BarChart
						data={data}
						margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							opacity={0.1}
							vertical={false}
						/>
						{xAxis && (
							<XAxis
								dataKey={xAxis}
								axisLine={false}
								tickLine={false}
								tick={{ fill: "currentColor", opacity: 0.5 }}
								dy={10}
							/>
						)}
						{yAxis && (
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: "currentColor", opacity: 0.5 }}
								dx={-10}
								tickFormatter={(val) =>
									typeof val === "number" && val >= 1000
										? `$${val / 1000}k`
										: val
								}
							/>
						)}
						<Tooltip
							contentStyle={{
								backgroundColor: "var(--background)",
								borderColor: "var(--border)",
								borderRadius: "8px",
							}}
							itemStyle={{ color: "var(--foreground)" }}
							cursor={{ fill: "currentColor", opacity: 0.05 }}
						/>
						{yAxis && (
							<Bar dataKey={yAxis} fill={mainColor} radius={[4, 4, 0, 0]} />
						)}
					</BarChart>
				);
			case "area":
				return (
					<AreaChart
						data={data}
						margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
					>
						<defs>
							<linearGradient id={`color-${yAxis}`} x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={mainColor} stopOpacity={0.3} />
								<stop offset="95%" stopColor={mainColor} stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							opacity={0.1}
							vertical={false}
						/>
						{xAxis && (
							<XAxis
								dataKey={xAxis}
								axisLine={false}
								tickLine={false}
								tick={{ fill: "currentColor", opacity: 0.5 }}
								dy={10}
							/>
						)}
						{yAxis && (
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: "currentColor", opacity: 0.5 }}
								dx={-10}
								tickFormatter={(val) =>
									typeof val === "number" && val >= 1000
										? `$${val / 1000}k`
										: val
								}
							/>
						)}
						<Tooltip
							contentStyle={{
								backgroundColor: "var(--background)",
								borderColor: "var(--border)",
								borderRadius: "8px",
							}}
							itemStyle={{ color: "var(--foreground)" }}
						/>
						{yAxis && (
							<Area
								type="monotone"
								dataKey={yAxis}
								stroke={mainColor}
								fillOpacity={1}
								fill={`url(#color-${yAxis})`}
								strokeWidth={3}
							/>
						)}
					</AreaChart>
				);
			default:
				return (
					<LineChart
						data={data}
						margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							opacity={0.1}
							vertical={false}
						/>
						{xAxis && (
							<XAxis
								dataKey={xAxis}
								axisLine={false}
								tickLine={false}
								tick={{ fill: "currentColor", opacity: 0.5 }}
								dy={10}
							/>
						)}
						{yAxis && (
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: "currentColor", opacity: 0.5 }}
								dx={-10}
								tickFormatter={(val) =>
									typeof val === "number" && val >= 1000
										? `$${val / 1000}k`
										: val
								}
							/>
						)}
						<Tooltip
							contentStyle={{
								backgroundColor: "var(--background)",
								borderColor: "var(--border)",
								borderRadius: "8px",
							}}
							itemStyle={{ color: "var(--foreground)" }}
						/>
						{yAxis && (
							<Line
								type="monotone"
								dataKey={yAxis}
								stroke={mainColor}
								strokeWidth={3}
								dot={{ r: 4, fill: mainColor, strokeWidth: 2 }}
								activeDot={{ r: 6 }}
							/>
						)}
					</LineChart>
				);
		}
	};

	return (
		<div className="glass-card rounded-xl p-6">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<h3 className="font-semibold">{title}</h3>
					{aiRecommended && (
						<div
							className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full"
							title="Backend AI deemed this chart type optimal for representing this data"
						>
							<Sparkles className="w-3 h-3" />
							AI Recommended
						</div>
					)}
				</div>
				<div className="flex bg-muted/50 rounded-lg p-1 border border-border">
					{/* Visual indicator of what the backend rendered */}
					<div className="px-2 py-1 text-xs font-medium text-foreground bg-[var(--background)] shadow-sm rounded-md capitalize">
						{type} Chart
					</div>
				</div>
			</div>
			<div className="h-64 w-full text-sm">
				<ResponsiveContainer width="100%" height="100%">
					{renderChart()}
				</ResponsiveContainer>
			</div>
		</div>
	);
}
