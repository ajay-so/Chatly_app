import { useChatStore } from "../store/useChatStore.js";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="w-full h-[95vh] overflow-hidden p-2 bg-slate-950">
      <BorderAnimatedContainer className="flex h-full w-full">

        {/* --- LEFT SIDEBAR --- */}
        <div
          className={`
            h-full flex flex-col transition-all duration-300
            bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50
            ${selectedUser ? "hidden sm:flex sm:w-80" : "w-full sm:w-80 flex"}
          `}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* --- RIGHT SIDE (CHAT AREA) --- */}
        <div
          className={`
            flex-1 h-full flex flex-col transition-all duration-300
            bg-slate-900/50 backdrop-blur-sm
            ${selectedUser ? "flex w-full" : "hidden sm:flex"}
          `}
        >
          {selectedUser ? (
            <ChatContainer />
          ) : (
            <div className="flex-1 flex items-center justify-center">
               <NoConversationPlaceholder />
            </div>
          )}
        </div>

      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;