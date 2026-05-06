export interface Product {
  id: number;
  artist: string;
  name: string;
  price: number;
  image?: string;
  isBoosted?: boolean;
  stock?: number;
}

export interface Auction {
  id: string;
  artist: string;
  name: string;
  currentBid: number;
  timer: string;
  isUrgent: boolean;
  image?: string;
}

export interface Fandom {
  name: string;
  items: number;
  accent: string;
  glyph: string;
}

export interface NavLink {
  label: string;
  href: string;
}
