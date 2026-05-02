export interface Fandom {
  id: string;
  name: string;
  items: number;
  accent: string;
  glyph: string;
}

export interface FandomProduct {
  id: string;
  artist: string;
  name: string;
  price: number;
  image?: string;
  isBoosted?: boolean;
  stock?: number;
  fandomId: string;
}
