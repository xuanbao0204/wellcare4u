"use client";

import { useEffect, useRef, useState } from "react";
import FloatingInput from "@/shared/components/FloatingInput";

import { showSuccess } from "@/lib/toast";
import { deleteFile, uploadToCloudinary } from "@/shared/services/uploadFile";
import { useAuth } from "@/shared/AuthContext";
import { getPublicIdFromUrl } from "@/shared/services/uploadFile";
import ActionButton from "@/shared/components/ActionButton";
import Loader from "@/shared/ui/Loader";
import { getPatientProfile, updatePatientProfile } from "../patientInformationService";

export default function DoctorProfile() {
    const [form, setForm] = useState<any>(null);
    const [initialForm, setInitialForm] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const { user } = useAuth();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getPatientProfile();
            if (res.status !== 200) return;

            setForm(res.data);
            setInitialForm(res.data);
        };

        fetchData();
    }, []);

    const handleChange = (field: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEditToggle = () => setIsEditing(true);

    const handleCancel = async () => {
        setForm(initialForm);
        setIsEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSaving(true);
        try {
            const res = await updatePatientProfile({
                emergencyContact: form.emergencyContact,
                bloodType: form.bloodType,
                insuranceNumber: form.insuranceNumber,
                insuranceImage: form.insuranceImage
            });

            if (res.status === 200) {
                setForm(res.data);
                setInitialForm(res.data);
                setIsEditing(false);

                showSuccess("Cập nhật thông tin chuyên môn thành công!");
            }
        } finally {
            setSaving(false);
        }
    };

    const [uploadingImage, setUploadingImage] = useState(false);

    const handleInsuranceImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];
        setUploadingImage(true);

        try {
            const url = await uploadToCloudinary(
                file,
                {
                    folder: "wellcare/insurance",
                    publicId: `insurance_${user?.email.split("@")[0]}`,
                }
            );
            setForm((prev: any) => ({
                ...prev,
                insuranceImage: url,
            }));

            const res = await updatePatientProfile({ insuranceImage: url });

            if (res.status === 200) {
                setForm((prev: any) => ({
                    ...prev,
                    avatar: url,
                }));
                showSuccess("Đã tải lên chứng chỉ mới thành công");
            }
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDeleteInsuranceImage = async () => {
        try {
            if (!form.insuranceImage) return;

            const publicId = getPublicIdFromUrl(form.insuranceImage);

            if (publicId) {
                await deleteFile(publicId);
            }

            setForm((prev: any) => ({
                ...prev,
                insuranceImage: "",
            }));
        } catch (err) {
            console.error(err);
        }
    };

    if (!form) return <div>Loading...</div>;

    return (
        <section className="mx-auto w-full max-w-4xl">
            <div className="rounded-3xl border border-primary/20 bg-white/80 backdrop-blur-md shadow-xl p-8">

                <div>
                    <h3 className="text-xl font-semibold text-primary">
                        Thông tin bệnh nhân
                    </h3>
                    <p className="mt-1 text-sm text-foreground/60 py-2">
                        Quản lý thông tin cá nhân và bảo hiểm y tế của bạn.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                    }}
                    className="space-y-6"
                >

                    <FloatingInput
                        label="Số điện thoại liên lạc khẩn cấp"
                        type="text"
                        value={form.emergencyContact || ""}
                        onChange={(e) =>
                            handleChange("emergencyContact", e.target.value)
                        }
                        disabled={!isEditing}
                    />

                    <select
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                            value={form.bloodType || ""}
                            onChange={(e) =>
                                handleChange("bloodType", e.target.value)
                            }
                            disabled={!isEditing}
                        >
                            <option value="">Chọn nhóm máu</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>

                    <FloatingInput
                        label="Số bảo hiểm y tế"
                        value={form.insuranceNumber || ""}
                        onChange={(e) =>
                            handleChange("insuranceNumber", e.target.value)
                        }
                        disabled={!isEditing}
                    />

                    {isEditing && (
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
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

                {!isEditing && (
                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleEditToggle}
                            className="rounded-xl border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
                        >
                            Chỉnh  sửa
                        </button>
                    </div>
                )}
            </div>
            <hr className="my-4 border-t-2 border-gray-200" />
            <div className="space-y-4">
                <label className="text-sm font-medium text-primary py-4 mb-3">
                    Hình ảnh bảo hiểm
                </label>

                <p className="text-sm text-gray-900">Hình ảnh sẽ được dùng để xác thực bảo hiểm y tế</p>

                {!form.insuranceImage && (
                    <div className="flex justify-center">
                        <label className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 transition">
                            Tải lên hình ảnh bảo hiểm
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleInsuranceImageUpload}
                            />
                        </label>
                    </div>
                )}

                {form.insuranceImage && (
                    <div className="space-y-4 rounded-xl border p-4 bg-gray-50">

                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-4">

                                <h3 className="text-lg font-semibold text-primary">
                                    Chứng chỉ
                                </h3>

                                <div className="max-h-100 overflow-auto border rounded-lg">

                                    <img
                                        src={form.insuranceImage}
                                        alt="Insurance Image"
                                        className="w-full object-contain"
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="flex justify-center gap-4 pt-2">

                            <label className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 transition">
                                Tải mới
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleInsuranceImageUpload}
                                />
                            </label>

                            <button
                                type="button"
                                onClick={handleDeleteInsuranceImage}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600 transition"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </section>
    );
}