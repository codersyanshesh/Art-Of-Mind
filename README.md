# Art of Mind — Next-Generation Interactive Storytelling Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-5A67D8?style=flat&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

**Art of Mind** is a production-quality, responsive interactive storytelling platform designed for creators and readers of Novels, Reels (short fiction), Audio narratives, Comics, and Interactive stories. It enables narrative franchise construction through shared universes and character databases, providing readers with personalized, accessibility-first scroll feeds and reading experiences.

---

## 🎨 Core Product Vision

Traditional publishing restricts narratives to pure text. Art of Mind breaks these boundaries:
- **Franchise Building**: Creators link multiple stories across different mediums to unified **Universes** and shared **Characters**.
- **Snackable & Audio Formats**: Read fast-paced Reels on mobile or listen to narration via integrated Audio Players.
- **Accessibility Customization**: Reader configuration syncing (dyslexia font overrides, font scaling, colorblind mode filters) persisted directly to PostgreSQL.

### 🗺️ User Experience & Navigation Flow

```mermaid
graph TD
    Landing[Landing Page / OTP Auth] -->|Sign In| Discover[Discover All Formats]
    Discover -->|Explore Franchise| UniverseHub[Universe Hub / Lore Network]
    UniverseHub -->|View Connections| CharLore[Character Database]
    UniverseHub -->|Start Reading| SideReader[Side-by-Side E-Reader]
    SideReader -->|Scroll Checkpoints| SaveProgress[(Save Reading Progress)]
    SideReader -->|Interact| Comments[Nested Comments & Reactions]
    SideReader -->|Join Community| FanClubs[Creator Fan Clubs]
    Discover -->|Switch to Creator Mode| Studio[Creator Studio Dashboard]
    Studio -->|Generate Script/Voice| AITools[AI Assistant Suite]
```

---

## 🏛️ System Architecture

The runtime executes on Vercel's edge network, routing data securely to Supabase's managed serverless backend.

```mermaid
graph TD
    User([User Browser])
    
    subgraph Vercel [Next.js Hosting - Vercel]
        NextJS[Next.js App Router]
        RSC[React Server Components]
        SA[Server Actions]
        Middle[Middleware - Auth & Edge Routing]
    end

    subgraph SupabasePlatform [Supabase Ecosystem]
        SAuth[Supabase Auth]
        SStore[Supabase Storage - CDN Enabled]
        DB[(Supabase PostgreSQL Database)]
    end

    User -->|HTTPS Request| Middle
    Middle -->|Validate Token| SAuth
    Middle -->|Route Request| NextJS
    NextJS -->|Render Page| RSC
    RSC -->|Prisma Client| DB
    SA -->|Prisma Client Mutations| DB
    User -->|Interactions / Uploads| SA
    SA -->|File Upload / Retrieve| SStore
    SStore -->|Delivered via| CDN[Supabase CDN]
    CDN -->|Cached Assets| User
```

---

## ✨ Features Checklist

- **OTP Authentication**: Secure login, signup, and route middleware utilizing Supabase Auth tokens.
- **Preferences Sync**: Accessible preference panels that sync settings directly from the database schema.
- **Novel Reading Page**: Distraction-free, responsive layout optimized for mobile and desktop screens.
- **Reading Progress Checkpoints**: Scroll-triggered progress tracker persisting chapter bookmark percentages.
- **Interactive Comment Threads**: Fast, nested comment replies supporting likes, hearts, and laugh reactions.
- **Creator Studio Dashboard**: Tools for writers to manage story drafts, chapter indices, and metadata.

---

## 🖼️ UI Gallery & Mockups

### 1. Interactive Side-by-Side Reader
Provides a split-screen experience combining typography-focused novels on the left with dynamic media reels, audio waveforms, or comic panels on the right.
![Side-by-Side Reader](public/screenshots/side_by_side_reader_mockup.png)

### 2. Creator Studio Dashboard
An analytics-rich dashboard with real-time views growth visualization and automated generative AI script/audio assistance tools.
![Creator Studio Dashboard](public/screenshots/creator_studio_mockup.png)

### 3. Universe Lore & Character Hub
A visual representation of character networks and story linkages across different media franchises within the same universe.
![Universe Hub & Lore](public/screenshots/universe_hub_mockup.png)

---

## 📁 Repository Documentation Index

This project uses a modular documentation design to guide lifecycle planning. For a complete guide, explore the **[docs/README.md Documentation Hub](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/README.md)** or check individual files:

- 🗺️ **[ROADMAP.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/ROADMAP.md)**: Product roadmap, target MVP scope, and long-term milestones.
- 🏛️ **[ARCHITECTURE.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/ARCHITECTURE.md)**: Runtime specs, NFR requirements, security matrices, and future scaling.
- ⚖️ **[DECISIONS.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/DECISIONS.md)**: Architectural Decision Records (ADR) justifying code patterns (Prisma, Actions, UUIDs).
- 🗄️ **[DATA_MODEL.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/DATA_MODEL.md)**: ERD diagram, index policies, soft deletes, and schema models.
- 🏃 **[SPRINTS.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/SPRINTS.md)**: Sprint schedules, Definition of Done, and MVP acceptance criteria.
- 🚀 **[DEPLOYMENT.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/DEPLOYMENT.md)**: Cloud hosting infrastructure (Vercel/Supabase), env vars guide, and CI/CD pipelines.
- 🤝 **[CONTRIBUTING.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/CONTRIBUTING.md)**: Developer coding standards, PR workflows, and local workspace setup.

---

## 💻 Local Quick Start

### 1. Project Cloning & Dependencies
```bash
git clone <repository-url>
cd art-of-mind
npm install
```

### 2. Configure Local Environment
Create a `.env` file in your project root containing your database pooler and direct connection strings:
```env
DATABASE_URL="postgresql://postgres:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### 3. Run Database Migrations & Seeds
Initialize your local database schema and seed the initial universes, stories, and profiles:
```bash
npx prisma migrate dev
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to start interacting with the app.

---

## 📄 License
Distributed under the MIT License. See [LICENSE](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/LICENSE) for more information.
