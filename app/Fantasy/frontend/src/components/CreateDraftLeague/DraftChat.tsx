import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/auth/useAuth";
import { useMutation } from "@tanstack/react-query";
import { sendDraftChatMessage, getDraftChatStreamUrl, type DraftChatMessage } from "../../services/DraftChatService";

interface DraftChatProps {
  leagueId: string;
}

export default function DraftChat({ leagueId }: DraftChatProps) {
  const { user, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<DraftChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
 const messagesContainerRef = useRef<HTMLDivElement>(null);

  const username = user?.userName ?? "";

  
  useEffect(() => {
    if (!isLoggedIn() || !leagueId) return;

    const eventSource = new EventSource(getDraftChatStreamUrl(leagueId));

    eventSource.onmessage = (event) => {
      try {
        const msg: DraftChatMessage = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch {
        console.log("Failed to parse draft chat message:", event.data);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [leagueId, isLoggedIn]);

 
  useEffect(() => {
  const container = messagesContainerRef.current;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}, [messages]);

  const sendMutation = useMutation({
    mutationFn: () => sendDraftChatMessage(leagueId, username, messageText),
    onSuccess: () => setMessageText(""),
    onError: () => console.error("Failed to send message"),
  });

  const handleSend = () => {
    if (!messageText.trim() || !isLoggedIn()) return;
    sendMutation.mutate();
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
     
      <div className="bg-phoenix px-4 py-3 rounded-t-xl">
        <h1 className="text-white text-lg font-extrabold">Draft Chat</h1>
        <p className="text-white/70 text-xs">
          Logged in as <span className="text-white font-bold">{username}</span>
        </p>
      </div>

    
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 dark:bg-custom-gray bg-white">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10 text-sm">
            No messages yet. Say something!
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col max-w-xs ${
              msg.Username === username
                ? "self-end items-end"
                : "self-start items-start"
            }`}
          >
            <span className="text-phoenix text-xs mb-1 font-semibold">
              {msg.Username}
            </span>
            <div
              className={`px-3 py-2 rounded-xl text-sm ${
                msg.Username === username
                  ? "bg-phoenix text-white"
                  : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-800 shadow"
              }`}
            >
              {msg.Message}
            </div>
            <span className="text-gray-400 text-xs mt-1">
              {msg.Timestamp
                ? new Date(msg.Timestamp).toLocaleTimeString()
                : ""}
            </span>
          </div>
        ))}
       
      </div>

    
      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex gap-2 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
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
          disabled={sendMutation.isPending}
          className="bg-phoenix hover:bg-phoenix/80 cursor-pointer text-white font-bold px-4 rounded-lg transition text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}