# 📜 Architectural Decision Log

This document tracks major architectural decisions for the OptimaAI project in a single history.

---

## [ADR-0001] Use pnpm as Package Manager
**Status**: Accepted | **Date**: 2026-02-23

### Context
The project initially used npm. We need a faster, more disk-efficient package manager that provides strict dependency management.

### Decision
Use **pnpm** (v9+) as the primary package manager.

### Consequences
- Faster subsequent installs and strict dependency resolution.
- CI/CD and onboarding must use `pnpm` exclusively.

---

## [ADR-0002] Consolidate on Biome for Linting and Formatting
**Status**: Accepted | **Date**: 2026-02-23

### Context
Managing separate config for ESLint and Prettier is slow and complex.

### Decision
Remove ESLint/Prettier and consolidate all quality checks under **Biome**.

### Consequences
- Significant performance gains (Rust-based).
- Unified configuration in `.biome.json`.
- Removed overhead of the ESLint plugin ecosystem.

---

## [ADR-0003] Route Group Naming: (public) and (protected)
**Status**: Accepted | **Date**: 2026-02-23

### Context
Initial naming was inconsistent (`marketing` vs `protected`).

### Decision
Standardize on **`(public)`** for guest routes and **`(protected)`** for authenticated segments.

### Consequences
- Clearer technical intent for developers.
- Direct alignment with middleware protection logic.

---

## [ADR-0004] State Management: Zustand and TanStack Query
**Status**: Accepted | **Date**: 2026-02-23

### Context
Need to separate global UI state from complex server-side data fetching.

### Decision
Use **Zustand** for transient UI state and **TanStack Query** for all server-side logic.

### Consequences
- Clear separation of concerns.
- Automated caching and loading states for data fetching.
- Lightweight, boilerplate-free state management for the UI.

---
*For Git workflows, see [CONTRIBUTING.md](./CONTRIBUTING.md).*
