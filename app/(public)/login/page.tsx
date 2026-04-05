'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthProvider';
import { Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login, isLoading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"><div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" /><div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" /><div className="relative w-full max-w-md animate-fade-in"><div className="text-center mb-8"><Link href="/" className="inline-flex items-center gap-2"><div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"><Sparkles className="w-6 h-6 text-white" /></div><span className="text-2xl font-bold tracking-tight">Optima<span className="text-primary-400">AI</span></span></Link><p className="text-muted-foreground mt-2">Sign in to your account</p></div><div className="glass-card rounded-2xl p-8"><form onSubmit={handleSubmit} className="space-y-5"><div><label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label><input id="email" name="email" type="email" placeholder="you@company.com" required disabled={isLoading} className="w-full px-4 py-2.5 rounded-lg bg-background border border-input" /></div><div><label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label><div className="relative"><input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="********" required disabled={isLoading} className="w-full px-4 py-2.5 rounded-lg bg-background border border-input pr-10" /><button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>{errorMessage && <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{errorMessage}</div>}<button type="submit" disabled={isLoading} className="w-full py-2.5 rounded-lg gradient-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary-400/20 disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : 'Sign In'}</button></form><div className="mt-6 text-center text-sm text-muted-foreground">Don&apos;t have an account? <Link href="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign up</Link></div></div></div></div>
    );
}
