"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/branding/BrandLogo";

export default function SignupPage() {
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement registration logic with Zod validation
		await new Promise((resolve) => setTimeout(resolve, 2000));
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
			<div className="max-w-md w-full glass-card rounded-2xl p-8 relative z-10 border-dashed border-2">
				<div className="text-center mb-8">
					<BrandLogo variant="mark" imageClassName="h-14 w-auto mx-auto mb-4" />
					<h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
						Create Account
					</h1>
					<p className="text-muted-foreground mt-2">
						Join OptimaAI and transform your data.
					</p>
				</div>

				{/* 
                    TODO: Implement Signup Form with React Hook Form + Zod.
                    - Add fields: Full Name, Email, Password, Company.
                    - Implement validation (min length, email format).
                    - Handle 'Success' state with a confirmation message.
                */}
				<form
					onSubmit={handleSubmit}
					className="space-y-4 opacity-50 pointer-events-none"
				>
					<div className="h-10 bg-muted rounded animate-pulse" />
					<div className="h-10 bg-muted rounded animate-pulse" />
					<div className="h-10 bg-muted rounded animate-pulse" />
					<button
						type="button"
						disabled
						className="w-full py-2.5 rounded-lg bg-primary-500/50 text-white font-semibold"
					>
						Sign Up
					</button>
				</form>

				<div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg text-center">
					<p className="text-sm text-primary-600 dark:text-primary-300 font-medium mb-2">
						Development Task:
					</p>
					<p className="text-xs text-muted-foreground">
						Integrate React Hook Form and Zod to handle the registration flow.
					</p>
				</div>

				<div className="mt-8 text-center">
					<p className="text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-primary-600 hover:underline font-medium"
						>
							Log in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
