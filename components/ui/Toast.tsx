"use client";

import { AlertCircle, CheckCircle2, Info, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "loading";

interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
}

interface ToastStore {
	toasts: Toast[];
	toast: (props: Omit<Toast, "id">) => void;
	dismiss: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
	toasts: [],
	toast: (props) => {
		const id = Math.random().toString(36).slice(2, 9);
		set((state) => ({ toasts: [...state.toasts, { id, ...props }] }));

		// Auto dismiss if not loading
		if (props.type !== "loading") {
			const duration = props.duration || 5000;
			setTimeout(() => {
				set((state) => ({
					toasts: state.toasts.filter((t) => t.id !== id),
				}));
			}, duration);
		}
	},
	dismiss: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((t) => t.id !== id),
		})),
}));

export function Toaster() {
	const { toasts, dismiss } = useToast();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
			{toasts.map((t) => (
				<div
					key={t.id}
					className={cn(
						"pointer-events-auto flex items-start gap-4 p-4 rounded-xl shadow-xl border bg-card animate-fade-in",
						t.type === "success" && "border-success/30 bg-success/5",
						t.type === "error" && "border-danger/30 bg-danger/5",
						t.type === "info" && "border-info/30 bg-info/5",
						t.type === "loading" && "border-border",
					)}
				>
					<div className="shrink-0 mt-0.5">
						{t.type === "success" && (
							<CheckCircle2 className="w-5 h-5 text-success" />
						)}
						{t.type === "error" && (
							<AlertCircle className="w-5 h-5 text-danger" />
						)}
						{t.type === "info" && <Info className="w-5 h-5 text-info" />}
						{t.type === "loading" && (
							<Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
						)}
					</div>
					<div className="flex-1 min-w-0">
						<p
							className={cn(
								"text-sm font-semibold",
								t.type === "success" &&
									"text-success-800 dark:text-success-200",
								t.type === "error" && "text-danger-800 dark:text-danger-200",
								t.type === "info" && "text-info-800 dark:text-info-200",
							)}
						>
							{t.title}
						</p>
						{t.message && (
							<p className="text-sm text-muted-foreground mt-1 leading-snug">
								{t.message}
							</p>
						)}
					</div>
					<button
						type="button"
						onClick={() => dismiss(t.id)}
						className="shrink-0 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
					>
						<X className="w-4 h-4 text-muted-foreground" />
					</button>
				</div>
			))}
		</div>
	);
}
