import { http, HttpResponse, type HttpHandler } from "msw";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  PasswordResetTokenValidationResponse,
  RegisterUserRequest,
  ResetPasswordRequest,
  User,
} from "../dtos";

type NoParams = Record<string, never>;

/** The API's error body before the ProblemDetail migration: the message toasts show. */
type ErrorBody = { message: string };

export const authHandlers = {
  login(response: LoginResponse): HttpHandler {
    return http.post<NoParams, LoginRequest["body"], LoginResponse>("*/auth/login", () =>
      HttpResponse.json(response),
    );
  },
  loginRejected(message: string): HttpHandler {
    return http.post<NoParams, LoginRequest["body"], ErrorBody>("*/auth/login", () =>
      HttpResponse.json({ message }, { status: 401 }),
    );
  },
  logout(): HttpHandler {
    return http.post("*/auth/logout", () => new HttpResponse(null, { status: 204 }));
  },
  me(user: User): HttpHandler {
    return http.get<NoParams, never, User>("*/user/me", () => HttpResponse.json(user));
  },
  registerUser(user: User): HttpHandler {
    return http.post<NoParams, RegisterUserRequest["body"], User>("*/user", () =>
      HttpResponse.json(user, { status: 201 }),
    );
  },
  forgotPassword(): HttpHandler {
    return http.post<NoParams, ForgotPasswordRequest["body"]>(
      "*/auth/forgot-password",
      () => new HttpResponse(null, { status: 204 }),
    );
  },
  validateResetToken(response: PasswordResetTokenValidationResponse): HttpHandler {
    return http.get<NoParams, never, PasswordResetTokenValidationResponse>(
      "*/auth/reset-password/validate",
      () => HttpResponse.json(response),
    );
  },
  resetPassword(): HttpHandler {
    return http.post<NoParams, ResetPasswordRequest["body"]>(
      "*/auth/reset-password",
      () => new HttpResponse(null, { status: 204 }),
    );
  },
};
