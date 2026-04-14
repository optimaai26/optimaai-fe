import type { Metadata } from "next";
import { InsightsPageClient } from "@/features/insights/InsightsPageClient";

export const metadata: Metadata = { title: "Insights" };

export default function InsightsPage() {
	return <InsightsPageClient />;
}
