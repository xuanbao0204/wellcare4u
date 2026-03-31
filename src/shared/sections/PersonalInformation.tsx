"use client";

import { useEffect, useState } from "react";
import { fetchInfo } from "../services/personalInformation";
import { PersonalProfileData } from "../type";
import FloatingInput from "../components/FloatingInput";
import { updateInfo } from "../services/personalInformation";
import { showSuccess } from "@/lib/toast";
import Badge from "../ui/Badge";
import { uploadToCloudinary } from "../services/uploadFile";
import { useAuth } from "../AuthContext";
import Loader from "../ui/Loader";

export default function PersonalProfile() {
    const [form, setForm] = useState<PersonalProfileData | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [initialForm, setInitialForm] = useState<PersonalProfileData | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetchInfo();
            if (res.status !== 200) return;
            const data = await res.data;
            const formatted = {
                ...data,
                dob: data.dob ? data.dob.split("T")[0] : "",
            };

            setForm(formatted);
            setInitialForm(formatted);
        };
        fetchUser();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setForm(initialForm);
        setIsEditing(false);
    };

    const handleChange = (field: keyof PersonalProfileData, value: string) => {
        if (!form) return;
        setForm({
            ...form,
            [field]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;

        setSaving(true);
        try {
            const res = await updateInfo({
                firstName: form.firstName,
                lastName: form.lastName,
                dob: form.dob,
                gender: form.gender,
            });

            if (res.status === 200) {
                const data = await res.data;

                const updated = {
                    ...form,
                    ...data,
                    dob: data.dob ? data.dob.split("T")[0] : "",
                };

                setForm(updated);
                setInitialForm(updated);
                setIsEditing(false);

                showSuccess(res.message);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const url = await uploadToCloudinary(file, {
                folder: "wellcare/profile",
                publicId: `user_${form?.email.split("@")[0]}`,
            });
            const res = await updateInfo({ avatar: url });

            if (res.status === 200) {
                setForm((prev: any) => ({
                    ...prev,
                    avatar: url,
                }));
                showSuccess("Cập nhật avatar thành công");
            }
        } finally {
            setUploading(false);
        }
    };

    if (!form) {
        return (
            <div className="rounded-2xl border border-primary/15 bg-background p-8 text-sm text-foreground/60 shadow-sm">
                Loading profile...
            </div>
        );
    }

    return (
        <section className="mx-auto w-full max-w-4xl">
            <div className="rounded-3xl border border-primary/20 bg-white/80 backdrop-blur-md shadow-xl p-8">
                <div className="mb-10 flex flex-col items-center text-center rounded-2xl bg-white/60  backdrop-blur p-6 shadow-md">
                    <img
                        src={form.avatar || "/avatar-placeholder.png"}
                        alt="Profile avatar"
                        className="h-28 w-28 rounded-full border-4 border-background object-cover shadow-md ring-2 ring-primary/15"
                    />
                    <Badge value={form.role} className="mt-3 mr-3" />

                    <label className="mt-4 inline-flex cursor-pointer items-center rounded-xl border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5">
                        {uploading ? "Đang tải..." : "Thay đổi ảnh"}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                            disabled={uploading}
                        />
                    </label>

                    <p className="mt-2 text-xs text-foreground/60">
                        JPG or PNG, max 5MB
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-1">
                        <h3 className="text-xl font-semibold text-primary">
                            Thông tin tài khoản
                        </h3>
                        <p className="mt-1 text-sm text-foreground/60 py-2">
                            Quản lý thông tin cá nhân của bạn, bao gồm tên, ngày sinh và giới tính.
                        </p>
                    </div>

                    <FloatingInput
                        label="Email"
                        type="email"
                        value={form.email || ""}
                        disabled={!isEditing}
                        className="bg-gray-100"
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                        <FloatingInput
                            label="Họ tên đệm"
                            value={form.firstName || ""}
                            onChange={(e) =>
                                handleChange("firstName", e.target.value)
                            }
                            disabled={!isEditing}

                        />
                        <FloatingInput
                            label="Tên"
                            value={form.lastName || ""}
                            onChange={(e) =>
                                handleChange("lastName", e.target.value)
                            }
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <FloatingInput
                            label="Ngày sinh"
                            type="date"
                            value={form.dob || ""}
                            onChange={(e) =>
                                handleChange("dob", e.target.value)
                            }
                            disabled={!isEditing}
                        />

                        <div className="relative">
                            <select
                                value={form.gender || ""}
                                onChange={(e) =>
                                    handleChange("gender", e.target.value)
                                }
                                disabled={!isEditing}
                                className="peer h-14 w-full rounded-lg border-2 border-gray-300 bg-background px-4 pt-5 text-sm text-foreground transition focus:border-primary focus:outline-none"
                            >
                                <option value="">Giới tính</option>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                            <label className="pointer-events-none absolute left-4 top-2 bg-background px-1 text-xs text-primary">
                                Giới tính
                            </label>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 pt-4">

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                            >
                                {saving ? <Loader /> : "Lưu thay đổi"}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                            >
                                Hủy
                            </button>

                        </div>

                    )}
                </form>
                <div className="flex gap-3 pt-4">
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={handleEditToggle}
                            className="rounded-xl border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
