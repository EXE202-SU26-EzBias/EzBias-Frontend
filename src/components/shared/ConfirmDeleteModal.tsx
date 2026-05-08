import { useEffect } from 'react';

interface ConfirmDeleteModalProps {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal = ({ productName, onConfirm, onCancel }: ConfirmDeleteModalProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef2f2]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </span>
          <h2 id="confirm-delete-title" className="text-[17px] font-bold text-[#121212]">
            Delete listing?
          </h2>
          <p className="text-sm text-[#737373]">
            <span className="font-semibold text-[#121212]">{productName}</span> will be permanently removed. This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-11 w-full items-center justify-center rounded-full bg-[#dc2626] text-sm font-semibold text-white transition-colors hover:bg-[#b91c1c]"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-11 w-full items-center justify-center rounded-full border border-[#e6e6e6] text-sm font-medium text-[#737373] transition-colors hover:bg-[#f4f3f7]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
