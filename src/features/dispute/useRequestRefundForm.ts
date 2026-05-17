import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateDispute } from '../../services/dispute.service';
import { orderKeys } from '../../services/order.service';
import { useUiStore } from '../../stores/ui.store';
import type { Order } from '../../types/order';

interface UseRequestRefundFormOptions {
  order: Order;
  onSuccess: () => void;
}

export function useRequestRefundForm({ order, onSuccess }: UseRequestRefundFormOptions) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [reason, setReason] = useState('');

  const { mutate, isPending } = useCreateDispute();
  const showToast = useUiStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const toggleItem = useCallback((orderItemId: number) => {
    setCheckedItems((prev) => {
      const isNowChecked = !prev[orderItemId];
      if (!isNowChecked) {
        setQuantities((q) => {
          const copy = { ...q };
          delete copy[orderItemId];
          return copy;
        });
      }
      return { ...prev, [orderItemId]: isNowChecked };
    });
  }, []);

  const setQuantity = useCallback((orderItemId: number, qty: number) => {
    setQuantities((prev) => ({ ...prev, [orderItemId]: qty }));
  }, []);

  const canSubmit =
    reason.trim().length > 0 &&
    order.items.some((item) => checkedItems[item.id]);

  const handleSubmit = useCallback(() => {
    const selectedItems = order.items.filter((item) => checkedItems[item.id]);
    if (!reason.trim() || selectedItems.length === 0) return;

    const payload = {
      orderId: order.id,
      reason: reason.trim(),
      items: selectedItems.map((item) => ({
        orderItemId: item.id,
        requestedQty: quantities[item.id] ?? item.quantity,
        reason: reason.trim(),
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        showToast('Dispute submitted successfully.');
        queryClient.invalidateQueries({ queryKey: orderKeys.all });
        onSuccess();
      },
      onError: () => showToast('Failed to submit dispute. Please try again.'),
    });
  }, [order, reason, checkedItems, quantities, mutate, queryClient, onSuccess, showToast]);

  return {
    checkedItems,
    quantities,
    reason,
    setReason,
    toggleItem,
    setQuantity,
    handleSubmit,
    isPending,
    canSubmit,
  };
}
