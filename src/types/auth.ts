export type UserRole = 'User' | 'Admin';

export interface AuthUser {
  userId: number;
  email: string;
  username: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  expiresInSeconds?: number;
}

export interface MessageResponse {
  message: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
}

export interface EmailVerificationRequestPayload {
  email: string;
}

export interface EmailVerificationVerifyPayload {
  email: string;
  code: string;
}
