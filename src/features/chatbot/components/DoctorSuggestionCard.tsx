"use client";

import Link from "next/link";
import { Stethoscope, ArrowUpRight } from "lucide-react";
import { DoctorDTO } from "@/shared/type";

interface Props {
    doctor: DoctorDTO;
}

export default function DoctorSuggestionCard({ doctor }: Props) {
    const fullName = `${doctor.lastName} ${doctor.firstName}`;

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/70 text-sm font-semibold text-white shadow-sm">
                    <img src={doctor.avatar} alt={fullName} className="h-full w-full rounded-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground">
                        BS. {fullName}
                    </h3>

                    <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <Stethoscope className="h-3 w-3" />
                        {doctor.specialization}
                    </div>
                </div>
            </div>

            <Link
                href={`/patient/appointments/create?doctorId=${doctor.id}`}
                className="mt-4 flex items-center justify-between rounded-xl bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition-colors group-hover:bg-primary group-hover:text-white"
            >
                Chọn lịch hẹn
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
        </div>
    );
}