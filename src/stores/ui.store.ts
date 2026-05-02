import { create } from 'zustand';

interface UiState {
  toastMessage: string;
  toastVisible: boolean;
  isLoginOpen: boolean;
  showToast: (message: string) => void;
  openLogin: () => void;
  closeLogin: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  toastMessage: '',
  toastVisible: false,
  isLoginOpen: false,
  showToast: (message) => {
    set({ toastMessage: message, toastVisible: true });
    setTimeout(() => set({ toastVisible: false }), 1800);
  },
  openLogin: () => set({ isLoginOpen: true }),
  closeLogin: () => set({ isLoginOpen: false }),
}));
