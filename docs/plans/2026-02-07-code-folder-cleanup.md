# Code and Folder Cleanup Implementation Plan (2026-02-07)

## Summary

Clean the repository structure and codebase in one pass by removing tracked clutter files, standardizing lint/format tooling, hardening auth behavior, deleting dead code, normalizing public-facing copy, and adding basic API smoke tests.

## Locked Decisions

1. Scope: balanced cleanup.
2. Demo auth: remove fallback now.
3. Tooling: add ESLint + Prettier.
4. Clutter files: delete permanently.
5. Validation: lint + format + build + basic API smoke tests.
6. Public content: replace dev/demo/personal text with production-neutral placeholders.
7. Audit artifacts: move/standardize under `docs/audits/`.
8. JWT: harden now.
9. JWT secret policy: require in production, deterministic safe fallback in development.
10. `/terms`: create minimal terms page.
11. Dependency pruning: skip for this pass.
12. Debug API `/api/test`: remove.
13. `lib/database.js`: delete.
14. `components/DashboardNav.js`: delete.

## Public API / Interface Changes

1. `POST /api/auth/login`: remove hardcoded demo credential fallback.
2. `GET /api/auth/me`: require signature-valid JWT.
3. `POST /api/employees`: require explicit route-level JWT verification.
4. `GET /api/vacancies` and `POST /api/vacancies`: require explicit route-level JWT verification.
5. `GET /api/test`: remove route.
6. `GET /terms`: add via `app/terms/page.js`.
7. Env contract: `JWT_SECRET` required in production, dev fallback allowed in non-production.

## Implementation Plan

1. Baseline and plan artifact.
2. Repository hygiene and folder cleanup.
3. Audit artifact relocation and script standardization.
4. Tooling baseline (non-interactive lint/format).
5. Auth core cleanup and JWT hardening.
6. Auth/API route cleanup and consistency.
7. Dead code and broken-link cleanup.
8. Public content normalization.
9. Add API smoke tests.
10. Final verification and commit sequence.

## Test Cases and Scenarios

1. `npm run lint` runs without interactive setup.
2. `npm run format:check` passes.
3. `npm run build` passes.
4. Login missing credentials -> `400`.
5. Login invalid credentials -> `401` without demo bypass.
6. `/api/auth/me` without cookie -> `401`.
7. `/api/auth/me` with tampered token -> `401`.
8. `/api/auth/me` with valid signed token -> `200`.
9. `/api/employees` without valid token -> `401`.
10. `/api/vacancies` GET/POST without valid token -> `401`.
11. `/terms` resolves and no broken footer link.
12. Root folder no longer contains tracked clutter or root audit artifacts.

## Assumptions and Defaults

1. Placeholder contact defaults: `contact@tcncomply.mt` and `+356 0000 0000`.
2. No dependency pruning beyond lint/format tooling additions.
3. API response shapes stay stable where practical.
4. Middleware stays lightweight; strict auth remains route-level.
5. Deployment/runtime targets remain unchanged.
