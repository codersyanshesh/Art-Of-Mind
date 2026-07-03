# ADR-0003: Supabase for Backend Services

- **Date**: 2026-07-03
- **Status**: Accepted

---

## Context

Art of Mind requires three foundational backend services: user authentication (with OTP and email), secure file storage for covers, audio, and comic panels, and real-time event subscriptions for notifications. Building each of these from scratch introduces substantial security risk and engineering overhead that would delay the MVP.

## Decision

Integrate **Supabase** for Auth, Storage, and Real-Time change subscriptions, while keeping all primary relational application data in a Prisma-managed schema on the same Supabase PostgreSQL instance.

## Alternatives Considered

| Alternative | Reason Rejected |
| :--- | :--- |
| Firebase (Google) | NoSQL-first. Doesn't align with the relational data model required for stories, chapters, and comments. |
| Auth0 + AWS S3 | Two separate vendors and billing relationships. More complex infrastructure for a student-to-startup-scale project. |
| Custom JWT auth | Significant security implementation burden. OTP, token rotation, and session management are hard to get right without battle-tested tooling. |
| Clerk | Excellent DX for auth, but no integrated storage or real-time database layer. Would still require a separate storage solution. |

## Consequences

- ✅ **Auth out-of-the-box**: OTP email verification, session cookies, and JWT validation without custom crypto code.
- ✅ **Integrated storage with CDN**: Public and private buckets served through Supabase's CDN, reducing asset latency globally.
- ✅ **Real-time postgres events**: Native `LISTEN/NOTIFY` integration for the notification feed without a separate WebSocket server.
- ✅ **Same database**: Prisma and Supabase Auth both operate on the same PostgreSQL instance, simplifying relational integrity.
- ⚠️ **Auth isolation maintained**: The Supabase `auth.users` table is not directly referenced in the application schema. Instead, our `User` model stores the `supabaseId` UUID as a bridge. This ensures the application schema remains portable and not locked to Supabase internals. See [ADR-0004](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/adr/0004-uuid.md) for details on the UUID mapping strategy.
