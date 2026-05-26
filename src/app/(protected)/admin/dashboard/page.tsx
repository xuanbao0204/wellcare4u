"use client";

import { useEffect, useRef, useState } from "react";
import { getDashboardStats, DashboardStats } from "@/features/admin/adminService";
import {
    Users,
    Stethoscope,
    CalendarCheck,
    FileText,
    AlertCircle,
    CheckCircle,
    XCircle,
    Bell,
    Activity,
    Download,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    RadialBarChart,
    RadialBar,
} from "recharts";

import { exportAnalyticsExcel, exportDashboardPdf } from "@/features/admin/exportDashboard";
import TrendsChart from "@/features/admin/TrendChart";

function StatCard({
    label,
    value,
    icon,
    accent,
    sub,
}: {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    accent: string;
    sub?: string;
}) {
    return (
        <div
            className={`group rounded-[28px] border border-white/70 bg-linear-to-br ${accent} p-5 shadow-[0_22px_55px_-38px_rgba(15,23,42,0.28)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/55">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-[2rem]">
                        {value}
                    </p>
                    {sub ? (
                        <p className="mt-2 text-sm leading-6 text-foreground/60">
                            {sub}
                        </p>
                    ) : null}
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-primary shadow-sm">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function SectionTitle({
    title,
    description,
}: {
    title: React.ReactNode;
    description?: React.ReactNode;
}) {
    return (
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    {title}
                </h2>
                {description ? (
                    <p className="mt-1 text-sm leading-6 text-foreground/55">
                        {description}
                    </p>
                ) : null}
            </div>
            <div className="h-px w-full max-w-40 bg-linear-to-r from-primary/20 to-transparent sm:w-40" />
        </div>
    );
}

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
}) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-2xl border border-white/80 bg-white/92 px-4 py-3 text-sm shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
            {label ? (
                <p className="mb-2 font-semibold text-foreground/75">{label}</p>
            ) : null}
            {payload.map((item: TooltipPayloadItem, index: number) => (
                <p
                    key={index}
                    style={{ color: item.color ?? item.fill }}
                    className="font-medium"
                >
                    {item.name}:{" "}
                    <span className="tabular-nums">
                        {item.value.toLocaleString()}
                    </span>
                </p>
            ))}
        </div>
    );
};

type TooltipPayloadItem = {
    color?: string;
    fill?: string;
    name: string;
    value: number;
};

const typeBadge: Record<string, string> = {
    INFO: "border border-sky-200/80 bg-sky-50/90 text-sky-700",
    WARNING: "border border-amber-200/80 bg-amber-50/90 text-amber-700",
    SYSTEM: "border border-violet-200/80 bg-violet-50/90 text-violet-700",
};

const typeLabel: Record<string, string> = {
    INFO: "Thông tin",
    WARNING: "Cảnh báo",
    SYSTEM: "Hệ thống",
};

function SurfaceCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-6 ${className}`}
        >
            {children}
        </div>
    );
}

function ChartCard({
    title,
    description,
    children,
    footer,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}) {
    return (
        <SurfaceCard className="h-full">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <p className="text-base font-semibold tracking-tight text-foreground">
                        {title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-foreground/50">
                        {description}
                    </p>
                </div>
            </div>
            {children}
            {footer ? <div className="mt-5">{footer}</div> : null}
        </SurfaceCard>
    );
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .catch(() => setError("Không thể tải dữ liệu thống kê."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-[28px] border border-white/70 bg-white/75 text-foreground/55 shadow-sm backdrop-blur-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/80 shadow-sm">
                    <Activity size={28} className="animate-pulse text-primary" />
                </div>
                <p className="text-base font-medium">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex min-h-72 items-center justify-center rounded-[28px] border border-red-200/70 bg-red-50/90 px-6 text-base font-medium text-red-600 shadow-sm">
                {error ?? "Lỗi không xác định"}
            </div>
        );
    }

    const accountStatusData = [
        { name: "Hoạt động", value: stats.activeAccounts, fill: "#22c55e" },
        { name: "Chưa kích hoạt", value: stats.inactiveAccounts, fill: "#f59e0b" },
        { name: "Đã khóa", value: stats.lockedAccounts, fill: "#ef4444" },
    ].filter((item) => item.value > 0);

    const appointmentData = [
        { name: "Chờ duyệt", value: stats.pendingAppointments, fill: "#f59e0b" },
        { name: "Hoàn thành", value: stats.completedAppointments, fill: "#22c55e" },
        { name: "Đã hủy", value: stats.cancelledAppointments, fill: "#ef4444" },
    ];

    const doctorVerificationData = [
        { name: "Đã xác minh", value: stats.verifiedDoctors, fill: "#0ea5e9" },
        { name: "Chờ duyệt", value: stats.pendingVerificationDoctors, fill: "#e2e8f0" },
    ];

    const roleBreakdownData = [
        { name: "Bệnh nhân", value: stats.totalPatients, fill: "#6366f1" },
        { name: "Bác sĩ", value: stats.totalDoctors, fill: "#0ea5e9" },
        { name: "Admin", value: stats.totalAdmins, fill: "#8b5cf6" },
    ];

    const DONUT_INNER = 55;
    const DONUT_OUTER = 90;
    const verifiedRate =
        stats.totalDoctors > 0
            ? Math.round((stats.verifiedDoctors / stats.totalDoctors) * 100)
            : 0;

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-4xl border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,250,252,0.82))] p-6 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.42)] backdrop-blur-xl sm:p-7">
                <div className="absolute inset-y-0 right-0 hidden w-72 bg-linear-to-l from-primary/8 to-transparent lg:block" />
                <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
                            <Activity size={14} />
                            Admin overview
                        </div>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Tổng quan hệ thống
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-foreground/60">
                            Bảng điều khiển quản trị tập trung cho toàn bộ dữ liệu
                            WellCare4U, với số liệu rõ ràng hơn và bố cục tối ưu
                            cho việc theo dõi nhanh.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => {
                                    if (dashboardRef.current) {
                                        exportDashboardPdf(
                                            dashboardRef.current,
                                            `dashboard-report-${Date.now()}.pdf`
                                        );
                                    }
                                }}
                                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:opacity-90"
                            >
                                <Download size={18} />
                                Export PDF
                            </button>
                            <button
                                onClick={exportAnalyticsExcel}
                                className="inline-flex items-center rounded-2xl border border-primary/15 bg-white/85 px-4 py-3 text-sm font-medium text-primary shadow-sm transition hover:bg-primary/5"
                            >
                                Export XLSX
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-3xl border border-white/75 bg-white/80 p-4 shadow-sm backdrop-blur">
                            <p className="text-sm font-medium text-foreground/55">
                                Tổng tài khoản
                            </p>
                            <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">
                                {stats.totalAccounts.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-white/75 bg-white/80 p-4 shadow-sm backdrop-blur">
                            <p className="text-sm font-medium text-foreground/55">
                                Tổng lịch hẹn
                            </p>
                            <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">
                                {stats.totalAppointments.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50/90 p-4 shadow-sm backdrop-blur">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-emerald-700/80">
                                        Trạng thái dữ liệu
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-emerald-700">
                                        Live
                                    </p>
                                </div>
                                <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(34,197,94,0.16)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div ref={dashboardRef} className="space-y-8">
                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.95fr)]">
                    <ChartCard
                        title="Users & Appointments"
                        description="Chọn kỳ xem và điều hướng qua lại."
                    >
                        <TrendsChart />
                    </ChartCard>

                    <SurfaceCard className="h-full">
                        <SectionTitle
                            title="Tổng quan nhanh"
                            description="Các chỉ số quan trọng nhất được đưa lên đầu để dễ theo dõi trong một lần nhìn."
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <StatCard
                                label="Tổng tài khoản"
                                value={stats.totalAccounts.toLocaleString()}
                                icon={<Users size={28} />}
                                accent="from-blue-50/95 to-white/90"
                                sub={`${stats.activeAccounts} đang hoạt động`}
                            />
                            <StatCard
                                label="Bác sĩ"
                                value={stats.totalDoctors}
                                icon={<Stethoscope size={28} />}
                                accent="from-teal-50/95 to-white/90"
                                sub={`${stats.verifiedDoctors} đã xác minh · ${stats.pendingVerificationDoctors} chờ`}
                            />
                            <StatCard
                                label="Lịch hẹn"
                                value={stats.totalAppointments.toLocaleString()}
                                icon={<CalendarCheck size={28} />}
                                accent="from-sky-50/95 to-white/90"
                                sub={`${stats.pendingAppointments} đang chờ xử lý`}
                            />
                            <StatCard
                                label="Nội dung diễn đàn"
                                value={(stats.totalPosts + stats.totalComments).toLocaleString()}
                                icon={<FileText size={28} />}
                                accent="from-indigo-50/95 to-white/90"
                                sub={`${stats.totalPosts} bài viết · ${stats.totalComments} bình luận`}
                            />
                        </div>
                    </SurfaceCard>
                </section>

                <section>
                    <SectionTitle
                        title="Phân tích tài khoản"
                        description="Theo dõi phân bố người dùng và tiến độ xác minh bác sĩ trong cùng một cụm thông tin."
                    />
                    <div className="grid gap-6 lg:grid-cols-3">
                        <ChartCard
                            title="Trạng thái tài khoản"
                            description="Phân bổ theo trạng thái hiện tại của hệ thống."
                            footer={
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                                    {accountStatusData.map((item) => (
                                        <span
                                            key={item.name}
                                            className="flex items-center gap-2 text-sm text-foreground/60"
                                        >
                                            <span
                                                className="inline-block h-2.5 w-2.5 rounded-full"
                                                style={{ background: item.fill }}
                                            />
                                            {item.name}
                                        </span>
                                    ))}
                                </div>
                            }
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={accountStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={DONUT_INNER}
                                        outerRadius={DONUT_OUTER}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {accountStatusData.map((entry, index) => (
                                            <Cell key={index} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard
                            title="Phân bổ vai trò"
                            description="Bệnh nhân, bác sĩ và quản trị viên trên toàn hệ thống."
                            footer={
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                                    {roleBreakdownData.map((item) => (
                                        <span
                                            key={item.name}
                                            className="flex items-center gap-2 text-sm text-foreground/60"
                                        >
                                            <span
                                                className="inline-block h-2.5 w-2.5 rounded-full"
                                                style={{ background: item.fill }}
                                            />
                                            {item.name}:{" "}
                                            <strong className="text-foreground">
                                                {item.value}
                                            </strong>
                                        </span>
                                    ))}
                                </div>
                            }
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={roleBreakdownData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={DONUT_INNER}
                                        outerRadius={DONUT_OUTER}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {roleBreakdownData.map((entry, index) => (
                                            <Cell key={index} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard
                            title="Xác minh bác sĩ"
                            description="Tỷ lệ bác sĩ đã được xét duyệt và sẵn sàng hoạt động."
                            footer={
                                <div className="flex justify-center gap-4">
                                    <span className="flex items-center gap-2 text-sm text-foreground/60">
                                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-400" />
                                        Xác minh:{" "}
                                        <strong className="text-foreground">
                                            {stats.verifiedDoctors}
                                        </strong>
                                    </span>
                                    <span className="flex items-center gap-2 text-sm text-foreground/60">
                                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-200" />
                                        Chờ:{" "}
                                        <strong className="text-foreground">
                                            {stats.pendingVerificationDoctors}
                                        </strong>
                                    </span>
                                </div>
                            }
                        >
                            <div className="flex items-center justify-center">
                                <div className="relative">
                                    <ResponsiveContainer width={220} height={220}>
                                        <RadialBarChart
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={90}
                                            data={doctorVerificationData}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <RadialBar dataKey="value" cornerRadius={6} />
                                            <Tooltip content={<CustomTooltip />} />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-3xl font-bold text-sky-600">
                                            {verifiedRate}%
                                        </p>
                                        <p className="text-sm text-foreground/45">
                                            đã xác minh
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ChartCard>
                    </div>
                </section>

                <section>
                    <SectionTitle
                        title="Lịch hẹn và hoạt động"
                        description="Nhìn nhanh trạng thái xử lý lịch hẹn và mức độ hoạt động nội dung trong hệ thống."
                    />
                    <div className="grid gap-6 lg:grid-cols-2">
                        <ChartCard
                            title="Trạng thái lịch hẹn"
                            description="Phân bổ theo tiến trình xử lý hiện tại."
                            footer={
                                <div className="grid grid-cols-3 divide-x divide-white/70 overflow-hidden rounded-[22px] border border-white/70 bg-white/65 text-center">
                                    {appointmentData.map((item) => (
                                        <div key={item.name} className="py-4">
                                            <p
                                                className="text-2xl font-bold tabular-nums"
                                                style={{ color: item.fill }}
                                            >
                                                {item.value}
                                            </p>
                                            <p className="mt-1 text-sm text-foreground/50">
                                                {item.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            }
                        >
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={appointmentData} barSize={42}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 13, fill: "#64748b" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: "#f8fafc" }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        name="Số lịch hẹn"
                                        radius={[8, 8, 0, 0]}
                                    >
                                        {appointmentData.map((entry, index) => (
                                            <Cell key={index} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard
                            title="Diễn đàn và nội dung"
                            description="So sánh khối lượng bài viết và bình luận toàn hệ thống."
                            footer={
                                <div className="space-y-3">
                                    {[
                                        {
                                            label: "Bài viết",
                                            value: stats.totalPosts,
                                            total: stats.totalPosts + stats.totalComments,
                                            color: "bg-indigo-500",
                                        },
                                        {
                                            label: "Bình luận",
                                            value: stats.totalComments,
                                            total: stats.totalPosts + stats.totalComments,
                                            color: "bg-pink-500",
                                        },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-3">
                                            <span className="w-20 text-right text-sm text-foreground/50">
                                                {item.label}
                                            </span>
                                            <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className={`h-2.5 rounded-full ${item.color}`}
                                                    style={{
                                                        width:
                                                            item.total > 0
                                                                ? `${(item.value / item.total) * 100}%`
                                                                : "0%",
                                                    }}
                                                />
                                            </div>
                                            <span className="w-12 text-sm font-medium tabular-nums text-foreground/70">
                                                {item.total > 0
                                                    ? Math.round((item.value / item.total) * 100)
                                                    : 0}
                                                %
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            }
                        >
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart
                                    data={[
                                        {
                                            name: "Bài viết",
                                            value: stats.totalPosts,
                                            fill: "#6366f1",
                                        },
                                        {
                                            name: "Bình luận",
                                            value: stats.totalComments,
                                            fill: "#ec4899",
                                        },
                                    ]}
                                    barSize={64}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 13, fill: "#64748b" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: "#64748b" }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: "#f8fafc" }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        name="Số lượng"
                                        radius={[8, 8, 0, 0]}
                                    >
                                        <Cell fill="#6366f1" />
                                        <Cell fill="#ec4899" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <SurfaceCard className="h-full">
                        <SectionTitle
                            title="Trạng thái tài khoản chi tiết"
                            description="Tách riêng các nhóm tài khoản để quản trị viên dễ phát hiện tỷ lệ bất thường."
                        />
                        <div className="grid gap-4">
                            <StatCard
                                label="Đang hoạt động"
                                value={stats.activeAccounts}
                                icon={<CheckCircle size={26} />}
                                accent="from-emerald-50/95 to-white/90"
                                sub={`${stats.totalAccounts > 0 ? Math.round((stats.activeAccounts / stats.totalAccounts) * 100) : 0}% tổng tài khoản`}
                            />
                            <StatCard
                                label="Chưa kích hoạt"
                                value={stats.inactiveAccounts}
                                icon={<AlertCircle size={26} />}
                                accent="from-amber-50/95 to-white/90"
                                sub={`${stats.totalAccounts > 0 ? Math.round((stats.inactiveAccounts / stats.totalAccounts) * 100) : 0}% tổng tài khoản`}
                            />
                            <StatCard
                                label="Đã khóa"
                                value={stats.lockedAccounts}
                                icon={<XCircle size={26} />}
                                accent="from-red-50/95 to-white/90"
                                sub={`${stats.totalAccounts > 0 ? Math.round((stats.lockedAccounts / stats.totalAccounts) * 100) : 0}% tổng tài khoản`}
                            />
                        </div>
                    </SurfaceCard>

                    <div>
                        <SectionTitle
                            title="Thông báo gần đây"
                            description="Thông báo mới nhất dành cho quản trị viên, trình bày rõ hơn để theo dõi nhanh."
                        />
                        {stats.recentNotifications.length === 0 ? (
                            <div className="rounded-[28px] border border-dashed border-primary/20 bg-linear-to-b from-slate-50/90 to-white/80 p-10 text-center text-base text-foreground/35">
                                Chưa có thông báo nào.
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {stats.recentNotifications.map((notification) => (
                                    <SurfaceCard
                                        key={notification.id}
                                        className="p-5 transition-all duration-200 hover:-translate-y-0.5"
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary shadow-sm">
                                                <Bell size={18} />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="truncate text-base font-semibold text-foreground">
                                                        {notification.title}
                                                    </p>
                                                    <span
                                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadge[notification.type] ?? "border border-slate-200 bg-slate-100 text-slate-600"}`}
                                                    >
                                                        {typeLabel[notification.type] ?? notification.type}
                                                    </span>
                                                </div>
                                                <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground/60">
                                                    {notification.content}
                                                </p>
                                                <p className="mt-3 text-sm text-foreground/35">
                                                    {notification.createdAt}
                                                </p>
                                            </div>
                                        </div>
                                    </SurfaceCard>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
