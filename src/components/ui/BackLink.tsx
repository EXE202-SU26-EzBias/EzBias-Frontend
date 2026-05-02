import { Link } from 'react-router-dom';

interface BackLinkProps {
  to: string;
  label: string;
}

const BackLink = ({ to, label }: BackLinkProps) => (
  <Link
    to={to}
    className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#737373] transition-colors hover:text-[#121212]"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
    {label}
  </Link>
);

export default BackLink;
