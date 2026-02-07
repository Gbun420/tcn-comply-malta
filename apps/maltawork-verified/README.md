# MaltaWork Verified (Local MVP)

Safety-first Malta job board + verified anonymous workplace reviews.

## Prerequisites

- Node.js 18+ (tested with Node 25)
- Docker (for Supabase local)

## Setup

1. Install deps:
   - `npm i`
2. Configure env:
   - copy `.env.example` to `.env.local` and fill in values from `npx supabase status` after starting.

## DB (Supabase local)

- Start: `npm run db:start`
- Reset/apply migrations: `npm run db:reset`

## Seed

- `npm run seed`

## Run

- `npm run dev`
- App: `http://localhost:3001`

## Admin bootstrap

- Promote an existing user:
  - `npm run make-admin -- user@example.com`

## Evidence purge

- `npm run purge:evidence`

## Tests

- `npm test`
