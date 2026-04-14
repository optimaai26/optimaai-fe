"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
}

export function Modal({
	isOpen,
	onClose,
	title,
	description,
	children,
	footer,
	className,
}: ModalProps) {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.body.style.overflow = "hidden";
			document.addEventListener("keydown", handleEscape);
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-0">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Dialog */}
			<div
				className={cn(
					"relative z-50 w-full max-w-lg overflow-hidden rounded-xl bg-card border border-border shadow-2xl animate-fade-in flex flex-col max-h-[90vh]",
					className,
				)}
				role="dialog"
				aria-modal="true"
			>
				<div className="flex items-center justify-between px-6 py-4 border-b border-border">
					<div>
						<h2 className="text-lg font-semibold">{title}</h2>
						{description && (
							<p className="text-sm text-muted-foreground mt-1">
								{description}
							</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="rounded-full p-2 hover:bg-muted transition-colors"
						aria-label="Close modal"
					>
						<X className="w-5 h-5 text-muted-foreground" />
					</button>
				</div>

				<div className="px-6 py-4 overflow-y-auto">{children}</div>

				{footer && (
					<div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-end gap-3">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}
