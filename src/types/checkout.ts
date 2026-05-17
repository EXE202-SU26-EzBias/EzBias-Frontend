export interface ShippingFormValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
}

export type OrderSource = 'cart' | 'auction';

export interface AddressSnap {
  fullname: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
}

export interface CreateOrderItem {
  cartItemId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  addressSnap: AddressSnap;
  items: CreateOrderItem[];
}

export interface CreateOrderResponse {
  orderIds: number[];
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

export type { Order as BuyerOrder } from './order';
