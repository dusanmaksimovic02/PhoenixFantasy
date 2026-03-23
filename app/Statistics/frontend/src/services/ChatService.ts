import apiClient from "./client";

export interface ChatMessage {
  Username: string;
  Message: string;
  Timestamp: string;
}

export interface ChatMessageDto {
  username: string;
  message: string;
}

export const sendChatMessage = async (message: ChatMessageDto) => {
  await apiClient.post("api/chat/send", message);
};

export const getChatHistory = async (): Promise<ChatMessage[]> => {
  const res = await apiClient.get("api/chat/history");
  return res.data.map((m: any) => ({
    Username: m.username,
    Message: m.message,
    Timestamp: m.timestamp,
  }));
};
