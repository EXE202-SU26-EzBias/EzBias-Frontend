export interface UserProfile {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  avatarUrl: string;
  avatarBg: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface UpdateUserProfilePayload {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}
