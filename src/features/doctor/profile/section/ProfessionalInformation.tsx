"use client";

import { useEffect, useRef, useState } from "react";
import FloatingInput from "@/shared/components/FloatingInput";

import { showSuccess } from "@/lib/toast";
import { getDoctorProfile, updateDoctorProfile } from "../services/doctorProfileService";
import { deleteFile, uploadToCloudinary } from "@/shared/services/uploadFile";
import { useAuth } from "@/shared/AuthContext";
import { getPublicIdFromUrl } from "@/shared/services/uploadFile";
import ActionButton from "@/shared/components/ActionButton";
import Loader from "@/shared/ui/Loader";

export default function DoctorProfile() {
    const [form, setForm] = useState<any>(null);
    const [initialForm, setInitialForm] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const [showCertModal, setShowCertModal] = useState(false);

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
            const res = await getDoctorProfile();
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
            const res = await updateDoctorProfile({
                bio: form.bio,
                specialization: form.specialization,
                experienceYears: form.experienceYears,
                consultationFee: form.consultationFee,
                clinicAddress: form.clinicAddress,
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

    const [uploadingCert, setUploadingCert] = useState(false);

    const handleCertificationUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files?.length) return;

        const file = e.target.files[0];
        setUploadingCert(true);

        try {
            const url = await uploadToCloudinary(
                file,
                {
                    folder: "wellcare/certifications",
                    publicId: `cert_${user?.email.split("@")[0]}`,
                }
            );
            setForm((prev: any) => ({
                ...prev,
                certification: url,
            }));

            const res = await updateDoctorProfile({ certification: url });

            if (res.status === 200) {
                setForm((prev: any) => ({
                    ...prev,
                    avatar: url,
                }));
                showSuccess("Đã tải lên chứng chỉ mới thành công");
            }
        } finally {
            setUploadingCert(false);
        }
    };

    const handleDeleteCertification = async () => {
        try {
            if (!form.certification) return;

            const publicId = getPublicIdFromUrl(form.certification);

            if (publicId) {
                await deleteFile(publicId);
            }

            setForm((prev: any) => ({
                ...prev,
                certification: "",
            }));

            setShowCertModal(false);
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
                        Thông tin chuyên môn
                    </h3>
                    <p className="mt-1 text-sm text-foreground/60 py-2">
                        Quản lý chuyên môn và thông tin phòng khám của bạn.
                    </p>
                </div>


                <div className="space-y-4">
                    <label className="text-sm font-medium text-primary py-4 mb-3">
                        Chứng chỉ
                    </label>

                    {!form.certification && (
                        <div className="flex justify-center">
                            <label className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 transition">
                                Tải lên chứng chỉ
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleCertificationUpload}
                                />
                            </label>
                        </div>
                    )}

                    {form.certification && (
                        <div className="space-y-4 rounded-xl border p-4 bg-gray-50">

                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setShowCertModal(true)}
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    Xem chứng chỉ
                                </button>
                            </div>

                            <div className="flex justify-center gap-4 pt-2">

                                <label className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 transition">
                                    Tải mới
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,image/*"
                                        onChange={handleCertificationUpload}
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={handleDeleteCertification}
                                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600 transition"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <hr className="my-4 border-t-2 border-gray-200" />

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") e.preventDefault();
                    }}
                    className="space-y-6"
                >
                    <div className="relative" ref={dropdownRef}>
                        <input
                            type="text"
                            value={form.specialization || ""}
                            onChange={(e) =>
                                handleChange("specialization", e.target.value)
                            }
                            onFocus={() => setShowDropdown(true)}
                            disabled={!isEditing}
                            placeholder="Search specialization..."
                            className="peer h-14 w-full rounded-lg border-2 border-gray-300 bg-background px-4 pt-5 text-sm text-foreground focus:border-primary focus:outline-none"
                        />

                        <label className="absolute left-4 top-2 bg-background px-1 text-xs text-primary">
                            Chuyên khoa
                        </label>

                        {isEditing && showDropdown && (
                            <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                                {SPECIALIZATIONS
                                    .filter((item) =>
                                        item
                                            .toLowerCase()
                                            .includes((form.specialization || "").toLowerCase())
                                    )
                                    .map((item) => (
                                        <div
                                            key={item}
                                            onClick={() => {
                                                handleChange("specialization", item);
                                                setShowDropdown(false);
                                            }}
                                            className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/10"
                                        >
                                            {item}
                                        </div>
                                    ))}

                                {SPECIALIZATIONS.filter((item) =>
                                    item
                                        .toLowerCase()
                                        .includes((form.specialization || "").toLowerCase())
                                ).length === 0 && (
                                        <div className="px-4 py-2 text-sm text-gray-400">
                                            Không tìm thấy kết quả
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>

                    <FloatingInput
                        label="Năm kinh nghiệm"
                        type="number"
                        value={form.experienceYears || ""}
                        onChange={(e) =>
                            handleChange("experienceYears", e.target.value)
                        }
                        disabled={!isEditing}
                    />

                    <FloatingInput
                        label="Consultation Fee ($)"
                        type="number"
                        value={form.consultationFee || ""}
                        onChange={(e) =>
                            handleChange("consultationFee", e.target.value)
                        }
                        disabled={!isEditing}
                    />

                    <FloatingInput
                        label="Clinic Address"
                        value={form.clinicAddress || ""}
                        onChange={(e) =>
                            handleChange("clinicAddress", e.target.value)
                        }
                        disabled={!isEditing}
                    />

                    <div className="relative">
                        <textarea
                            value={form.bio || ""}
                            onChange={(e) =>
                                handleChange("bio", e.target.value)
                            }
                            disabled={!isEditing}
                            rows={4}
                            className="w-full rounded-lg border-2 border-gray-300 p-4 text-sm focus:border-primary focus:outline-none"
                        />
                        <label className="absolute left-3 -top-2 bg-background px-1 text-xs text-primary">
                            Bio
                        </label>
                    </div>

                    {isEditing && (
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
                            >
                                {saving ? <Loader /> : "Save Changes"}
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

            {showCertModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-4">

                        <h3 className="text-lg font-semibold text-primary">
                            Chứng chỉ
                        </h3>

                        <div className="max-h-100 overflow-auto border rounded-lg">
                            {form.certification?.endsWith(".pdf") ? (
                                <embed
                                    src={form.certification}
                                    type="application/pdf"
                                    className="w-full h-100"
                                />
                            ) : (
                                <img
                                    src={form.certification}
                                    alt="cert"
                                    className="w-full object-contain"
                                />
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowCertModal(false)}
                                className="rounded-lg border px-4 py-2 text-sm"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

const SPECIALIZATIONS = [
    "Tim mạch",
    "Da liễu",
    "Tiêu hóa - Gan mật",
    "Thần kinh",
    "Nội tiết",
    "Hô hấp",
    "Thận - Tiết niệu",
    "Cơ xương khớp",
    "Huyết học",
    "Truyền nhiễm",
    "Nội tổng quát",
    "Ngoại tổng quát",
    "Ngoại thần kinh",
    "Chấn thương chỉnh hình",
    "Ngoại lồng ngực - Tim mạch",
    "Nam khoa",
    "Phẫu thuật thẩm mỹ",
    "Sản phụ khoa",
    "Nhi khoa",
    "Tai Mũi Họng",
    "Răng Hàm Mặt",
    "Nhãn khoa",
    "Sức khỏe tâm thần",
    "Ung bướu",
    "Chẩn đoán hình ảnh",
    "Xét nghiệm",
    "Gây mê hồi sức",
    "Phục hồi chức năng",
    "Dinh dưỡng",
    "Y học cổ truyền",
    "Y học gia đình",
    "Cấp cứu",
    "Lão khoa"
];