"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAllRecordByPatientId } from "@/features/medical-records/medicalRecordService";
import { MedicalRecordListDTO } from "@/features/medical-records/types";
import { showError } from "@/lib/toast";
import { useAuth } from "@/shared/AuthContext";

import MedicalRecordList from "@/shared/components/medical-record-view/MedicalRecordList";

const PatientMedicalRecordsPage = () => {
    const { user } = useAuth();
    const router = useRouter();

    const [records, setRecords] = useState<MedicalRecordListDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!user) return;

            const res = await getAllRecordByPatientId(user.id!);

            if (res.status === 200) {
                setRecords(res.data || []);
            } else {
                showError("Lấy hồ sơ bệnh án thất bại");
            }

            setLoading(false);
        };

        fetch();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-4xl">

                <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_-25px_rgba(0,10,156,0.35)] backdrop-blur-xl">

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-foreground">
                            Hồ sơ bệnh án
                        </h1>
                        <p className="mt-1 text-sm text-foreground/70">
                            Xem lại lịch sử khám và chẩn đoán của bạn.
                        </p>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="py-16 text-center text-sm text-foreground/50">
                            Đang tải dữ liệu...
                        </div>
                    ) : (
                        <MedicalRecordList
                            records={records}
                            onSelect={(id) => {
                                router.push(`/medical-records/${id}`);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientMedicalRecordsPage;