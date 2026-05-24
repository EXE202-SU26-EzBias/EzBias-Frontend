import type { AdminDashboardOverviewResponse } from '../../types/admin';

export type Severity = 'high' | 'medium' | 'low';

export interface AlertInfo {
  id: string;
  label: string;
  count: number;
  description: string;
  severity: Severity;
}

export const ALERT_THRESHOLDS = {
  ordersToProcess: { high: 50, med: 20 },
  openDisputes:    { high: 5,  med: 1 },
  pendingRefunds:  { high: 5,  med: 1 },
  pendingPayouts:  { high: 10, med: 1 },
} as const;

export function toSeverity(count: number, highAt: number, medAt: number): Severity {
  if (count >= highAt) return 'high';
  if (count >= medAt) return 'medium';
  return 'low';
}

export function deriveAlerts(data: AdminDashboardOverviewResponse): AlertInfo[] {
  const pendingTotal = data.pendingOrders + data.processingOrders;
  const t = ALERT_THRESHOLDS;
  return [
    {
      id: 'ordersToProcess',
      label: 'Orders to Process',
      count: pendingTotal,
      description: `${data.pendingOrders.toLocaleString()} awaiting payment · ${data.processingOrders.toLocaleString()} processing`,
      severity: toSeverity(pendingTotal, t.ordersToProcess.high, t.ordersToProcess.med),
    },
    {
      id: 'openDisputes',
      label: 'Open Disputes',
      count: data.openDisputes,
      description: 'Buyer disputes awaiting admin review',
      severity: toSeverity(data.openDisputes, t.openDisputes.high, t.openDisputes.med),
    },
    {
      id: 'pendingRefunds',
      label: 'Pending Refunds',
      count: data.pendingRefunds,
      description: 'Approved disputes awaiting refund processing',
      severity: toSeverity(data.pendingRefunds, t.pendingRefunds.high, t.pendingRefunds.med),
    },
    {
      id: 'pendingPayouts',
      label: 'Pending Payouts',
      count: data.pendingPayouts,
      description: 'Seller payout requests to approve',
      severity: toSeverity(data.pendingPayouts, t.pendingPayouts.high, t.pendingPayouts.med),
    },
  ];
}
