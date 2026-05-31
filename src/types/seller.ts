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
  imageUrls: string[];
  isAuction: boolean;
  status: ProductStatus;
  createdAt: string;
}

// Re-export so existing imports of SellerAuctionStatus keep working
export type { AuctionStatus as SellerAuctionStatus };

export interface SellerAuctionProduct {
  id: number;
  name: string;
  artist: string;
  type: string;
  price: number;
  stock: number;
  primaryImageUrl: string;
  status: number;
  fandomId: string;
}

export interface SellerAuction {
  auctionId: number;
  productId: number;
  floorPrice: number;
  currentBid: number;
  status: AuctionStatus;
  endsAt: string;
  createdAt?: string;
  product?: SellerAuctionProduct;
}

export type { Order as SellerOrder } from './order';
