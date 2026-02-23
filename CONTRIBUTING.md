# 🚀 OptimaAI Onboarding – Team Guidelines

Welcome to the OptimaAI core development team. This repository contains the architectural foundation for our B2B SaaS analytics platform.

## 🏗️ Architecture Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4 (Theme tokens in `app/globals.css`)
- **State Management**: Zustand (Global UI) + React Context (Auth)
- **Data Fetching**: TanStack Query v5
- **Forms & Validation**: React Hook Form + Zod
- **Icons**: Lucide React

## 🎯 Development Roadmap
We have prepared "Skeleton" files for upcoming features. Look for the `TODO` comments in the codebase.

### Junior Assignment 1: Data Mastery
Focus on the data ingestion and reporting pipeline.
- [ ] **Datasets Inventory**: `app/(protected)/datasets/page.tsx`
- [ ] **Dataset Details**: `app/(protected)/datasets/[id]/page.tsx`
- [ ] **Reports**: `app/(protected)/reports/page.tsx`

### Junior Assignment 2: Intelligence & Visualization
Focus on making complex data intuitive.
- [ ] **Predictions**: `app/(protected)/predictions/page.tsx`
- [ ] **Insights**: `app/(protected)/insights/page.tsx`

### Junior Assignment 3: Interactive Workflows
Focus on user-driven strategic tools.
- [ ] **Signup Flow**: `app/(marketing)/signup/page.tsx`
- [ ] **Admin Approval**: `app/(protected)/admin/access-requests/page.tsx`
- [ ] **Strategy Canvas**: `app/(protected)/canvas/page.tsx`

---

## 🎨 Design Principles
1. **Glassmorphism**: Use the `.glass-card` utility and semantic variables.
2. **Typography**: Use standard `text-xl`, `font-bold`, etc. Headings should use the primary gradient where appropriate.
3. **Accessibility**: All interactive elements MUST have `aria-label` and `suppressHydrationWarning` where browser extensions might interfere.

## 📚 Reference Documentation
Before starting, review the following polished pages to see the "Gold Standard" implementation:
- **Dashboard**: `app/(protected)/dashboard/page.tsx` (Charts & KPIs)
- **Admin Roles**: `app/(protected)/admin/roles/page.tsx` (Complex Data Structures)
- **Login**: `app/(marketing)/login/page.tsx` (Auth logic)

---
*Happy coding! – Your Senior Engineering Team*
