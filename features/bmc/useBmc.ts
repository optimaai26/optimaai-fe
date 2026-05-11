/**
 * features/bmc/useBmc.ts
 *
 * TanStack Query hooks wrapping /api/v1/bmc/* endpoints.
 */

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';

export type EvidenceTag = 'observed' | 'derived' | 'inferred' | 'assumption';

export interface BmcBullet {
  text: string;
  tag: EvidenceTag;
}

export interface BmcBlock {
  id: string;
  title: string;
  icon: string;
  grid_pos: { row: number; col: number; rowspan: number; colspan: number };
  bullets: BmcBullet[];
  confidence: 'high' | 'medium' | 'low';
  data_used: string[];
}

export interface BmcResponse {
  status: 'success' | 'no_data';
  bmc_id?: string;
  business_name: string;
  generated_at: string;
  blocks: BmcBlock[];
  data_scope: {
    sources: string[];
    chunks: number;
    is_sparse: boolean;
  };
  files?: { docx: string; pdf: string };
  message?: string;
}

export type GenerateBmcParams = {
  business_name?: string;
};

/** POST /bmc/generate — generate a fresh BMC */
export function useGenerateBmc() {
  return useMutation<BmcResponse, Error, GenerateBmcParams>({
    mutationFn: (params) => apiClient.post<BmcResponse>('/bmc/generate', params),
  });
}

/** Build a download URL for the BMC docx/pdf. */
export function getBmcDownloadUrl(bmcId: string, fmt: 'docx' | 'pdf'): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';
  return `${base}/bmc/${bmcId}/file/${fmt}`;
}
