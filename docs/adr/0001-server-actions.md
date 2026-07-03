# ADR-0001: Next.js Server Actions for Data Mutations

- **Date**: 2026-07-03
- **Status**: Accepted

---

## Context

Traditional React applications require manually authored API route handlers (`/app/api/comment/route.ts`) to process data mutations. This creates a two-layer gap: the client form or button must construct a fetch request, serialize arguments, and then the API handler deserializes and executes the logic. This results in duplicated types, complex error handling surfaces, and a slower developer experience.

## Decision

Use **Next.js Server Actions** as the primary pattern for all data mutations (submitting comments, updating preferences, recording reading progress, and uploading content).

## Alternatives Considered

| Alternative | Reason Rejected |
| :--- | :--- |
| `/app/api/` Route Handlers | Requires manual type duplication between the client payload and the server handler. More code for the same outcome. |
| tRPC | Adds a third-party abstraction layer. Server Actions offer a native, framework-supported equivalent without additional dependencies. |
| GraphQL Mutations | Significant setup overhead (schema, resolvers, codegen) for a small-to-medium application that doesn't require a public API. |

## Consequences

- ✅ **Type-safe end-to-end**: Arguments passed to a Server Action are statically type-checked at compile time using TypeScript.
- ✅ **Zero API boilerplate**: Server-side logic is called as a plain TypeScript function from a React component.
- ✅ **Progressive enhancement**: Server Actions work without JavaScript on the client, improving accessibility.
- ✅ **Automatic CSRF protection**: Next.js validates the request origin on every Server Action call.
- ⚠️ **Not a public API**: Server Actions are not suitable if Art of Mind needs to expose a public REST or GraphQL API for third-party clients in the future. Route Handlers would need to be added for that use case (see `docs/API.md` when created).
