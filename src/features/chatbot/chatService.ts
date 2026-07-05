import api from "@/lib/axios";
import { ChatMessage, ChatResponse } from "./type";

export const sendChatMessage = (message: string) => {
    return api.post<ChatResponse>("/chat", { message });
};