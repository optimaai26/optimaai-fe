# Product Backlog

This document tracks all planned, requested, and upcoming features that are not currently slated for the active Sprint (see `ROADMAP.md` for active Sprint tasks).

## 🚀 Epic: Backend Realignment
- [ ] Migrate `apiClient` base URL from MSW mocks to the Python/FastAPI production backend.
- [ ] Implement JWT token refresh flow to gracefully handle token expiration without forcing re-authorization.
- [ ] Connect the `Business Model Canvas` UI to real-time WebSockets for multi-user collaboration.

## 🎨 Epic: UI/UX Enhancements
- [ ] Implement Settings: Build out functional UI for `Notifications`, `Privacy`, `Localization`, and `Data & Export` tabs.
- [ ] Internationalization (i18n): Set up `next-intl` to support English, Spanish, and French.
- [ ] Implement granular transitions and micro-animations for data fetching beyond the standard Loader.
- [ ] Build User Profile Image Upload mapping to AWS S3 / Cloudflare R2 via uploadthing.

## 📊 Epic: Reporting & Data Export
- [ ] Create the server-side PDF generator using Puppeteer/Playwright to export Dashboard KPIs.
- [ ] Allow users to schedule weekly automated email reports via SendGrid integration.
- [ ] Add custom time-range filtering (Last 7 days, 30 days, YTD) to the main dashboard.

## 🛡️ Epic: Security & Infrastructure
- [ ] Implement robust CSRF protection for `/api` mutating routes.
- [ ] Expand Cypress E2E functional test coverage mapping to the primary user workflow.
- [ ] Stand up a Staging environment using Vercel or AWS Amplify connected to a staging database.
- [ ] Set up auto-deployment pipelines using GitHub Actions.
