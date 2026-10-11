export interface LoginRequest {
  body: {
    email: string;
    password: string;
  };
}

export interface LoginResponse {
  token: string;
}

export interface ForgotPasswordRequest {
  body: {
    email: string;
  };
}

export interface ResetPasswordRequest {
  body: {
    token: string;
    password: string;
  };
}

export interface PasswordResetTokenValidationResponse {
  valid: boolean;
}
