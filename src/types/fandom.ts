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

export interface FandomProductDetail {
  id: number;
  sellerId: number;
  fandomId: string;
  artist: string;
  name: string;
  type: string;
  condition: number;
  price: number;
  stock: number;
  description: string;
  primaryImageUrl: string;
  imageUrls: string[];
  isAuction: boolean;
  status: number;
  createdAt: string;
}
