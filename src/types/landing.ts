export interface Auction {
  id: string;
  artist: string;
  name: string;
  currentBid: number;
  timer: string;
  isUrgent: boolean;
  image?: string;
}
export interface NavLink {
  label: string;
  href: string;
}
