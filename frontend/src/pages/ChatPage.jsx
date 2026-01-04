import { useChatStore } from "../store/useChatStore.js";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser } = useChatStore();

  return (
    <div className="w-full h-screen overflow-hidden">
      <BorderAnimatedContainer className="flex">

        {/* LEFT SIDEBAR */}
        <div
          className={`
            w-full sm:w-80 
            h-full
            bg-slate-800/50 backdrop-blur-sm 
            flex flex-col
            ${selectedUser ? "hidden sm:flex" : "flex"}
          `}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        <div
          className={`
            flex-1 h-full flex flex-col 
            bg-slate-900/50 backdrop-blur-sm
            ${selectedUser ? "flex" : "hidden sm:flex"}
          `}
        >
          {/* Mobile back button */}
          {selectedUser && (
            <div className="sm:hidden p-3 border-b border-slate-700">
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-300 text-sm"
              >
                ← Back
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </div>

      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;
