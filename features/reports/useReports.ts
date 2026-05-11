/**
 * features/reports/useReports.ts
 *
 * TanStack Query hooks wrapping the FastAPI /api/v1/reports/* endpoints.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  section_count: number;
}

export interface ReportSection {
  id: string;
  title: string;
  content_md: string;
}

export interface GeneratedReport {
  status: string;
  report_id: string;
  template: string;
  title: string;
  role: string;
  generated_at: string;
  sections: ReportSection[];
  markdown: string;
  files: {
    docx: string;
    pdf: string;
    md: string;
  };
}

export type GenerateReportParams = {
  template_id: string;
  role?: string;
};

/* ------------------------------------------------------------------ */
/* Query keys                                                          */
/* ------------------------------------------------------------------ */

const REPORTS_KEY = ['reports'] as const;
const TEMPLATES_KEY = [...REPORTS_KEY, 'templates'] as const;

/* ------------------------------------------------------------------ */
/* Queries & Mutations                                                 */
/* ------------------------------------------------------------------ */

/** GET /reports/templates — list available templates */
export function useReportTemplates() {
  return useQuery<{ templates: ReportTemplate[] }>({
    queryKey: TEMPLATES_KEY,
    queryFn: () => apiClient.get<{ templates: ReportTemplate[] }>('/reports/templates'),
    staleTime: 5 * 60_000, // 5 minutes — templates rarely change
  });
}

/** POST /reports/generate — generate a new report */
export function useGenerateReport() {
  return useMutation<GeneratedReport, Error, GenerateReportParams>({
    mutationFn: (params) => apiClient.post<GeneratedReport>('/reports/generate', params),
  });
}

/**
 * Build the absolute URL for downloading a report file.
 * The /file/<fmt> endpoint returns a binary stream; opening it in a new tab
 * triggers the browser to download with the proper filename.
 */
export function getReportDownloadUrl(reportId: string, fmt: 'docx' | 'pdf' | 'md'): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';
  return `${base}/reports/${reportId}/file/${fmt}`;
}
