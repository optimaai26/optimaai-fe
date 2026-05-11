import { OdooPageClient } from '@/features/odoo/OdooPageClient';

export const metadata = {
  title: 'Odoo Integration · OptimaAI',
  description: 'Connect, sync, and manage your Odoo ERP data source.',
};

export default function OdooIntegrationPage() {
  return <OdooPageClient />;
}
