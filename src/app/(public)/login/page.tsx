"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, MailIcon } from "lucide-react";
import ActionButton from "@/shared/components/ActionButton";
import { showError, showSuccess } from "@/lib/toast";
import { LoginRequest } from "@/features/auth/type";
import { login } from "@/features/auth/authService";
import FloatingInput from "@/shared/components/FloatingInput";
import { useAuth } from "@/shared/AuthContext";
import { parseApiError } from "@/lib/parseError";
import { useRedirectByRole } from "@/features/auth/redirectByRole";

const Login = () => {
    const [form, setForm] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const { user, setUser } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const redirectByRole = useRedirectByRole();
    
    useEffect(() => {
        if (user) {
            redirectByRole(user.role);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            showError("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        setLoading(true);
        try {
            const response = await login(form);
            setUser(response.data);

            showSuccess(response.message);
        } catch (error: any) {
            console.log(error);
            showError(parseApiError(error));
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-auto md:w-2xl border-2 border-blue-800 rounded-lg shadow-lg p-4">
                <h2 className="text-center text-3xl font-bold mb-8 mt-6">Đăng nhập</h2>
                <p className="text-center text-gray-600 mb-6">Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục trải nghiệm dịch vụ.</p>
                <form className="flex flex-col gap-6 items-center w-full max-w-md mx-auto" onSubmit={handleSubmit}>

                    <FloatingInput
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        required={true}
                        onChange={handleChange}
                        leftIcon={<Mail className="h-5 w-5 text-gray-500" />} />

                    <FloatingInput
                        label="Mật khẩu"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        required={true}
                        onChange={handleChange}
                        leftIcon={<Lock className="h-5 w-5 text-gray-500" />}
                        rightIcon={showPassword ? <EyeOff className="h-5 w-5 text-gray-500 cursor-pointer"
                            onClick={() => setShowPassword(false)} /> : <Eye className="h-5 w-5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(true)} />} />

                    <ActionButton type="submit" disabled={loading}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</ActionButton>
                </form>
                <p className="text-center text-gray-500 text-sm mt-4">Bạn chưa có tài khoản? <a href="/register" className="text-blue-600 hover:underline">Đăng ký</a></p>
            </div>
        </div>
    );
}
export default Login;