import { useCallback, useState } from 'react';
import type { AxiosError } from 'axios';
import {
  useAdminPayouts,
  useApprovePayout,
  useRejectPayout,
} from '../../services/admin.service';
import { useUiStore } from '../../stores/ui.store';
import type { AdminPayoutListItem } from '../../types/admin';

export type ModalMode = 'approve' | 'reject';

export function useAdminPayoutsFeature() {
  const showToast = useUiStore((s) => s.showToast);
  const { data: payouts = [], isLoading, isError, refetch } = useAdminPayouts();
  const { mutate: approveMutate, isPending: isApprovePending } = useApprovePayout();
  const { mutate: rejectMutate, isPending: isRejectPending } = useRejectPayout();

  const [selectedPayout, setSelectedPayout] = useState<AdminPayoutListItem | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);

  const openApprove = useCallback((payout: AdminPayoutListItem) => {
    setSelectedPayout(payout);
    setModalMode('approve');
  }, []);

  const openReject = useCallback((payout: AdminPayoutListItem) => {
    setSelectedPayout(payout);
    setModalMode('reject');
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPayout(null);
    setModalMode(null);
  }, []);

  const handleApprove = useCallback(
    (adminNote?: string) => {
      if (!selectedPayout) return;
      approveMutate(
        { payoutId: selectedPayout.payoutId, payload: { adminNote } },
        {
          onSuccess: () => {
            showToast('Payout approved successfully.', 'success');
            closeModal();
          },
          onError: (err) => {
            const msg =
              (err as AxiosError<{ message?: string }>).response?.data?.message ??
              'Failed to approve payout.';
            showToast(msg, 'error');
          },
        },
      );
    },
    [selectedPayout, approveMutate, showToast, closeModal],
  );

  const handleReject = useCallback(
    (reason: string) => {
      if (!selectedPayout) return;
      rejectMutate(
        { payoutId: selectedPayout.payoutId, payload: { reason } },
        {
          onSuccess: () => {
            showToast('Payout rejected.', 'success');
            closeModal();
          },
          onError: (err) => {
            const msg =
              (err as AxiosError<{ message?: string }>).response?.data?.message ??
              'Failed to reject payout.';
            showToast(msg, 'error');
          },
        },
      );
    },
    [selectedPayout, rejectMutate, showToast, closeModal],
  );

  return {
    payouts,
    isLoading,
    isError,
    refetch,
    selectedPayout,
    modalMode,
    openApprove,
    openReject,
    closeModal,
    handleApprove,
    handleReject,
    isApprovePending,
    isRejectPending,
  };
}
