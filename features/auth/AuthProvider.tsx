"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	apiClient,
	clearAuthToken,
	getStoredAuthToken,
	persistAuthToken,
} from "@/lib/api/api-client";
import type { ApiResponse, User } from "@/types";

interface AuthState {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (payload: {
		fullName: string;
		email: string;
		password: string;
	}) => Promise<void>;
	logout: () => void;
	refreshSession: () => Promise<void>;
}

type AuthPayload = { token: string; user: User };

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refreshSession = useCallback(async () => {
		const token = getStoredAuthToken();
		if (!token) {
			setUser(null);
			setIsLoading(false);
			return;
		}
		try {
			const response = await apiClient.get<ApiResponse<User>>("/auth/me");
			setUser(response.data);
		} catch {
			clearAuthToken();
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void refreshSession();
	}, [refreshSession]);

	const login = useCallback(async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const response = await apiClient.post<ApiResponse<AuthPayload>>(
				"/auth/login",
				{ email, password },
			);
			persistAuthToken(response.data.token);
			setUser(response.data.user);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const register = useCallback(
		async ({
			fullName,
			email,
			password,
		}: {
			fullName: string;
			email: string;
			password: string;
		}) => {
			setIsLoading(true);
			try {
				const response = await apiClient.post<ApiResponse<AuthPayload>>(
					"/auth/register",
					{ fullName, email, password },
				);
				// Auto-login: persist token and hydrate user after successful registration
				persistAuthToken(response.data.token);
				setUser(response.data.user);
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const logout = useCallback(() => {
		clearAuthToken();
		setUser(null);
	}, []);

	const value = useMemo<AuthState>(
		() => ({
			user,
			isLoading,
			isAuthenticated: !!user,
			login,
			register,
			logout,
			refreshSession,
		}),
		[user, isLoading, login, register, logout, refreshSession],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
