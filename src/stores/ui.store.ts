import { create } from 'zustand';

interface UiState {
  toastMessage: string;
  toastVisible: boolean;
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  showToast: (message: string) => void;
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUiStore = create<UiState>((set) => ({
  toastMessage: '',
  toastVisible: false,
  isLoginOpen: false,
  isRegisterOpen: false,
  showToast: (message) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toastMessage: message, toastVisible: true });
    toastTimer = setTimeout(() => set({ toastVisible: false }), 1800);
  },
  openLogin: () => set({ isLoginOpen: true, isRegisterOpen: false }),
  closeLogin: () => set({ isLoginOpen: false }),
  openRegister: () => set({ isRegisterOpen: true, isLoginOpen: false }),
  closeRegister: () => set({ isRegisterOpen: false }),
}));
