import { PageHeader } from '@/components/layout/PageHeader';
import { BrainCircuit, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Insights' };

export default function InsightsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between gap-6">
        <PageHeader
          title="AI Strategic Insights"
          description="LLM-powered recommendations derived from your data patterns."
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export PDF
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export PNG
          </button>
        </div>
      </div>

      {/* ✅ Strategic Recommendations header row (like the photo) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Strategic Recommendations</h2>
        </div>

        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md">
          5 New Insights
        </span>
      </div>

      {/* ✅ Main layout like the photo: left cards + vertical divider + right canvas */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 xl:gap-0 items-start">
        {/* LEFT SIDE */}
        <div className="space-y-4 xl:pr-6">
{/* Card 1 */}
<article className="w-full rounded-xl border border-gray-200 bg-white p-4">
  <div className="flex items-start gap-3">
    <Lightbulb className="w-5 h-5 text-gray-700 mt-0.5" />
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-gray-900">Cost Structure Alert</h3>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
          FINANCIAL
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-700">
          HIGH IMPACT
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
          92% Confidence
        </span>
      </div>

      <p className="text-sm text-gray-700 mt-2">
        Supply chain logistics costs have risen{' '}
        <span className="font-semibold text-red-600">8% MoM</span>. Based on current contracts,
        renegotiating with &apos;SpeedyShip&apos; or switching to regional providers could save
        an estimated <span className="font-semibold">$12k/quarter</span>.
      </p>

      {/* ✅ Actions row (Update + Share with Dept) */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          Update Cost Structure
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M12.5 11.2c-.6 0-1.1.2-1.5.6L6.7 9.3c.1-.2.1-.4.1-.6s0-.4-.1-.6L11 5.6c.4.4.9.6 1.5.6 1.2 0 2.2-1 2.2-2.2S13.7 1.8 12.5 1.8s-2.2 1-2.2 2.2c0 .2 0 .4.1.6L6.1 7.1c-.4-.4-.9-.6-1.5-.6C3.4 6.5 2.4 7.5 2.4 8.7s1 2.2 2.2 2.2c.6 0 1.1-.2 1.5-.6l4.3 2.5c-.1.2-.1.4-.1.6 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2-1-2.2-2.2-2.2Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          Share with Dept
        </button>
      </div>
    </div>
  </div>
</article>

{/* Card 2 */}
<article className="w-full rounded-xl border border-gray-200 bg-white p-4">
  <div className="flex items-start gap-3">
    <Lightbulb className="w-5 h-5 text-gray-700 mt-0.5" />
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-gray-900">Customer Segment Opportunity</h3>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
          GROWTH
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
          MEDIUM IMPACT
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
          88% Confidence
        </span>
      </div>

      <p className="text-sm text-gray-700 mt-2">
        Recent sales data indicates a surge in B2B micro-transactions. Targeting{' '}
        <span className="font-semibold text-indigo-600">
          &apos;Local Cafes &amp; Coworking Spaces&apos;
        </span>{' '}
        specifically could increase revenue by 15% in Q3.
      </p>

      {/* ✅ Actions row (Primary + Share with Dept) */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          Add to Segments
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M12.5 11.2c-.6 0-1.1.2-1.5.6L6.7 9.3c.1-.2.1-.4.1-.6s0-.4-.1-.6L11 5.6c.4.4.9.6 1.5.6 1.2 0 2.2-1 2.2-2.2S13.7 1.8 12.5 1.8s-2.2 1-2.2 2.2c0 .2 0 .4.1.6L6.1 7.1c-.4-.4-.9-.6-1.5-.6C3.4 6.5 2.4 7.5 2.4 8.7s1 2.2 2.2 2.2c.6 0 1.1-.2 1.5-.6l4.3 2.5c-.1.2-.1.4-.1.6 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2-1-2.2-2.2-2.2Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          Share with Dept
        </button>
      </div>
    </div>
  </div>
</article>

{/* Card 3 */}
<article className="w-full rounded-xl border border-gray-200 bg-white p-4">
  <div className="flex items-start gap-3">
    <Lightbulb className="w-5 h-5 text-gray-700 mt-0.5" />
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-gray-900">Inventory Turnover</h3>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
          OPERATIONS
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-700">
          LOW IMPACT
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
          75% Confidence
        </span>
      </div>

      <p className="text-sm text-gray-700 mt-2">
        Product category &apos;Accessories&apos; has a low turnover rate (3.2). Consider bundling
        these items or running a clearance campaign to free up capital.
      </p>

      {/* ✅ Actions row (Primary + Share with Dept) */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          View Inventory Details
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M12.5 11.2c-.6 0-1.1.2-1.5.6L6.7 9.3c.1-.2.1-.4.1-.6s0-.4-.1-.6L11 5.6c.4.4.9.6 1.5.6 1.2 0 2.2-1 2.2-2.2S13.7 1.8 12.5 1.8s-2.2 1-2.2 2.2c0 .2 0 .4.1.6L6.1 7.1c-.4-.4-.9-.6-1.5-.6C3.4 6.5 2.4 7.5 2.4 8.7s1 2.2 2.2 2.2c.6 0 1.1-.2 1.5-.6l4.3 2.5c-.1.2-.1.4-.1.6 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2-1-2.2-2.2-2.2Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          Share with Dept
        </button>
      </div>
    </div>
  </div>
</article>

{/* Card 4 Placeholder */}
<article className="w-full rounded-xl border border-dashed border-gray-300 bg-white p-4">
  <div className="flex items-start gap-3">
    <Lightbulb className="w-5 h-5 text-gray-400 mt-0.5" />
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-gray-700">Placeholder Recommendation</h3>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          PLACEHOLDER
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-600">
          TBD IMPACT
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-600">
          TBD Confidence
        </span>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Add your next AI recommendation here (placeholder).
      </p>

      {/* ✅ Actions row (Coming soon + Share with Dept) */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-600 cursor-not-allowed"
          disabled
        >
          Coming Soon
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M12.5 11.2c-.6 0-1.1.2-1.5.6L6.7 9.3c.1-.2.1-.4.1-.6s0-.4-.1-.6L11 5.6c.4.4.9.6 1.5.6 1.2 0 2.2-1 2.2-2.2S13.7 1.8 12.5 1.8s-2.2 1-2.2 2.2c0 .2 0 .4.1.6L6.1 7.1c-.4-.4-.9-.6-1.5-.6C3.4 6.5 2.4 7.5 2.4 8.7s1 2.2 2.2 2.2c.6 0 1.1-.2 1.5-.6l4.3 2.5c-.1.2-.1.4-.1.6 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2-1-2.2-2.2-2.2Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          Share with Dept
        </button>
      </div>
    </div>
  </div>
</article>
        </div>


        {/* RIGHT SIDE (Canvas) */}
        <aside className="w-full xl:w-[420px] xl:border-l xl:border-gray-200 xl:pl-6 xl:sticky xl:top-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-900">
                LIVE CANVAS MODEL
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                Auto-saving
              </div>
            </div>

            {/* Toggle */}
            <label className="flex items-center gap-2 select-none">
              <span className="text-[10px] font-semibold text-gray-500 tracking-wide">
                DEPT OVERLAYS
              </span>
              <span className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  aria-label="Toggle department overlays"
                  className="sr-only peer"
                />
                <span className="w-10 h-5 rounded-full bg-gray-200 peer-checked:bg-indigo-600 transition-colors" />
                <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          </div>

          <div className="space-y-4">
            {/* Key Partners + Key Activities */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6.5 6.5L8 8M9.5 9.5L8 8M2.5 10.5L5 8C5.6 7.4 6.4 7.4 7 8L8 9C8.6 9.6 9.4 9.6 10 9L13.5 5.5"
                        stroke="#9CA3AF"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-[11px] font-semibold tracking-wide text-gray-500">
                      KEY PARTNERS
                    </p>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    OPS
                  </span>
                </div>

                <ul className="mt-3 text-xs text-gray-700 space-y-2 list-disc pl-4">
                  <li>SpeedyShip Logistics</li>
                  <li>AWS (Cloud infra)</li>
                  <li className="text-gray-400 italic">Add partner...</li>
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="#9CA3AF" strokeWidth="1.2" fill="none" />
                      <path
                        d="M5.5 8L7.2 9.7L10.6 6.3"
                        stroke="#9CA3AF"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-[11px] font-semibold tracking-wide text-gray-500">
                      KEY ACTIVITIES
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
                      DEV
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold">
                      MKT
                    </span>
                  </div>
                </div>

                <ul className="mt-3 text-xs text-gray-700 space-y-2 list-disc pl-4">
                  <li>Platform Development</li>
                  <li>Data Analysis</li>
                  <li>Marketing Automation</li>
                </ul>
              </div>
            </div>

            {/* Value Propositions */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
  <div className="flex items-start justify-between gap-2">
    <div className="flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect
          x="3"
          y="3"
          width="10"
          height="10"
          rx="2"
          stroke="#9CA3AF"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M6 8L7.5 9.5L10 6.5"
          stroke="#9CA3AF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <p className="text-[11px] font-semibold tracking-wide text-gray-500">
        VALUE PROPOSITIONS
      </p>
    </div>

    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-900 text-white font-semibold">
      ALL
    </span>
  </div>

  <div className="mt-3 flex flex-wrap gap-2">
    <span className="text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
      Real-time Analytics
    </span>
    <span className="text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
      Predictive AI Models
    </span>
    <span className="text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
      24/7 Support
    </span>
    <span className="text-xs px-2 py-1 rounded-lg bg-white text-gray-500 border border-gray-200">
      + Add Prop
    </span>
  </div>
</div>
            {/* Relationships + Segments */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 13s-5-3.1-5-7a3 3 0 0 1 5-1 3 3 0 0 1 5 1c0 3.9-5 7-5 7Z"
                        fill="#9CA3AF"
                        opacity="0.35"
                      />
                    </svg>
                    <p className="text-[11px] font-semibold tracking-wide text-gray-500">
                      RELATIONSHIPS
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
                    CS
                  </span>
                </div>

                <ul className="mt-3 text-xs text-gray-700 space-y-2 list-disc pl-4">
                  <li>Automated Self-Service</li>
                  <li>Dedicated Managers</li>
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="5" cy="5" r="2" fill="#9CA3AF" />
                      <circle cx="11" cy="5" r="2" fill="#9CA3AF" />
                      <circle cx="8" cy="11" r="2" fill="#9CA3AF" />
                    </svg>
                    <p className="text-[11px] font-semibold tracking-wide text-gray-500">
                      SEGMENTS
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                    SALES
                  </span>
                </div>

                <ul className="mt-3 text-xs text-gray-700 space-y-2 list-disc pl-4">
                  <li>SME Owners</li>
                  <li>Freelance Analysts</li>
                  <li>Enterprise Teams</li>
                </ul>
              </div>
            </div>

            {/* Key Resources */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="2"
                      y="2"
                      width="12"
                      height="12"
                      rx="2"
                      stroke="#9CA3AF"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <circle cx="8" cy="8" r="3" fill="#9CA3AF" opacity="0.25" />
                  </svg>
                  <p className="text-[11px] font-semibold tracking-wide text-gray-500">
                    KEY RESOURCES
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    ENG
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                    HR
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500 italic">
                Proprietary AI Algorithms, Data Warehouses, Skilled Data Scientists.
              </p>
            </div>

            {/* Channels */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 6L8 2L14 6V12L8 14L2 12V6Z"
                      stroke="#9CA3AF"
                      strokeWidth="1.2"
                      fill="none"
                    />
                  </svg>
                  <p className="text-[11px] font-semibold tracking-wide text-gray-500">
                    CHANNELS
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold">
                  MKT
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Direct Sales
                </span>
                <span className="text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Web App
                </span>
                <span className="text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                  API
                </span>
              </div>
            </div>

            {/* Cost + Revenue */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="#9CA3AF" strokeWidth="1.2" fill="none" />
                      <path
                        d="M8 4V8H11"
                        stroke="#9CA3AF"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <p className="text-[11px] font-semibold tracking-wide text-gray-500">
                      COST
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                    FIN
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 9L8 4L13 9M5 7V13H11V7"
                        stroke="#9CA3AF"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                    <p className="text-[11px] font-semibold tracking-wide text-gray-500">
                      REVENUE
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                    FIN
                  </span>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M6 3V6H12V3M6 10H12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Save Model Version
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}