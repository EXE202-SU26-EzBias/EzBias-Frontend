import { useState } from 'react';
import ConversationList from '../../../components/chat/ConversationList';
import MessageThread from '../../../components/chat/MessageThread';
import SellerTopbar from '../SellerTopbar';
import type { Conversation } from '../../../types/chat';

const ChatSection = () => {
  const [active, setActive] = useState<Conversation | null>(null);

  return (
    <div>
      <SellerTopbar title="Messages" sub="Chat with your buyers" />
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="grid grid-cols-[280px_1fr] min-h-[520px]">
          {/* Left: conversation list */}
          <div className="border-r border-[rgba(230,230,230,0.5)] overflow-y-auto">
            <div className="px-4 py-3 border-b border-[rgba(230,230,230,0.5)]">
              <h3 className="text-[13px] font-bold text-[#737373] uppercase tracking-[0.5px]">Conversations</h3>
            </div>
            <ConversationList
              activeId={active?.id ?? null}
              onSelect={setActive}
            />
          </div>

          {/* Right: message thread */}
          <div className="flex flex-col">
            {active ? (
              <MessageThread
                conversationId={active.id}
                otherParticipantName={active.otherParticipantName}
                otherParticipantId={active.otherParticipantId}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center text-[13px] text-[#b3b3b3]">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
