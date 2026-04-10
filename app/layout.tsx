import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from '@/components/ui/Toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'OptimaAI – AI-Powered Analytics Platform',
    template: '%s | OptimaAI',
  },
  description:
    'OptimaAI is a B2B SaaS analytics platform with ML predictions, LLM-powered insights, and Business Model Canvas editing.',
  keywords: ['analytics', 'AI', 'machine learning', 'business intelligence', 'SaaS'],
  authors: [{ name: 'OptimaAI' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
