# Password Recovery — Design

**Spec:** [spec.md](./spec.md) · **Context:** [context.md](./context.md)

## Backend

| Piece | File | Notes |
| ----- | ---- | ----- |
| Table | `db/migration/V10__create_password_reset_tokens.sql` | `token_hash` varchar(64) unique, FK `users` `ON DELETE CASCADE`, index on `user_id` (PWR-01) |
| Entity / repo | `models/PasswordResetToken`, `repositories/PasswordResetTokenRepository` | `findByTokenHash`, `deleteAllByUser` |
| Service | `services/PasswordResetService` | `requestReset` (unknown email = no-op; deletes older tokens; 32 random bytes, base64url; SHA-256 hex stored; `expiresAt = now(clock) + 60 min`), `isTokenValid` (read-only), `resetPassword` (throws `InvalidPasswordResetTokenException`, sets password via `UserService.changePassword`, deletes all the user's tokens) |
| Email | `services/EmailService`, `config/MailConfig` | `JavaMailSender` bean only when `SMTP_HOST` is non-blank; port 465 → SMTPS, otherwise STARTTLS when offered. No sender → link logged. Send failures logged, never thrown (keeps `forgot-password` neutral) |
| Endpoints | `AuthenticationController` | `POST /auth/forgot-password` 204 · `GET /auth/reset-password/validate` 200 `{valid}` · `POST /auth/reset-password` 204; all `permitAll` in `SecurityConfig` |
| Error | `UserExceptions.InvalidPasswordResetTokenException` → `400` in `GlobalExceptionHandler` | Uses the current `ErrorResponseDto` body, like every other handler (ProblemDetail migration still pending) |
| Config | `application.properties` `app.url`, `app.mail.*` ← `APP_URL`, `SMTP_HOST/PORT/USERNAME/PASSWORD/FROM` | Documented in `backend/.env.example`, `.env.production.example`; passed through `docker-compose.yml` |

`TOKEN_TTL` lives on `PasswordResetService` and is reused by the email text so they can't drift.

## Frontend

| Piece | File |
| ----- | ---- |
| DTOs | `api/dtos/auth.ts` — `ForgotPasswordRequest`, `ResetPasswordRequest`, `PasswordResetTokenValidationResponse` |
| Service hooks | `api/services/useAuthService.ts` — `useForgotPassword` (no success toast; page shows neutral state), `useValidatePasswordResetToken` (key `["passwordResetToken", { token }]`), `useResetPassword` (success toast) |
| Pages | `features/forgotPassword/ForgotPasswordPage.tsx`, `features/resetPassword/ResetPasswordPage.tsx` (schema exported for tests, same pattern as `TransactionFormDrawer`) |
| Routing | `PATHS.forgotPassword`, `PATHS.resetPassword` under `AuthLayout` (public) |
| Login | "Forgot password?" link under the password field |

## Tests

- `backend/.../services/PasswordRecoveryIT.java` — `EmailService` is a `@MockitoBean` so the test can capture the emailed link (the raw token is never stored). Covers PWR-02..07.
- `frontend/.../resetPassword/ResetPasswordPage.test.ts` — schema (PWR-16).

## Known limitation

Existing JWTs stay valid until they expire (24h) after a reset — see spec Out of Scope.
