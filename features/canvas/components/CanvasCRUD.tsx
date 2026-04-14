import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import {
	useAddCanvasBlock,
	useDeleteCanvasBlock,
	useUpdateCanvasBlock,
} from "@/features/canvas/useCanvas";
import { cn } from "@/lib/utils";
import type { CanvasBlock, CanvasSection } from "@/types";

const CANVAS_SECTIONS: CanvasSection[] = [
	"key_partners",
	"key_activities",
	"key_resources",
	"value_propositions",
	"customer_relationships",
	"channels",
	"customer_segments",
	"cost_structure",
	"revenue_streams",
];

export function CanvasCRUD({ blocks }: { blocks: CanvasBlock[] }) {
	const { toast } = useToast();
	const addBlock = useAddCanvasBlock();
	const updateBlock = useUpdateCanvasBlock();

	// Map of id -> { content, section } for blocks with unsaved changes
	const [edits, setEdits] = useState<
		Record<string, { content: string; section: CanvasSection }>
	>({});
	const [isSavingAll, setIsSavingAll] = useState(false);

	// Reset edits when upstream blocks change (like after a successful save)
	useEffect(() => {
		setEdits({});
	}, []);

	const handleAdd = () => {
		addBlock.mutate(
			{ content: "", section: "value_propositions", order: blocks.length + 1 },
			{
				onSuccess: () => toast({ type: "success", title: "Block Added" }),
			},
		);
	};

	const handleBlockEdit = (
		id: string,
		newContent: string,
		newSection: CanvasSection,
	) => {
		const original = blocks.find((b) => b.id === id);
		if (!original) return;

		if (original.content === newContent && original.section === newSection) {
			setEdits((prev) => {
				const next = { ...prev };
				delete next[id];
				return next;
			});
		} else {
			setEdits((prev) => ({
				...prev,
				[id]: { content: newContent, section: newSection },
			}));
		}
	};

	const getBlockData = (block: CanvasBlock) => {
		return edits[block.id] ? { ...block, ...edits[block.id] } : block;
	};

	const handleSaveAll = async () => {
		setIsSavingAll(true);
		const updates = Object.entries(edits).map(([id, changes]) => ({
			id,
			content: changes.content,
			section: changes.section,
		}));

		// Save sequentially to avoid race conditions and easily handle promises
		let successCount = 0;
		for (const update of updates) {
			try {
				await updateBlock.mutateAsync(update);
				successCount++;
			} catch (e) {
				console.error("Failed to save block", update.id, e);
			}
		}

		setIsSavingAll(false);
		setEdits({});

		toast({
			type: successCount === updates.length ? "success" : "error",
			title: "Canvas Updated",
			message: `Successfully saved ${successCount} canvas block(s).`,
		});
	};

	const hasEdits = Object.keys(edits).length > 0;

	return (
		<div className="space-y-6 relative pb-20">
			<div className="flex justify-end">
				<button
					type="button"
					onClick={handleAdd}
					disabled={addBlock.isPending}
					className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
				>
					{addBlock.isPending ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<Plus className="w-4 h-4" />
					)}
					Add Canvas Block
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{blocks.map((block) => (
					<CanvasBlockEditor
						key={block.id}
						block={getBlockData(block)}
						onChange={(content, section) =>
							handleBlockEdit(block.id, content, section)
						}
						isDirty={!!edits[block.id]}
					/>
				))}
			</div>

			{hasEdits && (
				<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
					<div className="glass-card shadow-2xl rounded-full p-2 flex items-center gap-4 border border-primary/20 bg-background/80 backdrop-blur-md">
						<div className="px-4 text-sm font-medium">
							<span className="text-primary mr-1">
								{Object.keys(edits).length}
							</span>{" "}
							unsaved block(s)
						</div>
						<button
							type="button"
							onClick={() => setEdits({})}
							disabled={isSavingAll}
							className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
						>
							Discard
						</button>
						<button
							type="button"
							onClick={handleSaveAll}
							disabled={isSavingAll}
							className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
						>
							{isSavingAll ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
							Save Changes
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

function CanvasBlockEditor({
	block,
	onChange,
	isDirty,
}: {
	block: CanvasBlock;
	onChange: (content: string, section: CanvasSection) => void;
	isDirty: boolean;
}) {
	const { toast } = useToast();
	const deleteBlock = useDeleteCanvasBlock();

	const handleDelete = () => {
		deleteBlock.mutate(block.id, {
			onSuccess: () => toast({ type: "success", title: "Block deleted" }),
		});
	};

	return (
		<div
			className={cn(
				"glass-card rounded-2xl p-5 space-y-3 transition-all duration-300",
				isDirty
					? "border-primary/50 shadow-[0_0_15px_-3px_rgba(var(--primary),0.2)]"
					: "hover:border-border/80",
			)}
		>
			<div className="mb-2">
				<Select
					value={block.section}
					onChange={(val) => onChange(block.content, val as CanvasSection)}
					options={CANVAS_SECTIONS.map((s) => ({
						value: s,
						label: s
							.replace(/_/g, " ")
							.replace(/\b\w/g, (l) => l.toUpperCase()),
					}))}
				/>
			</div>
			<textarea
				value={block.content}
				onChange={(e) => onChange(e.target.value, block.section)}
				className="w-full min-h-32 rounded-xl border border-transparent bg-muted/20 hover:bg-muted/40 px-3 py-2 text-sm focus:border-primary/50 focus:bg-background outline-none transition-all resize-none custom-scrollbar"
				placeholder="Enter block content..."
			/>
			<div className="flex items-center justify-between pt-2 border-t border-border/30">
				<button
					type="button"
					onClick={handleDelete}
					disabled={deleteBlock.isPending}
					className="inline-flex items-center gap-1.5 text-danger/70 hover:text-danger text-sm font-medium px-2 py-1.5 rounded-lg hover:bg-danger/10 transition-colors"
				>
					{deleteBlock.isPending ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<Trash2 className="w-4 h-4" />
					)}
					Delete
				</button>
			</div>
		</div>
	);
}
