"use client"

import { fetchPrescription } from "@/features/prescription/prescriptionService";
import { formatDate } from "@/lib/formatDay";
import { Prescription } from "@/shared/type";
import { useEffect, useState } from "react";

export default function PrescriptionHistory() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

    const fetchData = async () => {
        const res = await fetchPrescription();
        setPrescriptions(res.data);
    }

    useEffect(() => {
        // fetch(`/api/prescriptions/patient/${patientId}`)
        //   .then(r => r.json())
        //   .then(setPrescriptions);
        fetchData();

    }, []);

    return (
        <div className="space-y-4">
            {prescriptions.map((p) => (
                <div key={p.id} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-md">

                    {/* Header — thời gian dùng thuốc */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-500">
                            Đơn thuốc #{p.id}
                        </p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${p.endTime && new Date(p.endTime) < new Date()
                                ? "bg-slate-100 text-slate-500"   // hết hạn
                                : "bg-green-100 text-green-700"   // đang dùng
                            }`}>
                            {p.endTime && new Date(p.endTime) < new Date() ? "Đã kết thúc" : "Đang dùng"}
                        </span>
                    </div>

                    <p className="mb-4 text-xs text-slate-400">
                        {formatDate(p.startTime)} → {p.endTime ? formatDate(p.endTime) : "Không xác định"}
                    </p>

                    {/* Danh sách thuốc */}
                    <div className="space-y-2">
                        {p.items.map((item) => (
                            <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                                <p className="font-semibold text-slate-800">{item.drugName}</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {item.dosage} · {item.frequency} · {item.duration}
                                </p>
                                {item.instruction && (
                                    <p className="mt-1 text-xs italic text-slate-400">{item.instruction}</p>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            ))}
        </div>
    );
}