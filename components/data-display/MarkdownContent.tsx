'use client';

/**
 * components/MarkdownContent.tsx
 *
 * Shared markdown renderer for OptimaAi. Used by Reports, Insights, and
 * anywhere else we surface LLM-generated markdown to the user.
 *
 * Built on react-markdown + remark-gfm so we get GitHub-flavored markdown
 * for free: tables, task lists, strikethrough, autolinks, etc.
 *
 * Each HTML element gets a Tailwind-styled override so the rendered output
 * matches the OptimaAi design system (rounded borders, alternating row
 * tints, primary-tinted strong/links, etc.).
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MarkdownContentProps {
    children: string;
    /** Use 'compact' inside chat bubbles, 'full' inside report sections. */
    variant?: 'compact' | 'full';
}

export function MarkdownContent({
    children,
    variant = 'full',
}: MarkdownContentProps) {
    return (
        <div
            className={
                variant === 'compact'
                    ? 'text-sm leading-relaxed text-foreground space-y-2'
                    : 'text-sm leading-relaxed text-foreground space-y-4'
            }
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MARKDOWN_COMPONENTS}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}

// ──────────────────────────────────────────────────────────────────────
// Tailwind-styled element overrides
// ──────────────────────────────────────────────────────────────────────
//
// react-markdown calls these for every node it encounters in the parsed
// markdown tree. Each one returns a React element with our design-system
// classes applied. Anything not listed here uses react-markdown's default.
// ──────────────────────────────────────────────────────────────────────

const MARKDOWN_COMPONENTS: Components = {
    // ── Paragraphs ────────────────────────────────────────────────────
    p: ({ children }) => (
        <p className="leading-relaxed">{children}</p>
    ),

    // ── Headings ──────────────────────────────────────────────────────
    h1: ({ children }) => (
        <h1 className="text-xl font-bold mt-2 mb-1">{children}</h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-lg font-semibold mt-2 mb-1">{children}</h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>
    ),
    h4: ({ children }) => (
        <h4 className="text-sm font-semibold mt-2 mb-1">{children}</h4>
    ),

    // ── Inline emphasis ───────────────────────────────────────────────
    strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
        <em className="italic text-muted-foreground">{children}</em>
    ),

    // ── Links ─────────────────────────────────────────────────────────
    a: ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
        >
            {children}
        </a>
    ),

    // ── Lists ─────────────────────────────────────────────────────────
    ul: ({ children }) => (
        <ul className="list-disc list-outside pl-6 space-y-1 my-2">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal list-outside pl-6 space-y-1 my-2">{children}</ol>
    ),
    li: ({ children }) => (
        <li className="leading-relaxed">{children}</li>
    ),

    // ── Tables (the headline feature) ─────────────────────────────────
    table: ({ children }) => (
        // Wrapped in an overflow-x container so wide tables scroll on
        // narrow screens instead of breaking the layout.
        <div className="my-3 overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }) => (
        <thead className="bg-muted/50 border-b border-border">{children}</thead>
    ),
    tbody: ({ children }) => (
        <tbody className="divide-y divide-border">{children}</tbody>
    ),
    tr: ({ children }) => (
        // Subtle hover for scannability on long tables
        <tr className="transition-colors hover:bg-muted/30">{children}</tr>
    ),
    th: ({ children, style }) => (
        <th
            className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            style={style}
        >
            {children}
        </th>
    ),
    td: ({ children, style }) => (
        <td
            className="px-3 py-2 align-top text-foreground/90"
            style={style}
        >
            {children}
        </td>
    ),

    // ── Blockquotes ───────────────────────────────────────────────────
    blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-primary/40 bg-muted/20 pl-4 py-1 italic text-muted-foreground my-2">
            {children}
        </blockquote>
    ),

    // ── Code ──────────────────────────────────────────────────────────
    code: ({ inline, children, ...props }: any) =>
        inline ? (
            <code
                className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary"
                {...props}
            >
                {children}
            </code>
        ) : (
            <code className="block font-mono text-xs" {...props}>
                {children}
            </code>
        ),
    pre: ({ children }) => (
        <pre className="p-3 rounded-lg bg-muted overflow-x-auto my-2 text-xs">
            {children}
        </pre>
    ),

    // ── Horizontal rule ───────────────────────────────────────────────
    hr: () => <hr className="my-4 border-border" />,
};
