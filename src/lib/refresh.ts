import axios from 'axios';

export async function refreshAccessToken(): Promise<string> {
  const { data } = await axios.post<{ accessToken: string }>(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
    undefined,
    { withCredentials: true },
  );
  return data.accessToken;
}
