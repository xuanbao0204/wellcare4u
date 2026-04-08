"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MedicalRecordListDTO } from "@/features/medical-records/types";
import { getAllRecordByDoctorId } from "@/features/medical-records/medicalRecordService";
import Skeleton from "@/features/medical-records/components/Skeleton";

import { formatDate } from "@/lib/formatDay";
import { useAuth } from "@/shared/AuthContext";
import { showError, showSuccess } from "@/lib/toast";

export default function MedicalRecordListPage() {
    const [records, setRecords] = useState<MedicalRecordListDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const {user} = useAuth();

    const fetchRecords = async () => {
        if (!user) return;

        const res = await getAllRecordByDoctorId(user.id)
        if (res.status === 200) {
            setRecords(res.data || []);
            setLoading(false);
            showSuccess("Lấy hồ sơ bệnh án thành công");
        } else {
            showError("Lấy hồ sơ bệnh án thất bại");
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchRecords();
    }, []);

    return (
        <div className="max-w-6xl mx-auto mt-6 mb-10 space-y-6">

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-primary">
                    Hồ sơ bệnh án
                </h1>

                <span className="text-sm text-gray-500">
                    {records.length} hồ sơ
                </span>
            </div>

            {loading ? (
                <Skeleton />
            ) : records.length === 0 ? (
                <div className="text-center py-16 border border-gray-600 rounded-2xl bg-white">
                    <div className="text-gray-500">
                        Chưa có hồ sơ bệnh án
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {records.map((rec) => (
                        <div
                            key={rec.recordId}
                            className="group flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-4">

                                <img
                                    src={rec.patient.avatar}
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                <div className="space-y-1">

                                    <div className="font-medium">
                                        {rec.patient.firstName} {rec.patient.lastName}
                                    </div>

                                    <div className="text-sm text-gray-500 flex gap-4">
                                        <span>
                                            BS: {rec.doctor.firstName} {rec.doctor.lastName}
                                        </span>

                                        <span>
                                            {formatDate(rec.createdAt)}
                                        </span>
                                    </div>

                                    {rec.diagnosis && (
                                        <div className="text-sm text-gray-600 line-clamp-1">
                                            {rec.diagnosis}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">

                                <Link
                                    href={`/doctor/records/${rec.recordId}`}
                                    className="opacity-0 group-hover:opacity-100 transition text-sm px-4 py-1 rounded-full border hover:bg-primary/10"
                                >
                                    Xem
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}