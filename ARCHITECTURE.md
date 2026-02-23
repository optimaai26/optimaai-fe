# 🏗️ OptimaAI Architecture Overview

This document explains the repository structure, design patterns, and "Mental Model" of the OptimaAI frontend.

---

## 🗺️ Repo Map: Where to Find Everything

### 1. `app/` (The Routing Engine)
We use the **Next.js 15 App Router** with **Route Groups** to separate concerns:
- **`app/(public)/`**: Guest-facing pages (Landing, Login, Signup). These use a minimal layout.
- **`app/(protected)/`**: The core SaaS product. These routes are protected by middleware and share the Sidebar/Topbar layout.
- **`app/api/`**: Server-side route handlers for file uploads and data proxying.

### 2. `components/` (The Visual Layer)
- **`components/layout/`**: Global shell components (Sidebar, Topbar, PageHeader).
- **`components/ui/`**: Atomic, low-level components (Buttons, Inputs, Cards). These are mostly provided by shadcn/ui.
- **`components/data-display/`**: High-level visual components like `KpiCard` and `DataTable`.
- **Formatting**: We use **Biome** for consistent code quality across the team.

### 3. `features/` (The Domain Logic)
The "Brain" of the application. Logic is grouped by feature rather than type:
- **`features/auth/`**: `AuthProvider`, auth-specific hooks, and session logic.
- **`features/datasets/`**: Query hooks and state for data management.

### 4. `lib/` (The Foundation)
- **`lib/stores/`**: Global UI state management using **Zustand**.
- **`lib/api/`**: The `api-client.ts` (fetch wrapper) and `query-client.ts` (TanStack config).
- **`lib/utils/`**: Shared utilities like the `cn()` helper for Tailwind merging.

### 5. `constants/` (Configuration)
Contains static data that shouldn't be hardcoded in components:
- `navigation.ts`: Defines the Sidebar hierarchy and icon mapping.
- `permissions.ts`: Defines the RBAC (Role-Based Access Control) matrix.

---

## 💎 Core Design Patterns

### Glassmorphism Styling
We use a custom design system built into `app/globals.css`. 
- **Pattern**: Use the `.glass-card` class for container backgrounds.
- **Colors**: Driven by HSL variables (e.g., `--primary`, `--background`) that automatically adapt to Dark/Light mode.

### State Management Strategy
1. **Server State**: Managed by **TanStack Query**. Use hooks in `features/` to fetch data.
2. **UI State**: Managed by **Zustand**. Use for sidebar toggles, theme switching, or modal states.
3. **Session State**: Managed by **React Context** in the `AuthProvider`.

### Route Privacy
Access is controlled via `middleware.ts`. It checks for an `auth_token` cookie. If missing, it redirects users from `(protected)` routes back to `(public)/login`.

---

## 🛠️ Adding a New Feature
When adding a new feature (e.g., "Invoices"):
1. **Types**: Add models to `types/index.d.ts`.
2. **Routes**: Create a new folder in `app/(protected)/invoices/`.
3. **Logic**: Create a folder in `features/invoices/` for complex hooks or providers.
4. **Nav**: Update `constants/navigation.ts` to show it in the Sidebar.

---
*For Git workflows and team roles, see [CONTRIBUTING.md](./CONTRIBUTING.md).*
*For records of specific architectural decisions, see the [ADR directory](./docs/adr/README.md).*
