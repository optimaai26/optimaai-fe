import {
	type PermissionKey,
	ROLE_NAMES,
	ROLE_PERMISSIONS,
	type RoleName,
} from "@/constants/permissions";
import type {
	AccessRequest,
	ApiResponse,
	CanvasBlock,
	DashboardOverview,
	Dataset,
	Insight,
	Permission,
	Prediction,
	Report,
	Role,
	User,
} from "@/types";

type AuthUserRecord = User & { password: string };

function clone<T>(value: T): T {
	return structuredClone(value);
}

function createPermissionObjects(keys: PermissionKey[]): Permission[] {
	return keys.map((key) => ({
		id: key,
		key,
		description: key.replace(/[:_-]/g, " "),
	}));
}

const initialRoles: Role[] = ROLE_NAMES.map((name) => ({
	id: `role-${name}`,
	name,
	permissions: createPermissionObjects(ROLE_PERMISSIONS[name]),
}));

const initialUsers: AuthUserRecord[] = [
	{
		id: "user-1",
		email: "admin@optima.ai",
		name: "Maya Hassan",
		avatarUrl: "",
		role: initialRoles[0],
		departmentId: "ops",
		createdAt: "2026-04-01T08:00:00.000Z",
		updatedAt: "2026-04-01T08:00:00.000Z",
		password: "Password123!",
	},
	{
		id: "user-2",
		email: "manager@optima.ai",
		name: "Omar Ali",
		avatarUrl: "",
		role: initialRoles[1],
		departmentId: "sales",
		createdAt: "2026-04-01T08:15:00.000Z",
		updatedAt: "2026-04-01T08:15:00.000Z",
		password: "Password123!",
	},
	{
		id: "user-3",
		email: "analyst@optima.ai",
		name: "Nour Adel",
		avatarUrl: "",
		role: initialRoles[2],
		departmentId: "analytics",
		createdAt: "2026-04-01T08:30:00.000Z",
		updatedAt: "2026-04-01T08:30:00.000Z",
		password: "Password123!",
	},
	{
		id: "user-4",
		email: "viewer@optima.ai",
		name: "Salma Wael",
		avatarUrl: "",
		role: initialRoles[3],
		departmentId: "finance",
		createdAt: "2026-04-01T08:45:00.000Z",
		updatedAt: "2026-04-01T08:45:00.000Z",
		password: "Password123!",
	},
	{
		id: "user-5",
		email: "engineer@optima.ai",
		name: "Kareem Ahmed",
		avatarUrl: "",
		role: initialRoles[1],
		departmentId: "engineering",
		createdAt: "2026-04-02T09:12:00.000Z",
		updatedAt: "2026-04-02T09:12:00.000Z",
		password: "Password123!",
	},
	{
		id: "user-6",
		email: "marketing@optima.ai",
		name: "Lina Saeed",
		avatarUrl: "",
		role: initialRoles[2],
		departmentId: "marketing",
		createdAt: "2026-04-03T11:45:00.000Z",
		updatedAt: "2026-04-03T11:45:00.000Z",
		password: "Password123!",
	},
];

const initialDatasets: Dataset[] = [
	{
		id: "dataset-1",
		name: "Customer Churn - Q1",
		description: "Quarterly churn dataset for SaaS subscriptions.",
		fileName: "customer-churn-q1.csv",
		fileUrl: "/mock/customer-churn-q1.csv",
		rowCount: 15420,
		columnCount: 18,
		status: "ready",
		uploadedBy: "user-3",
		createdAt: "2026-04-01T09:00:00.000Z",
		updatedAt: "2026-04-01T09:00:00.000Z",
	},
	{
		id: "dataset-2",
		name: "Revenue Forecast Inputs",
		description: "Cleaned revenue signals for forecasting.",
		fileName: "revenue-forecast.xlsx",
		fileUrl: "/mock/revenue-forecast.xlsx",
		rowCount: 8420,
		columnCount: 12,
		status: "processing",
		uploadedBy: "user-2",
		createdAt: "2026-04-01T10:15:00.000Z",
		updatedAt: "2026-04-01T10:45:00.000Z",
	},
	{
		id: "dataset-3",
		name: "Growth Signals",
		description: "Lead scoring and growth intent indicators.",
		fileName: "growth-signals.csv",
		fileUrl: "/mock/growth-signals.csv",
		rowCount: 5290,
		columnCount: 10,
		status: "ready",
		uploadedBy: "user-1",
		createdAt: "2026-04-01T11:20:00.000Z",
		updatedAt: "2026-04-01T11:20:00.000Z",
	},
	{
		id: "dataset-4",
		name: "Support Ticket Analysis",
		description: "NLP classification dataset for customer support queries.",
		fileName: "support-nlp-q4.csv",
		fileUrl: "/mock/support-nlp-q4.csv",
		rowCount: 32050,
		columnCount: 8,
		status: "ready",
		uploadedBy: "user-5",
		createdAt: "2026-04-02T14:30:00.000Z",
		updatedAt: "2026-04-02T14:35:00.000Z",
	},
	{
		id: "dataset-5",
		name: "Marketing Campaign ROI",
		description: "Historical ROI data for social media campaigns.",
		fileName: "marketing-roi-2025.csv",
		fileUrl: "/mock/marketing-roi-2025.csv",
		rowCount: 1240,
		columnCount: 24,
		status: "failed",
		uploadedBy: "user-6",
		createdAt: "2026-04-03T09:15:00.000Z",
		updatedAt: "2026-04-03T09:20:00.000Z",
	},
];

const initialPredictions: Prediction[] = [
	{
		id: "prediction-1",
		datasetId: "dataset-1",
		type: "churn",
		status: "completed",
		result: {
			summary: "Churn risk increased in enterprise accounts.",
			confidence: 0.91,
			data: { highRiskAccounts: 124, uplift: 0.18 },
		},
		createdAt: "2026-04-01T12:00:00.000Z",
	},
	{
		id: "prediction-2",
		datasetId: "dataset-2",
		type: "revenue_forecast",
		status: "running",
		createdAt: "2026-04-01T12:20:00.000Z",
	},
	{
		id: "prediction-3",
		datasetId: "dataset-3",
		type: "growth_scoring",
		status: "queued",
		createdAt: "2026-04-01T12:35:00.000Z",
	},
	{
		id: "prediction-4",
		datasetId: "dataset-4",
		type: "support_nlp",
		status: "completed",
		result: {
			summary: "Significant spike in login-related issues identified.",
			confidence: 0.88,
			data: { loginIssues: 450, billingIssues: 120 },
		},
		createdAt: "2026-04-02T15:00:00.000Z",
	},
	{
		id: "prediction-5",
		datasetId: "dataset-1",
		type: "churn",
		status: "failed",
		createdAt: "2026-04-03T10:00:00.000Z",
	},
];

const initialInsights: Insight[] = [
	{
		id: "insight-1",
		datasetId: "dataset-1",
		predictionId: "prediction-1",
		title: "Enterprise churn risk needs intervention",
		content:
			"Focus retention campaigns on enterprise customers showing reduced product usage.",
		category: "strategic",
		priority: "high",
		createdAt: "2026-04-01T12:30:00.000Z",
	},
	{
		id: "insight-2",
		datasetId: "dataset-3",
		title: "Upsell intent concentrated in mid-market",
		content:
			"Mid-market accounts show the strongest response to premium feature bundles.",
		category: "growth",
		priority: "medium",
		createdAt: "2026-04-01T13:00:00.000Z",
	},
	{
		id: "insight-3",
		datasetId: "dataset-4",
		predictionId: "prediction-4",
		title: "Support SLA misses predicted",
		content:
			"Current staffing levels will likely fail to meet SLA requirements given the forecasted 25% spike in volume.",
		category: "operational",
		priority: "critical",
		createdAt: "2026-04-02T16:00:00.000Z",
	},
	{
		id: "insight-4",
		datasetId: "dataset-2",
		title: "Q2 Revenue Exceeding Expectations",
		content:
			"Current run-rate suggests Q2 revenue will exceed targets by 12% if expansion velocity is maintained.",
		category: "strategic",
		priority: "low",
		createdAt: "2026-04-04T09:00:00.000Z",
	},
];

const initialCanvasBlocks: CanvasBlock[] = [
	{
		id: "canvas-1",
		section: "value_propositions",
		content: "Reduce customer churn with explainable AI recommendations.",
		order: 1,
	},
	{
		id: "canvas-2",
		section: "customer_segments",
		content: "B2B SaaS companies with recurring revenue and growth teams.",
		order: 2,
	},
	{
		id: "canvas-3",
		section: "revenue_streams",
		content:
			"Subscription tiers, enterprise onboarding, and advisory analytics.",
		order: 3,
	},
	{
		id: "canvas-4",
		section: "problems",
		content: "Companies have data but lack actionable AI forecasting insights.",
		order: 1,
	},
	{
		id: "canvas-5",
		section: "key_metrics",
		content:
			"Monthly Recurring Revenue (MRR), Customer Acquisition Cost (CAC), Churn Rate.",
		order: 1,
	},
];

const initialReports: Report[] = [
	{
		id: "report-1",
		title: "Q1 Executive Retention Report",
		summary: "Summarizes churn patterns and AI recommendations for leadership.",
		datasetId: "dataset-1",
		predictionId: "prediction-1",
		createdBy: "user-1",
		status: "published",
		blocks: clone(initialCanvasBlocks),
		createdAt: "2026-04-01T13:20:00.000Z",
		updatedAt: "2026-04-01T13:45:00.000Z",
	},
	{
		id: "report-2",
		title: "Revenue Model Draft",
		summary: "Draft report linked to the active forecasting dataset.",
		datasetId: "dataset-2",
		createdBy: "user-2",
		status: "draft",
		blocks: [clone(initialCanvasBlocks[0])],
		createdAt: "2026-04-01T14:00:00.000Z",
		updatedAt: "2026-04-01T14:10:00.000Z",
	},
	{
		id: "report-3",
		title: "Support SLA Optimization Plan",
		summary:
			"Review of current support bottlenecks and automated triaging solutions.",
		datasetId: "dataset-4",
		predictionId: "prediction-4",
		createdBy: "user-5",
		status: "published",
		blocks: [clone(initialCanvasBlocks[3])],
		createdAt: "2026-04-03T10:00:00.000Z",
		updatedAt: "2026-04-03T11:00:00.000Z",
	},
];

const initialAccessRequests: AccessRequest[] = [
	{
		id: "access-1",
		userId: "user-4",
		user: { id: "user-4", name: "Salma Wael", email: "viewer@optima.ai" },
		requestedRole: "analyst",
		justification:
			"Needs access to run growth analysis for the finance planning team.",
		status: "pending",
		createdAt: "2026-04-01T14:25:00.000Z",
		updatedAt: "2026-04-01T14:25:00.000Z",
	},
	{
		id: "access-2",
		userId: "user-3",
		user: { id: "user-3", name: "Nour Adel", email: "analyst@optima.ai" },
		requestedRole: "manager",
		justification: "Temporarily covering revenue review workflows.",
		status: "approved",
		reviewedBy: "user-1",
		createdAt: "2026-04-01T10:00:00.000Z",
		updatedAt: "2026-04-01T11:00:00.000Z",
	},
	{
		id: "access-3",
		userId: "user-6",
		user: { id: "user-6", name: "Lina Saeed", email: "marketing@optima.ai" },
		requestedRole: "admin",
		justification:
			"Requires cross-functional access to configure global integrations.",
		status: "rejected",
		reviewedBy: "user-1",
		createdAt: "2026-04-04T09:00:00.000Z",
		updatedAt: "2026-04-04T10:30:00.000Z",
	},
];

const initialDashboardOverview: DashboardOverview = {
	kpis: [
		{
			id: "kpi-1",
			title: "Total Revenue",
			value: "$124,500",
			changePercent: 12.5,
			trend: "up",
			icon: "DollarSign",
		},
		{
			id: "kpi-2",
			title: "Active Users",
			value: "2,340",
			changePercent: 8.1,
			trend: "up",
			icon: "Users",
		},
		{
			id: "kpi-3",
			title: "Churn Rate",
			value: "3.2%",
			changePercent: -0.8,
			trend: "down",
			icon: "Activity",
		},
		{
			id: "kpi-4",
			title: "Growth Score",
			value: "87/100",
			changePercent: 4.2,
			trend: "up",
			icon: "TrendingUp",
		},
	],
	recentActivity: [
		{
			id: "activity-1",
			action: "New dataset uploaded",
			time: "2 minutes ago",
			color: "bg-success",
		},
		{
			id: "activity-2",
			action: "Churn prediction completed",
			time: "15 minutes ago",
			color: "bg-primary-400",
		},
		{
			id: "activity-3",
			action: "AI insight generated",
			time: "1 hour ago",
			color: "bg-info",
		},
		{
			id: "activity-4",
			action: "Revenue forecast updated",
			time: "3 hours ago",
			color: "bg-warning",
		},
		{
			id: "activity-5",
			action: "Bob joined as an Analyst",
			time: "4 hours ago",
			color: "bg-success",
		},
		{
			id: "activity-6",
			action: "Marketing dataset processing failed",
			time: "5 hours ago",
			color: "bg-danger",
		},
	],
	charts: [
		{
			type: "area", // Backend decided 'area' represents revenue best
			title: "Revenue Trend",
			xAxis: "name",
			yAxis: "revenue",
			data: [
				{ name: "Jan", revenue: 40000, users: 400 },
				{ name: "Feb", revenue: 45000, users: 510 },
				{ name: "Mar", revenue: 52000, users: 800 },
				{ name: "Apr", revenue: 64000, users: 1100 },
				{ name: "May", revenue: 78000, users: 1540 },
				{ name: "Jun", revenue: 95000, users: 2010 },
				{ name: "Jul", revenue: 124500, users: 2340 },
			],
			colors: ["var(--primary)"],
			aiRecommended: true,
		},
		{
			type: "bar", // Backend decided 'bar' represents users best
			title: "User Distribution",
			xAxis: "name",
			yAxis: "users",
			data: [
				{ name: "Jan", revenue: 40000, users: 400 },
				{ name: "Feb", revenue: 45000, users: 510 },
				{ name: "Mar", revenue: 52000, users: 800 },
				{ name: "Apr", revenue: 64000, users: 1100 },
				{ name: "May", revenue: 78000, users: 1540 },
				{ name: "Jun", revenue: 95000, users: 2010 },
				{ name: "Jul", revenue: 124500, users: 2340 },
			],
			colors: ["var(--secondary)"],
			aiRecommended: true,
		},
	],
};

const STATUSES = [
	"ready",
	"processing",
	"failed",
	"uploading",
	"error",
] as const;
const PREDICTION_TYPES = [
	"churn",
	"revenue_forecast",
	"growth_scoring",
	"support_nlp",
] as const;
const DEPARTMENTS = [
	"engineering",
	"finance",
	"sales",
	"marketing",
	"analytics",
	"ops",
];

// --- BULK SEEDING GENERATOR ---
for (let i = 1; i <= 25; i++) {
	// Seed Additional Datasets
	initialDatasets.push({
		id: `dataset-seed-${i}`,
		name: `Automated Backfill Dataset ${i}`,
		description: `Synthetic data generated for bulk load testing and UI population (Batch ${i}).`,
		fileName: `data-batch-${i}.csv`,
		fileUrl: `/mock/data-batch-${i}.csv`,
		rowCount: Math.floor(Math.random() * 50000) + 1000,
		columnCount: Math.floor(Math.random() * 50) + 5,
		status: STATUSES[i % STATUSES.length],
		uploadedBy: `user-${(i % 5) + 1}`,
		createdAt: new Date(Date.now() - i * 86400000).toISOString(),
		updatedAt: new Date(Date.now() - i * 42000000).toISOString(),
	});

	// Seed Additional Users
	const roleIdx = i % initialRoles.length;
	initialUsers.push({
		id: `user-seed-${i}`,
		email: `demo-user-${i}@optima.ai`,
		name: `Synthetic User ${i}`,
		avatarUrl: "",
		role: initialRoles[roleIdx],
		departmentId: DEPARTMENTS[i % DEPARTMENTS.length],
		createdAt: new Date(Date.now() - i * 186400000).toISOString(),
		updatedAt: new Date().toISOString(),
		password: "Password123!",
	});

	// Seed Additional Predictions
	if (i <= 15) {
		initialPredictions.push({
			id: `prediction-seed-${i}`,
			datasetId: `dataset-seed-${i}`,
			type: PREDICTION_TYPES[i % PREDICTION_TYPES.length],
			status: i % 4 === 0 ? "failed" : i % 3 === 0 ? "running" : "completed",
			result:
				i % 3 !== 0 && i % 4 !== 0
					? {
							summary: `Prediction generated AI summary ${i} indicating anomalous behavioral scoring.`,
							confidence: 0.65 + Math.random() * 0.3,
							data: { metricA: i * 10, metricB: i * 1.5 },
						}
					: undefined,
			createdAt: new Date(Date.now() - i * 10000000).toISOString(),
		});
	}

	// Seed Access Requests
	if (i <= 12) {
		initialAccessRequests.push({
			id: `access-seed-${i}`,
			userId: `user-seed-${i}`,
			user: {
				id: `user-seed-${i}`,
				name: `Synthetic User ${i}`,
				email: `demo-user-${i}@optima.ai`,
			},
			requestedRole: roleIdx === 0 ? "admin" : "manager",
			justification: `Need elevated access to view analytics dashboards and approve reports. (Auto Request ${i})`,
			status: i < 3 ? "approved" : i > 10 ? "rejected" : "pending",
			createdAt: new Date(Date.now() - i * 4000000).toISOString(),
			updatedAt: new Date().toISOString(),
		});
	}
}

let roles = clone(initialRoles);
let users = clone(initialUsers);
let datasets = clone(initialDatasets);
let predictions = clone(initialPredictions);
let insights = clone(initialInsights);
let reports = clone(initialReports);
let canvasBlocks = clone(initialCanvasBlocks);
let accessRequests = clone(initialAccessRequests);
let dashboardOverview = clone(initialDashboardOverview);

function nextId(prefix: string): string {
	return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function sanitizeUser(record: AuthUserRecord): User {
	const { password, ...user } = record;
	return user;
}

function makeToken(userId: string): string {
	return `mock.${userId}.signature`;
}

function getUserIdFromToken(token?: string | null): string | null {
	if (!token) return null;
	const parts = token.split(".");
	if (parts.length !== 3 || parts[0] !== "mock" || parts[2] !== "signature") {
		return null;
	}
	return parts[1] || null;
}

function findAuthRecordByUserId(userId: string): AuthUserRecord | undefined {
	return users.find((user) => user.id === userId);
}

export function resetMockData(): void {
	roles = clone(initialRoles);
	users = clone(initialUsers);
	datasets = clone(initialDatasets);
	predictions = clone(initialPredictions);
	insights = clone(initialInsights);
	reports = clone(initialReports);
	canvasBlocks = clone(initialCanvasBlocks);
	accessRequests = clone(initialAccessRequests);
	dashboardOverview = clone(initialDashboardOverview);
}

export function getRoles(): Role[] {
	return roles;
}

export function getUsers(): User[] {
	return users.map(sanitizeUser);
}

export function getUserById(id: string): User | undefined {
	const user = users.find((item) => item.id === id);
	return user ? sanitizeUser(user) : undefined;
}

export function addUser(params: {
	name: string;
	email: string;
	password: string;
	roleName?: RoleName;
}): User {
	const roleName = params.roleName ?? "viewer";
	const role =
		roles.find((item) => item.name === roleName) ?? roles[roles.length - 1];
	const now = new Date().toISOString();
	const user: AuthUserRecord = {
		id: nextId("user"),
		email: params.email,
		name: params.name,
		role,
		createdAt: now,
		updatedAt: now,
		password: params.password,
	};

	users.unshift(user);
	return sanitizeUser(user);
}

export function authenticateUser(
	email: string,
	password: string,
): ApiResponse<{ token: string; user: User }> | null {
	const record = users.find(
		(user) =>
			user.email.toLowerCase() === email.toLowerCase() &&
			user.password === password,
	);

	if (!record) {
		return null;
	}

	return {
		data: {
			token: makeToken(record.id),
			user: sanitizeUser(record),
		},
		message: "Login successful",
	};
}

export function registerUser(params: {
	name: string;
	email: string;
	password: string;
}): ApiResponse<{ user: User; token: string }> | { error: string } {
	const exists = users.some(
		(user) => user.email.toLowerCase() === params.email.toLowerCase(),
	);

	if (exists) {
		return { error: "An account with this email already exists." };
	}

	const user = addUser(params);
	return {
		data: {
			user,
			token: makeToken(user.id),
		},
		message: "Account created successfully",
	};
}

export function getUserFromToken(token?: string | null): User | null {
	const userId = getUserIdFromToken(token);
	if (!userId) return null;
	const record = findAuthRecordByUserId(userId);
	return record ? sanitizeUser(record) : null;
}

export function getDatasets(): Dataset[] {
	return datasets;
}

export function getDatasetById(id: string): Dataset | undefined {
	return datasets.find((dataset) => dataset.id === id);
}

export function addDataset(
	dataset: Omit<Dataset, "id" | "createdAt" | "updatedAt">,
): Dataset {
	const now = new Date().toISOString();
	const newDataset: Dataset = {
		...dataset,
		id: nextId("dataset"),
		createdAt: now,
		updatedAt: now,
	};

	datasets.unshift(newDataset);
	return newDataset;
}

export function updateDataset(
	id: string,
	updates: Partial<Dataset>,
): Dataset | undefined {
	const index = datasets.findIndex((dataset) => dataset.id === id);
	if (index === -1) return undefined;
	datasets[index] = {
		...datasets[index],
		...updates,
		id,
		updatedAt: new Date().toISOString(),
	};
	return datasets[index];
}

export function deleteDataset(id: string): boolean {
	const next = datasets.filter((dataset) => dataset.id !== id);
	if (next.length === datasets.length) return false;
	datasets = next;
	return true;
}

export function getPredictions(): Prediction[] {
	return predictions;
}

export function getPredictionById(id: string): Prediction | undefined {
	return predictions.find((prediction) => prediction.id === id);
}

export function addPrediction(
	prediction: Omit<Prediction, "id" | "createdAt">,
): Prediction {
	const nextPrediction: Prediction = {
		...prediction,
		id: nextId("prediction"),
		createdAt: new Date().toISOString(),
	};

	predictions.unshift(nextPrediction);
	return nextPrediction;
}

export function getInsights(): Insight[] {
	return insights;
}

export function getReports(): Report[] {
	return reports;
}

export function getCanvasBlocks(): CanvasBlock[] {
	return canvasBlocks;
}

export function updateCanvasBlock(
	id: string,
	content: string,
): CanvasBlock | undefined {
	const block = canvasBlocks.find((item) => item.id === id);
	if (!block) return undefined;
	block.content = content;
	reports = reports.map((report) => ({
		...report,
		blocks: report.blocks.map((item) =>
			item.id === id ? { ...item, content } : item,
		),
	}));
	return block;
}

export function addCanvasBlock(block: Omit<CanvasBlock, "id">): CanvasBlock {
	const newBlock: CanvasBlock = {
		...block,
		id: nextId("canvas"),
	};
	canvasBlocks.push(newBlock);
	return newBlock;
}

export function deleteCanvasBlock(id: string): boolean {
	const next = canvasBlocks.filter((item) => item.id !== id);
	if (next.length === canvasBlocks.length) return false;
	canvasBlocks = next;
	return true;
}

export function getAccessRequests(): AccessRequest[] {
	return accessRequests;
}

export function reviewAccessRequest(
	id: string,
	status: "approved" | "rejected",
	reviewedBy: string,
): AccessRequest | undefined {
	const index = accessRequests.findIndex((request) => request.id === id);
	if (index === -1) return undefined;
	accessRequests[index] = {
		...accessRequests[index],
		status,
		reviewedBy,
		updatedAt: new Date().toISOString(),
	};
	return accessRequests[index];
}

export function getDashboardOverview(): DashboardOverview {
	return dashboardOverview;
}
