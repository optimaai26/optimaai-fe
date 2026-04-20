import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type BrandVariant = "wordmark" | "mark";
type BrandTheme = "adaptive" | "color";

type BrandLogoProps = {
	href?: string;
	variant?: BrandVariant;
	theme?: BrandTheme;
	className?: string;
	imageClassName?: string;
	priority?: boolean;
	label?: string;
};

const logoSources = {
	wordmark: {
		color: "/branding/logo-color.svg",
		light: "/branding/logo-navy.svg",
		dark: "/branding/logo-white.svg",
	},
	mark: {
		color: "/branding/mark-color.svg",
		light: "/branding/mark-navy.svg",
		dark: "/branding/mark-white.svg",
	},
} as const;

function BrandImages({
	variant,
	theme,
	imageClassName,
	label,
}: Pick<BrandLogoProps, "variant" | "theme" | "imageClassName" | "label">) {
	const sources = logoSources[variant ?? "wordmark"];

	if (theme === "color") {
		return (
			<img
				src={sources.color}
				alt={label}
				className={cn("block h-8 w-auto", imageClassName)}
			/>
		);
	}

	return (
		<>
			<img
				src={sources.light}
				alt={label}
				className={cn("block h-8 w-auto dark:hidden", imageClassName)}
			/>
			<img
				src={sources.dark}
				alt={label}
				className={cn("hidden h-8 w-auto dark:block", imageClassName)}
			/>
		</>
	);
}

export function BrandLogo({
	href,
	variant = "wordmark",
	theme = "adaptive",
	className,
	imageClassName,
	label = "OptimaAI",
}: BrandLogoProps) {
	const content = (
		<span className={cn("inline-flex items-center", className)}>
			<BrandImages
				variant={variant}
				theme={theme}
				imageClassName={imageClassName}
				label={label}
			/>
		</span>
	);

	if (!href) {
		return content;
	}

	return (
		<Link
			href={href}
			className={cn("inline-flex items-center", className)}
			aria-label={label}
		>
			<BrandImages
				variant={variant}
				theme={theme}
				imageClassName={imageClassName}
				label={label}
			/>
		</Link>
	);
}
