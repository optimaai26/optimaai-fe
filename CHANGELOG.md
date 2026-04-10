# Changelog

All notable changes to the OptimaAI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - Sprint 1 Active

### Added
- Created `PredictionDetailModal` with glassmorphism styling to view expanded details of ML predictions.
- Implemented `DashboardPageClient` interactive tab components.
- Added comprehensive MSW backend mock support via `mocks/handlers.ts` for all `/api/v1` routes.
- Introduced proper interactive state for the `SettingsPageClient` to support Appearance module configuration.

### Changed
- Standardized UI to use full glassmorphism tokens (`bg-background/95 backdrop-blur-xl ring-1 ring-white/10`).
- Refactored `features/access-requests`, `features/roles`, `features/reports`, and `features/users` to use `@tanstack/react-query` calling our centralized `apiClient`.
- Fixed the `DashboardOverview` TypeScript definitions to support the `chartData` interface.
- Wired the `useDashboard`, `useInsights`, and `usePredictions` hooks to dynamically pull from the MSW handlers rather than returning static empty arrays.
- Re-architected modals (Role Creation, Prediction Details, Request Access) to share consistent overlay properties.
- Enhanced UX on all dashboard empty states by checking loading / error states globally.

### Fixed
- Fixed 401 Unauthorized "Redirect Loop" when running in Docker, resolving stale Site Data collision from other shared localhost environments.
- Corrected garbage collection and `staleTime` logic on the React Query instance.
- Avoided hydration mismatch warnings by converting the static mock `SettingsPage` to a `use client` component.

---
*Generated: 2026-04-10*
