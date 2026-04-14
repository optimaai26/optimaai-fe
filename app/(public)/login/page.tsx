"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
			<div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
			<div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />

			<div className="relative w-full max-w-md animate-fade-in">
				<div className="text-center mb-8">
					<Link href="/" className="inline-flex items-center gap-2">
						<div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
							<Sparkles className="w-6 h-6 text-white" />
						</div>
						<span className="text-2xl font-bold tracking-tight">
							Optima<span className="text-primary-400">AI</span>
						</span>
					</Link>
					<p className="text-muted-foreground mt-2">Sign in to your account</p>
				</div>

				<div className="glass-card rounded-2xl p-8">
					<LoginForm />

					<div className="mt-6 text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
						>
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
