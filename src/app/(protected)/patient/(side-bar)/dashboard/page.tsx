"use client";

import { getPatientDashboard } from "@/features/patient/patientService";
import { useAuth } from "@/shared/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    ArrowRight,
    Bell,
    CalendarDays,
    Clock3,
    FileText,
    HeartPulse,
    Sparkles,
    Stethoscope,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

const quickActions = [
    {
        title: "Đặt lịch khám",
        description: "Chọn bác sĩ và khung giờ phù hợp cho lần khám tiếp theo.",
        href: "/patient/appointments",
        icon: CalendarDays,
        accent: "from-sky-500/12 via-white/85 to-white/70",
        iconStyle: "border-sky-200 bg-sky-100 text-sky-600",
    },
    {
        title: "Xem bệnh án",
        description: "Theo dõi lịch sử khám, chẩn đoán và hồ sơ điều trị.",
        href: "/patient/medical-records",
        icon: FileText,
        accent: "from-emerald-500/12 via-white/85 to-white/70",
        iconStyle: "border-emerald-200 bg-emerald-100 text-emerald-600",
    },
    {
        title: "Đơn thuốc",
        description: "Kiểm tra các thuốc đã kê và thông tin sử dụng gần đây.",
        href: "/patient/prescriptions",
        icon: Activity,
        accent: "from-amber-500/12 via-white/85 to-white/70",
        iconStyle: "border-amber-200 bg-amber-100 text-amber-700",
    },
    {
        title: "Diễn đàn sức khỏe",
        description: "Đọc chia sẻ hữu ích và đặt câu hỏi với cộng đồng.",
        href: "/patient/forum",
        icon: Sparkles,
        accent: "from-pink-500/12 via-white/85 to-white/70",
        iconStyle: "border-pink-200 bg-pink-100 text-pink-600",
    },
] as const;

const PatientDashboardPage = () => {
    const { user } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ["patient-dashboard", user?.id],

        queryFn: async () => {
            const res = await getPatientDashboard();
            return res.data;
        },

        enabled: !!user,

        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,

        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-500">Đang tải dashboard...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-red-500">Không thể tải dữ liệu dashboard</p>
            </div>
        );
    }

    const {
        profile,
        stats,
        upcomingAppointment,
        recentAppointments,
        recentNotifications,
        medicalSummary,
        vitalSignHistory,
    } = data;

    const latestVital = vitalSignHistory?.[0];
    const patientName = `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();
    const patientInitials = `${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`.toUpperCase();

    return (
        <div className="space-y-5">
            <section className="relative overflow-hidden rounded-[30px] border border-primary/15 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.78))] p-5 shadow-sm backdrop-blur-xl sm:p-6">
                <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="relative grid gap-4 xl:grid-cols-[1.3fr_0.95fr]">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm">
                                    <Sparkles size={14} />
                                    Patient Dashboard
                                </div>

                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                                        Chào mừng trở lại, {patientName || "bạn"}
                                    </h1>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                                        Theo dõi lịch hẹn, chỉ số sức khỏe và các cập nhật mới trong một bố cục gọn hơn để bạn nắm thông tin nhanh hơn.
                                    </p>
                                </div>
                            </div>

                            <div className="shrink-0">
                                {profile?.avatar ? (
                                    <Image
                                        src={profile.avatar}
                                        alt="avatar"
                                        width={84}
                                        height={84}
                                        className="h-20 w-20 rounded-3xl border border-white/70 object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/70 bg-white/80 text-xl font-semibold text-primary shadow-sm">
                                        {patientInitials || "PT"}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            <InfoPill label="Lần khám gần nhất" value={stats?.lastVisitDate || "Chưa có"} />
                            <InfoPill label="Bệnh án" value={`${stats?.totalMedicalRecords ?? 0} hồ sơ`} />
                            <InfoPill label="Thông báo mới" value={`${stats?.unreadNotifications ?? 0} mục`} />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                title="Tổng lịch hẹn"
                                value={stats?.totalAppointments ?? 0}
                                note={`${stats?.pendingAppointments ?? 0} lịch đang chờ`}
                                icon={<CalendarDays size={18} />}
                                accent="from-sky-500/12 via-white/88 to-white/78"
                                iconStyle="border-sky-200 bg-sky-100 text-sky-600"
                                compact
                            />
                            <StatCard
                                title="Hồ sơ bệnh án"
                                value={stats?.totalMedicalRecords ?? 0}
                                note={
                                    medicalSummary?.lastVisitDate
                                        ? `Gần nhất ${medicalSummary.lastVisitDate}`
                                        : "Chưa có lần khám gần đây"
                                }
                                icon={<FileText size={18} />}
                                accent="from-emerald-500/12 via-white/88 to-white/78"
                                iconStyle="border-emerald-200 bg-emerald-100 text-emerald-600"
                                compact
                            />
                            <StatCard
                                title="Chưa đọc"
                                value={stats?.unreadNotifications ?? 0}
                                note={`${recentNotifications?.length ?? 0} cập nhật gần đây`}
                                icon={<Bell size={18} />}
                                accent="from-amber-500/12 via-white/88 to-white/78"
                                iconStyle="border-amber-200 bg-amber-100 text-amber-700"
                                compact
                            />
                            <StatCard
                                title="Đã hoàn thành"
                                value={stats?.completedAppointments ?? 0}
                                note={`${stats?.cancelledAppointments ?? 0} lịch đã hủy`}
                                icon={<Clock3 size={18} />}
                                accent="from-violet-500/12 via-white/88 to-white/78"
                                iconStyle="border-violet-200 bg-violet-100 text-violet-600"
                                compact
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <HeroMetric
                                label="Lịch hẹn sắp tới"
                                value={upcomingAppointment ? upcomingAppointment.slotDate : "Chưa có"}
                                hint={upcomingAppointment ? upcomingAppointment.slotTime : "Đặt lịch khi cần tư vấn"}
                                icon={<CalendarDays size={18} />}
                            />
                            <HeroMetric
                                label="BMI hiện tại"
                                value={latestVital?.bmi?.toFixed(1) || "--"}
                                hint={
                                    latestVital
                                        ? `Cập nhật ${latestVital.height} cm • ${latestVital.weight} kg`
                                        : "Chưa có dữ liệu sức khỏe"
                                }
                                icon={<Activity size={18} />}
                            />
                        </div>
                    </div>

                    <div className="rounded-[26px] border border-white/80 bg-white/72 p-4 shadow-sm backdrop-blur-md sm:p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                    Tổng quan sức khỏe bằng AI
                                </h2>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary">
                                <Sparkles size={18} />
                            </div>
                        </div>

                        <div className="mt-4 rounded-[22px] border border-primary/10 bg-white/80 p-4 shadow-sm">
                            <div className="prose prose-sm max-w-none whitespace-pre-line text-gray-700">
                                {medicalSummary?.aiSummary || "Chưa có tóm tắt sức khỏe."}
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            <HeroMetric
                                label="Hồ sơ AI phân tích"
                                value={medicalSummary?.totalRecords ? `${medicalSummary.totalRecords} hồ sơ` : "--"}
                                hint={medicalSummary?.lastVisitDate || "Phân tích từ lịch sử khám"}
                                icon={<FileText size={18} />}
                            />
                            <div className="grid gap-3">
                                <ListCard
                                    title="Chẩn đoán gần đây"
                                    items={medicalSummary?.recentDiagnoses || []}
                                    emptyText="Chưa có chẩn đoán gần đây"
                                />
                                <ListCard
                                    title="Điều trị đang theo dõi"
                                    items={medicalSummary?.activeTreatments || []}
                                    emptyText="Chưa có điều trị đang theo dõi"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="grid gap-5">
                    <div className="rounded-[28px] border border-primary/15 bg-white/80 p-5 shadow-sm backdrop-blur-md">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-primary">Lịch hẹn sắp tới</p>
                                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                    Chuẩn bị cho lần khám tiếp theo
                                </h2>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary">
                                <CalendarDays size={18} />
                            </div>
                        </div>

                        {upcomingAppointment ? (
                            <div className="rounded-[24px] border border-primary/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(239,246,255,0.78))] p-4 shadow-sm">
                                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={upcomingAppointment.doctorAvatar}
                                            alt="doctor"
                                            width={64}
                                            height={64}
                                            className="h-16 w-16 rounded-2xl border border-white/80 object-cover shadow-sm"
                                        />

                                        <div className="min-w-0">
                                            <p className="text-lg font-semibold text-gray-900">
                                                BS. {upcomingAppointment.doctorName}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {upcomingAppointment.slotDate} • {upcomingAppointment.slotTime}
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                                {upcomingAppointment.reason || "Chưa cập nhật"}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="inline-flex h-fit w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                        {upcomingAppointment.status}
                                    </span>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <DetailCard
                                        label="Lý do khám"
                                        value={upcomingAppointment.reason || "Chưa cập nhật"}
                                    />
                                    <DetailCard
                                        label="Loại lịch hẹn"
                                        value={upcomingAppointment.type || "Chưa cập nhật"}
                                    />
                                </div>
                            </div>
                        ) : (
                            <EmptyState
                                icon={<CalendarDays size={18} />}
                                title="Chưa có lịch hẹn sắp tới"
                                description="Bạn có thể đặt lịch khám mới để theo dõi sức khỏe và nhận tư vấn từ bác sĩ."
                            />
                        )}
                    </div>

                    <div className="rounded-[28px] border border-primary/15 bg-white/80 p-5 shadow-sm backdrop-blur-md">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-primary">Lịch hẹn gần đây</p>
                                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                    Những lần khám bạn vừa thực hiện
                                </h2>
                            </div>

                            <Link
                                href="/patient/appointments"
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3"
                            >
                                Xem tất cả
                                <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentAppointments?.length ? (
                                recentAppointments.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-[22px] border border-primary/10 bg-white/75 p-4 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={item.doctorAvatar}
                                                    alt="doctor"
                                                    width={52}
                                                    height={52}
                                                    className="h-14 w-14 rounded-2xl border border-white/80 object-cover"
                                                />

                                                <div>
                                                    <p className="font-semibold text-gray-900">BS. {item.doctorName}</p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {item.slotDate} • {item.slotTime}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="inline-flex w-fit rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                                                {item.status}
                                            </span>
                                        </div>

                                        <p className="mt-3 text-sm leading-6 text-gray-600">{item.reason}</p>
                                    </div>
                                ))
                            ) : (
                                <EmptyState
                                    icon={<FileText size={18} />}
                                    title="Chưa có lịch hẹn gần đây"
                                    description="Các lịch sử khám gần nhất sẽ hiển thị tại đây để bạn theo dõi thuận tiện hơn."
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-5">
                    <div className="rounded-[28px] border border-primary/15 bg-white/80 p-5 shadow-sm backdrop-blur-md">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-primary">Tổng quan sức khỏe</p>
                                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                    Chỉ số gần nhất của bạn
                                </h2>
                            </div>

                            <div className="rounded-2xl border border-primary/10 bg-primary/5 px-3 py-2 text-xs text-gray-500">
                                {latestVital ? "Đã cập nhật" : "Chưa có dữ liệu"}
                            </div>
                        </div>

                        {latestVital ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                                <HealthRow
                                    label="Nhịp tim"
                                    value={`${latestVital.heartRate ?? "--"} bpm`}
                                    icon={<HeartPulse size={16} />}
                                />
                                <HealthRow
                                    label="Huyết áp"
                                    value={latestVital.bloodPressure || "--"}
                                    icon={<Stethoscope size={16} />}
                                />
                                <HealthRow
                                    label="BMI"
                                    value={latestVital.bmi?.toFixed(1) || "--"}
                                    icon={<Activity size={16} />}
                                />
                                <HealthRow
                                    label="Chiều cao"
                                    value={latestVital.height ? `${latestVital.height} cm` : "--"}
                                    icon={<ArrowRight size={16} />}
                                />
                                <HealthRow
                                    label="Cân nặng"
                                    value={latestVital.weight ? `${latestVital.weight} kg` : "--"}
                                    icon={<ArrowRight size={16} />}
                                />
                            </div>
                        ) : (
                            <EmptyState
                                icon={<HeartPulse size={18} />}
                                title="Chưa có dữ liệu sức khỏe"
                                description="Khi có chỉ số sinh hiệu mới, khu vực này sẽ hiển thị để bạn theo dõi nhanh hơn."
                            />
                        )}
                    </div>

                    <div className="rounded-[28px] border border-primary/15 bg-white/80 p-5 shadow-sm backdrop-blur-md">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-primary">Thao tác nhanh</p>
                                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                    Đi nhanh đến tính năng chính
                                </h2>
                            </div>

                            <div className="hidden rounded-2xl border border-primary/10 bg-primary/5 px-3 py-2 text-right text-xs text-gray-500 sm:block">
                                <div className="font-medium text-primary">4 lối tắt</div>
                                <div>Gọn hơn, vẫn đủ thao tác</div>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {quickActions.map((action) => {
                                const Icon = action.icon;

                                return (
                                    <Link
                                        key={action.title}
                                        href={action.href}
                                        className={`group rounded-[22px] border border-primary/12 bg-linear-to-br ${action.accent} p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${action.iconStyle}`}>
                                                <Icon size={17} />
                                            </div>

                                            <ArrowRight className="mt-1 h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                                        </div>

                                        <div className="mt-4">
                                            <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                            <p className="mt-1.5 text-sm leading-6 text-gray-500">{action.description}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-primary/15 bg-white/80 p-5 shadow-sm backdrop-blur-md">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-primary">Thông báo gần đây</p>
                                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                    Những cập nhật bạn nên xem
                                </h2>
                            </div>

                            <div className="rounded-2xl border border-primary/10 bg-primary/5 px-3 py-2 text-xs text-gray-500">
                                <span className="font-medium text-primary">{stats?.unreadNotifications ?? 0}</span> chưa đọc
                            </div>
                        </div>

                        <div className="space-y-3">
                            {recentNotifications?.length ? (
                                recentNotifications.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-[22px] border border-primary/10 bg-white/75 p-4 shadow-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary">
                                                <Bell size={16} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-900">{item.title}</p>
                                                    {!item.isRead && (
                                                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                                                    )}
                                                </div>

                                                <p className="mt-1.5 text-sm leading-6 text-gray-600">{item.content}</p>
                                                <p className="mt-2 text-xs text-gray-400">{item.createdAt}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState
                                    icon={<Bell size={18} />}
                                    title="Chưa có thông báo gần đây"
                                    description="Khi có cập nhật mới từ hệ thống hoặc bác sĩ, bạn sẽ thấy chúng tại đây."
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

function InfoPill({ label, value }: { label: string; value: string }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-2 text-sm text-gray-600 shadow-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-900">{value}</span>
        </div>
    );
}

function HeroMetric({
    label,
    value,
    hint,
    icon,
}: {
    label: string;
    value: string;
    hint: string;
    icon: ReactNode;
}) {
    return (
        <div className="rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <div className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{value}</div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary">
                    {icon}
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">{hint}</p>
        </div>
    );
}

function StatCard({
    title,
    value,
    note,
    icon,
    accent,
    iconStyle,
    compact = false,
}: {
    title: string;
    value: string | number;
    note: string;
    icon: ReactNode;
    accent: string;
    iconStyle: string;
    compact?: boolean;
}) {
    return (
        <div
            className={`rounded-[26px] border border-primary/12 bg-linear-to-br ${accent} ${compact ? "p-4" : "p-5"} shadow-sm`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${iconStyle}`}>
                    {icon}
                </div>
            </div>

            <div className={compact ? "mt-5" : "mt-8"}>
                <div className="text-sm text-gray-500">{title}</div>
                <div className={`mt-2 font-semibold tracking-tight text-gray-900 ${compact ? "text-2xl" : "text-3xl"}`}>
                    {value}
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-500">{note}</p>
            </div>
        </div>
    );
}

function HealthRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-[22px] border border-primary/10 bg-white/72 px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary">
                    {icon}
                </div>
                <span className="text-sm text-gray-500">{label}</span>
            </div>

            <span className="text-sm font-semibold text-gray-900">{value}</span>
        </div>
    );
}

function DetailCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[22px] border border-primary/10 bg-white/75 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400">{label}</p>
            <p className="mt-2 text-sm leading-6 text-gray-700">{value}</p>
        </div>
    );
}

function ListCard({
    title,
    items,
    emptyText,
}: {
    title: string;
    items: string[];
    emptyText: string;
}) {
    return (
        <div className="rounded-[22px] border border-primary/10 bg-white/72 p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{title}</p>

            {items.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                    {items.map((item) => (
                        <span
                            key={`${title}-${item}`}
                            className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="mt-3 text-sm text-gray-500">{emptyText}</p>
            )}
        </div>
    );
}

function EmptyState({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-[24px] border border-dashed border-primary/15 bg-[linear-gradient(180deg,rgba(248,250,252,0.85),rgba(255,255,255,0.72))] p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-white/80 text-primary shadow-sm">
                {icon}
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">{description}</p>
        </div>
    );
}

export default PatientDashboardPage;
