"use client";

import { FileEdit, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { type Column, DataTable } from "@/components/data-display/DataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { ROLE_LABELS } from "@/constants/permissions";
import { EditUserRoleModal } from "@/features/users/EditUserRoleModal";
import { InviteUserModal } from "@/features/users/InviteUserModal";
import { useUsers } from "@/features/users/useUsers";
import type { User } from "@/types";

export function AdminUsersPageClient() {
	const { data, isLoading, isError } = useUsers();
	const [isInviteOpen, setIsInviteOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const users = data?.data ?? [];

	const columns: Column<User>[] = [
		{ key: "name", header: "Name" },
		{ key: "email", header: "Email" },
		{
			key: "role",
			header: "Role",
			render: (row) => ROLE_LABELS[row.role.name],
		},
		{
			key: "departmentId",
			header: "Department",
			render: (row) => row.departmentId ?? "-",
		},
		{
			key: "createdAt",
			header: "Joined",
			render: (row) => new Date(row.createdAt).toLocaleDateString(),
		},
		{
			key: "actions",
			header: "",
			render: (row) => (
				<button
					onClick={() => setEditingUser(row)}
					className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
					title="Edit Role"
				>
					<FileEdit className="w-4 h-4" />
				</button>
			),
		},
	];

	return (
		<div className="animate-fade-in space-y-6">
			<PageHeader
				title="User Management"
				description="Manage your team members and their organizational access."
				actions={
					<button
						onClick={() => setIsInviteOpen(true)}
						className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
					>
						<UserPlus className="w-4 h-4" />
						Invite Member
					</button>
				}
			/>
			{isLoading ? (
				<div className="min-h-[240px] flex items-center justify-center">
					<Loader2 className="w-6 h-6 animate-spin" />
				</div>
			) : isError ? (
				<div className="text-sm text-danger">Failed to load users.</div>
			) : (
				<DataTable
					columns={columns}
					data={users}
					keyExtractor={(row) => row.id}
					emptyMessage="No users found"
				/>
			)}
			<InviteUserModal
				isOpen={isInviteOpen}
				onClose={() => setIsInviteOpen(false)}
			/>
			<EditUserRoleModal
				user={editingUser}
				onClose={() => setEditingUser(null)}
			/>
		</div>
	);
}
