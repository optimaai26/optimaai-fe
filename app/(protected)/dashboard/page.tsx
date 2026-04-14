import type { Metadata } from "next";
import { DashboardPageClient } from "@/features/dashboard/DashboardPageClient";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
	return <DashboardPageClient />;
}
