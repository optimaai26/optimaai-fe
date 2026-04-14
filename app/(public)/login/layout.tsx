import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Log In | OptimaAI",
	description:
		"Log in to your OptimaAI account to access business intelligence and insights.",
};

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
