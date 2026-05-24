import React, { useCallback, useState } from 'react';
import { DISPUTE_STATUS, getDisputeStatusColors, getDisputeStatusLabel } from '../../../constants/dispute';
import {
  useApproveDispute,
  useDisputes,
  useRefundPayment,
  useRejectDispute,
} from '../../../services/dispute.service';
import { useUiStore } from '../../../stores/ui.store';
import type { ApprovedItem, DisputeItem, DisputeResponse } from '../../../types/dispute';
import { formatCurrency, formatTimeAgo } from '../../../utils/formatters';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

const COLUMNS = ['#', 'Order', 'Buyer', 'Status', 'Reason', 'Filed', 'Resolved', 'actions'] as const;

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-[#737373] uppercase tracking-wide">{label}</span>
      <span className="text-[12px] text-[#121212] break-all">{value}</span>
    </div>
  );
}

function buildApprovedItems(items: DisputeItem[], qtys: Record<number, number>, notes: Record<number, string>): ApprovedItem[] {
  return items.map((item) => ({
    orderItemId: item.orderItemId,
    approvedQty: qtys[item.orderItemId] ?? item.requestedQty,
    note: notes[item.orderItemId] ?? '',
  }));
}

function DisputeDetailPanel({ dispute }: { dispute: DisputeResponse }) {
  const { items, status, refundPayoutInfo, adminNote: existingNote } = dispute;
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: approve, isPending: approving } = useApproveDispute();
  const { mutate: reject, isPending: rejecting } = useRejectDispute();
  const { mutate: refund, isPending: refunding } = useRefundPayment();

  const [adminNote, setAdminNote] = useState('');
  const [approvedQtys, setApprovedQtys] = useState<Record<number, number>>(() => {
    const qtys: Record<number, number> = {};
    items.forEach((item) => { qtys[item.orderItemId] = item.requestedQty; });
    return qtys;
  });
  const [itemNotes, setItemNotes] = useState<Record<number, string>>({});
  const [rejectReason, setRejectReason] = useState('');

  const busy = approving || rejecting || refunding;
  const isOpen = status === DISPUTE_STATUS.OPEN;
  const isApproved = status === DISPUTE_STATUS.APPROVED;
  const hasBankInfo = !!(refundPayoutInfo?.bankName || refundPayoutInfo?.bankAccountNumber || refundPayoutInfo?.bankAccountName);

  const handleApprove = useCallback(() => {
    const approvedItems = buildApprovedItems(items, approvedQtys, itemNotes);
    if (approvedItems.every((i) => i.approvedQty === 0)) {
      showToast('At least one item must have approved quantity greater than 0.');
      return;
    }
    approve(
      { disputeId: dispute.id, payload: { adminNote, approvedItems } },
      {
        onSuccess: () => showToast('Dispute approved.'),
        onError: () => showToast('Action failed. Please try again.'),
      },
    );
  }, [approve, dispute.id, adminNote, approvedQtys, itemNotes, items, showToast]);

  const handleReject = useCallback(() => {
    if (!rejectReason.trim()) { showToast('Please enter a reason for rejection.'); return; }
    if (!window.confirm('Reject this dispute? This action cannot be undone.')) return;
    reject(
      { disputeId: dispute.id, payload: { reason: rejectReason.trim() } },
      {
        onSuccess: () => showToast('Dispute rejected.'),
        onError: () => showToast('Action failed. Please try again.'),
      },
    );
  }, [reject, dispute.id, rejectReason, showToast]);

  const handleRefund = useCallback(() => {
    if (!window.confirm('Process refund? Payment will be returned to the buyer.')) return;
    refund(dispute.id, {
      onSuccess: () => showToast('Refund processed.'),
      onError: () => showToast('Action failed. Please try again.'),
    });
  }, [refund, dispute.id, showToast]);

  return (
    <div className="grid grid-cols-[1fr_240px] gap-0 divide-x divide-[#e6e6e6]">
      {/* Left: items table + action forms */}
      <div className="flex flex-col gap-4 px-6 py-5">
        {items.length > 0 && (
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#e6e6e6]">
                {['Product', 'Ordered', 'Requested', 'Approved', 'Unit price',
                  ...(isOpen ? ['Approve qty', 'Note'] : [])].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#737373] pb-2 pr-5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[rgba(230,230,230,0.4)] last:border-0">
                  <td className="py-2.5 pr-5 text-[#121212] font-medium">{item.productName}</td>
                  <td className="py-2.5 pr-5 text-[#737373]">{item.orderedQty}</td>
                  <td className="py-2.5 pr-5 text-[#737373]">{item.requestedQty}</td>
                  <td className="py-2.5 pr-5">
                    {item.approvedQty != null
                      ? <span className="text-[#166534] font-semibold">{item.approvedQty}</span>
                      : <span className="text-[#b3b3b3]">—</span>}
                  </td>
                  <td className="py-2.5 pr-5 text-[#737373]">{formatCurrency(item.unitPrice)}</td>
                  {isOpen && (
                    <>
                      <td className="py-2.5 pr-5">
                        <input
                          type="number"
                          min={0}
                          max={item.requestedQty}
                          step={1}
                          value={approvedQtys[item.orderItemId] ?? item.requestedQty}
                          onChange={(e) => setApprovedQtys((prev) => ({
                            ...prev,
                            [item.orderItemId]: Math.floor(Math.max(0, Math.min(item.requestedQty, Number(e.target.value)))),
                          }))}
                          className="w-16 h-6 px-2 rounded border border-[#e6e6e6] text-[#121212] text-[12px] focus:outline-none focus:border-[#ad93e6]"
                        />
                      </td>
                      <td className="py-2.5 pr-5">
                        <input
                          type="text"
                          placeholder="optional"
                          value={itemNotes[item.orderItemId] ?? ''}
                          onChange={(e) => setItemNotes((prev) => ({ ...prev, [item.orderItemId]: e.target.value }))}
                          className="w-28 h-6 px-2 rounded border border-[#e6e6e6] text-[#121212] text-[12px] focus:outline-none focus:border-[#ad93e6]"
                        />
                      </td>
                    </>
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
            <button type="button" disabled={busy} onClick={handleRefund}
              className="h-7 px-3 rounded-lg bg-[#166534] text-white text-[12px] font-semibold hover:bg-[#14532d] transition-colors disabled:opacity-50">
              {refunding ? '…' : 'Process Refund'}
            </button>
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
    </div>
  );
}

const DisputesSection = React.memo(function DisputesSection() {
  const { data: disputes = [], isLoading, isError } = useDisputes();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

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
                  const isExpanded = expandedId === d.id;
                  const statusCls = getDisputeStatusColors(d.status);
                  return (
                    <React.Fragment key={d.id}>
                      <tr className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)]">
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
                        <td className="px-4 py-[14px] text-[#737373] align-middle max-w-[180px] truncate">{d.reason}</td>
                        <td className="px-4 py-[14px] text-[#737373] align-middle text-[12px] whitespace-nowrap">{formatTimeAgo(d.createdAt)}</td>
                        <td className="px-4 py-[14px] align-middle text-[12px] whitespace-nowrap">
                          {d.resolvedAt
                            ? <span className="text-[#737373]">{formatTimeAgo(d.resolvedAt)}</span>
                            : <span className="text-[#b3b3b3]">—</span>}
                        </td>
                        <td className="px-4 py-[14px] align-middle">
                          <button type="button" onClick={() => toggleExpand(d.id)}
                            className="flex items-center gap-1 text-[#737373] hover:text-[#121212] transition-colors text-[12px] whitespace-nowrap">
                            Details <ChevronDown open={isExpanded} />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[rgba(244,243,247,0.6)] border-b border-[rgba(230,230,230,0.5)]">
                          <td colSpan={COLUMNS.length}>
                            <DisputeDetailPanel key={d.id} dispute={d} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

export default DisputesSection;
