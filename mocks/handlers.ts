import { HttpResponse, http } from 'msw';
import {
    addDataset,
    addPrediction,
    authenticateUser,
    getAccessRequests,
    getCanvasBlocks,
    getDashboardOverview,
    getDatasetById,
    getDatasets,
    getInsights,
    getPredictionById,
    getPredictions,
    getReports,
    getRoles,
    getUserById,
    getUserFromToken,
    getUsers,
    registerUser,
    reviewAccessRequest,
    updateCanvasBlock,
    updateDataset,
    deleteDataset,
} from '@/mocks/data';
import type { ApiResponse, CanvasBlock, Dataset, Prediction } from '@/types';

const API_PREFIX = '/api/v1';

function getBearerToken(request: Request): string | null {
    const header = request.headers.get('authorization');
    if (!header) return null;
    const [scheme, token] = header.split(' ');
    return scheme?.toLowerCase() === 'bearer' ? token : null;
}

export const handlers = [
    http.post(`${API_PREFIX}/auth/login`, async ({ request }) => {
        const body = (await request.json()) as { email?: string; password?: string };
        const response = authenticateUser(body.email ?? '', body.password ?? '');

        if (!response) {
            return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        return HttpResponse.json(response);
    }),

    http.post(`${API_PREFIX}/auth/register`, async ({ request }) => {
        const body = (await request.json()) as { fullName?: string; email?: string; password?: string };
        const result = registerUser({
            name: body.fullName ?? '',
            email: body.email ?? '',
            password: body.password ?? '',
        });

        if ('error' in result) {
            return HttpResponse.json({ message: result.error }, { status: 409 });
        }

        return HttpResponse.json(result, { status: 201 });
    }),

    http.get(`${API_PREFIX}/auth/me`, ({ request }) => {
        const user = getUserFromToken(getBearerToken(request));

        if (!user) {
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return HttpResponse.json({ data: user } satisfies ApiResponse<typeof user>);
    }),

    http.get(`${API_PREFIX}/dashboard`, () => {
        return HttpResponse.json({ data: getDashboardOverview() });
    }),

    http.get(`${API_PREFIX}/roles`, () => {
        return HttpResponse.json({ data: getRoles() });
    }),

    http.get(`${API_PREFIX}/users`, () => {
        return HttpResponse.json({ data: getUsers() });
    }),

    http.get(`${API_PREFIX}/users/:id`, ({ params }) => {
        const user = getUserById(String(params.id));
        if (!user) {
            return HttpResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return HttpResponse.json({ data: user });
    }),

    http.get(`${API_PREFIX}/datasets`, ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? '1');
        const pageSize = Number(url.searchParams.get('pageSize') ?? '20');
        const all = getDatasets();
        const start = (page - 1) * pageSize;
        const data = all.slice(start, start + pageSize);
        return HttpResponse.json({
            data,
            total: all.length,
            page,
            pageSize,
            totalPages: Math.max(1, Math.ceil(all.length / pageSize)),
        });
    }),

    http.get(`${API_PREFIX}/datasets/:id`, ({ params }) => {
        const dataset = getDatasetById(String(params.id));
        if (!dataset) {
            return HttpResponse.json({ message: 'Dataset not found' }, { status: 404 });
        }
        return HttpResponse.json({ data: dataset });
    }),

    http.post(`${API_PREFIX}/datasets`, async ({ request }) => {
        const body = (await request.json()) as Partial<Dataset>;
        const dataset = addDataset({
            name: body.name ?? 'Untitled Dataset',
            description: body.description,
            fileName: body.fileName ?? 'uploaded.csv',
            fileUrl: body.fileUrl ?? '/mock/uploaded.csv',
            rowCount: body.rowCount ?? 0,
            columnCount: body.columnCount ?? 0,
            status: body.status ?? 'uploading',
            uploadedBy: body.uploadedBy ?? 'user-1',
        });
        return HttpResponse.json({ data: dataset }, { status: 201 });
    }),

    http.patch(`${API_PREFIX}/datasets/:id`, async ({ params, request }) => {
        const body = (await request.json()) as Partial<Dataset>;
        const dataset = updateDataset(String(params.id), body);
        if (!dataset) {
            return HttpResponse.json({ message: 'Dataset not found' }, { status: 404 });
        }
        return HttpResponse.json({ data: dataset });
    }),

    http.delete(`${API_PREFIX}/datasets/:id`, ({ params }) => {
        const deleted = deleteDataset(String(params.id));
        if (!deleted) {
            return HttpResponse.json({ message: 'Dataset not found' }, { status: 404 });
        }
        return new HttpResponse(null, { status: 204 });
    }),

    http.get(`${API_PREFIX}/predictions`, () => {
        return HttpResponse.json({ data: getPredictions() });
    }),

    http.get(`${API_PREFIX}/predictions/:id`, ({ params }) => {
        const prediction = getPredictionById(String(params.id));
        if (!prediction) {
            return HttpResponse.json({ message: 'Prediction not found' }, { status: 404 });
        }
        return HttpResponse.json({ data: prediction });
    }),

    http.post(`${API_PREFIX}/predictions`, async ({ request }) => {
        const body = (await request.json()) as Partial<Prediction>;
        const prediction = addPrediction({
            datasetId: body.datasetId ?? 'dataset-1',
            type: body.type ?? 'churn',
            status: body.status ?? 'queued',
            result: body.result,
        });
        return HttpResponse.json({ data: prediction }, { status: 201 });
    }),

    http.get(`${API_PREFIX}/insights`, () => {
        return HttpResponse.json({ data: getInsights() });
    }),

    http.get(`${API_PREFIX}/reports`, () => {
        return HttpResponse.json({ data: getReports() });
    }),

    http.get(`${API_PREFIX}/canvas`, () => {
        return HttpResponse.json({ data: getCanvasBlocks() });
    }),

    http.patch(`${API_PREFIX}/canvas/:id`, async ({ params, request }) => {
        const body = (await request.json()) as Partial<CanvasBlock>;
        const block = updateCanvasBlock(String(params.id), body.content ? String(body.content) : '');
        if (!block) {
            return HttpResponse.json({ message: 'Canvas block not found' }, { status: 404 });
        }
        return HttpResponse.json({ data: block });
    }),

    http.get(`${API_PREFIX}/access-requests`, () => {
        return HttpResponse.json({ data: getAccessRequests() });
    }),

    http.patch(`${API_PREFIX}/access-requests/:id`, async ({ params, request }) => {
        const body = (await request.json()) as { status?: 'approved' | 'rejected'; reviewedBy?: string };
        if (!body.status) {
            return HttpResponse.json({ message: 'Status is required' }, { status: 400 });
        }
        const result = reviewAccessRequest(String(params.id), body.status, body.reviewedBy ?? 'user-1');
        if (!result) {
            return HttpResponse.json({ message: 'Access request not found' }, { status: 404 });
        }
        return HttpResponse.json({ data: result });
    }),
];
