import { useMutation } from '@tanstack/react-query';
import { http } from '../lib/axios';

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (email: string) =>
      http.post('/newsletter/subscribe', { email }).then((r) => r.data),
  });
}
