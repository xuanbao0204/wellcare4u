"use client";

import Link from "next/link";
import { FileText, Stethoscope, ArrowUpRight, CalendarClock } from "lucide-react";
import { MedicalRecordDetail } from "@/shared/type";

interface Props {
    record: MedicalRecordDetail;
}

export default function MedicalRecordCard({ record }: Props) {
    const doctorName = record.doctor
        ? `${record.doctor.lastName} ${record.doctor.firstName}`
        : null;

    const recordDate = record.createdAt;

    return (
        <div className="rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground/50">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {recordDate ? new Date(recordDate).toLocaleDateString("vi-VN") : "Chưa rõ ngày"}
                </div>

                {doctorName && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <Stethoscope className="h-3 w-3" />
                        BS. {doctorName}
                    </div>
                )}
            </div>

            <h3 className="mt-2 font-semibold text-foreground">
                {record.diagnosis || record.chiefComplaint || "Chưa có chẩn đoán"}
            </h3>

            {record.conclusion && (
                <p className="mt-1 line-clamp-2 text-sm text-foreground/60">
                    {record.conclusion}
                </p>
            )}

            <Link
                href={`/patient/medical-records/${record.id}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
            >
                <FileText className="h-4 w-4" />
                Xem chi tiết hồ sơ
                <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
        </div>
    );
}