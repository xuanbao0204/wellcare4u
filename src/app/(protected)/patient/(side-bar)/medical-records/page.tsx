"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    CalendarDays,
    ChevronRight,
    ClipboardList,
    FileText,
    Stethoscope,
} from "lucide-react";

import { getAllRecordByPatientId } from "@/features/medical-records/medicalRecordService";
import { MedicalRecordListDTO } from "@/features/medical-records/types";
import { showError } from "@/lib/toast";
import { useAuth } from "@/shared/AuthContext";

const formatRecordDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

const getDoctorName = (record: MedicalRecordListDTO) =>
    `${record.doctor.firstName ?? ""} ${record.doctor.lastName ?? ""}`.trim();

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

    const latestRecord = records[0];
    const diagnosedCount = records.filter((record) => record.diagnosis).length;

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,#f8fafc,#eef6ff)] p-4 md:p-6">
            <div className="mx-auto max-w-6xl space-y-5">
                <section className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/75 p-5 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-6">
                    <div className="absolute -left-12 top-8 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm">
                                <FileText size={14} />
                                Hồ sơ y tế
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                                    Hồ sơ bệnh án
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                                    Danh sách các lần khám, bác sĩ phụ trách và chẩn đoán đã được ghi nhận.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-117.5">
                            <SummaryCard
                                label="Tổng hồ sơ"
                                value={records.length}
                                icon={<ClipboardList size={17} />}
                                tone="text-primary"
                            />
                            <SummaryCard
                                label="Đã chẩn đoán"
                                value={diagnosedCount}
                                icon={<Stethoscope size={17} />}
                                tone="text-emerald-600"
                            />
                            <SummaryCard
                                label="Gần nhất"
                                value={latestRecord ? formatRecordDate(latestRecord.createdAt) : "--"}
                                icon={<CalendarDays size={17} />}
                                tone="text-sky-600"
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-4xl border border-white/70 bg-white/72 p-4 shadow-[0_22px_64px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-5">
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="animate-pulse rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-200/80" />
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 w-2/5 rounded-full bg-slate-200/80" />
                                            <div className="h-3 w-3/5 rounded-full bg-slate-200/70" />
                                        </div>
                                    </div>
                                    <div className="mt-5 h-3 w-full rounded-full bg-slate-200/60" />
                                </div>
                            ))}
                        </div>
                    ) : records.length === 0 ? (
                        <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-primary/20 bg-white/55 px-6 py-14 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/80 bg-white/85 text-primary shadow-sm">
                                <FileText size={28} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-950">
                                Chưa có hồ sơ bệnh án
                            </h2>
                            <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
                                Các hồ sơ khám bệnh sẽ được hiển thị tại đây sau khi bác sĩ hoàn tất ghi nhận.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {records.map((record) => (
                                <button
                                    key={record.recordId}
                                    type="button"
                                    onClick={() => router.push(`/medical-records/${record.recordId}`)}
                                    className="group w-full rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.68))] p-4 text-left shadow-[0_18px_52px_-38px_rgba(15,23,42,0.5)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white/88 hover:shadow-[0_24px_64px_-36px_rgba(37,99,235,0.35)] sm:p-5"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex min-w-0 items-start gap-4">
                                            <Image
                                                src={record.doctor.avatar || "/images/default-avatar.png"}
                                                alt={getDoctorName(record) || "Bác sĩ phụ trách"}
                                                width={64}
                                                height={64}
                                                className="h-14 w-14 shrink-0 rounded-2xl border border-white/80 object-cover shadow-sm sm:h-16 sm:w-16"
                                            />

                                            <div className="min-w-0 space-y-2">
                                                <div>
                                                    <p className="truncate text-base font-semibold text-gray-950 sm:text-lg">
                                                        Bác sĩ {getDoctorName(record) || "phụ trách"}
                                                    </p>
                                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 sm:text-sm">
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50/80 px-2.5 py-1 text-sky-700">
                                                            <CalendarDays size={14} />
                                                            {formatRecordDate(record.createdAt)}
                                                        </span>
                                                        {record.doctor.specialization && (
                                                            <span className="rounded-full border border-emerald-100 bg-emerald-50/80 px-2.5 py-1 text-emerald-700">
                                                                {record.doctor.specialization}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl border border-slate-100/90 bg-slate-50/75 px-4 py-3">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                                                        Chẩn đoán
                                                    </p>
                                                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-700">
                                                        {record.diagnosis || "Chưa có chẩn đoán"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 md:justify-end">
                                            <span className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                                                #{record.recordId}
                                            </span>
                                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-primary shadow-sm transition-transform duration-200 group-hover:translate-x-0.5">
                                                <ChevronRight size={18} />
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

type SummaryCardProps = {
    label: string;
    value: string | number;
    icon: ReactNode;
    tone: string;
};

const SummaryCard = ({ label, value, icon, tone }: SummaryCardProps) => (
    <div className="rounded-3xl border border-white/75 bg-white/70 p-4 shadow-sm backdrop-blur-md">
        <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/80 bg-white/80 shadow-sm ${tone}`}>
            {icon}
        </div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-lg font-semibold tracking-tight text-gray-950">{value}</p>
    </div>
);

export default PatientMedicalRecordsPage;
