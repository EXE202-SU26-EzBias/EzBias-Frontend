export type ProductCondition = 0 | 1 | 2 | 3;

export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = {
  0: 'New',
  1: 'Like new',
  2: 'Good',
  3: 'Fair',
};

export function getProductConditionLabel(condition: ProductCondition): string {
  return PRODUCT_CONDITION_LABELS[condition];
}
