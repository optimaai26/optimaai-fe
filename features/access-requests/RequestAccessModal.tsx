"use client";

import { Loader2, Lock, X } from "lucide-react";
import { useState } from "react";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { ROLE_LABELS } from "@/constants/permissions";

export interface RequestAccessModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function RequestAccessModal({
	isOpen,
	onClose,
}: RequestAccessModalProps) {
	const [role, setRole] = useState<"admin" | "manager" | "analyst">("analyst");
	const [justification, setJustification] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 800));
		setIsSubmitting(false);
		toast({
			title: "Request Submitted",
			message: "Your access request has been sent for administrator review.",
			type: "success",
		});
		onClose();
	};

	const roleOptions = [
		{ value: "analyst", label: ROLE_LABELS.analyst },
		{ value: "manager", label: ROLE_LABELS.manager },
		{ value: "admin", label: ROLE_LABELS.admin },
	];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
			<div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl ring-1 ring-white/10 w-full max-w-md overflow-hidden animate-slide-up">
				<div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
					<div className="flex items-center gap-2 text-foreground font-semibold">
						<Lock className="w-5 h-5 text-primary-500" />
						Request Elevated Access
					</div>
					<button
						onClick={onClose}
						className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					<div>
						<label className="block text-sm font-medium text-foreground mb-1">
							Requested Role
						</label>
						<Select
							value={role}
							onChange={(val) => setRole(val as any)}
							options={roleOptions}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-foreground mb-1">
							Business Justification
						</label>
						<textarea
							value={justification}
							onChange={(e) => setJustification(e.target.value)}
							placeholder="Why do you need this level of access?"
							required
							className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[100px] resize-y custom-scrollbar transition-colors hover:border-border/80"
						/>
					</div>

					<div className="pt-2 flex justify-end gap-3 mt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting || !justification.trim()}
							className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm hover:shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								"Submit Request"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
