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
    /** The language of the page that asked: the reset e-mail follows it when the account has none saved. */
    language?: string;
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
