import type { AccessRequest, Dataset, Insight, User } from '@/types';

export interface PredictionRun {
    id: string;
    datasetId: string;
    type: 'churn' | 'revenue_forecast' | 'growth_scoring';
    status: 'queued' | 'running' | 'completed' | 'failed';
    createdAt: string;
    result?: Record<string, unknown>;
}

const initialMockUsers: User[] = [
    {
        id: 'user-1',
        email: 'admin@optima.ai',
        name: 'Maya Hassan',
        role: {
            id: 'role-admin',
            name: 'admin',
            permissions: [],
        },
        createdAt: '2026-04-01T08:00:00.000Z',
        updatedAt: '2026-04-01T08:00:00.000Z',
    },
    {
        id: 'user-2',
        email: 'analyst@optima.ai',
        name: 'Omar Ali',
        role: {
            id: 'role-analyst',
            name: 'analyst',
            permissions: [],
        },
        createdAt: '2026-04-01T08:30:00.000Z',
        updatedAt: '2026-04-01T08:30:00.000Z',
    },
];

const initialMockDatasets: Dataset[] = [
    {
        id: 'dataset-1',
        name: 'Customer Churn - Q1',
        description: 'Quarterly churn dataset for SaaS subscriptions.',
        fileName: 'customer-churn-q1.csv',
        fileUrl: '/mock/customer-churn-q1.csv',
        rowCount: 15420,
        columnCount: 18,
        status: 'ready',
        uploadedBy: 'user-2',
        createdAt: '2026-04-01T09:00:00.000Z',
        updatedAt: '2026-04-01T09:00:00.000Z',
    },
    {
        id: 'dataset-2',
        name: 'Revenue Forecast Inputs',
        description: 'Cleaned revenue signals for forecasting.',
        fileName: 'revenue-forecast.xlsx',
        fileUrl: '/mock/revenue-forecast.xlsx',
        rowCount: 8420,
        columnCount: 12,
        status: 'processing',
        uploadedBy: 'user-1',
        createdAt: '2026-04-01T10:15:00.000Z',
        updatedAt: '2026-04-01T10:45:00.000Z',
    },
];

const initialMockRequests: AccessRequest[] = [
    {
        id: 'access-1',
        userId: 'user-2',
        user: {
            id: 'user-2',
            name: 'Omar Ali',
            email: 'analyst@optima.ai',
        },
        requestedRole: 'manager',
        justification: 'Needs broader access for forecasting review.',
        status: 'pending',
        createdAt: '2026-04-01T11:00:00.000Z',
        updatedAt: '2026-04-01T11:00:00.000Z',
    },
];

const initialInsights: Insight[] = [
    {
        id: 'insight-1',
        datasetId: 'dataset-1',
        title: 'Enterprise churn risk needs intervention',
        content: 'Focus retention campaigns on enterprise customers with declining usage.',
        category: 'strategic',
        priority: 'high',
        createdAt: '2026-04-01T12:30:00.000Z',
    },
];

const initialPredictionRuns: PredictionRun[] = [
    {
        id: 'prediction-1',
        datasetId: 'dataset-1',
        type: 'churn',
        status: 'completed',
        createdAt: '2026-04-01T12:00:00.000Z',
        result: {
            confidence: 0.91,
            summary: 'Churn risk increased in enterprise accounts.',
        },
    },
];

function clone<T>(value: T): T {
    return structuredClone(value);
}

function nextId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function updateById<T extends { id: string }>(items: T[], id: string, updates: Partial<T>): T | undefined {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    items[index] = { ...items[index], ...updates, id };
    return items[index];
}

function removeById<T extends { id: string }>(items: T[], id: string): boolean {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    return true;
}

let mockDatasets = clone(initialMockDatasets);
let mockUsers = clone(initialMockUsers);
let mockRequests = clone(initialMockRequests);
let insights = clone(initialInsights);
let predictionRuns = clone(initialPredictionRuns);

export function resetMockData(): void {
    mockDatasets = clone(initialMockDatasets);
    mockUsers = clone(initialMockUsers);
    mockRequests = clone(initialMockRequests);
    insights = clone(initialInsights);
    predictionRuns = clone(initialPredictionRuns);
}

export function getDatasets(): Dataset[] {
    return mockDatasets;
}

export function getDatasetById(id: string): Dataset | undefined {
    return mockDatasets.find((dataset) => dataset.id === id);
}

export function addDataset(dataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>): Dataset {
    const now = new Date().toISOString();
    const nextDataset: Dataset = {
        ...dataset,
        id: nextId('dataset'),
        createdAt: now,
        updatedAt: now,
    };
    mockDatasets.unshift(nextDataset);
    return nextDataset;
}

export function updateDataset(id: string, updates: Partial<Dataset>): Dataset | undefined {
    const next = updateById(mockDatasets, id, updates);
    if (!next) return undefined;
    next.updatedAt = new Date().toISOString();
    return next;
}

export function removeDataset(id: string): boolean {
    return removeById(mockDatasets, id);
}

export function getUsers(): User[] {
    return mockUsers;
}

export function getUserById(id: string): User | undefined {
    return mockUsers.find((user) => user.id === id);
}

export function addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const now = new Date().toISOString();
    const nextUser: User = {
        ...user,
        id: nextId('user'),
        createdAt: now,
        updatedAt: now,
    };
    mockUsers.unshift(nextUser);
    return nextUser;
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
    const next = updateById(mockUsers, id, updates);
    if (!next) return undefined;
    next.updatedAt = new Date().toISOString();
    return next;
}

export function removeUser(id: string): boolean {
    return removeById(mockUsers, id);
}

export function getRequests(): AccessRequest[] {
    return mockRequests;
}

export function addRequest(request: Omit<AccessRequest, 'id' | 'createdAt' | 'updatedAt'>): AccessRequest {
    const now = new Date().toISOString();
    const nextRequest: AccessRequest = {
        ...request,
        id: nextId('access'),
        createdAt: now,
        updatedAt: now,
    };
    mockRequests.unshift(nextRequest);
    return nextRequest;
}

export function updateRequest(id: string, updates: Partial<AccessRequest>): AccessRequest | undefined {
    const next = updateById(mockRequests, id, updates);
    if (!next) return undefined;
    next.updatedAt = new Date().toISOString();
    return next;
}

export function removeRequest(id: string): boolean {
    return removeById(mockRequests, id);
}

export function getInsights(): Insight[] {
    return insights;
}

export function addInsight(insight: Omit<Insight, 'id' | 'createdAt'>): Insight {
    const nextInsight: Insight = {
        ...insight,
        id: nextId('insight'),
        createdAt: new Date().toISOString(),
    };
    insights.unshift(nextInsight);
    return nextInsight;
}

export function updateInsight(id: string, updates: Partial<Insight>): Insight | undefined {
    return updateById(insights, id, updates);
}

export function removeInsight(id: string): boolean {
    return removeById(insights, id);
}

export function getPredictionRuns(): PredictionRun[] {
    return predictionRuns;
}

export function addPredictionRun(run: Omit<PredictionRun, 'id' | 'createdAt'>): PredictionRun {
    const nextRun: PredictionRun = {
        ...run,
        id: nextId('prediction'),
        createdAt: new Date().toISOString(),
    };
    predictionRuns.unshift(nextRun);
    return nextRun;
}

export function updatePredictionRun(id: string, updates: Partial<PredictionRun>): PredictionRun | undefined {
    return updateById(predictionRuns, id, updates);
}

export function removePredictionRun(id: string): boolean {
    return removeById(predictionRuns, id);
}
