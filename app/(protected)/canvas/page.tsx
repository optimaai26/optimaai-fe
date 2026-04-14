import type { Metadata } from "next";
import { CanvasPageClient } from "@/features/canvas/CanvasPageClient";

export const metadata: Metadata = { title: "Canvas" };

export default function CanvasPage() {
	return <CanvasPageClient />;
}
