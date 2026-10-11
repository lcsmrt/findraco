# Password Recovery — Specification

> Mirrors the password-reset flow already running in the mindmap project (KAOS, M21), adapted to
> this stack (Spring Boot + stateless JWT). Decisions carried over are recorded in
> [context.md](./context.md).

## Problem Statement

A user who forgets their password has no way back into their account: the login page offers no
recovery path, and the only workaround is editing the `users` table by hand. Recovery must be
self-service, via a link sent to the account's email, without revealing which emails have accounts.

## Goals

- [ ] A user who forgot their password can set a new one from the login page in under 2 minutes,
      using only their mailbox.
- [ ] The flow never reveals whether an email is registered (same status and body for both cases).
- [ ] Email delivery is configuration, not code: switching SMTP providers means changing env vars.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Revoking JWTs issued before the reset ("log out other devices") | Auth is stateless JWT (24h TTL) with no session store; revocation needs token versioning — separate hardening item. |
| Rate limiting `forgot-password` | Small user base; the neutral response is the main anti-enumeration defense. Deferred, same as mindmap. |
| Email verification on sign-up, change-email, "password changed" notification, magic-link login | Not recovery. |
| HTML email templating engine | Plain text + minimal inline HTML is enough for one link. |

---

## User Stories

### P1: Recover access via email link ⭐ MVP

**User Story**: As a user who forgot my password, I want to receive a reset link by email so that I
can choose a new password and sign in again.

**Why P1**: It is the whole feature — without it the account is lost.

**Acceptance Criteria**:

1. WHEN the user clicks **"Forgot password?"** on the login page THEN the system SHALL navigate to
   `/forgot-password`.
2. WHEN the user submits an email on `/forgot-password` THEN the system SHALL show a neutral
   confirmation ("If an account exists for that email, we sent a reset link") and a link back to login.
3. WHEN the email belongs to an account THEN the system SHALL create a single-use reset token valid
   for 60 minutes and email a link `<APP_URL>/reset-password?token=<token>`.
4. WHEN the user opens a valid link THEN the system SHALL show a form with new password + confirmation.
5. WHEN the user submits matching passwords with a valid token THEN the system SHALL replace the
   password (BCrypt), consume the token, and redirect to `/login` with a visible success message
   (no auto-login).
6. WHEN the user signs in with the new password THEN login SHALL succeed, and the old password SHALL fail.

**Independent Test**: Request a reset for a registered email, open the link from Mailpit
(`localhost:8025`), set a new password, sign in with it.

---

### P1: Do not leak account existence ⭐ MVP

**User Story**: As an account owner, I want the recovery form not to reveal whether my email is
registered so that attackers can't enumerate accounts.

**Acceptance Criteria**:

1. WHEN `forgot-password` is called with an unknown email THEN the system SHALL respond exactly as for
   a known one (`204`, empty body) and SHALL NOT create a token or send an email.
2. WHEN SMTP delivery fails THEN the system SHALL still respond `204` and log the failure server-side.

**Independent Test**: Call the endpoint with a known and an unknown email; responses are identical.

---

### P1: Invalid and stale links fail clearly ⭐ MVP

**User Story**: As a user opening an old or broken link, I want a clear message and a way to request
a new one, instead of a form that fails on submit.

**Acceptance Criteria**:

1. WHEN `/reset-password` loads THEN the system SHALL validate the token first, with no side effect.
2. WHEN the token is unknown, expired, or already used THEN the page SHALL show "This link is invalid
   or has expired" and a link to `/forgot-password`, and SHALL NOT show the password form.
3. WHEN a second reset is requested for the same account THEN all previous tokens of that account
   SHALL stop working (only the latest link is valid).

**Independent Test**: Use a link twice; the second time the page shows the invalid-link state.

---

## API

| Requirement | Endpoint | Response |
| ----------- | -------- | -------- |
| PWR-02 | `POST /api/findraco/auth/forgot-password` `{ email }` | always `204` |
| PWR-05 | `GET /api/findraco/auth/reset-password/validate?token=…` | `200 { "valid": boolean }` — verdict is data, not an HTTP error; no side effect |
| PWR-06 | `POST /api/findraco/auth/reset-password` `{ token, password }` | `204`; invalid/expired/used token → `400` |

All three are public (`permitAll`).

## Edge Cases

- WHEN the email has different casing/whitespace than the stored one THEN lookup SHALL match the
  same way login does (no normalization beyond what login does today).
- WHEN the token has expired THEN validate SHALL return `{ valid: false }` and reset SHALL return `400`.
- WHEN the new password is blank THEN reset SHALL return `400` with a field error (same rule as sign-up:
  `@NotBlank`).
- WHEN the confirmation does not match THEN the frontend SHALL block submit with a field error.
- WHEN `/reset-password` has no `token` query param THEN the page SHALL show the invalid-link state.
- WHEN `SMTP_HOST` is not set THEN the API SHALL boot normally and log the reset link instead of
  sending it (dev without SMTP).

---

## Requirement Traceability

| ID | Story | Requirement | Status |
| -- | ----- | ----------- | ------ |
| PWR-01 | P1 recover | `password_reset_tokens` table + entity: `token_hash` (SHA-256, unique), `user_id`, `expires_at`; single-use (consumed = deleted) | Implemented |
| PWR-02 | P1 no-leak | `POST /auth/forgot-password` always `204` | Implemented |
| PWR-03 | P1 recover | Known email → token (60 min TTL) + email; new request deletes the user's previous tokens | Implemented |
| PWR-04 | P1 no-leak | Unknown email → no token, no email, identical response; SMTP failure → still `204`, logged | Implemented |
| PWR-05 | P1 stale | `GET /auth/reset-password/validate` → `200 { valid }`, no side effect | Implemented |
| PWR-06 | P1 recover | `POST /auth/reset-password` sets BCrypt password, consumes token, `204` | Implemented |
| PWR-07 | P1 stale | Invalid / expired / used token → `400` (typed exception in `UserExceptions`) | Implemented |
| PWR-08 | P1 recover | Email service: Spring `JavaMailSender` over SMTP from env; no `SMTP_HOST` → log the link | Implemented |
| PWR-09 | P1 recover | Env: `APP_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`; documented in `.env.example`, `.env.production.example`, `docker-compose.yml` | Implemented |
| PWR-10 | P1 recover | "Forgot password?" link on the login page | Implemented |
| PWR-11 | P1 recover | `/forgot-password` page: email field → neutral confirmation + back-to-login | Implemented |
| PWR-12 | P1 stale | `/reset-password?token=` validates on load; invalid → message + link to request a new one, no form | Implemented |
| PWR-13 | P1 recover | New password + confirmation form (react-hook-form + zod, must match) | Implemented |
| PWR-14 | P1 recover | Success → `/login` with success toast | Implemented |
| PWR-15 | — | `*IT`: neutrality, single-use, expiry, previous-token invalidation, login with new password | Implemented |
| PWR-16 | — | Frontend unit tests for the reset form schema | Implemented |

**Coverage:** 16 total, 16 implemented; tests written but not yet run (need the DB tunnel).

## Success Criteria

- [ ] End-to-end locally: request → email in Mailpit → reset → login with the new password.
- [ ] `./mvnw verify` green, including the new `PasswordRecoveryIT`.
- [ ] `npm run lint && npm run build && npm run test` green in `frontend`.
