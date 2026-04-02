import type { PermissionKey, RoleName } from '@/constants/permissions';

/* ==========================================
 * OptimaAI - Global Type Definitions
 * ========================================== */

export type { PermissionKey, RoleName } from '@/constants/permissions';

export type ISODateString = string;

/** User & RBAC */
export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    role: Role;
    departmentId?: string;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

export interface Role {
    id: string;
    name: RoleName;
    permissions: Permission[];
}

export interface Permission {
    id: string;
    key: PermissionKey;
    description: string;
}

export interface AccessRequest {
    id: string;
    userId: string;
    user: Pick<User, 'id' | 'name' | 'email'>;
    requestedRole: RoleName;
    justification: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: string;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

/** Datasets */
export interface Dataset {
    id: string;
    name: string;
    description?: string;
    fileName: string;
    fileUrl: string;
    rowCount: number;
    columnCount: number;
    status: DatasetStatus;
    uploadedBy: string;
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

export type DatasetStatus = 'uploading' | 'processing' | 'ready' | 'error';

export interface DatasetColumn {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date';
    nullCount: number;
    uniqueCount: number;
}

/** Predictions & ML */
export interface Prediction {
    id: string;
    datasetId: string;
    type: PredictionType;
    status: 'queued' | 'running' | 'completed' | 'failed';
    result?: PredictionResult;
    createdAt: ISODateString;
}

export type PredictionType = 'churn' | 'revenue_forecast' | 'growth_scoring';

export interface PredictionResult {
    summary: string;
    confidence: number;
    data: Record<string, unknown>;
    chartConfig?: ChartConfig;
}

/** AI Insights */
export interface Insight {
    id: string;
    datasetId?: string;
    predictionId?: string;
    title: string;
    content: string;
    category: 'strategic' | 'operational' | 'financial' | 'growth';
    priority: 'low' | 'medium' | 'high' | 'critical';
    createdAt: ISODateString;
}

/** Reports */
export interface Report {
    id: string;
    title: string;
    summary?: string;
    datasetId?: string;
    predictionId?: string;
    createdBy: string;
    status: 'draft' | 'published' | 'archived';
    blocks: CanvasBlock[];
    createdAt: ISODateString;
    updatedAt: ISODateString;
}

/** Charts & KPIs */
export interface KpiCardData {
    id: string;
    title: string;
    value: string | number;
    previousValue?: string | number;
    changePercent?: number;
    trend: 'up' | 'down' | 'neutral';
    icon?: string;
}

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'scatter' | 'funnel';

export interface ChartConfig {
    type: ChartType;
    title: string;
    xAxis?: string;
    yAxis?: string;
    data: Record<string, unknown>[];
    colors?: string[];
    aiRecommended?: boolean;
    alternativeTypes?: ChartType[];
}

/** Business Model Canvas */
export interface CanvasBlock {
    id: string;
    section: CanvasSection;
    content: string;
    order: number;
}

export type CanvasSection =
    | 'key_partners'
    | 'key_activities'
    | 'key_resources'
    | 'value_propositions'
    | 'customer_relationships'
    | 'channels'
    | 'customer_segments'
    | 'cost_structure'
    | 'revenue_streams';

/** API Response Wrappers */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}
