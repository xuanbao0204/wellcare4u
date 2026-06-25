"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import FloatingInput from "@/shared/components/FloatingInput";
import ActionButton from "@/shared/components/ActionButton";

import { resetPassword } from "@/features/account/accountService";

import { showError, showSuccess } from "@/lib/toast";
import { parseApiError } from "@/lib/parseError";

export default function ResetPasswordPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const stored = sessionStorage.getItem("otp_flow");

        if (!stored) {
            router.replace("/forgot-password");
            return;
        }

        const flow = JSON.parse(stored);

        if (flow.purpose !== "FORGOT_PASSWORD") {
            router.replace("/");
            return;
        }

        setEmail(flow.email);

    }, [router]);

    const validatePassword = () => {

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!passwordRegex.test(password)) {
            showError(
                "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
            );
            return false;
        }

        if (password !== confirmPassword) {
            showError("Mật khẩu xác nhận không khớp");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!validatePassword()) {
            return;
        }

        try {

            setLoading(true);

            const res = await resetPassword(email, password);

            showSuccess(res.message);

            sessionStorage.removeItem("otp_flow");

            router.push("/login");

        } catch (error: any) {
            showError(parseApiError(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border-2 border-blue-800 bg-white p-8 shadow-lg">

                <h1 className="mb-2 text-center text-3xl font-bold">
                    Đặt lại mật khẩu
                </h1>

                <p className="mb-8 text-center text-gray-500">
                    Tạo mật khẩu mới cho tài khoản của bạn
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <FloatingInput
                        label="Mật khẩu mới"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={<Lock className="h-5 w-5 text-gray-500" />}
                        rightIcon={
                            showPassword ? (
                                <EyeOff
                                    className="h-5 w-5 cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(false)}
                                />
                            ) : (
                                <Eye
                                    className="h-5 w-5 cursor-pointer text-gray-500"
                                    onClick={() => setShowPassword(true)}
                                />
                            )
                        }
                    />

                    <FloatingInput
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        leftIcon={<Lock className="h-5 w-5 text-gray-500" />}
                        rightIcon={
                            showConfirmPassword ? (
                                <EyeOff
                                    className="h-5 w-5 cursor-pointer text-gray-500"
                                    onClick={() => setShowConfirmPassword(false)}
                                />
                            ) : (
                                <Eye
                                    className="h-5 w-5 cursor-pointer text-gray-500"
                                    onClick={() => setShowConfirmPassword(true)}
                                />
                            )
                        }
                    />

                    <ActionButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Đang cập nhật..."
                            : "Đặt lại mật khẩu"}
                    </ActionButton>
                </form>
            </div>
        </div>
    );
}