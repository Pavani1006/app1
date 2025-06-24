import React from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        <ChatSidebar />
      </div>
      <div className="w-2/3">
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
