"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  options?: string[];
  isAnalysis?: boolean;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [shouldRender, setShouldRender] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGuideMode, setIsGuideMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Detect guide mode
  useEffect(() => {
    setIsGuideMode(searchParams.get("mode") === "guide");
  }, [searchParams]);

  // Auth check
  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      const currentPath = window.location.pathname;
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setShouldRender(user?.role === "PATIENT");
        } catch {
          setShouldRender(false);
        }
      } else {
        setShouldRender(currentPath.startsWith("/patient"));
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, isOpen]);

  const getSpecialtyName = (code: string) => {
    const map: Record<string, string> = {
      TIM_MACH: "Tim mạch",
      DA_LIEU: "Da liễu",
      TIEU_HOA_GAN_MAT: "Tiêu hóa - Gan mật",
      THAN_KINH: "Thần kinh",
      NOI_TIET: "Nội tiết",
      HO_HAP: "Hô hấp",
      THAN_TIET_NIEU: "Thận - Tiết niệu",
      CO_XUONG_KHOP: "Cơ xương khớp",
      HUYET_HOC: "Huyết học",
      TRUYEN_NHIEM: "Truyền nhiễm",
      NOI_TONG_QUAT: "Nội tổng quát",
      NGOAI_TONG_QUAT: "Ngoại tổng quát",
      NGOAI_THAN_KINH: "Ngoại thần kinh",
      CHAN_THUONG_CHINH_HINH: "Chấn thương chỉnh hình",
      NGOAI_LONG_NGUC_TIM_MACH: "Ngoại lồng ngực - Tim mạch",
      NAM_KHOA: "Nam khoa",
      PHAU_THUAT_THAM_MY: "Phẫu thuật thẩm mỹ",
      SAN_PHU_KHOA: "Sản phụ khoa",
      NHI_KHOA: "Nhi khoa",
      TAI_MUI_HONG: "Tai Mũi Họng",
      RANG_HAM_MAT: "Răng Hàm Mặt",
      NHAN_KHOA: "Nhãn khoa",
      SUC_KHOE_TAM_THAN: "Sức khỏe tâm thần",
      UNG_BUOU: "Ung bướu",
      CHAN_DOAN_HINH_ANH: "Chẩn đoán hình ảnh",
      XET_NGHIEM: "Xét nghiệm",
      GAY_ME_HOI_SUC: "Gây mê hồi sức",
      PHUC_HOI_CHUC_NANG: "Phục hồi chức năng",
      DINH_DUONG: "Dinh dưỡng",
      Y_HOC_CO_TRUYEN: "Y học cổ truyền",
      Y_HOC_GIA_DINH: "Y học gia đình",
      CAP_CUU: "Cấp cứu",
      LAO_KHOA: "Lão khoa",
    };

    return map[code] || "Đa khoa";
  };

  const handleToggleChat = () => {
    const willOpen = !isOpen;

    setIsOpen(willOpen);

    if (willOpen && messages.length === 0) {
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
    if (!inputText.trim() || loading) return;

    const userText = inputText.trim();
    const loadingId = crypto.randomUUID();

    setLoading(true);

    // Add user + loading message together
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "user",
        text: userText,
      },
      {
        id: loadingId,
        sender: "ai",
        text: "Đang phân tích...",
      },
    ]);

    setInputText("");

    try {
      const response = await api.post("/common/ai/consult", {
        symptoms: userText,
      });

      let aiData;

      try {
        aiData =
          typeof response.data === "string"
            ? JSON.parse(response.data)
            : response.data;
      } catch {
        throw new Error("Invalid AI response");
      }

      const { specialty, reason, firstAid, needMoreInfo } = aiData;

      const vnName = getSpecialtyName(specialty);

      const finalText = needMoreInfo
        ? "Thông tin bạn cung cấp hơi ít. Bạn có thể mô tả rõ hơn không? (Ví dụ: Đã bị bao lâu, có sốt, đau ở đâu, khó thở hay triệu chứng gì khác không?)"
        : `Dựa trên triệu chứng, bạn nên khám chuyên khoa: **${vnName}**.\n\n🔍 **Giải thích:** ${reason}\n\n💡 **Lưu ý/Sơ cứu:** ${firstAid}`;

      const finalOptions = needMoreInfo
        ? ["🔙 Quay lại"]
        : [`🚀 Đặt lịch khoa ${vnName}`, "🔙 Quay lại"];

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                text: finalText,
                options: finalOptions,
                isAnalysis: !needMoreInfo,
              }
            : msg,
        ),
      );
    } catch (error) {
      console.error(error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                text: "Lỗi kết nối hoặc AI không thể phản hồi lúc này!",
              }
            : msg,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "user",
        text: option,
      },
    ]);

    // Redirect booking
    if (option.includes("Đặt lịch") || option.includes("Bắt đầu ngay")) {
      const specialtyName = option
        .replace("🚀 Đặt lịch khoa ", "")
        .replace("🚀 Bắt đầu ngay", "")
        .trim();

      setIsOpen(false);

      const url = specialtyName
        ? `/patient/appointments/create?specialty=${encodeURIComponent(
            specialtyName,
          )}&mode=guide`
        : `/patient/appointments/create?mode=guide`;

      setTimeout(() => {
        router.push(url);
      }, 600);

      return;
    }

    // AI auto response
    setTimeout(() => {
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "",
      };

      if (option.includes("Tìm chuyên khoa") || option.includes("Quay lại")) {
        aiResponse.text =
          "Bạn hãy mô tả triệu chứng hoặc cảm giác khó chịu hiện tại để mình hỗ trợ nhé!";
      } else if (option.includes("Hướng dẫn đặt lịch")) {
        aiResponse.text =
          "Để đặt lịch, bạn chỉ cần 3 bước: Chọn bác sĩ → Chọn giờ → Xác nhận. Bạn muốn mình dẫn đi không?";

        aiResponse.options = ["🚀 Bắt đầu ngay", "🔙 Quay lại"];
      } else {
        aiResponse.text = "Mình có thể hỗ trợ gì thêm cho bạn không?";

        aiResponse.options = [
          "1️⃣ Hướng dẫn đặt lịch khám",
          "2️⃣ Tìm chuyên khoa khám bệnh phù hợp",
        ];
      }

      setMessages((prev) => [...prev, aiResponse]);
    }, 500);
  };

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      {/* Guide bubble */}
      <AnimatePresence>
        {isGuideMode && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white border-2 border-blue-500 p-3 rounded-2xl shadow-xl w-48 mb-4 pointer-events-auto relative z-[10001]"
          >
            <p className="text-xs font-bold text-blue-600">
              Chào bạn! Mình sẽ hướng dẫn bạn đặt lịch nhé!
            </p>

            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-blue-500 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            className="w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 mb-6 overflow-hidden flex flex-col h-[550px] pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h3 className="font-bold">Trợ lý Care4U</h3>
              </div>

              <button
                onClick={handleToggleChat}
                className="text-2xl hover:rotate-90 transition-transform"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-sm shadow-sm whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : msg.isAnalysis
                          ? "bg-white border-l-4 border-blue-500 text-slate-700 rounded-bl-none"
                          : "bg-white border text-slate-700 rounded-bl-none"
                    }`}
                  >
                    {msg.text
                      .split("**")
                      .map((part, i) =>
                        i % 2 === 1 ? <b key={i}>{part}</b> : part,
                      )}
                  </div>

                  {msg.options && msg.sender === "ai" && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(opt)}
                          className="bg-white hover:bg-blue-50 text-blue-700 text-xs py-2 px-3 rounded-xl border border-blue-100 transition-all hover:shadow-md active:scale-95"
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

            {/* Footer */}
            <div className="p-4 border-t bg-white flex gap-2">
              <input
                type="text"
                value={inputText}
                disabled={loading}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Mô tả triệu chứng..."
                className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400 transition-colors bg-slate-50 disabled:opacity-50"
              />

              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot */}
      <motion.div
        id="mascot-guide"
        onClick={handleToggleChat}
        className={`cursor-pointer pointer-events-auto relative group z-[10000] ${
          isGuideMode ? "highlight-mascot" : ""
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="robot-icon"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: [0, -12, 0],
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                default: {
                  duration: 0.3,
                },
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
            <motion.div
              key="close-icon"
              initial={{
                rotate: -90,
                opacity: 0,
              }}
              animate={{
                rotate: 0,
                opacity: 1,
              }}
              className="w-14 h-14 bg-white border border-slate-200 text-slate-500 rounded-full shadow-lg flex items-center justify-center text-3xl"
            >
              ×
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx global>{`
        .highlight-mascot {
          z-index: 99999 !important;
          filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.9)) !important;
        }
      `}</style>
    </div>,
    document.body,
  );
}
