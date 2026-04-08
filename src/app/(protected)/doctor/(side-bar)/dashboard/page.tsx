"use client";

import Link from "next/link";
import {
    PlusCircle,
    FilePlus,
    Search,
    User,
    CalendarCheck,
    FileText,
    Bell,
} from "lucide-react";

export default function DoctorDashboardPage() {

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">

                <div className="lg:col-span-3 rounded-2xl bg-white p-6 shadow-soft">
                    <h2 className="mb-4 text-sm font-semibold text-gray-500">
                        Thao tác nhanh
                    </h2>

                    <div className="flex flex-col gap-3">
                        <QuickActionButton
                            title="Tạo đơn thuốc"
                            href="/doctor/prescriptions/new"
                            icon={<PlusCircle size={18} />}
                            variant="blue"
                        />

                        <QuickActionButton
                            title="Tạo hồ sơ bệnh án"
                            href="/doctor/medical-records/new"
                            icon={<FilePlus size={18} />}
                            variant="pink"
                        />

                        <QuickActionButton
                            title="Tìm bệnh nhân"
                            href="/doctor/patients"
                            icon={<Search size={18} />}
                            variant="yellow"
                        />

                        <QuickActionButton
                            title="Hồ sơ cá nhân"
                            href="/doctor/profile"
                            icon={<User size={18} />}
                            variant="indigo"
                        />
                    </div>
                </div>

                <div className="lg:col-span-7 rounded-2xl bg-white p-6 shadow-soft">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Tổng quan hôm nay
                        </h2>

                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <OverviewCard
                            title="Lịch hẹn sắp tới"
                            value="--"
                            icon={<CalendarCheck size={20} />}
                            variant="blue"
                            href="/doctor/appointments?today=true"
                        />

                        <OverviewCard
                            title="Hồ sơ bệnh án"
                            value="--"
                            icon={<FileText size={20} />}
                            variant="pink"
                            href="/doctor/medical-records?status=PENDING"
                        />

                        <OverviewCard
                            title="Thông báo mới"
                            value="--"
                            icon={<Bell size={20} />}
                            variant="yellow"
                            href="/doctor/notifications"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">
                        Lịch hẹn hôm nay
                    </h3>

                    <Link
                        href="/doctor/appointments"
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Xem tất cả
                    </Link>
                </div>

                <div className="space-y-3">
                    <EmptyState text="Không có lịch hẹn hôm nay" />
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">
                        Hồ sơ cần xử lý
                    </h3>

                    <Link
                        href="/doctor/medical-records"
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Xem tất cả
                    </Link>
                </div>

                <EmptyState text="Không có hồ sơ chờ xử lý" />
            </div>
        </div>
    );
}

//
// ===== COMPONENTS =====
//

function OverviewCard({
    title,
    value,
    icon,
    variant,
    href,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    variant: "blue" | "pink" | "yellow";
    href?: string;
}) {
    const styles = {
        blue: {
            bg: "bg-blue-50",
            icon: "bg-blue-100 text-blue-600",
        },
        pink: {
            bg: "bg-pink-50",
            icon: "bg-pink-100 text-pink-600",
        },
        yellow: {
            bg: "bg-yellow-50",
            icon: "bg-yellow-100 text-yellow-700",
        },
    };

    const s = styles[variant];

    const content = (
        <div className={`rounded-2xl p-5 transition hover:shadow-md ${s.bg}`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.icon}`}>
                {icon}
            </div>

            <div className="mt-6">
                <div className="text-sm text-gray-500">{title}</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                    {value}
                </div>
            </div>
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}

function QuickActionButton({
    title,
    href,
    icon,
    variant,
}: {
    title: string;
    href: string;
    icon: React.ReactNode;
    variant: "blue" | "pink" | "yellow" | "indigo";
}) {
    const styles = {
        blue: "bg-blue-100 text-blue-600",
        pink: "bg-pink-100 text-pink-600",
        yellow: "bg-yellow-100 text-yellow-700",
        indigo: "bg-indigo-100 text-indigo-600",
    };

    return (
        <Link
            href={href}
            className="group flex items-center gap-4 rounded-xl px-3 py-3 transition hover:bg-gray-50"
        >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[variant]}`}>
                {icon}
            </div>

            <span className="font-medium text-gray-800 group-hover:underline">
                {title}
            </span>
        </Link>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex items-center justify-center rounded-xl border border-dashed py-8 text-sm text-gray-400">
            {text}
        </div>
    );
}