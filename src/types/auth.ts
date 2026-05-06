export interface AuthUser {
  userId: number;
  email: string;
  username: string;
  role?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  expiresInSeconds?: number;
}
