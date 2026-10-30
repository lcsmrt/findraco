import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { findracoApi } from "../clients/findracoApi";
import { RegisterUserRequest, UpdateTimeZoneRequest, User } from "../dtos/user";
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
async function login(params: LoginRequest): Promise<LoginResponse> {
  const { body } = params;
  const { data } = await findracoApi.post("/auth/login", body);
  return data;
}

/**
 * Hook for performing user login.
 */
export function useLogin(
  options?: MutationOptions<LoginResponse, LoginRequest>,
) {
  return useMutation({
    mutationFn: login,
    ...buildMutationOptions({ showSuccessToast: false }, options),
  });
}

/**
 * Ends the current device's session: the API revokes it and clears the
 * renewal cookie. Answers 204 whether or not a session was present.
 */
export async function logout(): Promise<void> {
  await findracoApi.post("/auth/logout");
}

/**
 * Fetches the authenticated user's profile.
 * @returns User data.
 */
export async function getUserProfile(): Promise<User> {
  const { data } = await findracoApi.get("/user/me");
  return data;
}

/**
 * Hook for the authenticated user's profile, shared with the session through the "profile" key.
 */
export function useGetUserProfile(
  options?: Omit<UseQueryOptions<User>, "queryKey">,
) {
  return useQuery({
    queryFn: getUserProfile,
    queryKey: ["profile"],
    ...options,
  });
}

/**
 * Pins a time zone, or hands the zone back to the device.
 * @param params New mode and, to pin, the IANA zone id.
 * @returns The updated user.
 */
async function updateTimeZone(params: UpdateTimeZoneRequest): Promise<User> {
  const { body } = params;
  const { data } = await findracoApi.patch("/user/me/time-zone", body);
  return data;
}

/**
 * Hook for choosing how the user's time zone is set.
 */
export function useUpdateTimeZone(
  options?: MutationOptions<User, UpdateTimeZoneRequest>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTimeZone,
    ...buildMutationOptions(
      { successMessage: "Time zone saved." },
      {
        ...options,
        onSuccess: (data, variables) => {
          queryClient.setQueryData(["profile"], data);
          options?.onSuccess?.(data, variables);
        },
      },
    ),
  });
}

/**
 * Sends a user registration request.
 * @param params Registration data.
 * @returns Created user.
 */
async function registerUser(params: RegisterUserRequest): Promise<User> {
  const { body } = params;
  const { data } = await findracoApi.post("/user", body);
  return data;
}

/**
 * Hook for performing user registration.
 */
export function useRegisterUser(
  options?: MutationOptions<User, RegisterUserRequest>,
) {
  return useMutation({
    mutationFn: registerUser,
    ...buildMutationOptions(
      { successMessage: "Account created." },
      options,
    ),
  });
}

/**
 * Requests a password reset link. The API answers the same whether or not the
 * account exists.
 * @param params Account email.
 */
async function forgotPassword(params: ForgotPasswordRequest): Promise<void> {
  const { body } = params;
  await findracoApi.post("/auth/forgot-password", body);
}

/**
 * Hook for requesting a password reset link.
 */
export function useForgotPassword(
  options?: MutationOptions<void, ForgotPasswordRequest>,
) {
  return useMutation({
    mutationFn: forgotPassword,
    ...buildMutationOptions({ showSuccessToast: false }, options),
  });
}

/**
 * Checks whether a password reset token is still valid, without consuming it.
 * @param token Token from the emailed link.
 * @returns Validation verdict.
 */
async function validatePasswordResetToken(
  token: string,
): Promise<PasswordResetTokenValidationResponse> {
  const { data } = await findracoApi.get("/auth/reset-password/validate", {
    params: { token },
  });
  return data;
}

/**
 * Hook for validating a password reset token.
 */
export function useValidatePasswordResetToken(
  token: string,
  options?: Omit<
    UseQueryOptions<PasswordResetTokenValidationResponse>,
    "queryKey"
  >,
) {
  return useQuery({
    queryFn: () => validatePasswordResetToken(token),
    queryKey: ["passwordResetToken", { token }],
    ...options,
  });
}

/**
 * Sets a new password using a password reset token.
 * @param params Token and new password.
 */
async function resetPassword(params: ResetPasswordRequest): Promise<void> {
  const { body } = params;
  await findracoApi.post("/auth/reset-password", body);
}

/**
 * Hook for resetting the password.
 */
export function useResetPassword(
  options?: MutationOptions<void, ResetPasswordRequest>,
) {
  return useMutation({
    mutationFn: resetPassword,
    ...buildMutationOptions(
      { successMessage: "Password updated. Sign in with your new password." },
      options,
    ),
  });
}
