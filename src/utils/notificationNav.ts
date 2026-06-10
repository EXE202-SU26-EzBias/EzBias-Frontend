import type { NotificationItem, NotificationMeta } from '../types/notification';

export function getNotificationRoute(notification: NotificationItem): string | null {
  let meta: NotificationMeta = {};
  try { meta = JSON.parse(notification.meta); } catch { /* ignore */ }

  switch (notification.type) {
    case 'AuctionWon':
    case 'Outbid':
    case 'AuctionEndingSoon':
      return meta.auctionId ? `/auction/${meta.auctionId}` : '/auction';

    case 'AuctionExpired':
      return '/seller';

    case 'OrderPlaced':
    case 'OrderConfirmed':
      // Seller receives these — go to seller orders tab
      return '/seller';

    case 'OrderShipped':
    case 'OrderDelivered':
      // Buyer receives these — go to seller dashboard buying tab
      return '/seller';

    case 'PayoutPaid':
      return '/seller';

    case 'DisputeOpened':
    case 'DisputeResolved':
    case 'DisputeRefundCompleted':
      return '/seller';

    case 'UserVerified':
      return '/';

    default:
      return null;
  }
}
