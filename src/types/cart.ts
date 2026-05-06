export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  sellerId: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}
