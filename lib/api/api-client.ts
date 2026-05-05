/**
 * OptimaAI API Client
 * Typed fetch wrapper with base URL, error handling, and auth header injection.
 */

export const AUTH_TOKEN_KEY = "auth_token";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export class ApiError extends Error {
	constructor(
		public status: number,
		public statusText: string,
		public body?: unknown,
	) {
		// Extract FastAPI's `detail` field if present, otherwise fall back
		const detail =
			body && typeof body === "object" && "detail" in body
				? String((body as { detail: unknown }).detail)
				: statusText;
		super(`${status}: ${detail}`);
		this.name = "ApiError";
	}
}

export function persistAuthToken(token: string): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(AUTH_TOKEN_KEY, token);
	// biome-ignore lint/suspicious/noDocumentCookie: SSR requires standard cookie set bypass
	document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=86400; samesite=lax`;
}

export function clearAuthToken(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(AUTH_TOKEN_KEY);
	// biome-ignore lint/suspicious/noDocumentCookie: SSR requires standard cookie clear bypass
	document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax`;
}

export function getStoredAuthToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(AUTH_TOKEN_KEY);
}

async function getAuthHeaders(): Promise<Record<string, string>> {
	const token = getStoredAuthToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
	endpoint: string,
	options: RequestOptions = {},
): Promise<T> {
	const { body, headers: customHeaders, ...restOptions } = options;

	const authHeaders = await getAuthHeaders();

	const headers: Record<string, string> = {
		...authHeaders,
		...((customHeaders as Record<string, string>) ?? {}),
	};

	if (body && !(body instanceof FormData)) {
		headers["Content-Type"] = "application/json";
	}

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...restOptions,
		headers,
		credentials: "include",
		body:
			body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => undefined);
		throw new ApiError(response.status, response.statusText, errorBody);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}

export const apiClient = {
	get: <T>(endpoint: string, options?: RequestOptions) =>
		request<T>(endpoint, { ...options, method: "GET" }),

	post: <T>(
		endpoint: string,
		body?: Record<string, unknown>,
		options?: RequestOptions,
	) => request<T>(endpoint, { ...options, method: "POST", body }),

	put: <T>(
		endpoint: string,
		body?: Record<string, unknown>,
		options?: RequestOptions,
	) => request<T>(endpoint, { ...options, method: "PUT", body }),

	patch: <T>(
		endpoint: string,
		body?: Record<string, unknown>,
		options?: RequestOptions,
	) => request<T>(endpoint, { ...options, method: "PATCH", body }),

	delete: <T>(endpoint: string, options?: RequestOptions) =>
		request<T>(endpoint, { ...options, method: "DELETE" }),
};
