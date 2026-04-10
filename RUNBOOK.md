# Operational Runbook

This document describes common operational procedures, troubleshooting steps, and local development quirks for the OptimaAI application.

---

## 1. Local Development Environment

### 1.1 MSW (Mock Service Worker) State Issues
**Symptom:** UI displays empty arrays or data is not persisting on refresh.
**Cause:** Data in MSW is stored in-memory in the local browser tab. Refreshing destroys the database state.
**Resolution:** This is expected behavior for mock development. For testing persistence, rely on the specific test runners.

### 1.2 "401 Unauthorized" Loop on Localhost
**Symptom:** User is immediately redirected to `/login` with an empty table immediately showing upon login, or the screen infinitely loops.
**Cause:** `middleware.ts` expects an OptimaAI signed mock token. Because you are testing on `localhost`, tokens from other projects running on `localhost:3000` or `3006` may collide.
**Resolution:** 
1. Open Chrome DevTools -> Application -> Storage.
2. Select `Clear site data`.
3. Reload and login using `admin@optima.ai`.

---

## 2. Docker Operations

### 2.1 Rebuilding the Container
If you update a file locally (like a React hook or CSS standard), the Docker container will **not** automatically sync unless a volume is mounted.
```bash
# Force Docker to drop its layer cache and rebuild the frontend
docker-compose up -d --build
```

### 2.2 Container Failing to Start
**Symptom:** Container exits with code 1 immediately.
**Verification:**
```bash
docker-compose logs -f frontend
```
**Common Cause:** Node module layer discrepancy or syntax error during `pnpm build`.
**Resolution:** Run `pnpm build` locally first. Ensure Biome linting passes without errors.

---

## 3. Mock Data Authentication

For testing RBAC policies, the following accounts exist in the mock server configuration:

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| `admin@optima.ai` | `Password123!` | System Admin | All (View, Edit, Delete, Manage) |
| `manager@optima.ai`| `Password123!` | Manager | View Dept, Edit Users, Generate Reports |
| `viewer@optima.ai` | `Password123!` | Viewer | View Global KPIs only |

*Note: Accessing restricted routes with a lower privilege account will trigger the `RequestAccessModal` gracefully.*
