import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'OptimaAI – AI-Powered Analytics Platform',
};

/**
 * Marketing layout – No sidebar, minimal chrome.
 * Used for landing, login, signup pages.
 */
export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {children}
        </div>
    );
}
