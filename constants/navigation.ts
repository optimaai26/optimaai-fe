import {
	BrainCircuit,
	Database,
	FileText,
	LayoutDashboard,
	type LucideIcon,
	Shield,
	TrendingUp,
	UserCog,
	Users,
} from "lucide-react";

/* ==========================================
 * Sidebar / Navigation Configuration
 * ========================================== */

export interface NavItem {
	title: string;
	href: string;
	icon: LucideIcon;
	badge?: string;
	disabled?: boolean;
}

export interface NavSection {
	label: string;
	items: NavItem[];
}

/** Primary navigation sections for the sidebar */
export const NAV_SECTIONS: NavSection[] = [
	{
		label: "Overview",
		items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
	},
	{
		label: "Data",
		items: [
			{ title: "Datasets", href: "/datasets", icon: Database },
			{ title: "Predictions", href: "/predictions", icon: TrendingUp },
		],
	},
	{
		label: "AI & Insights",
		items: [
			{ title: "Insights", href: "/insights", icon: BrainCircuit },
			// { title: 'Canvas', href: '/canvas', icon: BookOpen },
			{ title: "Reports", href: "/reports", icon: FileText },
		],
	},
];

/** Admin navigation (shown only to admin/manager roles) */
export const ADMIN_NAV_ITEMS: NavItem[] = [
	{ title: "Users", href: "/admin/users", icon: Users },
	{ title: "Roles", href: "/admin/roles", icon: Shield },
	{ title: "Access Requests", href: "/admin/access-requests", icon: UserCog },
];

/** Quick-access routes */
export const ROUTE_PATHS = {
	home: "/",
	login: "/login",
	signup: "/signup",
	dashboard: "/dashboard",
	datasets: "/datasets",
	datasetDetail: (id: string) => `/datasets/${id}` as const,
	predictions: "/predictions",
	insights: "/insights",
	canvas: "/canvas",
	reports: "/reports",
	adminUsers: "/admin/users",
	adminRoles: "/admin/roles",
	adminAccessRequests: "/admin/access-requests",
} as const;
