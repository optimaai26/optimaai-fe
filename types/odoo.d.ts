/**
 * Odoo integration type definitions.
 * Mirrors the response shapes returned by /api/v1/odoo/* on the FastAPI backend.
 *
 * Either re-export this from `types/index.d.ts`, or import directly via
 * `@/types/odoo`.
 */

/** Odoo models the connector knows how to read. */
export type OdooModel = 'sale.order' | 'account.move' | 'crm.lead' | 'res.partner';

/** Subset filter for which categories to include in a sync. */
export type OdooIncludeOption = 'sales' | 'invoices' | 'leads';

/** Lightweight status — does NOT contact Odoo. Returned by GET /odoo/status. */
export interface OdooStatus {
  configured: boolean;
  url: string | null;
  db: string | null;
  username: string | null;
  auth_method: 'api_key' | 'password';
  last_sync_at: string | null;
  sync_count: number;
}

/** Live ping result from POST /odoo/test-connection. */
export interface OdooConnectionInfo {
  ok: boolean;
  connected: boolean;
  url: string;
  db: string;
  uid: number;
  counts: Record<OdooModel, number>;
}

/** Body for POST /odoo/sync. */
export interface OdooSyncRequest {
  incremental?: boolean;
  since?: string | null;
  include?: OdooIncludeOption[];
  limit?: number;
  ingest_kb?: boolean;
}

/** Result of POST /odoo/sync — both inline and queued shapes. */
export interface OdooSyncResult {
  status: 'completed' | 'queued' | 'empty';
  message?: string;
  upload_id?: number;
  table_name?: string;
  file_name?: string;
  rows?: number;
  columns?: number;
  quality_before?: number;
  quality_after?: number;
  extracted_at?: string;
  completed_at?: string;
  filters?: {
    since: string | null;
    include: string[];
    limit: number | null;
  };
}

/** A row returned by GET /odoo/syncs. */
export interface OdooSyncRecord {
  id: number;
  file: string;
  table_name: string;
  rows: number;
  columns: number;
  quality_before: number | null;
  quality_after: number | null;
  uploaded_at: string;
  status: string;
}

/** GET /odoo/preview response. */
export interface OdooPreviewResponse {
  model: OdooModel;
  count: number;
  rows: Array<Record<string, unknown>>;
}
