"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PatientMedicalRecordsDTO, VitalSign } from "@/shared/type";
import { getPatientDetail } from "@/features/doctor/patient-manage/patientManageService";
import { ArrowRight } from "lucide-react";

function getAge(dob: string): number {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatDateTime(dateStr: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function VitalCard({ label, value, unit }: { label: string; value?: number; unit?: string }) {
    return (
        <div className="bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-base font-semibold text-gray-800">
                {value != null ? `${value}${unit ? ` ${unit}` : ""}` : "—"}
            </p>
        </div>
    );
}

export default function PatientDetailPage() {
    const router = useRouter();
    const params = useParams();
    const patientId = params?.patientId;

    const [patient, setPatient] = useState<PatientMedicalRecordsDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await getPatientDetail(Number(patientId));
                if (res.status !== 200) throw new Error(res.message);
                const found = (res.data as PatientMedicalRecordsDTO)
                if (!found) throw new Error("Patient not found");
                setPatient(found);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load patient");
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, [patientId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="p-6 text-red-500 bg-red-50 rounded-lg">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    // Latest vital sign
    const latestVital: VitalSign | undefined = patient.vitalSigns?.[patient.vitalSigns.length - 1];

    // Sort records newest first
    const sortedRecords = [...(patient.records ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Back */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
            >
                ← Back to patients
            </button>

            {/* Profile Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-5 mb-5">
                {patient.avatar ? (
                    <img
                        src={patient.avatar}
                        alt={`${patient.firstName} ${patient.lastName}`}
                        className="w-16 h-16 rounded-full object-cover bg-gray-200"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                        {patient.firstName?.[0]}{patient.lastName?.[0]}
                    </div>
                )}
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        {patient.firstName} {patient.lastName}
                    </h1>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                        <span className="capitalize">{patient.gender || "—"}</span>
                        <span>DOB: {formatDate(patient.dob)} ({getAge(patient.dob)} yrs)</span>
                        <span>Last visit: {formatDate(patient.lastVisitDate)}</span>
                        <span>{patient.totalRecords} records</span>
                    </div>
                </div>
            </div>

            {/* Latest Vital Signs */}
            {latestVital && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-gray-800">Latest Vital Signs</h2>
                        {latestVital.timestamp && (
                            <span className="text-xs text-gray-400">{formatDateTime(latestVital.timestamp)}</span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        <VitalCard label="Heart Rate" value={latestVital.heartRate} unit="bpm" />
                        {/* Blood pressure special case */}
                        <div className="bg-gray-50 rounded-lg px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">Blood Pressure</p>
                            <p className="text-base font-semibold text-gray-800">
                                {latestVital.bloodPressure != null &&
                                    latestVital.bloodPressure != null
                                    ? `${latestVital.bloodPressure} mmHg`
                                    : "—"}
                            </p>
                        </div>
                        <VitalCard label="Weight" value={latestVital.weight} unit="kg" />
                        <VitalCard label="Height" value={latestVital.height} unit="cm" />
                        <VitalCard label="BMI" value={latestVital.bmi} unit="" />
                    </div>
                </div>
            )}

            {/* All Vital Signs History */}
            {patient.vitalSigns && patient.vitalSigns.length > 1 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
                    <h2 className="font-semibold text-gray-800 mb-3">Vital Signs History</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-gray-100">
                                <tr className="text-left text-xs text-gray-500">
                                    <th className="pb-2 pr-4">Date</th>
                                    <th className="pb-2 pr-4">HR (bpm)</th>
                                    <th className="pb-2 pr-4">BP (mmHg)</th>
                                    <th className="pb-2 pr-4">Temp (°C)</th>
                                    <th className="pb-2 pr-4">Weight (kg)</th>
                                    <th className="pb-2 pr-4">Height (cm)</th>
                                    <th className="pb-2">SpO₂ (%)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[...patient.vitalSigns]
                                    .sort(
                                        (a, b) =>
                                            new Date(b.timestamp ?? 0).getTime() -
                                            new Date(a.timestamp ?? 0).getTime()
                                    )
                                    .map((v, i) => (
                                        <tr key={i} className="text-gray-700">
                                            <td className="py-2 pr-4 text-gray-500 text-xs">
                                                {v.timestamp ? formatDateTime(v.timestamp) : "—"}
                                            </td>
                                            <td className="py-2 pr-4">{v.heartRate ?? "—"}</td>
                                            <td className="py-2 pr-4">
                                                {v.bloodPressure != null
                                                    ? `${v.bloodPressure}/${v.bloodPressure} mmHg`
                                                    : "—"}
                                            </td>
                                            <td className="py-2 pr-4">{v.weight ?? "—"}</td>
                                            <td className="py-2 pr-4">{v.height ?? "—"}</td>
                                            <td className="py-2">{v.bmi?.toFixed(1) ?? "—"}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Medical Records */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="font-semibold text-gray-800 mb-3">
                    Medical Records
                    <span className="ml-2 text-xs font-normal text-gray-400">
                        ({sortedRecords.length})
                    </span>
                </h2>
                {sortedRecords.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">No records found.</p>
                ) : (
                    <div className="space-y-3">
                        {sortedRecords.map((record) => (
                            <div
                                key={record.recordId}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {record.diagnosis || "No diagnosis recorded"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {formatDateTime(record.createdAt)}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-400 shrink-0">#{record.recordId}</span>
                                <div className="text-sm text-gray-700 mt-2">
                                    <a href={`/medical-records/${record.recordId}`} className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                                        <ArrowRight className="inline-block w-4 h-4" /> Xem chi tiết
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}