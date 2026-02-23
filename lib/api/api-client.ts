/**
 * OptimaAI API Client
 * Typed fetch wrapper with base URL, error handling, and auth header injection.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public body?: unknown,
    ) {
        super(`API Error ${status}: ${statusText}`);
        this.name = 'ApiError';
    }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: Record<string, unknown> | FormData;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
    // TODO: Replace with actual auth token retrieval
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers: customHeaders, ...restOptions } = options;

    const authHeaders = await getAuthHeaders();

    const headers: Record<string, string> = {
        ...authHeaders,
        ...((customHeaders as Record<string, string>) ?? {}),
    };

    // Only set Content-Type for JSON bodies (not FormData)
    if (body && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...restOptions,
        headers,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => undefined);
        throw new ApiError(response.status, response.statusText, errorBody);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const apiClient = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body?: Record<string, unknown>, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'POST', body }),

    put: <T>(endpoint: string, body?: Record<string, unknown>, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'PUT', body }),

    patch: <T>(endpoint: string, body?: Record<string, unknown>, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'PATCH', body }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};
