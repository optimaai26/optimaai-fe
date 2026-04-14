import type { Metadata } from "next";
import { PredictionsPageClient } from "@/features/predictions/PredictionsPageClient";

export const metadata: Metadata = { title: "Predictions" };

export default function PredictionsPage() {
	return <PredictionsPageClient />;
}
