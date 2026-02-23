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

## [ADR-0005] Initial CI via GitHub Actions
**Status**: Accepted | **Date**: 2026-02-23

### Context
We need to ensure code quality and build stability as the team grows, without introducing heavy blockers that stifle velocity.

### Decision
Implement a GitHub Actions workflow that runs on every push and pull request to `master`. The workflow performs:
1. **Dependency Installation**: Ensuring `pnpm-lock.yaml` is healthy.
2. **Linting**: Running Biome to enforce style and safe-code rules.
3. **Build Check**: Running `next build` to catch compilation errors early.

### Consequences
- Automated feedback on code quality for every contribution.
- Prevents broken builds from reaching the shared development branch.
- Keeps the environment consistent by using `--frozen-lockfile` in CI.

---
*For Git workflows, see [CONTRIBUTING.md](./CONTRIBUTING.md).*
*For records of specific architectural decisions, see the [Decision Log](./DECISIONS.md).*
