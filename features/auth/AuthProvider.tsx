'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@/types';

/* ==========================================
 * Auth Context – Client-side auth state
 * Replace with actual auth provider (NextAuth, Clerk, etc.)
 * ========================================== */

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Mock delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            // TODO: Replace with actual API call
            const mockUser: User = {
                id: '1',
                email,
                name: 'Demo User',
                role: {
                    id: '1',
                    name: 'admin',
                    permissions: [],
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Set mock cookie for middleware
            document.cookie = 'auth_token=mock-token; path=/';

            setUser(mockUser);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        // Clear mock cookie
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
