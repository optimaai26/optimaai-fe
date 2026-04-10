import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign Up | OptimaAI',
    description: 'Create a new OptimaAI account to start analyzing your business data.',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
