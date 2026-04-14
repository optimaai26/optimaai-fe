import type { Metadata } from "next";
import { AdminRolesPageClient } from "@/features/roles/AdminRolesPageClient";

export const metadata: Metadata = { title: "Admin - Roles" };

export default function AdminRolesPage() {
	return <AdminRolesPageClient />;
}
