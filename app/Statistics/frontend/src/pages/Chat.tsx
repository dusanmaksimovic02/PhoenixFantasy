import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/auth/useAuth";
import { sendChatMessage, getChatHistory, type ChatMessage } from "../services/ChatService";

const SSE_URL = "http://localhost:5086/api/chat/stream";

export default function Chat() {
  const { user, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const username = user?.userName ?? "";

  useEffect(() => {
    if (!isLoggedIn()) return;

    getChatHistory().then((data) => setMessages(data));

    const eventSource = new EventSource(SSE_URL);

    eventSource.onmessage = (event) => {
      try {
        const msg: ChatMessage = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch {
        console.log("Failed to parse message:", event.data);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [isLoggedIn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || !isLoggedIn()) return;
    await sendChatMessage({ username, message: messageText });
    setMessageText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  if (!isLoggedIn()) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Please log in to use the chat.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-phoenix px-4 py-3">
        <h1 className="text-white text-lg font-extrabold">Game Chat</h1>
        <p className="text-white/70 text-xs">
          Logged in as <span className="text-white font-bold">{username}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 dark:bg-custom-gray">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10 text-sm">No messages yet. Say something!</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col max-w-xs ${msg.Username === username ? "self-end items-end" : "self-start items-start"}`}
          >
            <span className="text-phoenix text-xs mb-1 font-semibold">{msg.Username}</span>
            <div className={`px-3 py-2 rounded-xl text-sm ${msg.Username === username ? "bg-phoenix text-white" : "bg-white dark:bg-gray-700 dark:text-white text-gray-800 shadow"}`}>
              {msg.Message}
            </div>
            <span className="text-gray-400 text-xs mt-1">
              {msg.Timestamp ? new Date(msg.Timestamp).toLocaleTimeString() : ""}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:border-phoenix text-sm"
        />
        <button
          onClick={handleSend}
          className="bg-phoenix hover:bg-phoenix/80 text-white font-bold px-4 rounded-lg transition text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}