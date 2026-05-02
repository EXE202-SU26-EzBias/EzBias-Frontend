export interface Auction {
  id: string;
  artist: string;
  name: string;
  currentBid: number;
  timer: string;
  isUrgent: boolean;
  image?: string;
}

export interface BidEntry {
  id: string;
  username: string;
  avatar?: string;
  avatarBg?: string;
  amount: number;
  placedAt: string;
  isWinning: boolean;
}

export interface AuctionDetail {
  id: string;
  name: string;
  artist: string;
  image?: string;
  description?: string;
  isLive: boolean;
  currentBid: number;
  floorPrice: number;
  endsAt: string;
  bids: BidEntry[];
  sellerId: string;
}
