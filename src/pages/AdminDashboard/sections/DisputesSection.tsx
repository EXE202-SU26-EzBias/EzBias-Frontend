import React, { useCallback, useState } from 'react';
import type { AxiosError } from 'axios';
import { DISPUTE_STATUS, getDisputeStatusColors, getDisputeStatusLabel } from '../../../constants/dispute';
import {
  useApproveDispute,
  useDisputes,
  useRejectDispute,
} from '../../../services/dispute.service';
import { useUiStore } from '../../../stores/ui.store';
import type { DisputeResponse } from '../../../types/dispute';
import { formatCurrency, formatTimeAgo } from '../../../utils/formatters';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';
import DisputeRefundQRModal from './DisputeRefundQRModal';

const COLUMNS = ['#', 'Order', 'Buyer', 'Status', 'Reason', 'Filed', 'Resolved', 'actions'] as const;

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-[#737373] uppercase tracking-wide">{label}</span>
      <span className="text-[12px] text-[#121212] break-all">{value}</span>
    </div>
  );
}

function DisputeDetailModal({ dispute, onClose }: { dispute: DisputeResponse; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#e6e6e6] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-[17px] font-bold text-[#121212]">Dispute #{dispute.id}</h2>
            <p className="text-[12px] text-[#737373]">Order #{dispute.orderId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#e6e6e6] flex items-center justify-center text-[#737373] hover:text-[#121212] hover:bg-[#f4f4f4] transition-colors"
          >
            ×
          </button>
        </div>
        <DisputeDetailPanel dispute={dispute} onClose={onClose} />
      </div>
    </div>
  );
}

function DisputeDetailPanel({ dispute, onClose }: { dispute: DisputeResponse; onClose: () => void }) {
  const { items, status, refundPayoutInfo, adminNote: existingNote } = dispute;
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: approve, isPending: approving } = useApproveDispute();
  const { mutate: reject, isPending: rejecting } = useRejectDispute();

  const [adminNote, setAdminNote] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const busy = approving || rejecting;
  const isOpen = status === DISPUTE_STATUS.OPEN;
  const isApproved = status === DISPUTE_STATUS.RESOLVED_BUYER && !dispute.refundProcessed;
  const hasBankInfo = !!(refundPayoutInfo?.bankName || refundPayoutInfo?.bankAccountNumber || refundPayoutInfo?.bankAccountName);

  const handleApprove = useCallback(() => {
    const approvedItems = items.map((item) => ({
      orderItemId: item.orderItemId,
      approvedQty: item.requestedQty,
      note: '',
    }));
    approve(
      { disputeId: dispute.id, payload: { adminNote, approvedItems } },
      {
        onSuccess: () => { showToast('Dispute approved.', 'success'); },
        onError: (err) => {
          const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? 'Action failed. Please try again.';
          showToast(message, 'error');
        },
      },
    );
  }, [approve, dispute.id, adminNote, items, showToast]);

  const handleReject = useCallback(() => {
    if (!rejectReason.trim()) { showToast('Please enter a reason for rejection.', 'error'); return; }
    if (!window.confirm('Reject this dispute? This action cannot be undone.')) return;
    reject(
      { disputeId: dispute.id, payload: { reason: rejectReason.trim() } },
      {
        onSuccess: () => { showToast('Dispute rejected.', 'success'); onClose(); },
        onError: (err) => {
          const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? 'Action failed. Please try again.';
          showToast(message, 'error');
        },
      },
    );
  }, [reject, dispute.id, rejectReason, showToast, onClose]);

  return (
    <div className="grid grid-cols-[1fr_240px] gap-0 divide-x divide-[#e6e6e6]">
      {/* Left: items table + action forms */}
      <div className="flex flex-col gap-4 px-6 py-5">
        {dispute.reason && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Reason</p>
            <p className="text-[12px] text-[#121212] bg-[rgba(244,243,247,0.6)] rounded-lg px-3 py-2 border border-[#e6e6e6] whitespace-pre-wrap break-words">
              {dispute.reason}
            </p>
          </div>
        )}
        {items.length > 0 && (
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#e6e6e6]">
                {['Product', 'Ordered', 'Unit price',
                  ...(isOpen ? ['Quantity'] : [])].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#737373] pb-2 pr-5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[rgba(230,230,230,0.4)] last:border-0">
                  <td className="py-2.5 pr-5 text-[#121212] font-medium">{item.productName}</td>
                  <td className="py-2.5 pr-5 text-[#737373]">{item.orderedQty}</td>
                  <td className="py-2.5 pr-5 text-[#737373]">{formatCurrency(item.unitPrice)}</td>
                  {isOpen && (
                    <td className="py-2.5 pr-5 text-[#737373]">{item.requestedQty}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isOpen && (
          <>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#737373]">
                  Admin note <span className="font-normal text-[#b3b3b3]">(for approve)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional note to the buyer"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full rounded-lg border border-[#e6e6e6] px-3 py-2 text-[12px] text-[#121212] resize-none focus:outline-none focus:border-[#ad93e6]"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#737373]">
                  Rejection reason <span className="text-[#ef4343]">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Required if rejecting"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-lg border border-[#e6e6e6] px-3 py-2 text-[12px] text-[#121212] resize-none focus:outline-none focus:border-[#ad93e6]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" disabled={busy} onClick={handleApprove}
                className="h-7 px-3 rounded-lg bg-[#ad93e6] text-white text-[12px] font-semibold hover:bg-[#9d7ed9] transition-colors disabled:opacity-50">
                {approving ? '…' : 'Approve'}
              </button>
              <button type="button" disabled={busy} onClick={handleReject}
                className="h-7 px-3 rounded-lg border border-[#e6e6e6] text-[#737373] text-[12px] font-semibold hover:bg-[#f5f5f5] transition-colors disabled:opacity-50">
                {rejecting ? '…' : 'Reject'}
              </button>
            </div>
          </>
        )}

        {isApproved && (
          <div>
            <button type="button" disabled={busy || !hasBankInfo} onClick={() => setShowRefundModal(true)}
              title={!hasBankInfo ? 'Buyer must provide bank information first' : ''}
              className="h-7 px-3 rounded-lg bg-[#166534] text-white text-[12px] font-semibold hover:bg-[#14532d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Process Refund
            </button>
          </div>
        )}

        {dispute.refundProcessed && (
          <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[12px] font-semibold text-[#166534]">
            <span className="text-[13px] leading-none">✓</span> Refund processed
          </div>
        )}
      </div>

      {/* Right: info sidebar */}
      <div className="flex flex-col gap-5 px-5 py-5">
        {refundPayoutInfo && (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Buyer</p>
              <div className="flex flex-col gap-2">
                <InfoRow label="Name" value={refundPayoutInfo.buyerFullName} />
                <InfoRow label="Email" value={refundPayoutInfo.buyerEmail} />
                <InfoRow label="Phone" value={refundPayoutInfo.buyerPhone} />
              </div>
            </div>

            {hasBankInfo && (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Refund / Bank</p>
                <div className="flex flex-col gap-2">
                  <InfoRow label="Bank" value={refundPayoutInfo.bankName} />
                  <InfoRow label="Account #" value={refundPayoutInfo.bankAccountNumber} />
                  <InfoRow label="Account name" value={refundPayoutInfo.bankAccountName} />
                </div>
              </div>
            )}
          </>
        )}

        {existingNote && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Admin note</p>
            <p className="text-[12px] text-[#121212] bg-[rgba(173,147,230,0.08)] rounded-lg px-3 py-2 border border-[rgba(173,147,230,0.2)]">
              {existingNote}
            </p>
          </div>
        )}
      </div>

      {showRefundModal && (
        <DisputeRefundQRModal
          dispute={dispute}
          onClose={() => setShowRefundModal(false)}
          onProcessed={() => { setShowRefundModal(false); onClose(); }}
        />
      )}
    </div>
  );
}

const DisputesSection = React.memo(function DisputesSection() {
  const { data: disputes = [], isLoading, isError } = useDisputes();
  const [selectedDispute, setSelectedDispute] = useState<DisputeResponse | null>(null);

  const currentDispute = selectedDispute
    ? (disputes.find((d) => d.id === selectedDispute.id) ?? selectedDispute)
    : null;

  return (
    <div>
      <SellerTopbar title="Disputes" sub="Review buyer dispute requests" />
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
          </div>
        )}
        {isError && (
          <p className="px-5 py-6 text-[14px] text-[#ef4343]">Failed to load disputes. Please try again.</p>
        )}
        {!isLoading && !isError && disputes.length === 0 && (
          <p className="px-5 py-12 text-center text-[14px] text-[#737373]">No disputes yet.</p>
        )}
        {!isLoading && !isError && disputes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  {COLUMNS.map((h) => (
                    <th key={h}
                      className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)] whitespace-nowrap">
                      {h === 'actions' ? '' : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disputes.map((d: DisputeResponse) => {
                  const statusCls = getDisputeStatusColors(d.status);
                  return (
                    <tr key={d.id} className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)]">
                      <td className="px-4 py-[14px] text-[#121212] font-medium align-middle whitespace-nowrap">#{d.id}</td>
                      <td className="px-4 py-[14px] text-[#737373] align-middle whitespace-nowrap">#{d.orderId}</td>
                      <td className="px-4 py-[14px] align-middle">
                        <div className="flex flex-col">
                          <span className="text-[#121212] font-medium text-[13px]">{d.refundPayoutInfo?.buyerFullName ?? '—'}</span>
                          <span className="text-[#737373] text-[11px]">{d.refundPayoutInfo?.buyerEmail ?? ''}</span>
                        </div>
                      </td>
                      <td className="px-4 py-[14px] align-middle">
                        <span className={`inline-flex items-center px-[10px] py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${statusCls}`}>
                          {getDisputeStatusLabel(d.status)}
                        </span>
                      </td>
                      <td className="px-4 py-[14px] text-[#737373] align-middle max-w-[180px] truncate" title={d.reason}>{d.reason}</td>
                      <td className="px-4 py-[14px] text-[#737373] align-middle text-[12px] whitespace-nowrap">{formatTimeAgo(d.createdAt)}</td>
                      <td className="px-4 py-[14px] align-middle text-[12px] whitespace-nowrap">
                        {d.resolvedAt
                          ? <span className="text-[#737373]">{formatTimeAgo(d.resolvedAt)}</span>
                          : <span className="text-[#b3b3b3]">—</span>}
                      </td>
                      <td className="px-4 py-[14px] align-middle">
                        <button type="button" onClick={() => setSelectedDispute(d)}
                          className="flex items-center gap-1 text-[#737373] hover:text-[#121212] transition-colors text-[12px] whitespace-nowrap">
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {currentDispute && (
        <DisputeDetailModal dispute={currentDispute} onClose={() => setSelectedDispute(null)} />
      )}
    </div>
  );
});

export default DisputesSection;
