export interface Conversation {
  id: number;
  otherParticipantId: number;
  otherParticipantName: string;
  otherParticipantAvatarUrl: string;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  productId?: number | null;
  orderId?: number | null;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderAvatarUrl: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface MessagePage {
  messages: ChatMessage[];
  hasMore: boolean;
  nextCursor: number | null;
}
