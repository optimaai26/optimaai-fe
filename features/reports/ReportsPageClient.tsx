'use client';

/**
 * features/reports/ReportsPageClient.tsx
 *
 * The Reports tab. Lets the user pick from registered templates, generates
 * a multi-section AI report, renders it inline, and offers .docx / .pdf
 * downloads.
 */

import { useState } from 'react';
import {
    BarChart3,
    Download,
    FileText,
    Loader2,
    RefreshCw,
    TrendingUp,
    Users,
    type LucideIcon,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { MarkdownContent } from '@/components/data-display/MarkdownContent';
import { useAuth } from '@/features/auth/AuthProvider';
import {
    getReportDownloadUrl,
    useGenerateReport,
    useReportTemplates,
    type GeneratedReport,
    type ReportTemplate,
} from '@/features/reports/useReports';

// ──────────────────────────────────────────────────────────────────────
// Icon map — backend sends a string name; map to the Lucide component.
// ──────────────────────────────────────────────────────────────────────

const ICONS: Record<string, LucideIcon> = {
    FileText,
    Users,
    TrendingUp,
    BarChart3,
};

export function ReportsPageClient() {
    const { user } = useAuth();
    const role = user?.role?.name ?? 'business analyst';

    const { data: templatesData, isLoading: loadingTemplates } = useReportTemplates();
    const generate = useGenerateReport();

    const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
    const [report, setReport] = useState<GeneratedReport | null>(null);

    const templates = templatesData?.templates ?? [];

    const onGenerate = async (tpl: ReportTemplate) => {
        setSelectedTemplate(tpl);
        setReport(null);
        try {
            const result = await generate.mutateAsync({
                template_id: tpl.id,
                role,
            });
            setReport(result);
        } catch (err) {
            console.error('Report generation failed', err);
        }
    };

    const onRegenerate = () => {
        if (selectedTemplate) void onGenerate(selectedTemplate);
    };

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="AI Reports"
                description="Generate executive-ready reports from your data and ML models."
            />

            {/* Template picker */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Choose a template
                </h2>

                {loadingTemplates ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading templates…
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {templates.map((tpl) => (
                            <TemplateCard
                                key={tpl.id}
                                template={tpl}
                                isActive={selectedTemplate?.id === tpl.id}
                                isLoading={
                                    generate.isPending && selectedTemplate?.id === tpl.id
                                }
                                onClick={() => onGenerate(tpl)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Generation in progress */}
            {generate.isPending && (
                <div className="glass-card rounded-2xl border border-border p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
                    <p className="font-medium">Generating your {selectedTemplate?.title}…</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        This usually takes 20–40 seconds. The AI is analysing your ML
                        results and uploaded data, section by section.
                    </p>
                </div>
            )}

            {/* Error */}
            {generate.isError && !generate.isPending && (
                <div className="glass-card rounded-xl border border-danger/30 p-4 text-sm text-danger">
                    Report generation failed: {generate.error?.message ?? 'Unknown error'}
                </div>
            )}

            {/* Rendered report */}
            {report && !generate.isPending && (
                <RenderedReport report={report} onRegenerate={onRegenerate} />
            )}
        </div>
    );
}

/* ============================================================== */
/*  Sub-components                                                 */
/* ============================================================== */

function TemplateCard({
    template,
    isActive,
    isLoading,
    onClick,
}: {
    template: ReportTemplate;
    isActive: boolean;
    isLoading: boolean;
    onClick: () => void;
}) {
    const Icon = ICONS[template.icon] ?? FileText;
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isLoading}
            className={[
                'group text-left p-5 rounded-2xl border transition glass-card',
                'hover:border-primary/50 hover:shadow-lg disabled:opacity-60 disabled:cursor-wait',
                isActive ? 'border-primary/60 ring-1 ring-primary/30' : 'border-border',
            ].join(' ')}
        >
            <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <h3 className="font-semibold leading-snug">{template.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        {template.section_count} sections
                    </p>
                </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
                {template.description}
            </p>
            <div className="mt-4 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition">
                {isLoading ? 'Generating…' : 'Generate →'}
            </div>
        </button>
    );
}

function RenderedReport({
    report,
    onRegenerate,
}: {
    report: GeneratedReport;
    onRegenerate: () => void;
}) {
    const docxUrl = getReportDownloadUrl(report.report_id, 'docx');
    const pdfUrl = getReportDownloadUrl(report.report_id, 'pdf');

    return (
        <article className="glass-card rounded-2xl border border-border p-8 space-y-6">
            {/* Header bar */}
            <header className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-border">
                <div>
                    <h2 className="text-2xl font-bold">{report.title}</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Generated {new Date(report.generated_at).toLocaleString()}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <DownloadButton url={pdfUrl} label="PDF" />
                    <DownloadButton url={docxUrl} label="Word" />
                    <button
                        type="button"
                        onClick={onRegenerate}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-border hover:bg-muted"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                    </button>
                </div>
            </header>

            {/* Sections */}
            <div className="space-y-8">
                {report.sections.map((sec) => (
                    <section key={sec.id} className="space-y-3">
                        <h3 className="text-lg font-semibold border-b border-border pb-2">
                            {sec.title}
                        </h3>
                        <MarkdownContent variant="full">
                            {sec.content_md}
                        </MarkdownContent>
                    </section>
                ))}
            </div>
        </article>
    );
}

function DownloadButton({ url, label }: { url: string; label: string }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
            <Download className="w-4 h-4" />
            {label}
        </a>
    );
}