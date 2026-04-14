import type { Metadata } from "next";
import { DatasetsPageClient } from "@/features/datasets/DatasetsPageClient";

export const metadata: Metadata = { title: "Datasets" };

export default function DatasetsPage() {
	return <DatasetsPageClient />;
}
