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
  }, []);

  // scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl border rounded shadow p-2 mx-auto">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-2 p-2 border-b">
        {messages.map((msg) => (
          <div key={msg._id} className="text-sm break-words">
            <span className="font-semibold">{msg.username}</span>: {msg.text}
            <span className="text-xs text-gray-500 ml-2">
              [
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              ]
            </span>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="flex items-center p-2 space-x-2">
        <input
          type="text"
          className="flex-1 border rounded p-2 text-sm sm:text-base"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="px-3 py-2 sm:px-4 sm:py-2 border rounded bg-blue-500 text-white text-sm sm:text-base"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
