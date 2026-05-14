"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";

import {
  ESpecialization,
  SPECIALIZATION_LABELS,
} from "@/shared/type";

interface AIRobotMascotProps {
  message?: string;
  onClick?: () => void;
}

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  options?: string[];
  isAnalysis?: boolean;
}

export default function AIRobotMascot({
  message,
  onClick,
}: AIRobotMascotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [shouldRender, setShouldRender] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuideMode = searchParams.get("mode") === "guide";

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      const currentPath = window.location.pathname;
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user && user.role === "PATIENT") {
            setShouldRender(true);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      if (currentPath.startsWith("/patient")) {
        setShouldRender(true);
      } else {
        setShouldRender(false);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: "Xin chào! Mình là Trợ lý Y tế Care4U. Bạn cần mình hỗ trợ gì hôm nay?",
          options: [
            "1️⃣ Hướng dẫn đặt lịch khám",
            "2️⃣ Tìm chuyên khoa khám bệnh phù hợp",
          ],
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "user", text: inputText },
    ]);
    setInputText("");
    const loadingId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: loadingId, sender: "ai", text: "Đang phân tích..." },
    ]);

    try {
      const response = await api.post("/common/ai/consult", {
        symptoms: inputText,
      });
      const aiData =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;
      const { specialty, reason, firstAid, needMoreInfo } = aiData;
      const vnName = SPECIALIZATION_LABELS[
        specialty as ESpecialization
      ] || "Đa khoa";
      const botText = needMoreInfo
        ? "Bạn mô tả kỹ hơn được không?"
        : `Bạn nên khám khoa: **${vnName}**.\n\n🔍 **Lý do:** ${reason}\n\n💡 **Sơ cứu:** ${firstAid}`;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
              ...m,
              text: botText,
              isAnalysis: !needMoreInfo,
              options: needMoreInfo
                ? ["🔙 Quay lại"]
                : [`🚀 Đặt lịch khoa ${vnName}`, "🔙 Quay lại"],
            }
            : m,
        ),
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId ? { ...m, text: "Lỗi kết nối!" } : m,
        ),
      );
    }
  };

  const handleOptionClick = (option: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "user", text: option },
    ]);
    if (option.includes("Đặt lịch") || option.includes("Bắt đầu ngay")) {
      const specialtyName = option
        .replace("🚀 Đặt lịch khoa ", "")
        .replace("🚀 Bắt đầu ngay", "")
        .trim();
      setIsOpen(false);
      const url = specialtyName
        ? `/patient/appointments/create?specialty=${encodeURIComponent(specialtyName)}&mode=guide`
        : `/patient/appointments/create?mode=guide`;
      setTimeout(() => router.push(url), 600);
      return;
    }
    setTimeout(() => {
      let aiText = "Mình có thể hỗ trợ gì thêm không?";
      if (option.includes("Tìm chuyên khoa") || option.includes("Quay lại"))
        aiText = "Bạn hãy mô tả triệu chứng nhé!";
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "ai", text: aiText },
      ]);
    }, 500);
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end pointer-events-none">
      {/* 1. Khung Chatbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 mb-6 overflow-hidden flex flex-col h-[550px] pointer-events-auto"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>🤖</span>
                <h3 className="font-bold">Trợ lý Care4U</h3>
              </div>
              <button onClick={handleToggleChat} className="text-2xl">
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-sm whitespace-pre-line ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white border text-slate-700"}`}
                  >
                    {msg.text
                      .split("**")
                      .map((p, i) => (i % 2 === 1 ? <b key={i}>{p}</b> : p))}
                  </div>
                  {msg.options && msg.sender === "ai" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(opt)}
                          className="bg-white text-blue-700 text-xs py-2 px-3 rounded-xl border border-blue-100 transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border rounded-full px-4 py-2 text-sm outline-none bg-slate-50"
                placeholder="Mô tả triệu chứng..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white rounded-full w-10 h-10"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Bong bóng thoại Hướng dẫn (NẰM NGOÀI MASCOT ĐỂ KHÔNG BỊ CLONE) */}
      <AnimatePresence>
        {isGuideMode && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-28 right-0 bg-white border-2 border-blue-500 p-3 rounded-2xl shadow-xl w-48 z-[1010] pointer-events-auto"
          >
            <p className="text-xs font-bold text-blue-600">
              {message || "Chào bạn! Mình sẽ hướng dẫn bạn đặt lịch nhé!"}
            </p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-blue-500 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Nút Mascot (CHỈ CHỨA ICON ROBOT ĐỂ HIGHLIGHT CHUẨN) */}
      <motion.div
        onClick={() => {
          handleToggleChat();
          onClick?.();
        }}
        className={`cursor-pointer pointer-events-auto relative z-[1005] ${isGuideMode ? "highlight-mascot" : ""}`}
        whileHover={{ scale: 1.05 }}
      >
        <div id="mascot-guide" className="relative">
          {" "}
          {/* ID tour guide trỏ vào đây */}
          {!isOpen ? (
            <motion.div
              key="robot-icon"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -12, 0] }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                default: { duration: 0.3 },
              }}
            >
              <img
                src="/robot-health.png"
                alt="AI Assistant"
                className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-900/10 blur-md rounded-full" />
            </motion.div>
          ) : (
            <div className="w-14 h-14 bg-white border text-slate-500 rounded-full shadow-lg flex items-center justify-center text-3xl">
              ×
            </div>
          )}
        </div>
      </motion.div>

      <style jsx global>{`
        .highlight-mascot {
          z-index: 1020 !important;
          position: relative;
        }
        .highlight-mascot img {
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
        }
      `}</style>
    </div>
  );
}
