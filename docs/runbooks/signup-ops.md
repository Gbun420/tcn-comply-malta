# Signup Operations Runbook

## Scope

Operational guide for automated self-registration, webhook retry processing, and welcome-email queueing.

## Required Environment Variables

- `JWT_SECRET`
- `FIREBASE_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `SIGNUP_WEBHOOK_URL`
- `SIGNUP_WEBHOOK_SIGNING_SECRET`
- `INTERNAL_CRON_SECRET`

## Optional Environment Variables

- `FIREBASE_EMAIL_COLLECTION` (default: `mail`)
- `SIGNUP_WEBHOOK_TIMEOUT_MS` (default: `4000`)
- `SIGNUP_WEBHOOK_MAX_RETRIES` (default: `8`)
- `SIGNUP_RATE_LIMIT_WINDOW_SECONDS` (default: `900`)
- `SIGNUP_RATE_LIMIT_MAX_ATTEMPTS` (default: `5`)

## Firebase Extension Setup

1. Install the Firebase "Trigger Email" extension in the production project.
2. Confirm the extension collection path matches `FIREBASE_EMAIL_COLLECTION` (default `mail`).
3. Verify extension service account permissions for Firestore writes.

## Signup Health Checks

1. Submit `/api/auth/register` with missing `turnstileToken` and verify `400`.
2. Submit `/api/auth/register` with missing consent and verify `400`.
3. Submit valid signup payload and verify:

- `201` response
- `auth-token` cookie set
- `workspaces`, `user_profiles`, and `workspace_members` documents created
- welcome email document queued in `mail` (or configured collection)

## Webhook Retry Queue Operations

### Automatic retries

- Vercel cron calls `/api/internal/signup-webhook-retry` every 10 minutes.
- Header required: `x-internal-secret: $INTERNAL_CRON_SECRET`.

### Manual replay

Use a secure shell with the production domain:

```bash
curl -X POST "https://tcn-comply-malta.vercel.app/api/internal/signup-webhook-retry" \
  -H "x-internal-secret: $INTERNAL_CRON_SECRET"
```

Expected response:

- `200` with `{ success: true, summary: { processed, delivered, retried, deadLettered, skipped } }`

### Dead-letter recovery

1. Inspect `signup_webhook_queue` where `status == "dead_letter"`.
2. Correct target webhook/service issue.
3. Set document fields:

- `status = "retrying"`
- `nextAttemptAt = <current ISO timestamp>`
- `updatedAt = <current ISO timestamp>`

4. Trigger manual replay endpoint.

## Incident Guidance

- If signup returns `503` and mentions guardrails, verify Firebase admin credentials and Firestore access.
- If CAPTCHA checks fail, verify `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
- If webhooks are not delivering, verify `SIGNUP_WEBHOOK_URL`, signing secret, and endpoint reachability.
