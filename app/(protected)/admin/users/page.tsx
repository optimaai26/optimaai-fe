import type { Metadata } from "next";
import { AdminUsersPageClient } from "@/features/users/AdminUsersPageClient";

export const metadata: Metadata = { title: "Admin - Users" };

export default function AdminUsersPage() {
	return <AdminUsersPageClient />;
}
