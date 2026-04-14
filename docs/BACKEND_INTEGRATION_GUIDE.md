# OptimaAI — Backend API Integration Guide

> **Audience**: Backend engineering team  
> **Frontend Stack**: Next.js 16 · React 19 · TanStack Query · Zustand  
> **Last Updated**: 2026-04-14

---

## Table of Contents

1. [Quick Start — How to Connect](#1-quick-start--how-to-connect)
2. [Authentication Contract](#2-authentication-contract)
3. [Response Envelope Convention](#3-response-envelope-convention)
4. [Complete API Endpoints](#4-complete-api-endpoints)
5. [Data Models & TypeScript Schemas](#5-data-models--typescript-schemas)
6. [RBAC Permissions Matrix](#6-rbac-permissions-matrix)
7. [Error Handling Contract](#7-error-handling-contract)
8. [CORS & Security Requirements](#8-cors--security-requirements)
9. [Integration Checklist](#9-integration-checklist)

---

## 1. Quick Start — How to Connect

The frontend talks to the backend through a **single base URL** configured via environment variable:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**All frontend requests** are prefixed with this base URL. For example, if `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`, the frontend calls:

```
GET  http://localhost:8000/api/v1/dashboard
POST http://localhost:8000/api/v1/auth/login
```

### How the Frontend Client Works

The frontend uses a typed fetch wrapper ([`lib/api/api-client.ts`](../lib/api/api-client.ts)):

```typescript
// Every request automatically includes:
headers: {
  'Authorization': 'Bearer <token>',   // from localStorage
  'Content-Type': 'application/json',   // for non-FormData bodies
}
credentials: 'include'  // sends cookies for cross-origin
```

> **Currently**: The app runs against MSW (Mock Service Worker) in dev. To switch to a real backend, the backend team only needs to:
> 1. Set `NEXT_PUBLIC_API_URL` to the real API URL
> 2. Set `NEXT_PUBLIC_ENABLE_MSW=false` (disables the mock layer)
> 3. Implement the endpoints listed below

---

## 2. Authentication Contract

### 2.1 Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@optima.ai",
  "password": "Password123!"
}
```

**Success Response** `200 OK`:
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user-1",
      "email": "admin@optima.ai",
      "name": "Maya Hassan",
      "avatarUrl": "",
      "role": {
        "id": "role-admin",
        "name": "admin",
        "permissions": [
          { "id": "datasets:read", "key": "datasets:read", "description": "datasets read" },
          { "id": "datasets:write", "key": "datasets:write", "description": "datasets write" }
        ]
      },
      "departmentId": "ops",
      "createdAt": "2026-04-01T08:00:00.000Z",
      "updatedAt": "2026-04-01T08:00:00.000Z"
    }
  },
  "message": "Login successful"
}
```

**Failure Response** `401 Unauthorized`:
```json
{
  "message": "Invalid email or password"
}
```

> **Important**: The frontend stores the `token` in localStorage AND as a cookie named `auth_token`. The cookie is used by Next.js middleware (server-side) to protect routes before the page loads. The localStorage token is used in the `Authorization` header for API calls.

### 2.2 Register

```
POST /auth/register
```

**Request Body:**
```json
{
  "fullName": "New User",
  "email": "newuser@optima.ai",
  "password": "SecurePass123!"
}
```

**Success Response** `201 Created`:
```json
{
  "data": {
    "user": { /* ... same User shape ... */ },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Account created successfully"
}
```

**Conflict Response** `409 Conflict`:
```json
{
  "message": "An account with this email already exists."
}
```

### 2.3 Get Current User (Session Validation)

```
GET /auth/me
Authorization: Bearer <token>
```

**Success Response** `200 OK`:
```json
{
  "data": {
    "id": "user-1",
    "email": "admin@optima.ai",
    "name": "Maya Hassan",
    "avatarUrl": "",
    "role": { /* ... full Role object with permissions array ... */ },
    "departmentId": "ops",
    "createdAt": "2026-04-01T08:00:00.000Z",
    "updatedAt": "2026-04-01T08:00:00.000Z"
  }
}
```

**Failure Response** `401 Unauthorized`:
```json
{
  "message": "Unauthorized"
}
```

> **Critical**: This endpoint is called **on every page load** to rehydrate the session. It must be fast (<200ms). The frontend sends the stored token in the `Authorization` header.

### 2.4 Token Format

The frontend middleware validates tokens server-side before rendering protected pages. Currently it checks a mock regex. **The backend should issue JWTs** and the frontend will be updated to accept standard Bearer tokens.

**What the backend must provide:**
- A JWT (HS256 or RS256) with at least `{ sub: userId, exp: timestamp }`
- Token expiry of at least 24h (configurable)
- Future: a `POST /auth/refresh` endpoint for silent renewal

---

## 3. Response Envelope Convention

All API responses must use one of these two shapes:

### Single Resource
```json
{
  "data": { /* resource object */ },
  "message": "Optional success message"
}
```

### Collection (Non-Paginated)
```json
{
  "data": [ /* array of resource objects */ ]
}
```

### Collection (Paginated) — Used for Datasets
```json
{
  "data": [ /* array of resource objects */ ],
  "total": 30,
  "page": 1,
  "pageSize": 20,
  "totalPages": 2
}
```

### Error Response
```json
{
  "message": "Human readable error description"
}
```

### No Content
For successful DELETE operations, return `204 No Content` with no body.

---

## 4. Complete API Endpoints

### 4.1 Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/dashboard` | ✅ | Returns aggregated KPIs, activity feed, and chart data |

**Response** `200 OK`:
```json
{
  "data": {
    "kpis": [
      {
        "id": "kpi-1",
        "title": "Total Revenue",
        "value": "$124,500",
        "changePercent": 12.5,
        "trend": "up",
        "icon": "DollarSign"
      }
    ],
    "recentActivity": [
      {
        "id": "activity-1",
        "action": "New dataset uploaded",
        "time": "2 minutes ago",
        "color": "bg-success"
      }
    ],
    "charts": [
      {
        "type": "area",
        "title": "Revenue Trend",
        "xAxis": "name",
        "yAxis": "revenue",
        "aiRecommended": true,
        "colors": ["var(--primary)"],
        "data": [
          { "name": "Jan", "revenue": 40000, "users": 400 },
          { "name": "Feb", "revenue": 45000, "users": 510 }
        ]
      }
    ]
  }
}
```

> **Icon field**: The `icon` field maps to Lucide React icon names. Supported values: `"DollarSign"`, `"Users"`, `"Activity"`, `"TrendingUp"`. The backend can omit this field.

---

### 4.2 Datasets (Full CRUD + Pagination)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/datasets?page=1&pageSize=20` | ✅ | Paginated list |
| `GET` | `/datasets/:id` | ✅ | Single dataset detail |
| `POST` | `/datasets` | ✅ | Create dataset record |
| `PATCH` | `/datasets/:id` | ✅ | Update metadata |
| `DELETE` | `/datasets/:id` | ✅ | Delete dataset |

**GET `/datasets`** — Paginated Response:
```json
{
  "data": [
    {
      "id": "dataset-1",
      "name": "Customer Churn - Q1",
      "description": "Quarterly churn dataset for SaaS subscriptions.",
      "fileName": "customer-churn-q1.csv",
      "fileUrl": "/mock/customer-churn-q1.csv",
      "rowCount": 15420,
      "columnCount": 18,
      "status": "ready",
      "uploadedBy": "user-3",
      "createdAt": "2026-04-01T09:00:00.000Z",
      "updatedAt": "2026-04-01T09:00:00.000Z"
    }
  ],
  "total": 30,
  "page": 1,
  "pageSize": 20,
  "totalPages": 2
}
```

**POST `/datasets`** — Create:
```json
// Request
{
  "name": "Untitled Dataset",
  "description": "Optional description",
  "fileName": "uploaded.csv",
  "fileUrl": "/files/uploaded.csv",
  "rowCount": 0,
  "columnCount": 0,
  "status": "uploading",
  "uploadedBy": "user-1"
}

// Response 201
{ "data": { /* full Dataset object with generated id, createdAt, updatedAt */ } }
```

**Dataset `status` enum**: `"uploading"` | `"processing"` | `"ready"` | `"error"` | `"failed"`

---

### 4.3 Predictions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/predictions` | ✅ | All predictions |
| `GET` | `/predictions/:id` | ✅ | Single prediction |
| `POST` | `/predictions` | ✅ | Trigger new prediction |

**Prediction Object**:
```json
{
  "id": "prediction-1",
  "datasetId": "dataset-1",
  "type": "churn",
  "status": "completed",
  "result": {
    "summary": "Churn risk increased in enterprise accounts.",
    "confidence": 0.91,
    "data": { "highRiskAccounts": 124, "uplift": 0.18 }
  },
  "createdAt": "2026-04-01T12:00:00.000Z"
}
```

**Prediction `type` enum**: `"churn"` | `"revenue_forecast"` | `"growth_scoring"` | `"support_nlp"`

**Prediction `status` enum**: `"queued"` | `"running"` | `"completed"` | `"failed"`

**POST `/predictions`** — Trigger:
```json
// Request
{
  "datasetId": "dataset-1",
  "type": "churn"
}

// Response 201
{ "data": { /* Prediction with status: "queued" */ } }
```

> `result` is only present when `status === "completed"`. The `data` field inside `result` is a freeform object — shape depends on prediction type.

---

### 4.4 Insights (Read-Only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/insights` | ✅ | All AI-generated insights |

**Insight Object**:
```json
{
  "id": "insight-1",
  "datasetId": "dataset-1",
  "predictionId": "prediction-1",
  "title": "Enterprise churn risk needs intervention",
  "content": "Focus retention campaigns on enterprise customers showing reduced product usage.",
  "category": "strategic",
  "priority": "high",
  "createdAt": "2026-04-01T12:30:00.000Z"
}
```

**`category` enum**: `"strategic"` | `"operational"` | `"financial"` | `"growth"`

**`priority` enum**: `"low"` | `"medium"` | `"high"` | `"critical"`

---

### 4.5 Reports (Read-Only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/reports` | ✅ | All reports |

**Report Object**:
```json
{
  "id": "report-1",
  "title": "Q1 Executive Retention Report",
  "summary": "Summarizes churn patterns and AI recommendations.",
  "datasetId": "dataset-1",
  "predictionId": "prediction-1",
  "createdBy": "user-1",
  "status": "published",
  "blocks": [ /* array of CanvasBlock objects */ ],
  "createdAt": "2026-04-01T13:20:00.000Z",
  "updatedAt": "2026-04-01T13:45:00.000Z"
}
```

**Report `status` enum**: `"draft"` | `"published"` | `"archived"`

---

### 4.6 Canvas (Business Model Canvas — Full CRUD)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/canvas` | ✅ | All canvas blocks |
| `POST` | `/canvas` | ✅ | Add new block |
| `PATCH` | `/canvas/:id` | ✅ | Update block content |
| `DELETE` | `/canvas/:id` | ✅ | Delete block |

**CanvasBlock Object**:
```json
{
  "id": "canvas-1",
  "section": "value_propositions",
  "content": "Reduce customer churn with explainable AI recommendations.",
  "order": 1
}
```

**`section` enum**: `"key_partners"` | `"key_activities"` | `"key_resources"` | `"value_propositions"` | `"customer_relationships"` | `"channels"` | `"customer_segments"` | `"cost_structure"` | `"revenue_streams"` | `"problems"` | `"key_metrics"`

---

### 4.7 Users (Admin)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users` | ✅ | All users (admin only) |
| `GET` | `/users/:id` | ✅ | Single user detail |

**User Object** (password is NEVER returned):
```json
{
  "id": "user-1",
  "email": "admin@optima.ai",
  "name": "Maya Hassan",
  "avatarUrl": "",
  "role": {
    "id": "role-admin",
    "name": "admin",
    "permissions": [
      { "id": "datasets:read", "key": "datasets:read", "description": "datasets read" }
    ]
  },
  "departmentId": "ops",
  "createdAt": "2026-04-01T08:00:00.000Z",
  "updatedAt": "2026-04-01T08:00:00.000Z"
}
```

---

### 4.8 Roles (Admin)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/roles` | ✅ | All roles with permissions |

**Role Object**:
```json
{
  "id": "role-admin",
  "name": "admin",
  "permissions": [
    { "id": "datasets:read", "key": "datasets:read", "description": "datasets read" },
    { "id": "admin:users", "key": "admin:users", "description": "admin users" }
  ]
}
```

---

### 4.9 Access Requests (Admin Workflow)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/access-requests` | ✅ | All access requests |
| `PATCH` | `/access-requests/:id` | ✅ | Approve or reject |

**AccessRequest Object**:
```json
{
  "id": "access-1",
  "userId": "user-4",
  "user": {
    "id": "user-4",
    "name": "Salma Wael",
    "email": "viewer@optima.ai"
  },
  "requestedRole": "analyst",
  "justification": "Needs access to run growth analysis.",
  "status": "pending",
  "reviewedBy": null,
  "createdAt": "2026-04-01T14:25:00.000Z",
  "updatedAt": "2026-04-01T14:25:00.000Z"
}
```

**PATCH `/access-requests/:id`** — Review:
```json
// Request
{
  "status": "approved",
  "reviewedBy": "user-1"
}

// Response 200
{ "data": { /* updated AccessRequest object */ } }
```

**`status` enum**: `"pending"` | `"approved"` | `"rejected"`

---

## 5. Data Models & TypeScript Schemas

Copy these models into your API documentation or use them to generate DTOs / Pydantic models:

```typescript
// ===== Core Entities =====

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: Role;
  departmentId?: string;
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}

interface Role {
  id: string;
  name: "admin" | "manager" | "analyst" | "viewer";
  permissions: Permission[];
}

interface Permission {
  id: string;
  key: PermissionKey;
  description: string;
}

type PermissionKey =
  | "datasets:read" | "datasets:write" | "datasets:delete"
  | "predictions:read" | "predictions:run"
  | "insights:read"
  | "canvas:read" | "canvas:write"
  | "reports:read" | "reports:export"
  | "admin:users" | "admin:roles" | "admin:access-requests"
  | "view:department";

// ===== Domain Entities =====

interface Dataset {
  id: string;
  name: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  rowCount: number;
  columnCount: number;
  status: "uploading" | "processing" | "ready" | "error" | "failed";
  uploadedBy: string;  // User ID
  createdAt: string;
  updatedAt: string;
}

interface Prediction {
  id: string;
  datasetId: string;
  type: "churn" | "revenue_forecast" | "growth_scoring" | "support_nlp";
  status: "queued" | "running" | "completed" | "failed";
  result?: PredictionResult;
  createdAt: string;
}

interface PredictionResult {
  summary: string;
  confidence: number;     // 0.0 - 1.0
  data: Record<string, unknown>;  // freeform
}

interface Insight {
  id: string;
  datasetId?: string;
  predictionId?: string;
  title: string;
  content: string;
  category: "strategic" | "operational" | "financial" | "growth";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
}

interface Report {
  id: string;
  title: string;
  summary?: string;
  datasetId?: string;
  predictionId?: string;
  createdBy: string;    // User ID
  status: "draft" | "published" | "archived";
  blocks: CanvasBlock[];
  createdAt: string;
  updatedAt: string;
}

interface CanvasBlock {
  id: string;
  section: CanvasSection;
  content: string;
  order: number;
}

type CanvasSection =
  | "key_partners" | "key_activities" | "key_resources"
  | "value_propositions" | "customer_relationships" | "channels"
  | "customer_segments" | "cost_structure" | "revenue_streams"
  | "problems" | "key_metrics";

interface AccessRequest {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };  // embedded subset
  requestedRole: "admin" | "manager" | "analyst" | "viewer";
  justification: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;  // User ID
  createdAt: string;
  updatedAt: string;
}

// ===== Dashboard =====

interface KpiCardData {
  id: string;
  title: string;
  value: string | number;
  previousValue?: string | number;
  changePercent?: number;
  trend: "up" | "down" | "neutral";
  icon?: string;  // Lucide icon name (optional)
}

interface DashboardActivity {
  id: string;
  action: string;
  time: string;            // human-readable relative time
  color: string;           // CSS class e.g. "bg-success"
}

interface ChartConfig {
  type: "line" | "bar" | "area" | "pie" | "donut" | "scatter" | "funnel";
  title: string;
  xAxis?: string;
  yAxis?: string;
  data: Record<string, unknown>[];
  colors?: string[];
  aiRecommended?: boolean;
  alternativeTypes?: string[];
}

interface DashboardOverview {
  kpis: KpiCardData[];
  recentActivity: DashboardActivity[];
  charts: ChartConfig[];
}
```

---

## 6. RBAC Permissions Matrix

The frontend enforces UI visibility based on the `permissions[]` array returned with the user's role. **The backend must also enforce these on the server side.**

| Permission Key | Admin | Manager | Analyst | Viewer |
|----------------|-------|---------|---------|--------|
| `datasets:read` | ✅ | ✅ | ✅ | ✅ |
| `datasets:write` | ✅ | ✅ | ✅ | ❌ |
| `datasets:delete` | ✅ | ❌ | ❌ | ❌ |
| `predictions:read` | ✅ | ✅ | ✅ | ✅ |
| `predictions:run` | ✅ | ✅ | ✅ | ❌ |
| `insights:read` | ✅ | ✅ | ✅ | ✅ |
| `canvas:read` | ✅ | ✅ | ✅ | ✅ |
| `canvas:write` | ✅ | ✅ | ❌ | ❌ |
| `reports:read` | ✅ | ✅ | ✅ | ✅ |
| `reports:export` | ✅ | ✅ | ❌ | ❌ |
| `admin:users` | ✅ | ❌ | ❌ | ❌ |
| `admin:roles` | ✅ | ❌ | ❌ | ❌ |
| `admin:access-requests` | ✅ | ✅ | ❌ | ❌ |
| `view:department` | ✅ | ✅ | ❌ | ❌ |

> **Note**: The frontend checks permissions client-side for UI gating, but **the backend must independently validate permissions** on mutating endpoints. Never trust the frontend alone.

---

## 7. Error Handling Contract

The frontend API client checks `response.ok`. Any non-2xx response throws an `ApiError` with `{ status, statusText, body }`.

### Expected HTTP Status Codes

| Status | When | Body |
|--------|------|------|
| `200` | Successful read / update | `{ "data": ... }` |
| `201` | Successful creation | `{ "data": ... }` |
| `204` | Successful deletion | No body |
| `400` | Validation error | `{ "message": "Status is required" }` |
| `401` | Invalid / expired token | `{ "message": "Unauthorized" }` |
| `403` | Valid token, insufficient permissions | `{ "message": "Forbidden" }` |
| `404` | Resource not found | `{ "message": "Dataset not found" }` |
| `409` | Duplicate resource (e.g. email) | `{ "message": "Already exists" }` |
| `422` | Unprocessable entity | `{ "message": "...", "errors": {...} }` |
| `500` | Server error | `{ "message": "Internal server error" }` |

> **Important**: Always return `{ "message": "..." }` in error responses. The frontend displays this message to the user via toast notifications.

---

## 8. CORS & Security Requirements

### CORS Headers

The backend must allow cross-origin requests from the frontend origin:

```
Access-Control-Allow-Origin: http://localhost:3000  (dev)
Access-Control-Allow-Origin: https://app.optima.ai (production)
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

> `credentials: 'include'` is set on every fetch request (for cookie-based auth via middleware). This requires `Allow-Credentials: true` and **cannot use wildcard origin**.

### Content-Type

- All requests with a body send `Content-Type: application/json`
- Exception: file uploads may use `multipart/form-data` (future)

### Authentication Header

```
Authorization: Bearer <jwt-token>
```

All endpoints except `POST /auth/login` and `POST /auth/register` require this header.

---

## 9. Integration Checklist

Use this checklist to track implementation progress:

### Phase 1: Auth (Unblocks Everything)
- [ ] `POST /auth/login` — returns `{ data: { token, user } }`
- [ ] `POST /auth/register` — returns `{ data: { token, user } }`
- [ ] `GET /auth/me` — validates token, returns `{ data: user }`
- [ ] JWT issuance with HS256/RS256
- [ ] CORS configured for frontend origin

### Phase 2: Read-Only Endpoints
- [ ] `GET /dashboard` — returns `DashboardOverview`
- [ ] `GET /datasets?page=1&pageSize=20` — paginated
- [ ] `GET /datasets/:id` — single dataset
- [ ] `GET /predictions` — all predictions
- [ ] `GET /predictions/:id` — single prediction
- [ ] `GET /insights` — all insights
- [ ] `GET /reports` — all reports
- [ ] `GET /canvas` — all canvas blocks

### Phase 3: Mutations
- [ ] `POST /datasets` — create dataset record
- [ ] `PATCH /datasets/:id` — update metadata
- [ ] `DELETE /datasets/:id` — delete (returns 204)
- [ ] `POST /predictions` — trigger prediction
- [ ] `POST /canvas` — add block
- [ ] `PATCH /canvas/:id` — update block
- [ ] `DELETE /canvas/:id` — delete block

### Phase 4: Admin
- [ ] `GET /users` — all users (admin)
- [ ] `GET /users/:id` — single user
- [ ] `GET /roles` — all roles with permissions
- [ ] `GET /access-requests` — all requests
- [ ] `PATCH /access-requests/:id` — approve/reject

### Phase 5: Security Hardening
- [ ] Server-side permission validation on all mutating endpoints
- [ ] Rate limiting on auth endpoints
- [ ] Input validation / sanitization
- [ ] Token refresh endpoint (`POST /auth/refresh`)

---

## Endpoint Summary Table

| # | Method | Endpoint | Body | Response Type |
|---|--------|----------|------|---------------|
| 1 | `POST` | `/auth/login` | `{ email, password }` | `{ data: { token, user } }` |
| 2 | `POST` | `/auth/register` | `{ fullName, email, password }` | `{ data: { token, user } }` |
| 3 | `GET` | `/auth/me` | — | `{ data: User }` |
| 4 | `GET` | `/dashboard` | — | `{ data: DashboardOverview }` |
| 5 | `GET` | `/datasets` | `?page&pageSize` | `PaginatedResponse<Dataset>` |
| 6 | `GET` | `/datasets/:id` | — | `{ data: Dataset }` |
| 7 | `POST` | `/datasets` | `Dataset fields` | `{ data: Dataset }` |
| 8 | `PATCH` | `/datasets/:id` | `Partial<Dataset>` | `{ data: Dataset }` |
| 9 | `DELETE` | `/datasets/:id` | — | `204 No Content` |
| 10 | `GET` | `/predictions` | — | `{ data: Prediction[] }` |
| 11 | `GET` | `/predictions/:id` | — | `{ data: Prediction }` |
| 12 | `POST` | `/predictions` | `{ datasetId, type }` | `{ data: Prediction }` |
| 13 | `GET` | `/insights` | — | `{ data: Insight[] }` |
| 14 | `GET` | `/reports` | — | `{ data: Report[] }` |
| 15 | `GET` | `/canvas` | — | `{ data: CanvasBlock[] }` |
| 16 | `POST` | `/canvas` | `{ section, content, order }` | `{ data: CanvasBlock }` |
| 17 | `PATCH` | `/canvas/:id` | `{ content }` | `{ data: CanvasBlock }` |
| 18 | `DELETE` | `/canvas/:id` | — | `204 No Content` |
| 19 | `GET` | `/users` | — | `{ data: User[] }` |
| 20 | `GET` | `/users/:id` | — | `{ data: User }` |
| 21 | `GET` | `/roles` | — | `{ data: Role[] }` |
| 22 | `GET` | `/access-requests` | — | `{ data: AccessRequest[] }` |
| 23 | `PATCH` | `/access-requests/:id` | `{ status, reviewedBy }` | `{ data: AccessRequest }` |

**Total: 23 endpoints** (3 auth + 20 domain)

---
> - Mock data samples: see [`mocks/data.ts`](../mocks/data.ts)
> - Type definitions: see [`types/index.ts`](../types/index.ts)
> - API client implementation: see [`lib/api/api-client.ts`](../lib/api/api-client.ts)
