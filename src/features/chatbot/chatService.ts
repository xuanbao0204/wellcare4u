import api from "@/lib/axios";
import { ChatResponseDTO } from "./type";

export const sendChatMessage = (message: string) => {
    return api.post<ChatResponseDTO>("/chat", { message });
};