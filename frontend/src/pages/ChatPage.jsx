import React from 'react';
import { useAuthStore } from "../store/useAuthStore";

function ChatPage() {
  const { logout } = useAuthStore();
  return (
    <div className='z-10'>
      <button onClick={logout} className="btn btn-primary">LogOut</button>
    </div>
  )
}

export default ChatPage;