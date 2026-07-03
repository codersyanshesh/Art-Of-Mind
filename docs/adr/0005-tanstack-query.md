# ADR-0005: Selective Client-Side Fetching (TanStack Query)

- **Date**: 2026-07-03
- **Status**: Accepted

---

## Context

When building data-fetching patterns for the application, two approaches were considered: fetching all data client-side using a caching library (React Query / TanStack Query), or fetching data server-side using React Server Components (RSC) and delivering pre-rendered HTML. Using client-side fetching universally results in a visible loading skeleton on every page visit, bloats the JavaScript bundle, and undermines SEO.

## Decision

Adopt **React Server Components (RSC) as the default** data-fetching strategy. Restrict **TanStack Query** exclusively to UI nodes that require high-frequency client-side updates or live background refetching.

### TanStack Query is used for:
- **Notification dropdown**: Polls for new alerts without a full page reload.
- **Comment sections**: Supports infinite scroll pagination and optimistic updates on posting reactions.
- **Real-time subscriptions**: Invalidates query cache keys when Supabase postgres change events fire.

### RSC is used for:
- All static or slowly changing page layouts (story pages, chapter readers, creator dashboards, universe detail pages, settings panels).

## Alternatives Considered

| Alternative | Reason Rejected |
| :--- | :--- |
| TanStack Query globally | Entire page would start empty with loading spinners, requiring skeleton placeholders everywhere. Poor for SEO and first-paint performance. |
| SWR | Functionally similar to TanStack Query but with a smaller feature set. TanStack Query's `queryClient` provides superior control over cache invalidation alongside Supabase real-time events. |
| RSC exclusively | Would make dynamic interactions (e.g. notification badges, infinite comment threads) require full page navigations to show new data. |

## Consequences

- ✅ **Page performance**: Server-rendered pages arrive pre-populated with data, eliminating loading flashes on primary content.
- ✅ **SEO**: Story listings, chapter text, and character pages are indexable by search engines without JavaScript execution.
- ✅ **Real-time where it counts**: TanStack Query's cache invalidation integrates with Supabase's `postgres_changes` realtime channel for notifications and live comment feeds.
- ⚠️ **Dual mental model**: Developers must consciously decide whether a new component warrants RSC or client-side fetching. Documented in [CONTRIBUTING.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/CONTRIBUTING.md) to keep the team aligned.
