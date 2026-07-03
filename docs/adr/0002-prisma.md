# ADR-0002: Prisma ORM for Database Access

- **Date**: 2026-07-03
- **Status**: Accepted

---

## Context

We needed a database access layer that is type-safe, handles schema migrations deterministically, and supports the relational model of our PostgreSQL data (nested comments, user wallets, reading progress). The developer experience (DX) of raw SQL or lightweight query builders can become difficult to maintain as the schema grows.

## Decision

Use **Prisma ORM** as the sole interface between the Next.js application layer and the PostgreSQL database.

## Alternatives Considered

| Alternative | Reason Rejected |
| :--- | :--- |
| Raw `pg` queries | No type safety. Schema changes require manual updates to query payloads and return types everywhere. |
| Drizzle ORM | Strong competitor, but Prisma's generator-based typing, Studio GUI, and migration tooling are more mature for a project where schema iteration is rapid. |
| Sequelize | JavaScript-first with weaker TypeScript support. Less ergonomic for complex relations (e.g., nested replies via `parentCommentId`). |

## Consequences

- ✅ **Automatic TypeScript types**: Prisma generates a complete type set from `schema.prisma`, eliminating manual type maintenance.
- ✅ **Declarative schema**: `schema.prisma` is the single source of truth for the database structure.
- ✅ **SQL injection prevention**: All queries use parameterized statements by default.
- ✅ **Prisma Studio**: GUI browser for local data inspection during development.
- ⚠️ **Serverless cold start**: The Prisma Client has a warm-up cost in cold-start serverless environments. Mitigated by configuring connection pooling via `DATABASE_URL` with PgBouncer on Supabase.
- ⚠️ **Schema drift risk**: If migrations are not run before deploying new code that assumes new columns, the application will throw runtime errors. Addressed by the CI/CD migration step in `docs/DEPLOYMENT.md`.
