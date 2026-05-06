import { ARTIST_ACCENT_MAP } from '../../constants/checkout';
import type { CartItem } from '../../types/cart';
import OrderItem from './OrderItem';

interface OrderItemListProps {
  items: CartItem[];
  onRemove: (cartItemId: number) => void;
}

const OrderItemList = ({ items, onRemove }: OrderItemListProps) => (
  <div className="divide-y divide-[#f0f0f0]">
    {items.map((item) => (
      <OrderItem key={item.cartItemId} item={item} accentMap={ARTIST_ACCENT_MAP} onRemove={onRemove} />
    ))}
  </div>
);

export default OrderItemList;
