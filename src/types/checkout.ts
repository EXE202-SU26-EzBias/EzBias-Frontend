export interface ShippingFormValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
}

export type OrderSource = 'cart' | 'auction';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface AddressSnap {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
}

export interface CreateOrderPayload {
  source: OrderSource;
  addressSnap: AddressSnap;
  cartItemIds?: number[];
  auctionId?: number;
}

export interface CreateOrderResponse {
  id: number;
  userId: number;
  sellerId: number;
  source: OrderSource;
  auctionId?: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  addressSnap: AddressSnap;
  createdAt: string;
}

export interface OrderTotal {
  subtotal: number;
  shippingFee: number;
  total: number;
}

export interface ArtistAccent {
  bg: string;
  text: string;
}

export type ArtistAccentMap = Record<string, ArtistAccent>;
