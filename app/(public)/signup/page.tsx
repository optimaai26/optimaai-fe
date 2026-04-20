"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/features/auth/AuthProvider";

const signupSchema = z.object({
	fullName: z.string().min(3, "Full name must be at least 3 characters."),
	email: z.string().email("Enter a valid email address."),
	password: z.string().min(8, "Password must be at least 8 characters."),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
	const router = useRouter();
	const { register: registerUser, isLoading } = useAuth();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: { fullName: "", email: "", password: "" },
	});

	const onSubmit = async (values: SignupFormValues) => {
		setErrorMessage(null);
		setSuccessMessage(null);
		try {
			await registerUser(values);
			setSuccessMessage(
				"Account created successfully. Redirecting to login...",
			);
			setTimeout(() => router.push("/login"), 1000);
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : "Registration failed.",
			);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
			<div className="max-w-md w-full glass-card rounded-2xl p-8 relative z-10 border border-border">
				<div className="text-center mb-8">
					<img src="/assets/logos/c4.svg" alt="OptimaAI Icon" className="h-16 w-auto mx-auto mb-4" />
					<h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
						Create Account
					</h1>
					<p className="text-muted-foreground mt-2">
						Join OptimaAI and transform your data.
					</p>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<label
							htmlFor="fullName"
							className="block text-sm font-medium mb-1.5"
						>
							Full Name
						</label>
						<input
							id="fullName"
							{...register("fullName")}
							className="w-full px-4 py-2.5 rounded-lg bg-background border border-input"
							placeholder="Your full name"
							disabled={isLoading}
						/>
						{errors.fullName && (
							<p className="text-xs text-danger mt-1">
								{errors.fullName.message}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1.5">
							Email
						</label>
						<input
							id="email"
							type="email"
							{...register("email")}
							className="w-full px-4 py-2.5 rounded-lg bg-background border border-input"
							placeholder="you@company.com"
							disabled={isLoading}
						/>
						{errors.email && (
							<p className="text-xs text-danger mt-1">{errors.email.message}</p>
						)}
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium mb-1.5"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							{...register("password")}
							className="w-full px-4 py-2.5 rounded-lg bg-background border border-input"
							placeholder="Choose a secure password"
							disabled={isLoading}
						/>
						{errors.password && (
							<p className="text-xs text-danger mt-1">
								{errors.password.message}
							</p>
						)}
					</div>
					{errorMessage && (
						<div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
							{errorMessage}
						</div>
					)}
					{successMessage && (
						<div className="text-sm text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2">
							{successMessage}
						</div>
					)}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-2.5 rounded-lg gradient-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Creating account...
							</>
						) : (
							"Sign Up"
						)}
					</button>
				</form>
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
