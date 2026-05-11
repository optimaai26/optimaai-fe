'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { OdooConnectionPanel } from '@/features/odoo/OdooConnectionPanel';
import { OdooPreviewPanel } from '@/features/odoo/OdooPreviewPanel';
import { OdooSyncHistory } from '@/features/odoo/OdooSyncHistory';
import { OdooSyncPanel } from '@/features/odoo/OdooSyncPanel';

/**
 * OdooPageClient
 * --------------
 * The full Odoo integration management page.
 *
 * Layout choices
 * --------------
 * - Two-column on desktop so Connection and Sync sit side-by-side at eye
 *   level — testing the connection and triggering a sync are the primary
 *   actions.
 * - Single column on mobile — readability beats density at small widths.
 * - Preview and History stack underneath full-width because they're
 *   secondary surfaces the user inspects after their primary action.
 */
export function OdooPageClient() {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Odoo Integration"
        description="Pull CRM, Sales, and Invoice records from your Odoo instance and feed them through the OptimaAI analytics pipeline."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OdooConnectionPanel />
        <OdooSyncPanel />
      </div>

      <OdooPreviewPanel />
      <OdooSyncHistory />
    </div>
  );
}
