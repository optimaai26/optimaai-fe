import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx for conditional class names.
 * This is the standard utility used across all components.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
