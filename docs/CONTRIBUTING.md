# Art of Mind — Contributor Guidelines

This document outlines the coding standards, repository workflows, and workspace setup instructions for developers working on **Art of Mind**.

---

## 1. Local Workspace Setup

Follow these steps to establish a functional local environment:

### Prerequisites
- Install **Node.js** (v20+ recommended)
- Install a local instance of **PostgreSQL** or prepare a Supabase cloud database instance.

### Setup Instructions

1. **Clone the Repository** and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd art-of-mind
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` (or refer to [DEPLOYMENT.md](file:///c:/Users/sayso/OneDrive/Documents/Art%20of%20Mind/docs/DEPLOYMENT.md)) to create a `.env` file in the root workspace, filling in connection details for your development database.

4. **Initialize the Database**:
   Apply existing migrations and run the local development database seed script:
   ```bash
   npx prisma migrate dev
   ```
   This command creates the tables and executes the seed file (`prisma/seed.ts`) to populate mock narratives and user accounts.

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the running app.

---

## 2. Coding Standards

### TypeScript
- All code files must utilize TypeScript (.ts or .tsx). Refrain from using `any` types; define explicit interfaces or schemas instead.
- Rely on TypeScript type inference where clear, but explicitly define return types for Server Actions and helper utilities.

### Linting & Formatting
We enforce strict linting and formatting policies to maintain code readability:
- **ESLint**: Standard rules for Next.js and React are configured in `eslint.config.mjs`. Running `npm run lint` must pass with zero errors before checking in code.
- **Prettier**: Code formatting is standardized. Always run `npx prettier --write .` before committing changes to ensure consistent whitespace, line lengths, and bracket placements.

### Project Structure
Keep files focused and modular:
- Components belong inside `components/` categorized by domain (e.g. `components/auth/`, `components/layout/`).
- Shared application logic, Prisma helpers, and validation utilities belong inside `lib/`.
- Dynamic page layouts reside within the Next.js App Router under `app/`.

---

## 3. Branching & Pull Requests

- **Branch Naming**: Use clean, feature-driven branch names prefixed with context:
  - `feat/feature-name` (for new features)
  - `fix/bug-description` (for bugs)
  - `docs/doc-update` (for documentation adjustments)
- **PR Code Reviews**: All Pull Requests target the `main` branch. A PR must pass all CI builds (compiles, lints, and migrates successfully) and receive at least one approval from a reviewer before merging.
