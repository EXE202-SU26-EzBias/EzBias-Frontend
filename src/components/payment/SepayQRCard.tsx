import { useState } from 'react';

interface SepayQRCardProps {
  amount: number;
  reference: string;
}

function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value as string;
}

const BANK_NAME = requireEnv('VITE_SEPAY_BANK_NAME');
const ACCOUNT_NUMBER = requireEnv('VITE_SEPAY_ACCOUNT_NUMBER');
const ACCOUNT_HOLDER = requireEnv('VITE_SEPAY_ACCOUNT_HOLDER');

function buildQrUrl(amount: number, reference: string) {
  const params = new URLSearchParams({
    acc: ACCOUNT_NUMBER,
    bank: BANK_NAME,
    amount: String(amount),
    des: reference,
  });
  return `https://qr.sepay.vn/img?${params.toString()}`;
}

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SepayQRCard = ({ amount, reference }: SepayQRCardProps) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently ignore — do not show "Copied"
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-[#e6e6e6] bg-white p-6 sm:flex-row sm:items-start">
      <div className="shrink-0 overflow-hidden rounded-xl border border-[#e6e6e6]">
        {imgError ? (
          <div className="flex h-[160px] w-[160px] items-center justify-center bg-[#f9f9f9] p-3 text-center text-[11px] text-[#737373]">
            QR unavailable — use account details to transfer manually.
          </div>
        ) : (
          <img
            src={buildQrUrl(amount, reference)}
            alt="SePay QR Code"
            width={160}
            height={160}
            className="block"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="flex w-full flex-col gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#b0bac3]">Bank</p>
          <p className="text-[14px] font-semibold text-[#121212]">{BANK_NAME}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#b0bac3]">Account number</p>
          <p className="text-[14px] font-semibold text-[#121212]">{ACCOUNT_NUMBER}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#b0bac3]">Account holder</p>
          <p className="text-[14px] font-semibold text-[#121212]">{ACCOUNT_HOLDER}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#b0bac3]">Transfer content</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-[14px] font-semibold text-[#9b84ec]">{reference}</p>
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[#737373] transition-colors hover:bg-[#f5f5f5] hover:text-[#121212]"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#b0bac3]">Amount</p>
          <p className="text-[18px] font-bold text-[#121212]">
            {amount.toLocaleString('vi-VN')}
            <span className="ml-1 text-[13px] font-medium text-[#737373]">₫</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SepayQRCard;
