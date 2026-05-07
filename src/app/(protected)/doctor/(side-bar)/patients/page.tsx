"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAllPatients } from "@/features/doctor/patient-manage/patientManageService";
import { PatientsSummaryDTO } from "@/shared/type";

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

export default function PatientsManagePage() {
    const router = useRouter();
    const [patients, setPatients] = useState<PatientsSummaryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await getAllPatients();
                if (res.status !== 200) throw new Error(res.message);
                // Sort by lastVisitDate descending
                const sorted = (res.data as PatientsSummaryDTO[]).sort(
                    (a, b) =>
                        new Date(b.lastVisitDate).getTime() -
                        new Date(a.lastVisitDate).getTime()
                );
                setPatients(sorted);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load patients");
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filtered = patients.filter((p) => {
        const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500 bg-red-50 rounded-lg">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                <p className="text-sm text-gray-500 mt-1">{patients.length} patients under your care</p>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Patient</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Gender</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Age</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Date of Birth</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Last Visit</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Records</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-10 text-gray-400">
                                    No patients found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((patient) => (
                                <tr
                                    key={patient.patientId}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/doctor/patients/${patient.patientId}`)}
                                >
                                    {/* Avatar + Name */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {patient.avatar ? (
                                                <img
                                                    src={patient.avatar}
                                                    alt={`${patient.firstName} ${patient.lastName}`}
                                                    className="w-9 h-9 rounded-full object-cover bg-gray-200"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                                                    {patient.firstName?.[0]}{patient.lastName?.[0]}
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-900">
                                                {patient.firstName} {patient.lastName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Gender */}
                                    <td className="px-4 py-3 text-gray-600 capitalize">{patient.gender === "MALE" ? "Nam" : patient.gender === "FEMALE" ? "Nữ" : "—"}</td>

                                    {/* Age */}
                                    <td className="px-4 py-3 text-gray-600">{getAge(patient.dob)}</td>

                                    {/* DOB */}
                                    <td className="px-4 py-3 text-gray-600">{formatDate(patient.dob)}</td>

                                    {/* Last Visit */}
                                    <td className="px-4 py-3">
                                        <span className="text-gray-700">{formatDate(patient.lastVisitDate)}</span>
                                    </td>

                                    {/* Total Records */}
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {patient.totalRecords} records
                                        </span>
                                    </td>

                                    {/* Arrow */}
                                    <td className="px-4 py-3 text-gray-400 text-right">→</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}