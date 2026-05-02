import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../constants/landing';

const Footer = () => (
  <footer className="bg-[rgba(244,243,247,0.4)] px-6">
    <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-[#e6e6e6] px-4 py-8">
      <Link to="/" className="text-xl font-extrabold text-[#ad93e6]">
        EZBias
      </Link>
      <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
        {NAV_LINKS.map((l) => (
          <Link
            key={l.label}
            to={l.href}
            className="text-sm text-[#737373] transition-colors hover:text-[#121212]"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <p className="text-sm text-[#737373]">Copyright 2026 EZBias. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
