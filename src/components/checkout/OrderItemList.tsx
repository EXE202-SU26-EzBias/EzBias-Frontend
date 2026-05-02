import { ARTIST_ACCENT_MAP } from '../../constants/checkout';
import type { CartItem } from '../../stores/cart.store';
import OrderItem from './OrderItem';

interface OrderItemListProps {
  items: CartItem[];
  onRemove: (id: string) => void;
}

const OrderItemList = ({ items, onRemove }: OrderItemListProps) => (
  <div className="divide-y divide-[#f0f0f0]">
    {items.map((item) => (
      <OrderItem key={item.id} item={item} accentMap={ARTIST_ACCENT_MAP} onRemove={onRemove} />
    ))}
  </div>
);

export default OrderItemList;
