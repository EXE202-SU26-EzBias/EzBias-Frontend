import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { UpdateUserProfilePayload, UserProfile } from '../types/user';

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => http.get<UserProfile>('/api/users/me').then((r) => r.data),
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) =>
      http.put<UserProfile>('/api/users/me', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}
