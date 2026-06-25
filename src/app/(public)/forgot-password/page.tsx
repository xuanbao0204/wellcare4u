"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

import FloatingInput from "@/shared/components/FloatingInput";
import ActionButton from "@/shared/components/ActionButton";

import { OtpType, sendOtp } from "@/features/otp/otpService";

import { showError, showSuccess } from "@/lib/toast";
import { parseApiError } from "@/lib/parseError";

export default function ForgotPasswordPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            showError("Vui lòng nhập email");
            return;
        }
        setLoading(true);

        sessionStorage.setItem(
            "otp_flow",
            JSON.stringify({
                purpose: OtpType.FORGOT_PASSWORD,
                email,
                redirectTo: "/reset-password",
                source: "/forgot-password"
            })
        );

        router.push("/verify-otp");
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border-2 border-blue-800 bg-white p-8 shadow-lg">

                <h1 className="mb-2 text-center text-3xl font-bold">
                    Quên mật khẩu
                </h1>

                <p className="mb-8 text-center text-gray-500">
                    Nhập email để nhận mã OTP đặt lại mật khẩu
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <FloatingInput
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={<Mail className="h-5 w-5 text-gray-500" />}
                    />

                    <ActionButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Đang gửi OTP..."
                            : "Gửi mã OTP"
                        }
                    </ActionButton>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Đã nhớ mật khẩu?{" "}
                    <a
                        href="/login"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
}