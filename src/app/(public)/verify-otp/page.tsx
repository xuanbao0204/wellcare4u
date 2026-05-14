"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp, resendOtp } from "@/features/auth/authService";
import { showError, showSuccess } from "@/lib/toast";
import { parseApiError } from "@/lib/parseError";
import { ShieldCheck, RefreshCw, ArrowLeft, Mail } from "lucide-react";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyOtpPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email") ?? "";

    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown cho nút gửi lại
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    // Redirect nếu không có email
    useEffect(() => {
        if (!email) router.replace("/register");
    }, [email, router]);

    // ─── Input handlers ───────────────────────────────────────────────────────

    const handleChange = (index: number, value: string) => {
        // Cho phép paste chuỗi 6 số
        if (value.length > 1) {
            const cleaned = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
            const next = [...digits];
            for (let i = 0; i < OTP_LENGTH; i++) {
                next[i] = cleaned[i] ?? "";
            }
            setDigits(next);
            const focusIdx = Math.min(cleaned.length, OTP_LENGTH - 1);
            inputRefs.current[focusIdx]?.focus();
            return;
        }

        if (!/^\d?$/.test(value)) return;

        const next = [...digits];
        next[index] = value;
        setDigits(next);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    };

    // ─── Actions ──────────────────────────────────────────────────────────────

    const handleVerify = async () => {
        const code = digits.join("");
        if (code.length < OTP_LENGTH) {
            showError("Vui lòng nhập đủ 6 chữ số OTP.");
            return;
        }

        setLoading(true);
        try {
            const res = await verifyOtp(email, code);
            showSuccess(res.message);
            router.replace("/login");
        } catch (err: any) {
            showError(parseApiError(err));
            // Xoá ô nhập nếu OTP sai
            setDigits(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setResending(true);
        try {
            const res = await resendOtp(email);
            showSuccess(res.message);
            setCooldown(RESEND_COOLDOWN);
            setDigits(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            showError(parseApiError(err));
        } finally {
            setResending(false);
        }
    };

    const allFilled = digits.every(d => d !== "");

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border-2 border-blue-800 bg-white p-8 shadow-lg">

                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border-2 border-blue-200">
                        <ShieldCheck size={32} className="text-blue-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
                    Xác thực tài khoản
                </h2>
                <p className="mb-1 text-center text-sm text-gray-500">
                    Mã OTP 6 chữ số đã được gửi đến
                </p>
                <div className="mb-8 flex items-center justify-center gap-2">
                    <Mail size={14} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">{email}</span>
                </div>

                {/* OTP Input boxes */}
                <div className="mb-6 flex justify-center gap-3">
                    {digits.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={el => { inputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={OTP_LENGTH}
                            value={digit}
                            onChange={e => handleChange(idx, e.target.value)}
                            onKeyDown={e => handleKeyDown(idx, e)}
                            onFocus={e => e.target.select()}
                            className={`h-14 w-12 rounded-xl border-2 text-center text-2xl font-bold transition-colors outline-none
                                ${digit
                                    ? "border-blue-600 bg-blue-50 text-blue-800"
                                    : "border-gray-200 bg-gray-50 text-gray-800"
                                }
                                focus:border-blue-500 focus:bg-white`}
                        />
                    ))}
                </div>

                {/* Verify button */}
                <button
                    onClick={handleVerify}
                    disabled={loading || !allFilled}
                    className="mb-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Đang xác thực..." : "Xác thực tài khoản"}
                </button>

                {/* Resend */}
                <div className="mb-6 text-center">
                    <span className="text-sm text-gray-500">Không nhận được mã? </span>
                    <button
                        onClick={handleResend}
                        disabled={resending || cooldown > 0}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
                        {cooldown > 0
                            ? `Gửi lại sau ${cooldown}s`
                            : resending ? "Đang gửi..." : "Gửi lại OTP"
                        }
                    </button>
                </div>

                {/* Back */}
                <div className="border-t border-gray-100 pt-4 text-center">
                    <a
                        href="/register"
                        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
                    >
                        <ArrowLeft size={13} />
                        Quay lại đăng ký
                    </a>
                </div>

                {/* Note */}
                <p className="mt-4 text-center text-xs text-gray-400">
                    ⏱ Mã OTP có hiệu lực trong <strong>10 phút</strong>.
                    Kiểm tra cả hộp thư Spam nếu không thấy email.
                </p>
            </div>
        </div>
    );
}