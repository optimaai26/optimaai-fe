import type { Metadata } from "next";
import { AccessRequestsPageClient } from "@/features/access-requests/AccessRequestsPageClient";

export const metadata: Metadata = { title: "Admin - Access Requests" };

export default function AccessRequestsPage() {
	return <AccessRequestsPageClient />;
}
