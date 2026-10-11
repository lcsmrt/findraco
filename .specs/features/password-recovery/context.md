# Password Recovery — Context

**Gathered:** 2026-10-11
**Spec:** `.specs/features/password-recovery/spec.md`
**Status:** Ready for design

The user asked to replicate the flow already shipped in the mindmap project (KAOS, feature M21) for
email provider, proof-of-ownership mechanism and link lifetime.

## Feature Boundary

Self-service password reset via an emailed single-use link. Nothing else about account management.

## Implementation Decisions

### Email delivery — SMTP of an existing mailbox, configured by env

- Send through SMTP configured entirely by env vars (e.g. Gmail with an app password), same as mindmap.
- Without `SMTP_HOST` the API logs the link instead of sending (dev needs no SMTP). Locally, Mailpit
  (`localhost:1025`, UI `localhost:8025`) can be used by setting `SMTP_HOST=localhost`, `SMTP_PORT=1025`.
- Provider choice is an ops credential, not code coupling.

### Proof of ownership — link with a random token

- `<APP_URL>/reset-password?token=<token>`; 32 random bytes, base64url.
- Stored only as a SHA-256 hash; single-use (deleted on consume); a new request deletes the user's
  older tokens.

### Lifetime — 60 minutes

### After reset — back to login, no auto-login

- Redirect to `/login` with a success message; the user types the new password once, proving it works.

### Divergence from mindmap — no "log out other devices" checkbox

- mindmap deletes server-side sessions; findraco uses stateless JWTs with no session store, so there
  is nothing to delete. Revoking older JWTs needs token versioning and is deferred (see spec Out of Scope).
