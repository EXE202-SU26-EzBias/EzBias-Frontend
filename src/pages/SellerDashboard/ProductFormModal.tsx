import { useEffect, type ReactNode } from 'react';
import { PRODUCT_CONDITION_LABELS, PRODUCT_STATUS_LABELS, getProductConditionLabel } from '../../constants/product';
import { useCreateProductForm, useUpdateProductForm } from '../../features/seller/useProductForm';
import type { SellerProduct } from '../../types/seller';

interface ProductFormModalProps {
  product: SellerProduct | null;
  onClose: () => void;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

const inputCls =
  'h-10 w-full rounded-lg border border-[#e6e6e6] bg-white px-3 text-[14px] text-[#121212] outline-none transition focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)]';

const selectCls = inputCls + ' cursor-pointer';

// Wrapping <label> associates the label text with its input without needing htmlFor/id
function Field({ label, error, children }: { label: string; error?: { message?: string }; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#737373]">{label}</span>
      {children}
      {error?.message && <span className="text-[11px] text-[#ef4343]">{error.message}</span>}
    </label>
  );
}

function ReadOnly({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#737373]">{label}</span>
      <span className="flex h-10 items-center rounded-lg border border-[#e6e6e6] bg-[#fafafa] px-3 text-[14px] text-[#737373]">
        {value}
      </span>
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#e6e6e6] px-6 py-5">
          <h2 id="modal-title" className="text-[17px] font-bold text-[#121212]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#737373] transition hover:bg-[#f4f3f7] hover:text-[#121212]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormFooter({ onClose, isPending, label }: { onClose: () => void; isPending: boolean; label: string }) {
  return (
    <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[#e6e6e6] px-6 py-4">
      <button
        type="button"
        onClick={onClose}
        className="flex h-10 items-center justify-center rounded-full border border-[#e6e6e6] px-5 text-[13px] font-medium text-[#737373] transition hover:bg-[#f4f3f7]"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isPending}
        className="flex h-10 items-center justify-center rounded-full bg-[#ad93e6] px-5 text-[13px] font-semibold text-white transition hover:bg-[#9d7ed9] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Saving…' : label}
      </button>
    </div>
  );
}

// ─── Create form ──────────────────────────────────────────────────────────────

function CreateProductModal({ onClose }: { onClose: () => void }) {
  const { register, onSubmit, errors, isPending, fandoms, isFandomsLoading } = useCreateProductForm(onClose);

  return (
    <ModalShell title="New listing" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" error={errors.name}>
                <input type="text" placeholder="e.g. Golden Photocard A" className={inputCls} {...register('name')} />
              </Field>
              <Field label="Artist" error={errors.artist}>
                <input type="text" placeholder="e.g. Jungkook" className={inputCls} {...register('artist')} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (VNĐ)" error={errors.price}>
                <input type="number" min="1" placeholder="180000" className={inputCls} {...register('price')} />
              </Field>
              <Field label="Stock" error={errors.stock}>
                <input type="number" min="0" placeholder="10" className={inputCls} {...register('stock')} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Type" error={errors.type}>
                <input type="text" placeholder="e.g. Photocard, Album" className={inputCls} {...register('type')} />
              </Field>
              <Field label="Condition" error={errors.condition}>
                <select className={selectCls} {...register('condition')}>
                  {(Object.entries(PRODUCT_CONDITION_LABELS) as [string, string][]).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Fandom" error={errors.fandomId}>
              <select className={selectCls} disabled={isFandomsLoading} {...register('fandomId')}>
                <option value="">{isFandomsLoading ? 'Loading fandoms…' : 'Select fandom…'}</option>
                {fandoms.map((f) => (
                  <option key={f.id} value={String(f.id)}>{f.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Image URL" error={errors.primaryImageUrl}>
              <input type="text" placeholder="https://…" className={inputCls} {...register('primaryImageUrl')} />
            </Field>

            <Field label="Description" error={errors.description}>
              <textarea
                rows={3}
                placeholder="Optional product description…"
                className="w-full resize-none rounded-lg border border-[#e6e6e6] bg-white px-3 py-2.5 text-[14px] text-[#121212] outline-none transition focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)]"
                {...register('description')}
              />
            </Field>
          </div>
        </div>
        <FormFooter onClose={onClose} isPending={isPending} label="Create listing" />
      </form>
    </ModalShell>
  );
}

// ─── Edit form ────────────────────────────────────────────────────────────────

function EditProductModal({ product, onClose }: { product: SellerProduct; onClose: () => void }) {
  const { register, onSubmit, errors, isPending } = useUpdateProductForm(product, onClose);

  return (
    <ModalShell title="Edit listing" onClose={onClose}>
      <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            {/* Read-only product info */}
            <div className="rounded-xl border border-[#e6e6e6] bg-[#fafafa] px-4 py-3">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.5px] text-[#b3b3b3]">Product info (not editable)</p>
              <div className="grid grid-cols-2 gap-3">
                <ReadOnly label="Name" value={product.name} />
                <ReadOnly label="Artist" value={product.artist} />
                <ReadOnly label="Type" value={product.type} />
                <ReadOnly label="Condition" value={getProductConditionLabel(product.condition)} />
              </div>
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (VNĐ)" error={errors.price}>
                <input type="number" min="1" className={inputCls} {...register('price')} />
              </Field>
              <Field label="Stock" error={errors.stock}>
                <input type="number" min="0" className={inputCls} {...register('stock')} />
              </Field>
            </div>

            <Field label="Status" error={errors.status}>
              <select className={selectCls} {...register('status')}>
                {(Object.entries(PRODUCT_STATUS_LABELS) as [string, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </Field>

            <Field label="Image URL" error={errors.primaryImageUrl}>
              <input type="text" placeholder="https://…" className={inputCls} {...register('primaryImageUrl')} />
            </Field>

            <Field label="Description" error={errors.description}>
              <textarea
                rows={3}
                className="w-full resize-none rounded-lg border border-[#e6e6e6] bg-white px-3 py-2.5 text-[14px] text-[#121212] outline-none transition focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)]"
                {...register('description')}
              />
            </Field>
          </div>
        </div>
        <FormFooter onClose={onClose} isPending={isPending} label="Save changes" />
      </form>
    </ModalShell>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

const ProductFormModal = ({ product, onClose }: ProductFormModalProps) =>
  product
    ? <EditProductModal product={product} onClose={onClose} />
    : <CreateProductModal onClose={onClose} />;

export default ProductFormModal;
