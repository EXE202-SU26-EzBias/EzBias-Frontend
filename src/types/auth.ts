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
