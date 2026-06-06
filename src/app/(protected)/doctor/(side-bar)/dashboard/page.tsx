"use client";

import Link from "next/link";
import {
    Activity,
    ArrowRight,
    CalendarCheck,
    Clock3,
    FileText,
    Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Loader from "@/shared/ui/Loader";
import { showError } from "@/lib/toast";
import { parseApiError } from "@/lib/parseError";
import {
    DoctorDashboardSnapshotDTO,
    getDoctorDashboardData,
} from "@/features/doctor/doctorService";
import { AppointmentDTO } from "@/shared/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/AuthContext";
import { generateDoctorSummary } from "@/features/aiTools/aiTools";

const quickActions = [
    {
        title: "Lịch hẹn",
        description: "Theo dõi lịch khám và xử lý các cuộc hẹn sắp tới.",
        href: "/doctor/appointments",
        icon: <CalendarCheck size={18} />,
        variant: "blue" as const,
    },
    {
        title: "Hồ sơ bệnh án",
        description: "Truy cập kết quả khám, ghi chú và thông tin điều trị.",
        href: "/doctor/medical-records",
        icon: <FileText size={18} />,
        variant: "slate" as const,
    },
    {
        title: "Lịch làm việc",
        description: "Cập nhật ca trực và thời gian tiếp nhận bệnh nhân.",
        href: "/doctor/schedule",
        icon: <Clock3 size={18} />,
        variant: "amber" as const,
    },
];

export default function DoctorDashboardPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const hasTriggeredRef = useRef(false);

    const {
        data,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useQuery({
        queryKey: ["doctor-dashboard", user?.id],

        queryFn: async () => {
            const res = await getDoctorDashboardData();
            return res.data;
        },

        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });

    const generateSummaryMutation = useMutation({
        mutationFn: async () => {
            const res = await generateDoctorSummary();
            return res.data;
        },

        onSuccess: (aiSummary) => {
            queryClient.setQueryData(
                ["doctor-dashboard", user?.id],
                (old: DoctorDashboardSnapshotDTO | undefined) =>
                    old
                        ? {
                              ...old,
                              aiSummary,
                          }
                        : old
            );
        },

        onError: (err) => {
            showError(parseApiError(err));
        },
    });

    useEffect(() => {
        if (
            isSuccess &&
            data?.aiSummary == null &&
            !generateSummaryMutation.isPending &&
            !hasTriggeredRef.current
        ) {
            hasTriggeredRef.current = true;
            generateSummaryMutation.mutate();
        }
    }, [
        isSuccess,
        data?.aiSummary,
        generateSummaryMutation.isPending,
    ]);

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-red-500">
                    {parseApiError(error)}
                </p>
            </div>
        );
    }

    const stats = data.stats;
    const doctorName = [data.profile?.firstName, data.profile?.lastName]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[30px] border border-white/60 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,255,255,0.78))] p-6 shadow-[0_26px_70px_-42px_rgba(15,23,42,0.42)] backdrop-blur-xl sm:p-7">
                <div className="absolute -top-10 right-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-slate-200/60 blur-3xl" />

                <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
                            Doctor dashboard
                        </div>

                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">
                            Xin chào {doctorName ? `Dr. ${doctorName}` : "bác sĩ"}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                            Tổng quan lịch hẹn, tiến độ khám và tình hình bệnh
                            nhân trong ngày.
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <HighlightMetric
                                label="Lịch hôm nay"
                                value={`${stats.todayAppointments ?? 0} ca`}
                            />
                            <HighlightMetric
                                label="Đã hoàn thành"
                                value={`${stats.completedAppointments ?? 0} ca`}
                            />
                            <HighlightMetric
                                label="Tỷ lệ hủy"
                                value={`${(
                                    stats.cancellationRate ?? 0
                                ).toFixed(1)}%`}
                            />
                        </div>
                    </div>

                    <div className="grid w-full gap-3 sm:grid-cols-3 xl:w-110">
                        <CompactMetric
                            label="Tổng lịch hẹn"
                            value={`${stats.totalAppointments ?? 0}`}
                            hint="Tất cả cuộc hẹn đã tiếp nhận"
                        />
                        <CompactMetric
                            label="Bệnh nhân"
                            value={`${stats.totalPatients ?? 0}`}
                            hint="Số bệnh nhân đã phục vụ"
                        />
                        <CompactMetric
                            label="Bệnh án"
                            value={`${stats.totalMedicalRecords ?? 0}`}
                            hint="Hồ sơ khám đã tạo"
                        />
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <OverviewCard
                    title="Lịch hôm nay"
                    value={stats.todayAppointments ?? 0}
                    note="Theo dõi và điều phối các cuộc hẹn trong ngày."
                    href="/doctor/appointments"
                    icon={<CalendarCheck size={20} />}
                    variant="blue"
                />

                <OverviewCard
                    title="Đã hoàn thành"
                    value={stats.completedAppointments ?? 0}
                    note="Số ca khám đã được xử lý xong."
                    href="/doctor/medical-records"
                    icon={<Activity size={20} />}
                    variant="emerald"
                />

                <OverviewCard
                    title="Tỷ lệ hủy"
                    value={`${(stats.cancellationRate ?? 0).toFixed(1)}%`}
                    note="Mức độ ổn định của lịch hẹn và khả năng lấp đầy."
                    href="/doctor/appointments"
                    icon={<Clock3 size={20} />}
                    variant="amber"
                />

                <OverviewCard
                    title="Bệnh nhân"
                    value={stats.totalPatients ?? 0}
                    note="Tổng số bệnh nhân đã tiếp nhận và theo dõi."
                    href="/doctor/patients"
                    icon={<Users size={20} />}
                    variant="slate"
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
                <div className="rounded-[28px] border border-white/60 bg-white/72 p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur-xl">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-primary">
                                Tổng quan hoạt động
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                Nhận định nhanh
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/75 text-primary shadow-sm">
                            <Activity size={20} />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(248,250,252,0.9))] p-5 shadow-sm">
                        <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                            {data.aiSummary ? data.aiSummary : generateSummaryMutation.isPending ? "Đang tạo tổng hợp..." : "Chưa có dữ liệu tổng hợp cho hôm nay."}
                        </p>
                    </div>
                </div>

                <div className="rounded-[28px] border border-white/60 bg-white/72 p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur-xl">
                    <div className="mb-5">
                        <p className="text-sm font-medium text-primary">
                            Truy cập nhanh
                        </p>

                        <h2 className="mt-1 text-xl font-semibold text-slate-900">
                            Công việc thường dùng
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {quickActions.map((action) => (
                            <QuickActionCard
                                key={action.title}
                                {...action}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <AppointmentPanel
                    eyebrow="Cần chuẩn bị"
                    title="Lịch hẹn sắp tới"
                    appointments={data.upcomingAppointments ?? []}
                    emptyText="Không có lịch hẹn sắp tới."
                    href="/doctor/appointments"
                />

                <AppointmentPanel
                    eyebrow="Mới cập nhật"
                    title="Hoạt động gần đây"
                    appointments={data.recentAppointments ?? []}
                    emptyText="Chưa có hoạt động gần đây."
                    href="/doctor/appointments"
                />
            </section>
        </div>
    );
}

function AppointmentPanel({
    eyebrow,
    title,
    appointments,
    emptyText,
    href,
}: {
    eyebrow: string;
    title: string;
    appointments: AppointmentDTO[];
    emptyText: string;
    href: string;
}) {
    return (
        <div className="rounded-[28px] border border-white/60 bg-white/72 p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur-xl">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-primary">
                        {eyebrow}
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-slate-900">
                        {title}
                    </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/75 text-primary shadow-sm">
                    <CalendarCheck size={18} />
                </div>
            </div>

            {appointments.length === 0 ? (
                <EmptyState text={emptyText} />
            ) : (
                <div className="space-y-3">
                    {appointments.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-[22px] border border-white/70 bg-white/72 p-4 shadow-sm backdrop-blur"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-slate-900">
                                        {item.patientName}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {item.slotDate} - {item.slotTime}
                                    </p>

                                    {item.reason && (
                                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                                            {item.reason}
                                        </p>
                                    )}
                                </div>

                                <StatusBadge status={item.status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-5">
                <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3"
                >
                    Xem tất cả
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}

function OverviewCard({
    title,
    value,
    note,
    icon,
    variant,
    href,
}: {
    title: string;
    value: string | number;
    note: string;
    icon: React.ReactNode;
    variant: "blue" | "emerald" | "amber" | "slate";
    href?: string;
}) {
    const styles = {
        blue: {
            icon: "border-blue-200/80 bg-blue-50/90 text-blue-600",
            surface:
                "bg-[linear-gradient(145deg,rgba(239,246,255,0.75),rgba(255,255,255,0.8))]",
        },
        emerald: {
            icon: "border-emerald-200/80 bg-emerald-50/90 text-emerald-600",
            surface:
                "bg-[linear-gradient(145deg,rgba(236,253,245,0.78),rgba(255,255,255,0.8))]",
        },
        amber: {
            icon: "border-amber-200/80 bg-amber-50/90 text-amber-700",
            surface:
                "bg-[linear-gradient(145deg,rgba(255,251,235,0.8),rgba(255,255,255,0.8))]",
        },
        slate: {
            icon: "border-slate-200/80 bg-slate-100/90 text-slate-700",
            surface:
                "bg-[linear-gradient(145deg,rgba(248,250,252,0.86),rgba(255,255,255,0.8))]",
        },
    };

    const s = styles[variant];

    const content = (
        <div
            className={`group h-full rounded-[26px] border border-white/65 ${s.surface} p-5 shadow-[0_22px_55px_-40px_rgba(15,23,42,0.42)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5`}
        >
            <div className="flex items-start justify-between gap-4">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${s.icon}`}
                >
                    {icon}
                </div>

                <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>

            <div className="mt-8">
                <div className="text-sm text-slate-500">{title}</div>

                <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                    {value}
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    {note}
                </p>
            </div>
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}

function QuickActionCard({
    title,
    description,
    href,
    icon,
    variant,
}: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    variant: "blue" | "slate" | "amber";
}) {
    const styles = {
        blue: "border-blue-200/80 bg-blue-50/90 text-blue-600",
        slate: "border-slate-200/80 bg-slate-100/90 text-slate-700",
        amber: "border-amber-200/80 bg-amber-50/90 text-amber-700",
    };

    return (
        <Link
            href={href}
            className="group block rounded-3xl border border-white/65 bg-white/74 p-5 shadow-[0_18px_44px_-38px_rgba(15,23,42,0.48)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/82"
        >
            <div className="flex items-start justify-between gap-4">
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${styles[variant]}`}
                >
                    {icon}
                </div>

                <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>

            <div className="mt-5">
                <h3 className="font-semibold text-slate-900">
                    {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    {description}
                </p>
            </div>
        </Link>
    );
}

function HighlightMetric({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[22px] border border-white/70 bg-white/68 px-4 py-4 shadow-sm backdrop-blur">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
                {value}
            </p>
        </div>
    );
}

function CompactMetric({
    label,
    value,
    hint,
}: {
    label: string;
    value: string;
    hint: string;
}) {
    return (
        <div className="rounded-[22px] border border-white/70 bg-white/68 p-4 shadow-sm backdrop-blur">
            <p className="text-sm text-slate-500">{label}</p>

            <div className="mt-2 text-2xl font-semibold text-slate-900">
                {value}
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
                {hint}
            </p>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-3xl border border-dashed border-white/80 bg-white/50 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/80 text-primary shadow-sm">
                <FileText size={18} />
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                {text}
            </p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "border-amber-200 bg-amber-50 text-amber-700",
        CONFIRMED: "border-blue-200 bg-blue-50 text-blue-700",
        COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
        CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
    };

    const labels: Record<string, string> = {
        PENDING: "Chờ xác nhận",
        CONFIRMED: "Đã xác nhận",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy",
    };

    return (
        <div
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${styles[status] ?? "border-slate-200 bg-slate-100 text-slate-700"
                }`}
        >
            {labels[status] ?? status}
        </div>
    );
}
