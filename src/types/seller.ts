import type { AuctionStatus } from '../constants/auction';
import type { ProductCondition, ProductStatus } from '../constants/product';

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
  status: ProductStatus;
  createdAt: string;
}

// Re-export so existing imports of SellerAuctionStatus keep working
export type { AuctionStatus as SellerAuctionStatus };

export interface SellerAuction {
  auctionId: number;
  productId: number;
  floorPrice: number;
  currentBid: number;
  status: AuctionStatus;
  endsAt: string;
  createdAt?: string;
}

export type { Order as SellerOrder } from './order';
