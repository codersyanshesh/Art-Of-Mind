# Changelog

All notable changes to **Art of Mind** will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Authentication infrastructure: sign-up, login, and OTP verification flows via Supabase Auth.
- Middleware route protection for authenticated pages.
- User preferences database model with accessibility controls (font size, dyslexia font, reading background, colorblind mode).
- Settings page syncing accessibility preferences to and from PostgreSQL.
- Prisma schema with 13 models: `User`, `Profile`, `Wallet`, `Preferences`, `Universe`, `Story`, `Chapter`, `MediaAsset`, `Character`, `Comment`, `ReadingProgress`, `Notification`, `Transaction`.
- Supabase Realtime subscription setup (`prisma/realtime_setup.ts`).
- Supabase Storage bucket configuration (`prisma/storage_setup.ts`).
- Development seed script (`prisma/seed.ts`) with mock universes, stories, chapters, and profiles.
- Initial documentation suite under `docs/`:
  - `README.md` (documentation hub)
  - `ROADMAP.md` (product vision and phases)
  - `ARCHITECTURE.md` (system design, NFRs, security, scaling)
  - `DATA_MODEL.md` (ERD, schema mappings, indexes, migrations)
  - `SPRINTS.md` (sprint schedule, DoD, acceptance criteria)
  - `DEPLOYMENT.md` (infrastructure and CI/CD pipeline)
  - `CONTRIBUTING.md` (coding standards and local setup)
  - `DECISIONS.md` (pointer to ADR directory)
  - `adr/` directory with ADR-0001 through ADR-0005

---

*Previous versions will be listed here as the project reaches release milestones.*
