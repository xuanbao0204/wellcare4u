"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, DashboardStats } from "@/features/admin/adminService";
import {
    Users,
    Stethoscope,
    CalendarCheck,
    FileText,
    ShieldCheck,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    Bell,
    MessageSquare,
} from "lucide-react";

function StatCard({
    label,
    value,
    icon,
    color,
    sub,
}: {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    sub?: string;
}) {
    return (
        <div className={`rounded-2xl border p-5 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
                    <p className="mt-1 text-3xl font-bold">{value}</p>
                    {sub && <p className="mt-1 text-xs opacity-60">{sub}</p>}
                </div>
                <div className="opacity-80">{icon}</div>
            </div>
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/50">
            {children}
        </h2>
    );
}

const typeBadge: Record<string, string> = {
    INFO: "bg-blue-50 text-blue-700",
    WARNING: "bg-amber-50 text-amber-700",
    SYSTEM: "bg-purple-50 text-purple-700",
};
const typeLabel: Record<string, string> = {
    INFO: "Thông tin",
    WARNING: "Cảnh báo",
    SYSTEM: "Hệ thống",
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .catch(() => setError("Không thể tải dữ liệu thống kê."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex h-60 items-center justify-center text-foreground/40">
                Đang tải...
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex h-60 items-center justify-center text-red-500">
                {error ?? "Lỗi không xác định"}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Tổng quan hệ thống</h1>
                <p className="mt-1 text-sm text-foreground/50">
                    Thống kê nhanh toàn bộ dữ liệu của WellCare4U
                </p>
            </div>

            {/* Tài khoản */}
            <section>
                <SectionTitle>Tài khoản</SectionTitle>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Tổng tài khoản"
                        value={stats.totalAccounts}
                        icon={<Users size={32} />}
                        color="border-blue-200 bg-blue-50 text-blue-800"
                    />
                    <StatCard
                        label="Bệnh nhân"
                        value={stats.totalPatients}
                        icon={<Users size={32} />}
                        color="border-green-200 bg-green-50 text-green-800"
                    />
                    <StatCard
                        label="Bác sĩ"
                        value={stats.totalDoctors}
                        icon={<Stethoscope size={32} />}
                        color="border-teal-200 bg-teal-50 text-teal-800"
                        sub={`${stats.verifiedDoctors} đã xác minh · ${stats.pendingVerificationDoctors} chờ duyệt`}
                    />
                    <StatCard
                        label="Quản trị viên"
                        value={stats.totalAdmins}
                        icon={<ShieldCheck size={32} />}
                        color="border-purple-200 bg-purple-50 text-purple-800"
                    />
                </div>
            </section>

            {/* Trạng thái tài khoản */}
            <section>
                <SectionTitle>Trạng thái tài khoản</SectionTitle>
                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Đang hoạt động"
                        value={stats.activeAccounts}
                        icon={<CheckCircle size={28} />}
                        color="border-green-200 bg-green-50 text-green-800"
                    />
                    <StatCard
                        label="Chưa kích hoạt"
                        value={stats.inactiveAccounts}
                        icon={<AlertCircle size={28} />}
                        color="border-amber-200 bg-amber-50 text-amber-800"
                    />
                    <StatCard
                        label="Đã khoá"
                        value={stats.lockedAccounts}
                        icon={<XCircle size={28} />}
                        color="border-red-200 bg-red-50 text-red-800"
                    />
                </div>
            </section>

            {/* Lịch hẹn & Diễn đàn */}
            <section>
                <SectionTitle>Lịch hẹn & Diễn đàn</SectionTitle>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Tổng lịch hẹn"
                        value={stats.totalAppointments}
                        icon={<CalendarCheck size={28} />}
                        color="border-sky-200 bg-sky-50 text-sky-800"
                    />
                    <StatCard
                        label="Đang chờ"
                        value={stats.pendingAppointments}
                        icon={<Clock size={28} />}
                        color="border-amber-200 bg-amber-50 text-amber-800"
                    />
                    <StatCard
                        label="Hoàn thành"
                        value={stats.completedAppointments}
                        icon={<CheckCircle size={28} />}
                        color="border-green-200 bg-green-50 text-green-800"
                    />
                    <StatCard
                        label="Đã huỷ"
                        value={stats.cancelledAppointments}
                        icon={<XCircle size={28} />}
                        color="border-red-200 bg-red-50 text-red-800"
                    />
                </div>
            </section>

            {/* Diễn đàn */}
            <section>
                <SectionTitle>Diễn đàn</SectionTitle>
                <div className="grid gap-4 sm:grid-cols-2">
                    <StatCard
                        label="Tổng bài viết"
                        value={stats.totalPosts}
                        icon={<FileText size={28} />}
                        color="border-indigo-200 bg-indigo-50 text-indigo-800"
                    />
                    <StatCard
                        label="Tổng bình luận"
                        value={stats.totalComments}
                        icon={<MessageSquare size={28} />}
                        color="border-pink-200 bg-pink-50 text-pink-800"
                    />
                </div>
            </section>

            {/* Thông báo gần đây */}
            <section>
                <SectionTitle>Thông báo gần đây</SectionTitle>
                {stats.recentNotifications.length === 0 ? (
                    <p className="text-sm text-foreground/40">Chưa có thông báo nào.</p>
                ) : (
                    <div className="space-y-3">
                        {stats.recentNotifications.map((n) => (
                            <div
                                key={n.id}
                                className="flex items-start gap-3 rounded-xl border border-primary/10 bg-white p-4"
                            >
                                <Bell size={16} className="mt-0.5 shrink-0 text-primary" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge[n.type] ?? "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {typeLabel[n.type] ?? n.type}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-foreground/60 line-clamp-2">{n.content}</p>
                                    <p className="mt-1 text-xs text-foreground/40">{n.createdAt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}