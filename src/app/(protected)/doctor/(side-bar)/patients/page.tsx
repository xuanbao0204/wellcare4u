"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import {
    ArrowRight,
    CalendarClock,
    FileText,
    LoaderCircle,
    Search,
    SearchX,
    UserRound,
    UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { getAllPatients } from "@/features/doctor/patient-manage/patientManageService";
import { PatientsSummaryDTO } from "@/shared/type";

function getAge(dob: string): number | string {
    if (!dob) return "-";

    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return "-";

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    return age;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "-";

    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatGender(gender?: string): string {
    if (gender === "MALE") return "Nam";
    if (gender === "FEMALE") return "Nữ";
    return "-";
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

                const sorted = (res.data as PatientsSummaryDTO[]).sort(
                    (a, b) =>
                        new Date(b.lastVisitDate || 0).getTime() -
                        new Date(a.lastVisitDate || 0).getTime()
                );

                setPatients(sorted);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Không thể tải danh sách bệnh nhân");
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const filtered = patients.filter((patient) => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
    });

    const totalRecords = patients.reduce(
        (sum, patient) => sum + (patient.totalRecords ?? 0),
        0
    );
    const latestVisit = patients[0]?.lastVisitDate;

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-5 py-4 text-sm font-medium text-primary shadow-[0_20px_50px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Đang tải danh sách bệnh nhân
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <section className="p-4 md:p-6">
                <div className="rounded-[28px] border border-rose-200/80 bg-rose-50/90 p-6 text-rose-700 shadow-[0_20px_55px_-42px_rgba(225,29,72,0.45)]">
                    <p className="font-semibold">Không thể tải dữ liệu</p>
                    <p className="mt-2 text-sm">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6 p-4 md:p-6">
            <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(0,10,156,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(29,63,255,0.1),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.76))] p-6 shadow-[0_26px_70px_-42px_rgba(15,23,42,0.42)] backdrop-blur-xl md:p-7">
                <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/72 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
                            <UsersRound className="h-3.5 w-3.5" />
                            Quản lý bệnh nhân
                        </div>

                        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                            Danh sách bệnh nhân
                        </h1>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:min-w-120">
                        <SummaryCard
                            icon={<UsersRound className="h-4 w-4" />}
                            label="Bệnh nhân"
                            value={patients.length}
                        />
                        <SummaryCard
                            icon={<FileText className="h-4 w-4" />}
                            label="Hồ sơ"
                            value={totalRecords}
                        />
                        <SummaryCard
                            icon={<CalendarClock className="h-4 w-4" />}
                            label="Lần khám gần nhất"
                            value={formatDate(latestVisit || "")}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/78 p-5 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.42)] backdrop-blur-xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-950">
                            Hồ sơ bệnh nhân
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {filtered.length} / {patients.length} bệnh nhân
                        </p>
                    </div>

                    <div className="relative w-full lg:max-w-sm">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên bệnh nhân"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200/80 bg-white/88 py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                        />
                    </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-[24px] border border-white/70 bg-white/80 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-230 text-sm">
                            <thead className="border-b border-slate-200/70 bg-slate-50/85 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 text-left">Bệnh nhân</th>
                                    <th className="px-5 py-4 text-left">Giới tính</th>
                                    <th className="px-5 py-4 text-left">Tuổi</th>
                                    <th className="px-5 py-4 text-left">Ngày sinh</th>
                                    <th className="px-5 py-4 text-left">Lần khám gần nhất</th>
                                    <th className="px-5 py-4 text-left">Hồ sơ</th>
                                    <th className="px-5 py-4" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/90">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 shadow-sm">
                                                    <SearchX className="h-6 w-6" />
                                                </div>
                                                <p className="mt-4 text-sm font-medium text-slate-600">
                                                    Không tìm thấy bệnh nhân
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((patient) => {
                                        const fullName = `${patient.firstName} ${patient.lastName}`.trim();
                                        const initials = `${patient.firstName?.[0] ?? ""}${patient.lastName?.[0] ?? ""}`;

                                        return (
                                            <tr
                                                key={patient.patientId}
                                                className="group cursor-pointer transition hover:bg-primary/4"
                                                onClick={() => router.push(`/doctor/patients/${patient.patientId}`)}
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {patient.avatar ? (
                                                            <img
                                                                src={patient.avatar}
                                                                alt={fullName}
                                                                className="h-11 w-11 rounded-2xl border border-white/80 bg-slate-100 object-cover shadow-sm"
                                                            />
                                                        ) : (
                                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/10 bg-primary/8 text-sm font-semibold text-primary shadow-sm">
                                                                {initials || <UserRound className="h-4 w-4" />}
                                                            </div>
                                                        )}
                                                        <span className="font-semibold text-slate-950">
                                                            {fullName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600">{formatGender(patient.gender)}</td>
                                                <td className="px-5 py-4 text-slate-600">{getAge(patient.dob)}</td>
                                                <td className="px-5 py-4 text-slate-600">{formatDate(patient.dob)}</td>
                                                <td className="px-5 py-4 text-slate-600">{formatDate(patient.lastVisitDate)}</td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                                                        {patient.totalRecords} hồ sơ
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition group-hover:border-primary/20 group-hover:text-primary">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SummaryCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-[22px] border border-white/75 bg-white/68 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary">
                    {icon}
                </span>
                {label}
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                {value}
            </p>
        </div>
    );
}
