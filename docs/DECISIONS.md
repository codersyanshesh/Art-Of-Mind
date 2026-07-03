# Architectural Decisions

The architectural decisions for **Art of Mind** are documented as individual Architecture Decision Records (ADRs) under the `adr/` directory.

👉 **See [`docs/adr/README.md`](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/adr/README.md) for the full index.**

---

## Quick Reference

| Decision | Summary |
| :--- | :--- |
| [ADR-0001](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/adr/0001-server-actions.md) | Server Actions replace API route handlers for type-safe, boilerplate-free mutations. |
| [ADR-0002](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/adr/0002-prisma.md) | Prisma ORM provides type-safe database access, schema migration, and relational query ergonomics. |
| [ADR-0003](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/adr/0003-supabase.md) | Supabase handles Auth, Storage, and Real-Time without fragmenting the infrastructure across multiple vendors. |
| [ADR-0004](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/adr/0004-uuid.md) | UUID v4 primary keys prevent enumeration attacks and align with Supabase Auth identifiers. |
| [ADR-0005](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/adr/0005-tanstack-query.md) | TanStack Query is used selectively; RSC handles static layouts to maximize performance and SEO. |
