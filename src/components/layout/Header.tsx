import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../constants/landing';
import { useCart } from '../../services/cart.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';
import NotificationBell from '../ui/NotificationBell';
import ChatInbox from '../chat/ChatInbox';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { data: cartData } = useCart();
  const count = cartData?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const { user, isAuthenticated } = useAuthStore();
  const openLogin = useUiStore((s) => s.openLogin);

  const initials = (user?.username ?? user?.email ?? '??').slice(0, 2).toUpperCase();

  return (
    <div className="sticky top-0 z-[100]">
      <header className="border-b border-[#e6e6e6] bg-white/60 backdrop-blur-sm" role="banner">
        <div className="mx-auto flex h-[65px] w-full max-w-[1920px] items-center justify-between px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="EZBias Home">
            <img
              className="h-14 w-auto object-contain"
              src="/logo.png"
              alt="EZBias logo"
              width="72"
              height="56"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#121212] ${
                  pathname === link.href ? 'text-[#121212]' : 'text-[#121212b3]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <Link
                to={user.role === 'Admin' ? '/admin' : '/seller'}
                className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white shadow-[0_0_0_2px_#ad93e6,0_0_0_4px_#fff]"
                style={{ backgroundColor: '#7c3aed' }}
                title={user.username ?? user.email}
                aria-label={`Logged in as ${user.username ?? user.email}`}
              >
                {initials}
              </Link>
            ) : (
              <button
                onClick={openLogin}
                className="hidden h-10 items-center rounded-full border border-[#ad93e6] bg-white px-6 text-sm font-semibold text-[#ad93e6] transition-colors hover:bg-[#ad93e6] hover:text-white sm:inline-flex"
              >
                SIGN UP
              </button>
            )}

            {/* Notification bell — only for authenticated users */}
            {isAuthenticated && <NotificationBell />}

            {/* Chat inbox — only for authenticated users */}
            {isAuthenticated && <ChatInbox />}

            {/* Cart */}
            <Link
              to="/checkout"
              className="relative flex h-[37px] w-[37px] items-center justify-center text-[#ad93e6]"
              aria-label={`View cart, ${count} item${count !== 1 ? 's' : ''}`}
            >
              <svg
                className="h-[26px] w-[26px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M3 4.5h2.2a1 1 0 0 1 .98.8l1.5 8.2a1 1 0 0 0 .98.8h8.5a1 1 0 0 0 .96-.72l1.4-4.95a1 1 0 0 0-.96-1.28H7.2" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#ad93e6] px-1 text-[10px] font-bold leading-none text-white">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="flex h-9 w-9 flex-col justify-center gap-[5px] p-1 lg:hidden"
              onClick={() => setIsOpen((v) => !v)}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <span
                className={`block h-0.5 w-full rounded bg-[#121212] transition-all duration-200 ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`}
              />
              <span
                className={`block h-0.5 w-full rounded bg-[#121212] transition-all duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`block h-0.5 w-full rounded bg-[#121212] transition-all duration-200 ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        className={`overflow-hidden bg-white/95 backdrop-blur-sm transition-all duration-300 lg:hidden ${isOpen ? 'max-h-72' : 'max-h-0'}`}
        aria-label="Mobile navigation"
      >
        <div className="px-4 py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={`mobile-${link.label}`}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="block border-b border-[#e6e6e6] py-3 text-base font-medium text-[#121212b3] last:border-b-0 hover:text-[#121212]"
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <button
              onClick={() => {
                openLogin();
                setIsOpen(false);
              }}
              className="mt-3 inline-flex h-10 items-center justify-center rounded-full border border-[#ad93e6] bg-white px-6 text-sm font-semibold text-[#ad93e6]"
            >
              SIGN UP
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
