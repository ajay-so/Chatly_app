import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Uncommented and cleaned up the fetching logic
  useEffect(() => {
    if (selectedUser?._id) {
      getMessagesByUserId(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  // Auto-scroll logic
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    /* Main Wrapper: flex-col with h-full ensures the container fills the parent */
    <div className="flex flex-col h-full bg-slate-950">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-6 p-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative shadow-md ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg max-h-60 object-contain mb-2" />
                  )}
                  {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                  <p className="text-[10px] mt-1 opacity-60 flex justify-end uppercase font-bold tracking-tighter">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : (
          /* This will now be perfectly centered vertically and horizontally */
          <div className="h-full flex items-center justify-center">
            <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-slate-950/50 backdrop-blur-sm border-slate-800/50">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatContainer;