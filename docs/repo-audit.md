# Repo Audit (tcn-comply-malta)

Date: 2026-02-07

## Package Manager

- `npm` (repo has `package-lock.json`)

## Framework / App Structure

- Next.js app router at repo root (`app/` directory)
- Root app is JavaScript ESM (`"type": "module"` in root `package.json`)

## Auth / Data

- Firebase Admin + Firestore appear to be the primary backend for the existing product:
  - `lib/firebase-admin.js`
  - `lib/auth.js`
- `next-auth` is listed as a dependency, but a quick search did not find active usage in `app/`, `lib/`, or `components/`.

## Database Layer

- No Postgres ORM/migration tooling present (no Prisma/Drizzle/Supabase folders at root).

## Tests / Lint / Format

- Tests: `node --test tests/*.test.mjs`
- Lint: `npm run lint`
- Format: `npm run format:check`

## Integration Decision For MaltaWork Verified

- To avoid disrupting the existing product, MaltaWork Verified will be implemented as a **separate nested app** at:
  - `apps/maltawork-verified/`
- It will use **Supabase local** (Postgres + Auth + Storage + RLS) to implement privacy-by-design constraints and admin-only evidence access.
