import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatWindow = ({ selectedUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/messages/${selectedUser._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error loading messages", err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/user/message", {
        to: selectedUser._id,
        content: message,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Push new message to local state
      setMessages((prev) => [...prev, res.data]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full">
      {selectedUser ? (
        <>
          <h2 className="text-xl font-bold mb-4">Chat with {selectedUser.name}</h2>
          <div className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-semibold">{msg.from === selectedUser._id ? selectedUser.name : "You"}:</span>{" "}
                {msg.content}
              </div>
            ))}
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <h2 className="text-xl font-bold text-gray-500">
          Select a user to chat
        </h2>
      )}
    </div>
  );
};

export default ChatWindow;
