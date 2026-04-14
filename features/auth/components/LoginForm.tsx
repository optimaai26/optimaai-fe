"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/features/auth/AuthProvider";

const loginSchema = z.object({
	email: z.string().email("Enter a valid email address."),
	password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const router = useRouter();
	const { login, isLoading } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (values: LoginFormValues) => {
		setErrorMessage(null);
		try {
			await login(values.email, values.password);
			router.push("/dashboard");
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Login failed");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
			<div>
				<label htmlFor="email" className="block text-sm font-medium mb-1.5">
					Email
				</label>
				<input
					id="email"
					type="email"
					placeholder="you@company.com"
					disabled={isLoading}
					{...register("email")}
					className="w-full px-4 py-2.5 rounded-lg bg-background border border-input"
				/>
				{errors.email && (
					<p className="text-xs text-danger mt-1">{errors.email.message}</p>
				)}
			</div>
			<div>
				<label htmlFor="password" className="block text-sm font-medium mb-1.5">
					Password
				</label>
				<div className="relative">
					<input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="********"
						disabled={isLoading}
						{...register("password")}
						className="w-full px-4 py-2.5 rounded-lg bg-background border border-input pr-10"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						disabled={isLoading}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
					>
						{showPassword ? (
							<EyeOff className="w-4 h-4" />
						) : (
							<Eye className="w-4 h-4" />
						)}
					</button>
				</div>
				{errors.password && (
					<p className="text-xs text-danger mt-1">{errors.password.message}</p>
				)}
			</div>

			{errorMessage && (
				<div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
					{errorMessage}
				</div>
			)}

			<button
				type="submit"
				disabled={isLoading}
				className="w-full py-2.5 rounded-lg gradient-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary-400/20 disabled:opacity-50 flex items-center justify-center gap-2"
			>
				{isLoading ? (
					<>
						<Loader2 className="w-4 h-4 animate-spin" />
						Signing in...
					</>
				) : (
					"Sign In"
				)}
			</button>
		</form>
	);
}
