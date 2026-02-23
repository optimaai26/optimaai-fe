# 🚀 OptimaAI Onboarding – Team Guidelines

Welcome to the OptimaAI core development team. This repository contains the architectural foundation for our B2B SaaS analytics platform.

## 🏗️ Architecture Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4 (Theme tokens in `app/globals.css`)
- **State Management**: Zustand (Global UI) + React Context (Auth)
- **Data Fetching**: TanStack Query v5
- **Forms & Validation**: React Hook Form + Zod
- **Package Manager**: [pnpm](https://pnpm.io/) (v9+)

## 🛠️ Project Setup

Before contributing, ensure you have **pnpm** installed.

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build for production
pnpm build
```

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
- **Public Flow**: `app/(public)/signup/page.tsx`
- **Admin Approval**: `app/(protected)/admin/access-requests/page.tsx`
- **Strategy Canvas**: `app/(protected)/canvas/page.tsx`

---

## 🎨 Design Principles
1. **Glassmorphism**: Use the `.glass-card` utility and semantic variables.
2. **Typography**: Use standard `text-xl`, `font-bold`, etc. Headings should use the primary gradient where appropriate.
3. **Accessibility**: All interactive elements MUST have `aria-label` and `suppressHydrationWarning` where browser extensions might interfere.

## 📚 Reference Documentation
Before starting, review the following polished pages to see the "Gold Standard" implementation:
- **Dashboard**: `app/(protected)/dashboard/page.tsx` (Charts & KPIs)
- **Admin Roles**: `app/(protected)/admin/roles/page.tsx` (Complex Data Structures)
- **Login**: `app/(public)/login/page.tsx` (Auth logic)

## 🌿 Git Workflow

To maintain a clean and professional history, follow these rules:

### Branching
- **Feature branch**: `feat/task-name`
- **Bug fix**: `fix/issue-description`
- **Refactor**: `refactor/component-name`
- **Hotfix**: `hotfix/critical-issue-name` (for urgent production fixes)
*Always branch off `master`.*

### Commits
We use **Conventional Commits**:
- `feat: add dataset list component`
- `fix: resolve layout shift on mobile`
- `chore: update dependencies or build scripts`
- `docs: update setup instructions`
*Keep commit messages concise and in the imperative mood ("add", not "added").*

## 🔐 Security & Privacy

**NEVER PUSH SECRETS.** 
- Do not commit `.env` files.
- Do not commit hardcoded API keys or passwords.
- Do not commit actual customer data (use the mock data in `lib/mocks`).
- If you accidentally commit a secret, notify the Senior team immediately.

---
*Happy coding! – Your Senior Engineering Team*
