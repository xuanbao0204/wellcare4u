"use client";

import { Bot, Send, X } from "lucide-react";
import { useState } from "react";

import DoctorSuggestionCard from "./DoctorSuggestionCard";
import { DoctorSuggestionDTO } from "../type";
import { sendChatMessage } from "../chatService";

type Role = "USER" | "AI";

interface ChatMessage {
    id: string;
    role: Role;
    text: string;
    doctors?: DoctorSuggestionDTO[];
}

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: crypto.randomUUID(),
            role: "AI",
            text: "Xin chào. Tôi có thể hỗ trợ đặt lịch khám cho bạn.",
        },
    ]);

    const sendMessage = async (text?: string) => {
        const value = (text ?? input).trim();

        if (!value || loading) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "USER",
            text: value,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            setLoading(true);

            const res = await sendChatMessage(value);
            const ai = res.data;

            const aiMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "AI",
                text: ai.message,
                doctors: ai.doctors,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.error("[ChatBot]", err);

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "AI",
                    text: "Đã xảy ra lỗi khi xử lý yêu cầu.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105"
                >
                    <Bot size={24} />
                </button>
            )}

            {open && (
                <div className="fixed bottom-6 right-6 z-50 flex h-[640px] w-[420px] flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-primary/10 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Bot size={20} />
                            <h2 className="font-semibold text-foreground">
                                WellCare AI Assistant
                            </h2>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-full p-2 transition hover:bg-slate-100"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-4">
                        {messages.map((message) => (
                            <div key={message.id}>
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${message.role === "USER"
                                        ? "ml-auto bg-primary text-white"
                                        : "bg-white text-foreground"
                                        }`}
                                >
                                    {message.text}
                                </div>

                                {message.doctors?.length ? (
                                    <div className="mt-3 space-y-3">
                                        {message.doctors.map((doctor) => (
                                            <DoctorSuggestionCard
                                                key={doctor.doctorId}
                                                doctor={doctor}
                                                onSelectSlot={sendMessage}
                                            />
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}

                        {loading && (
                            <div className="text-sm text-foreground/50">
                                AI đang xử lý...
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t border-primary/10 bg-white p-3">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        void sendMessage();
                                    }
                                }}
                                placeholder="Nhập yêu cầu đặt lịch..."
                                className="flex-1 rounded-2xl border border-primary/10 px-4 py-3 outline-none transition focus:border-primary/30"
                            />

                            <button
                                onClick={() => void sendMessage()}
                                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white transition hover:opacity-90"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}