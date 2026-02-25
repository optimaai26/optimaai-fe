# 🚀 OptimaAI Onboarding – Team Guidelines

Welcome to the OptimaAI core development team. This repository contains the architectural foundation for our B2B SaaS analytics platform.

## 🏗️ Architecture Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4 (Theme tokens in `app/globals.css`)
- **Linting/Formatting**: [Biome](https://biomejs.dev/) (Strict mode)
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
pnpm devpodman-compose up --build

# Build for production
pnpm build
```

## 🎯 Development Roadmap

Your specific design challenges and functional tasks for this sprint are documented in the **[Sprint 1 Roadmap](./ROADMAP.md)**. 

Please refer to that document for:
- Detailed feature descriptions.
- Formal **Acceptance Criteria (AC)**.
- Design challenges for each "Skeleton" page.

### Current Task Areas:
1. **Data Infrastructure**: Datasets, Profiling, Reports.
2. **Intelligence**: Predictions, AI Insights.
3. **Admin & Access**: Identity Management, Role Exports.
4. **Strategy**: Business Model Canvas integration.

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
- If you accidentally commit a secret, notify the engineering lead immediately.

---
*Happy coding! – *
