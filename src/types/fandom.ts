export interface Fandom {
  id: number;
  name: string;
  isActive: boolean;
}

export interface FandomProduct {
  id: number;
  sellerId: number;
  fandomId: number;
  artist: string;
  name: string;
  type: string;
  price: number;
  stock: number;
  primaryImageUrl?: string;
  isAuction: boolean;
  status: number;
}
