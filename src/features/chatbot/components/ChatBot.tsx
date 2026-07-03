"use client";

import { Bot, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import ToolRenderer from "./ToolRenderer";

import {
    ChatMessage,
    ChatResponse
} from "../type";
import { sendChatMessage } from "../chatService";

type Role = "USER" | "AI";

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: crypto.randomUUID(),
            role: "AI",
            text: "Xin chào. Tôi có thể hỗ trợ bạn đặt lịch khám, tra cứu hồ sơ sức khỏe và tìm bác sĩ."
        }
    ]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const value = (text ?? input).trim();

        if (!value || loading) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "USER",
            text: value,
        };

        const loadingId = crypto.randomUUID();

        const loadingMessage: ChatMessage = {
            id: loadingId,
            role: "AI",
            text: "AI đang xử lý...",
        };

        setMessages(prev => [
            ...prev,
            userMessage,
            loadingMessage
        ]);

        setInput("");
        setLoading(true);

        const start = Date.now();

        try {

            const res = await sendChatMessage(value);

            const elapsed = Date.now() - start;

            const MIN_DELAY = 2000;

            if (elapsed < MIN_DELAY) {
                await new Promise(resolve =>
                    setTimeout(resolve, MIN_DELAY - elapsed)
                );
            }

            const ai: ChatResponse = res.data;

            const aiMessage: ChatMessage = {
                id: loadingId,
                role: "AI",
                text: ai.message,
                intent: ai.intent,
                payload: ai.payload,
            };

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === loadingId ? aiMessage : msg
                )
            );

        } catch (err) {

            console.error(err);

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === loadingId
                        ? {
                            id: loadingId,
                            role: "AI",
                            text: "Đã xảy ra lỗi khi xử lý yêu cầu.",
                        }
                        : msg
                )
            );

        } finally {
            setLoading(false);
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
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
                <div className="fixed bottom-6 right-6 z-50 flex h-160 w-105 flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-2xl">
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
                            <div key={message.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${message.role === "USER"
                                        ? "ml-auto bg-primary text-white text-right w-fit"
                                        : "bg-white text-foreground w-fit"
                                        }`}
                                >
                                    {message.text === "AI đang xử lý..." ? (
                                        <div className="flex gap-1">
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
                                            <span
                                                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                                style={{ animationDelay: "0.15s" }}
                                            ></span>
                                            <span
                                                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                                style={{ animationDelay: "0.3s" }}
                                            ></span>
                                        </div>
                                    ) : (
                                        message.text
                                    )}
                                </div>

                                <ToolRenderer
                                    message={message}
                                    onAction={sendMessage}
                                />
                            </div>
                        ))}
                        <div ref={bottomRef} />

                    </div>

                    {/* Input */}
                    <div className="border-t border-primary/10 bg-white p-3">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                ref={inputRef}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        void sendMessage();
                                    }
                                }}
                                placeholder="Nhập yêu cầu..."
                                disabled={loading}
                                className="flex-1 rounded-2xl border border-primary/10 px-4 py-3 outline-none transition focus:border-primary/30"
                            />

                            <button
                                disabled={loading}
                                onClick={() => void sendMessage()}
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white transition
                                            ${loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
                                        `}
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