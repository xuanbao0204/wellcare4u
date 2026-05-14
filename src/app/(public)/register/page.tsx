"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import ActionButton from "@/shared/components/ActionButton";
import { showError, showSuccess } from "@/lib/toast";
import FloatingInput from "@/shared/components/FloatingInput";
import { parseApiError } from "@/lib/parseError";
import { register } from "@/features/auth/authService";
import { RegisterRequest } from "@/features/auth/type";

const Register = () => {
    const [form, setForm] = useState<RegisterRequest>({
        email: "",
        password: "",
        role: "PATIENT",
        firstName: "",
        lastName: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {

        const newErrors: Record<string, string> = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;

        if (!emailRegex.test(form.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (!passwordRegex.test(form.password)) {
            newErrors.password =
                "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
        }

        if (!nameRegex.test(form.firstName)) {
            newErrors.firstName =
                "Tên không được chứa ký tự đặc biệt";
        }

        if (!nameRegex.test(form.lastName)) {
            newErrors.lastName =
                "Họ không được chứa ký tự đặc biệt";
        }

        if (form.password !== confirmPassword) {
            newErrors.confirmPassword =
                "Mật khẩu xác nhận không khớp";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.email || !form.password || !form.firstName || !form.lastName) {
            showError("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (form.password !== confirmPassword) {
            showError("Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);
        try {
            const response = await register(form);
            if (response.status !== 200) {
                showError(response.message || "Đăng ký thất bại!");
                return;
            }
            showSuccess(response.message);

            window.location.href = `/verify-otp?email=${encodeURIComponent(form.email)}`;
        } catch (error: any) {
            console.log(error);
            showError(parseApiError(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-auto md:w-2xl border-2 border-blue-800 rounded-lg shadow-lg p-4">
                <h2 className="text-center text-3xl font-bold mb-8 mt-6">Đăng ký</h2>
                <p className="text-center text-gray-600 mb-6">
                    Tạo tài khoản để bắt đầu sử dụng dịch vụ chăm sóc sức khỏe.
                </p>

                <form
                    className="flex flex-col gap-6 items-center w-full max-w-md mx-auto"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full flex gap-4">
                        <FloatingInput
                            label="Họ"
                            name="lastName"
                            type="text"
                            value={form.lastName}
                            required
                            onChange={handleChange}
                            leftIcon={<User className="h-5 w-5 text-gray-500" />}
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.lastName}
                            </p>
                        )}
                    </div>
                    <div className="w-full flex gap-4">
                        <FloatingInput
                            label="Tên"
                            name="firstName"
                            type="text"
                            value={form.firstName}
                            required
                            onChange={handleChange}
                            leftIcon={<User className="h-5 w-5 text-gray-500" />}
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.firstName}
                            </p>
                        )}
                    </div>

                    <div className="w-full flex gap-4">
                        <FloatingInput
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            required
                            onChange={handleChange}
                            leftIcon={<Mail className="h-5 w-5 text-gray-500" />}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="w-full flex gap-4">
                        <FloatingInput
                            label="Mật khẩu"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            required
                            onChange={handleChange}
                            leftIcon={<Lock className="h-5 w-5 text-gray-500" />}
                            rightIcon={
                                showPassword ? (
                                    <EyeOff
                                        className="h-5 w-5 text-gray-500 cursor-pointer"
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="h-5 w-5 text-gray-500 cursor-pointer"
                                        onClick={() => setShowPassword(true)}
                                    />
                                )
                            }
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <div className="w-full flex gap-4">
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
                                        className="h-5 w-5 text-gray-500 cursor-pointer"
                                        onClick={() => setShowConfirmPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        className="h-5 w-5 text-gray-500 cursor-pointer"
                                        onClick={() => setShowConfirmPassword(true)}
                                    />
                                )
                            }
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Vai trò
                        </label>

                        <div className="w-full flex gap-8 justify-around">
                            {["ADMIN", "DOCTOR", "PATIENT"].map((role) => (
                                <label
                                    key={role}
                                    className={`flex items-center gap-2 cursor-pointer px-3 py-2 border rounded-md transition ${form.role === role
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role}
                                        checked={form.role === role}
                                        onChange={handleChange}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-sm font-medium">
                                        {role === "ADMIN"
                                            ? "Quản trị viên"
                                            : role === "DOCTOR"
                                                ? "Bác sĩ"
                                                : "Bệnh nhân"}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <ActionButton type="submit" disabled={loading}>
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </ActionButton>
                </form>

                <p className="text-center text-gray-500 text-sm mt-4">
                    Bạn đã có tài khoản?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;