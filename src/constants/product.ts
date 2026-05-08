export type ProductCondition = 1 | 2 | 3 | 4;

export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = {
  1: 'New',
  2: 'Like new',
  3: 'Good',
  4: 'Fair',
};

export function getProductConditionLabel(condition: number): string {
  return PRODUCT_CONDITION_LABELS[condition as ProductCondition] ?? 'Unknown';
}

export type ProductStatus = 1 | 2 | 3;

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  1: 'Active',
  2: 'Sold out',
  3: 'Archived',
};

export const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
  1: 'text-[#16a34a] bg-[#f0fdf4] border-[#bbf7d0]',
  2: 'text-[#dc2626] bg-[#fef2f2] border-[#fecaca]',
  3: 'text-[#737373] bg-[#f5f5f5] border-[#e6e6e6]',
};

export function getProductStatusLabel(status: number): string {
  return PRODUCT_STATUS_LABELS[status as ProductStatus] ?? 'Unknown';
}

export function getProductStatusColors(status: number): string {
  return PRODUCT_STATUS_COLORS[status as ProductStatus] ?? PRODUCT_STATUS_COLORS[3];
}
