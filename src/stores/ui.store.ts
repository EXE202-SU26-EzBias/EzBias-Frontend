import { create } from 'zustand';

interface UiState {
  toastMessage: string;
  toastVisible: boolean;
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  isForgotPasswordOpen: boolean;
  isEmailVerificationOpen: boolean;
  pendingVerificationEmail: string;
  showToast: (message: string) => void;
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
  openForgotPassword: () => void;
  closeForgotPassword: () => void;
  openEmailVerification: (email: string) => void;
  closeEmailVerification: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUiStore = create<UiState>((set) => ({
  toastMessage: '',
  toastVisible: false,
  isLoginOpen: false,
  isRegisterOpen: false,
  isForgotPasswordOpen: false,
  isEmailVerificationOpen: false,
  pendingVerificationEmail: '',
  showToast: (message) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toastMessage: message, toastVisible: true });
    toastTimer = setTimeout(() => set({ toastVisible: false }), 1800);
  },
  openLogin: () => set({ isLoginOpen: true, isRegisterOpen: false, isForgotPasswordOpen: false, isEmailVerificationOpen: false }),
  closeLogin: () => set({ isLoginOpen: false }),
  openRegister: () => set({ isRegisterOpen: true, isLoginOpen: false, isForgotPasswordOpen: false, isEmailVerificationOpen: false }),
  closeRegister: () => set({ isRegisterOpen: false }),
  openForgotPassword: () => set({ isForgotPasswordOpen: true, isLoginOpen: false, isRegisterOpen: false }),
  closeForgotPassword: () => set({ isForgotPasswordOpen: false }),
  openEmailVerification: (email) => set({ isEmailVerificationOpen: true, pendingVerificationEmail: email, isLoginOpen: false, isRegisterOpen: false }),
  closeEmailVerification: () => set({ isEmailVerificationOpen: false, pendingVerificationEmail: '' }),
}));
