import React, { useCallback, useState } from 'react';
import {
  useApproveDispute,
  useDisputeDetail,
  useDisputes,
  useRefundPayment,
  useRejectDispute,
} from '../../../services/dispute.service';
import { useUiStore } from '../../../stores/ui.store';
import { DISPUTE_STATUS, getDisputeStatusColors, getDisputeStatusLabel } from '../../../constants/dispute';
import { formatCurrency, formatTimeAgo } from '../../../utils/formatters';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';
import type { DisputeResponse } from '../../../types/dispute';

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function DisputeDetailRow({ disputeId }: { disputeId: number }) {
  const { data: detail, isLoading } = useDisputeDetail(disputeId);
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: approve, isPending: approving } = useApproveDispute();
  const { mutate: reject, isPending: rejecting } = useRejectDispute();
  const { mutate: refund, isPending: refunding } = useRefundPayment();

  const busy = approving || rejecting || refunding;

  const handleApprove = useCallback(() => {
    if (!window.confirm('Approve this dispute? The buyer will be eligible for a refund.')) return;
    approve(disputeId, {
      onSuccess: () => showToast('Dispute approved.'),
      onError: () => showToast('Action failed. Please try again.'),
    });
  }, [approve, disputeId, showToast]);

  const handleReject = useCallback(() => {
    if (!window.confirm('Reject this dispute? This action cannot be undone.')) return;
    reject(disputeId, {
      onSuccess: () => showToast('Dispute rejected.'),
      onError: () => showToast('Action failed. Please try again.'),
    });
  }, [reject, disputeId, showToast]);

  const handleRefund = useCallback(() => {
    if (!window.confirm('Process refund for this dispute? Payment will be returned to the buyer.')) return;
    refund(disputeId, {
      onSuccess: () => showToast('Refund processed.'),
      onError: () => showToast('Action failed. Please try again.'),
    });
  }, [refund, disputeId, showToast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      {detail.items.length > 0 && (
        <table className="w-full text-[12px]">
          <thead>
            <tr>
              {['Product', 'Qty', 'Unit price'].map((h) => (
                <th key={h} className="text-left font-semibold text-[#737373] pb-2 pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detail.items.map((item) => (
              <tr key={item.id}>
                <td className="py-1.5 pr-6 text-[#121212]">{item.productName}</td>
                <td className="py-1.5 pr-6 text-[#737373]">{item.quantity}</td>
                <td className="py-1.5 text-[#737373]">{formatCurrency(item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex gap-2">
        {detail.status === DISPUTE_STATUS.OPEN && (
          <>
            <button type="button" disabled={busy} onClick={handleApprove} className="h-7 px-3 rounded-lg bg-[#ad93e6] text-white text-[12px] font-semibold hover:bg-[#9d7ed9] transition-colors disabled:opacity-50">
              {approving ? '…' : 'Approve'}
            </button>
            <button type="button" disabled={busy} onClick={handleReject} className="h-7 px-3 rounded-lg border border-[#e6e6e6] text-[#737373] text-[12px] font-semibold hover:bg-[#f5f5f5] transition-colors disabled:opacity-50">
              {rejecting ? '…' : 'Reject'}
            </button>
          </>
        )}
        {detail.status === DISPUTE_STATUS.APPROVED && (
          <button type="button" disabled={busy} onClick={handleRefund} className="h-7 px-3 rounded-lg bg-[#166534] text-white text-[12px] font-semibold hover:bg-[#14532d] transition-colors disabled:opacity-50">
            {refunding ? '…' : 'Process Refund'}
          </button>
        )}
      </div>
    </div>
  );
}

const DisputesSection = React.memo(function DisputesSection() {
  const { data: disputes = [], isLoading, isError } = useDisputes();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const headers = ['Dispute', 'Order', 'Status', 'Reason', 'Filed', ''];

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
        {isError && !isLoading && (
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
                  {headers.map((h) => (
                    <th key={h} className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]">
                      {h}
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
                        <td className="px-4 py-[14px] text-[#121212] font-medium align-middle">#{d.id}</td>
                        <td className="px-4 py-[14px] text-[#737373] align-middle">#{d.orderId}</td>
                        <td className="px-4 py-[14px] align-middle">
                          <span className={`inline-flex items-center px-[10px] py-0.5 rounded-full text-[11px] font-semibold border ${statusCls}`}>
                            {getDisputeStatusLabel(d.status)}
                          </span>
                        </td>
                        <td className="px-4 py-[14px] text-[#737373] align-middle max-w-[200px] truncate">{d.reason}</td>
                        <td className="px-4 py-[14px] text-[#737373] align-middle text-[12px]">{formatTimeAgo(d.createdAt)}</td>
                        <td className="px-4 py-[14px] align-middle">
                          <button type="button" onClick={() => toggleExpand(d.id)} className="flex items-center gap-1 text-[#737373] hover:text-[#121212] transition-colors text-[12px]">
                            Details <ChevronDown open={isExpanded} />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[rgba(244,243,247,0.6)] border-b border-[rgba(230,230,230,0.5)]">
                          <td colSpan={6}>
                            <DisputeDetailRow disputeId={d.id} />
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
