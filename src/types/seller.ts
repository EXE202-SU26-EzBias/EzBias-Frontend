import type { ProductCondition } from '../constants/product';

export interface SellerProduct {
  id: number;
  sellerId: number;
  fandomId: string;
  artist: string;
  name: string;
  type: string;
  condition: ProductCondition;
  price: number;
  stock: number;
  description: string;
  primaryImageUrl: string;
  isAuction: boolean;
  status: number;
  createdAt: string;
}
