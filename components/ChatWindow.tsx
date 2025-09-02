"use client";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  _id: string;
  username: string;
  text: string;
  timestamp: string;
};

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // fetch messages
  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch("/api/chats");
      const data = await res.json();
      setMessages(data);
    };
    fetchChats();
    const interval = setInterval(fetchChats, 3000); // every 3s
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const res = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });

    if (res.ok) {
      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    }
  };

  const handleSignOut = async () => {
    // 👉 depends on your auth, just a placeholder
    await fetch("/api/signout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto bg-white border rounded shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-100 sticky top-0">
        <h1 className="text-lg font-semibold">Chat</h1>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
        >
          Sign out
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg._id} className="text-sm break-words">
            <span className="font-semibold">{msg.username}</span>: {msg.text}
            <span className="text-xs text-gray-500 ml-2">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="sticky bottom-0 bg-white px-2 py-2 border-t">
        <div className="flex items-center p-3 space-x-2 border-t bg-white">
          <input
            type="text"
            className="flex-1 border rounded-xl px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="px-5 py-3 rounded-xl bg-blue-500 text-white font-medium text-base sm:text-lg shadow hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
