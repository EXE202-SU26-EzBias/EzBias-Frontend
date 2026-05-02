import type { ReactNode } from 'react';
import { useUiStore } from '../../stores/ui.store';
import LoginModal from '../shared/LoginModal';
import RegisterModal from '../shared/RegisterModal';
import Toast from '../ui/Toast';
import Footer from './Footer';
import Header from './Header';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const toastMessage = useUiStore((s) => s.toastMessage);
  const toastVisible = useUiStore((s) => s.toastVisible);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <LoginModal />
      <RegisterModal />
      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
};

export default PageLayout;
