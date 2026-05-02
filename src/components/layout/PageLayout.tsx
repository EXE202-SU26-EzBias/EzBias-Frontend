import type { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import LoginModal from '../ui/LoginModal';
import Toast from '../ui/Toast';
import { useUiStore } from '../../stores/ui.store';

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
      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
};

export default PageLayout;
