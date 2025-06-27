import React, {useState} from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatPage = () => {
   const [selectedUser, setSelectedUser] = useState(null); 
   return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        {/* ✅ Pass setSelectedUser to sidebar */}
        <ChatSidebar setSelectedUser={setSelectedUser} />
      </div>
      <div className="w-2/3">
        {/* ✅ Pass selectedUser to ChatWindow */}
        <ChatWindow selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default ChatPage;
