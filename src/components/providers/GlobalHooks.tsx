import { useNotificationHub } from '../../services/notification.service';
import { useChatHub } from '../../features/chat/useChatHub';

/**
 * GlobalHooks component that initializes SignalR connections when user is authenticated.
 * This ensures realtime features work across all pages, including SellerDashboard and ChatPanel.
 */
const GlobalHooks = () => {
  useNotificationHub();
  useChatHub();
  return null;
};

export default GlobalHooks;
