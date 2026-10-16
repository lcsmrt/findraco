import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import { RegisterUserRequest, User } from "../dtos/user";
import { MutationOptions } from "../types/mutationOptions";
import { buildMutationOptions } from "../utils/buildMutationOptions";
import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  PasswordResetTokenValidationResponse,
  ResetPasswordRequest,
} from "../dtos";

/**
 * Sends login request.
 * @param params Login credentials.
 * @returns Login response with token.
 */
const login = async (params: LoginRequest): Promise<LoginResponse> => {
  const { body } = params;
  const { data } = await findracoApi.post("/auth/login", body);
  return data;
};

/**
 * Hook for performing user login.
 */
export const useLogin = (
  options?: MutationOptions<LoginResponse, LoginRequest>,
) => {
  return useMutation({
    mutationFn: login,
    ...buildMutationOptions({ showSuccessToast: false }, options),
  });
};

/**
 * Ends the current device's session: the API revokes it and clears the
 * renewal cookie. Answers 204 whether or not a session was present.
 */
export const logout = async (): Promise<void> => {
  await findracoApi.post("/auth/logout");
};

/**
 * Fetches the authenticated user's profile.
 * @returns User data.
 */
const getUserProfile = async (): Promise<User> => {
  const { data } = await findracoApi.get("/user/me");
  return data;
};

/**
 * Hook for fetching the authenticated user's profile.
 */
export const useGetUserProfile = (
  options?: Omit<UseQueryOptions<User>, "queryKey">,
) => {
  return useQuery({
    queryFn: getUserProfile,
    queryKey: ["profile"],
    ...options,
  });
};

/**
 * Sends a user registration request.
 * @param params Registration data.
 * @returns Created user.
 */
const registerUser = async (params: RegisterUserRequest): Promise<User> => {
  const { body } = params;
  const { data } = await findracoApi.post("/user", body);
  return data;
};

/**
 * Hook for performing user registration.
 */
export const useRegisterUser = (
  options?: MutationOptions<User, RegisterUserRequest>,
) => {
  return useMutation({
    mutationFn: registerUser,
    ...buildMutationOptions(
      { successMessage: "User registered successfully." },
      options,
    ),
  });
};

/**
 * Requests a password reset link. The API answers the same whether or not the
 * account exists.
 * @param params Account email.
 */
const forgotPassword = async (params: ForgotPasswordRequest): Promise<void> => {
  const { body } = params;
  await findracoApi.post("/auth/forgot-password", body);
};

/**
 * Hook for requesting a password reset link.
 */
export const useForgotPassword = (
  options?: MutationOptions<void, ForgotPasswordRequest>,
) => {
  return useMutation({
    mutationFn: forgotPassword,
    ...buildMutationOptions({ showSuccessToast: false }, options),
  });
};

/**
 * Checks whether a password reset token is still valid, without consuming it.
 * @param token Token from the emailed link.
 * @returns Validation verdict.
 */
const validatePasswordResetToken = async (
  token: string,
): Promise<PasswordResetTokenValidationResponse> => {
  const { data } = await findracoApi.get("/auth/reset-password/validate", {
    params: { token },
  });
  return data;
};

/**
 * Hook for validating a password reset token.
 */
export const useValidatePasswordResetToken = (
  token: string,
  options?: Omit<
    UseQueryOptions<PasswordResetTokenValidationResponse>,
    "queryKey"
  >,
) => {
  return useQuery({
    queryFn: () => validatePasswordResetToken(token),
    queryKey: ["passwordResetToken", { token }],
    ...options,
  });
};

/**
 * Sets a new password using a password reset token.
 * @param params Token and new password.
 */
const resetPassword = async (params: ResetPasswordRequest): Promise<void> => {
  const { body } = params;
  await findracoApi.post("/auth/reset-password", body);
};

/**
 * Hook for resetting the password.
 */
export const useResetPassword = (
  options?: MutationOptions<void, ResetPasswordRequest>,
) => {
  return useMutation({
    mutationFn: resetPassword,
    ...buildMutationOptions(
      { successMessage: "Password updated. Sign in with your new password." },
      options,
    ),
  });
};
