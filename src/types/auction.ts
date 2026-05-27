export type AuctionStatus = number;

export interface AuctionSeller {
  id: number;
  username: string;
  fullName: string;
  avatarUrl: string;
  avgSellerRating: number;
  totalRatings: number;
}

export interface AuctionProduct {
  id: number;
  name: string;
  artist: string;
  type: string;
  price: number;
  stock: number;
  primaryImageUrl: string;
  status: number;
  fandomId: number;
}

export interface Auction {
  auctionId: number;
  productId: number;
  sellerId: number;
  floorPrice: number;
  currentBid: number;
  status: AuctionStatus;
  endsAt: string;
  seller: AuctionSeller;
  product: AuctionProduct;
}

export interface BidEntry {
  id: number;
  userId: number;
  amount: number;
  createdAt: string;
}

export interface AuctionDetail extends Auction {
  reservePrice?: number | null;
  extensionSeconds: number;
  triggerBeforeEnd: number;
  bids?: BidEntry[];
  winnerId?: number | null;
}

export interface BidderProfile {
  id: number;
  username: string;
  avatarUrl: string | null;
  avatarBg: string | null;
}

export interface BidHistoryEntry {
  bidId: number;
  auctionId: number;
  amount: number;
  isWinning: boolean;
  placedAt: string;
  bidder: BidderProfile;
}
