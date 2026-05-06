export type PaymentMethod = 'cash_on_delivery' | 'bank_transfer' | 'credit_card';

export interface ShippingFormValues {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
}

export interface PlaceOrderPayload {
  shippingDetails: ShippingFormValues;
  paymentMethod: PaymentMethod;
  items: Array<{ productId: number; quantity: number; price: number }>;
}

export interface PlaceOrderResponse {
  orderId: string;
  status: 'pending' | 'confirmed';
  total: number;
  createdAt: string;
}

export interface OrderTotal {
  subtotal: number;
  shippingFee: number;
  total: number;
}

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  description: string;
}

export interface ArtistAccent {
  bg: string;
  text: string;
}

export type ArtistAccentMap = Record<string, ArtistAccent>;
