# Automated Self-Registration SaaS Flow Plan (TCN Comply Malta)

## Summary

Implement an automated self-registration flow that provisions company workspaces instantly, enforces signup guardrails (Turnstile, consent, rate limiting), queues welcome email delivery, emits signed signup webhooks with retry semantics, and enriches auth session data with workspace context.

## Implemented Scope

1. Stabilize auth UX error normalization and provider-outage guidance.
2. Centralize Firebase admin/auth/profile helpers.
3. Enforce signup guardrails in `POST /api/auth/register`:

- required `turnstileToken`
- required `consentTerms` and `consentPrivacy`
- Firestore-backed signup rate limiting

4. Provision workspace/profile/member records on signup.
5. Queue welcome emails using Firebase email collection.
6. Dispatch signed `signup.created` webhook and queue failures for retry.
7. Add internal retry endpoint:

- `POST /api/internal/signup-webhook-retry`
- protected by `x-internal-secret`

8. Add Vercel cron for webhook retry processing.
9. Enrich login/me session responses with `workspaceId`, `company`, and `role`.
10. Upgrade register frontend with consent checkboxes and Turnstile widget.

## API Contracts

### POST `/api/auth/register`

Request:

- `name`
- `email`
- `password`
- `company`
- `turnstileToken`
- `consentTerms`
- `consentPrivacy`

Success response (`201`):

- `success: true`
- `user: { uid, email, name, role, company, workspaceId }`
- `workspace: { id, name, slug, plan, status }`

### POST `/api/internal/signup-webhook-retry`

- Requires header `x-internal-secret` matching `INTERNAL_CRON_SECRET`.
- Returns queue processing summary.

## Firestore Collections

- `workspaces`
- `user_profiles`
- `workspace_members`
- `signup_webhook_queue`
- `signup_rate_limits`
- `mail` (or `FIREBASE_EMAIL_COLLECTION`)

## Verification Targets

- Auth API tests for login/me/logout and session context.
- Signup guardrail/provisioning/webhook unit tests.
- Vercel config tests for Turnstile CSP and retry cron.
- Full suite, lint, and build before production deploy.
