'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            Optima<span className="text-primary-400">AI</span>
                        </span>
                    </Link>
                    <p className="text-muted-foreground mt-2">Create your OptimaAI account</p>
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl p-8">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            // TODO: Implement signup
                        }}
                        className="space-y-5"
                    >
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                                Work Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                required
                                className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 8 characters"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2 text-sm">
                            <input type="checkbox" required className="rounded border-input mt-0.5" />
                            <span className="text-muted-foreground">
                                I agree to the{' '}
                                <a href="#" className="text-primary-400 hover:text-primary-300 font-medium">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-primary-400 hover:text-primary-300 font-medium">
                                    Privacy Policy
                                </a>
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-lg gradient-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary-400/20"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
