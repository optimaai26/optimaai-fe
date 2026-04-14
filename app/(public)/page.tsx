import {
	ArrowRight,
	BarChart3,
	BrainCircuit,
	Database,
	Shield,
	Sparkles,
} from "lucide-react";
import Link from "next/link";

const features = [
	{
		icon: Database,
		title: "Smart Data Upload",
		description:
			"Upload CSV files and let our AI clean, transform, and prepare your data automatically.",
	},
	{
		icon: BrainCircuit,
		title: "ML Predictions",
		description:
			"Churn prediction, revenue forecasting, and growth scoring powered by cutting-edge models.",
	},
	{
		icon: Sparkles,
		title: "AI Insights",
		description:
			"LLM-generated strategic recommendations tailored to your business data.",
	},
	{
		icon: BarChart3,
		title: "Smart Charts",
		description:
			"AI suggests the best chart type for your data. Explore alternatives with one click.",
	},
	{
		icon: Shield,
		title: "Role-Based Access",
		description:
			"Fine-grained RBAC with department scoping and access request workflows.",
	},
];

export default function LandingPage() {
	return (
		<>
			{/* Navigation */}
			<nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
							<Sparkles className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold tracking-tight">
							Optima<span className="text-primary-400">AI</span>
						</span>
					</Link>

					<div className="flex items-center gap-4">
						<Link
							href="/login"
							className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							Sign in
						</Link>
						<Link
							href="/signup"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
						>
							Get Started
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero */}
			<section className="relative pt-32 pb-20 px-6 overflow-hidden">
				{/* Background gradient orbs */}
				<div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
				<div className="absolute top-40 right-1/4 w-72 h-72 bg-primary-600/15 rounded-full blur-3xl" />

				<div className="relative max-w-4xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 text-sm font-medium mb-6">
						<Sparkles className="w-4 h-4" />
						AI-Powered Business Analytics
					</div>

					<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
						Turn Data Into
						<span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
							Strategic Decisions
						</span>
					</h1>

					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
						Upload your data, get ML predictions, receive AI-generated insights,
						and build your Business Model Canvas — all in one platform.
					</p>

					<div className="flex items-center justify-center gap-4">
						<Link
							href="/signup"
							className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-primary-400/25"
						>
							Start Free Trial
							<ArrowRight className="w-5 h-5" />
						</Link>
						<Link
							href="#features"
							className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-base hover:bg-muted transition-colors"
						>
							See Features
						</Link>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section id="features" className="py-20 px-6">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Everything You Need to
							<span className="text-primary-400"> Dominate</span> Your Market
						</h2>
						<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
							From raw CSV to actionable strategy — OptimaAI handles the entire
							analytics pipeline.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="group glass-card rounded-xl p-6 hover:border-primary-400/30 transition-all duration-300"
							>
								<div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<feature.icon className="w-6 h-6 text-primary-400" />
								</div>
								<h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border py-8 px-6 mt-auto">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<span className="text-sm text-muted-foreground">
						© 2026 OptimaAI. All rights reserved.
					</span>
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
							<Sparkles className="w-3.5 h-3.5 text-white" />
						</div>
						<span className="text-sm font-semibold">OptimaAI</span>
					</div>
				</div>
			</footer>
		</>
	);
}
