"use client";

import {
	BarChart2,
	Command,
	Database,
	FileText,
	Search,
	X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";

export function GlobalSearch() {
	const { isOpen, setIsOpen, query, setQuery, toggle } = useGlobalSearch();
	const inputRef = useRef<HTMLInputElement>(null);

	// Handle Ctrl+K / Cmd+K
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				toggle();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [toggle]);

	// Focus input on open
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [isOpen]);

	// Mock search results
	const results = [
		{
			id: "1",
			type: "dataset",
			title: "Customer Churn - Q1",
			href: "/datasets/dataset-1",
			icon: Database,
		},
		{
			id: "2",
			type: "report",
			title: "Q1 Executive Retention Report",
			href: "/reports/report-1",
			icon: FileText,
		},
		{
			id: "3",
			type: "prediction",
			title: "Revenue Forecast",
			href: "/predictions",
			icon: BarChart2,
		},
		{
			id: "4",
			type: "canvas",
			title: "Strategy Canvas",
			href: "/canvas",
			icon: Command,
		},
	].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			title=""
			className="sm:max-w-[600px] p-0 overflow-hidden"
		>
			<div className="flex items-center px-4 py-3 border-b border-border gap-3">
				<Search className="w-5 h-5 text-muted-foreground shrink-0" />
				<input
					ref={inputRef}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search datasets, reports, predictions..."
					className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
				/>
				<button
					type="button"
					onClick={() => setIsOpen(false)}
					className="shrink-0 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
				>
					<X className="w-4 h-4" />
				</button>
			</div>

			<div className="max-h-[60vh] overflow-y-auto p-2">
				{results.length > 0 ? (
					<div className="flex flex-col gap-1">
						{results.map((result) => {
							const Icon = result.icon;
							return (
								<Link
									key={result.id}
									href={result.href}
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm"
								>
									<div className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center">
										<Icon className="w-4 h-4 text-muted-foreground" />
									</div>
									<div className="flex-1">
										<span className="font-medium text-foreground">
											{result.title}
										</span>
										<span className="block text-xs text-muted-foreground capitalize">
											{result.type}
										</span>
									</div>
								</Link>
							);
						})}
					</div>
				) : (
					<div className="py-12 text-center text-sm text-muted-foreground">
						No results found for &quot;{query}&quot;
					</div>
				)}
			</div>
		</Modal>
	);
}
