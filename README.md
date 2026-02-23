# OptimaAI – Enterprise AI Analytics Platform

![Status](https://img.shields.io/badge/Status-Scaffolded-brightgreen)
![Tech](https://img.shields.io/badge/Tech-Next.js%2015%20%7C%20Tailwind%204%20%7C%20pnpm-blue)

OptimaAI is a high-performance B2B SaaS analytics platform built for high-scale business intelligence. It integrates Predictive ML models, LLM-powered strategic insights, and an interactive Business Model Canvas into a seamless, glassmorphic experience.

---

## 💎 Core Features

### 📊 Intelligence Dashboard
- **Real-time KPIs**: Monitor revenue, churn, and growth with beautiful trend indicators.
- **Advanced Visualization**: High-fidelity charts showing historical and projected data.
- **Global vs. Department View**: Toggle between high-level summaries and granular department metrics.

### 🧠 Predictive ML & Strategy
- **ML Predictions**: Forecast future trends based on your unique datasets.
- **AI Insights**: LLM-generated business strategy cards translating data into action.
- **Strategic Canvas**: Interactive Business Model Canvas editor for team iteration.

### 🛡️ Enterprise-Grade Foundation
- **Mock Auth**: Fully functional cookie-based authentication for local development.
- **Permission Matrix**: Fine-grained RBAC (Role-Based Access Control) ready for scaling.
- **Modern UI**: State-of-the-art glassmorphism, dark mode, and ultra-responsive layouts.

---

## 🛠️ Technical Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Turbopack)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (UI) & React Context (Auth)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd optimai

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## 🌿 Repository Structure & Onboarding

For comprehensive team guidelines, branching strategies, please refer to:
👉 **[CONTRIBUTING.md](./CONTRIBUTING.md)**

---

## 🏗️ Architecture

```text
app/
├── (public)     # Public routes (Landing, Auth)
├── (protected)  # Authenticated app routes (Dashboard, Predictions)
├── api/         # API Route handlers
components/      # Reusable UI components
constants/       # Typed navigation, permissions, and theme tokens
features/        # Domain-specific logic and hooks
lib/             # Shared utilities, stores, and API clients
```

---
*Developed by the OptimaAI Engineering Team.*
