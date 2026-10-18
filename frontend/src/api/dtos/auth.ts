export type LoginRequest = {
  body: {
    email: string;
    password: string;
  };
}

export type LoginResponse = {
  token: string;
}

export type ForgotPasswordRequest = {
  body: {
    email: string;
  };
}

export type ResetPasswordRequest = {
  body: {
    token: string;
    password: string;
  };
}

export type PasswordResetTokenValidationResponse = {
  valid: boolean;
}
