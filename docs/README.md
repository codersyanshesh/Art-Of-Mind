# Art of Mind — Documentation Hub

Welcome to the internal engineering and product documentation for **Art of Mind**, a modern interactive storytelling platform. This directory contains detailed specifications, architecture designs, database models, and sprint roadmaps guiding the development of the platform.

## Documentation Index

Explore the different facets of the Art of Mind project:

| Document | Purpose | Key Contents |
| :--- | :--- | :--- |
| 🗺️ **[ROADMAP.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/ROADMAP.md)** | Product Vision & Phases | Core product concept, MVP boundaries, Phase 1 (Core Novel Reading), Phase 2 (Advanced Formats & Social), and Phase 3 (Monetization). |
| 🏛️ **[ARCHITECTURE.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/ARCHITECTURE.md)** | System Design & NFRs | Runtime architecture diagram (Mermaid), NFR specifications, security roadmaps, accessibility guidelines, and future scaling plans. |
| ⚖️ **[DECISIONS.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/DECISIONS.md)** | Architectural Decisions | Quick-reference index pointing to the `adr/` directory of individual Architecture Decision Records (ADR-0001 through ADR-0005). |
| 📋 **[adr/README.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/adr/README.md)** | ADR Directory | Individual decision files: Server Actions, Prisma, Supabase, UUID v4, and TanStack Query. |
| 🗄️ **[DATA_MODEL.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/DATA_MODEL.md)** | Data Schema & Lifecycles | Entity Relationship Diagram (ERD), table details, database index strategies, soft deletes, migrations, and seeding policies. |
| 🏃 **[SPRINTS.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/SPRINTS.md)** | Project Sprints & DoD | Weekly deliverables, Sprint 1 Definition of Done, and rigorous Acceptance Criteria for MVP features (e.g., Notifications dropdown, Reading progress). |
| 🚀 **[DEPLOYMENT.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/DEPLOYMENT.md)** | Hosting & Pipeline | Infrastructure details (Vercel/Supabase configurations), environment variables manifest, storage bucket security, and CI/CD pipelines. |
| 🤝 **[CONTRIBUTING.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/CONTRIBUTING.md)** | Standards & Setup | Coding conventions, TypeScript expectations, branching policies, and local development setup instructions. |
| 🔌 **[API.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/API.md)** | API Specifications | Server Actions, Route Handlers, webhook configurations, and database sync contracts. |
| 📝 **[../CHANGELOG.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/CHANGELOG.md)** | Release History | Version-by-version record of additions, changes, fixes, and removals using Keep a Changelog format. |

---

## Technical Philosophy

Art of Mind is built with the following core technical values:
1. **Performance first**: Leverage React Server Components (RSC) to serve pre-rendered pages, minimizing client bundle sizes and maximizing SEO potential.
2. **Data Integrity & Portability**: Maintain user profile, story, comment, and wallet records in a clean relational schema (PostgreSQL via Prisma), separating core app domain data from the authentication provider (Supabase Auth).
3. **Accessibility**: Guarantee an inclusive reading experience out of the box with accessibility settings (adjustable font sizes, dyslexia-friendly fonts, and colorblind mode filters) persisted directly in the user preferences database.
4. **Resiliency**: Document architecture and code guidelines thoroughly to allow rapid onboarding and clean handoffs between contributors.
