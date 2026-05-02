import type { ArtistAccentMap, PaymentMethodOption } from '../types/checkout';

export const SHIPPING_FEE = 30_000;
export const FREE_SHIPPING_THRESHOLD = 500_000;

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  { value: 'bank_transfer', label: 'Bank Transfer', description: 'Transfer to our account' },
];

export const ARTIST_ACCENT_MAP: ArtistAccentMap = {
  BTS: { bg: 'rgba(80, 120, 220, 0.12)', text: '#5078DC' },
  BLACKPINK: { bg: 'rgba(232, 62, 140, 0.12)', text: '#E83E8C' },
  NEWJEANS: { bg: 'rgba(0, 188, 212, 0.12)', text: '#00BCD4' },
  DEFAULT: { bg: 'rgba(173, 147, 230, 0.12)', text: '#9B84EC' },
};
