"use client";

import Link from "next/link";
import {
    Activity,
    ArrowRight,
    Bell,
    CalendarCheck,
    Clock3,
    FileText,
    Sparkles,
    Stethoscope,
    User,
} from "lucide-react";

const quickActions = [
    {
        title: "Xem lịch hẹn",
        description: "Theo dõi lịch khám trong ngày và xử lý các cuộc hẹn sắp tới.",
        href: "/doctor/appointments",
        icon: <CalendarCheck size={18} />,
        variant: "blue" as const,
    },
    {
        title: "Hồ sơ cá nhân",
        description: "Cập nhật thông tin chuyên môn, liên hệ và thông tin hiển thị.",
        href: "/doctor/profile",
        icon: <User size={18} />,
        variant: "pink" as const,
    },
    {
        title: "Thiết lập lịch làm việc",
        description: "Quản lý lịch trực, ca khám và thời gian sẵn sàng tiếp nhận.",
        href: "/doctor/schedule",
        icon: <Clock3 size={18} />,
        variant: "amber" as const,
    },
];

const overviewCards = [
    {
        title: "Lịch hẹn hôm nay",
        value: "--",
        note: "Cần xác nhận và theo dõi trong ngày",
        href: "/doctor/appointments?today=true",
        icon: <CalendarCheck size={20} />,
        variant: "blue" as const,
    },
    {
        title: "Lịch hẹn tuần này",
        value: "--",
        note: "Cần hoàn tất hoặc bổ sung ghi chú",
        href: "/doctor/medical-records?status=PENDING",
        icon: <FileText size={20} />,
        variant: "pink" as const,
    },
    {
        title: "Thông báo mới",
        value: "--",
        note: "Cập nhật từ hệ thống và bệnh nhân",
        href: "/doctor/notifications",
        icon: <Bell size={20} />,
        variant: "amber" as const,
    },
];

const workflowCards = [
    {
        title: "Bắt đầu ca trực",
        description: "Kiểm tra lịch hẹn, ưu tiên các ca khám sớm và các lưu ý quan trọng.",
        icon: <Clock3 size={18} />,
        accent: "from-sky-500/15 via-white/80 to-white/70",
    },
    {
        title: "Theo dõi bệnh án",
        description: "Rà soát hồ sơ đang mở, kết quả cận lâm sàng và ghi chú điều trị.",
        icon: <Activity size={18} />,
        accent: "from-rose-500/15 via-white/80 to-white/70",
    },
    {
        title: "Chuẩn bị tư vấn",
        description: "Tổng hợp ghi chú để buổi khám tiếp theo diễn ra liền mạch hơn.",
        icon: <Stethoscope size={18} />,
        accent: "from-amber-500/15 via-white/80 to-white/70",
    },
];

export default function DoctorDashboardPage() {
    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[28px] border border-primary/15 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.78))] p-6 shadow-soft backdrop-blur-xl sm:p-7">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                            <Sparkles size={14} />
                            Bảng điều khiển bác sĩ
                        </div>

                        <div className="space-y-3">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                                    Tổng quan làm việc hôm nay
                                </h1>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
                                    Theo dõi lịch hẹn, hồ sơ đang chờ và những việc cần xử lý
                                    trong ngày trong một không gian gọn gàng, rõ ràng và dễ thao tác.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <InfoPill label="Trạng thái" value="Sẵn sàng khám" />
                                <InfoPill label="Ưu tiên" value="Lịch hẹn trong ngày" />
                                <InfoPill label="Nhịp độ" value="Ổn định" />
                            </div>
                        </div>
                    </div>

                    <div className="grid w-full gap-3 sm:grid-cols-3 xl:w-[420px] xl:grid-cols-1">
                        <MiniMetric
                            label="Ca sắp tới"
                            value="--"
                            hint="Theo dõi các ca khám gần nhất"
                        />
                        <MiniMetric
                            label="Hồ sơ cần xử lý"
                            value="--"
                            hint="Cập nhật trước khi kết thúc ca"
                        />
                        <MiniMetric
                            label="Thông báo cần đọc"
                            value="--"
                            hint="Từ hệ thống và khoa phòng"
                        />
                    </div>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                {overviewCards.map((card) => (
                    <OverviewCard key={card.title} {...card} />
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
                <div className="rounded-[28px] border border-primary/15 bg-white/80 p-6 shadow-soft backdrop-blur-md">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-primary">Thao tác nhanh</p>
                            <h2 className="mt-1 text-xl font-semibold text-gray-900">
                                Lối tắt cho công việc thường dùng
                            </h2>
                        </div>

                        <div className="hidden rounded-2xl border border-primary/10 bg-primary/5 px-3 py-2 text-right text-xs text-gray-500 sm:block">
                            <div className="font-medium text-primary">3 tác vụ chính</div>
                            <div>Mở nhanh trong một chạm</div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                        {quickActions.map((action) => (
                            <QuickActionCard key={action.title} {...action} />
                        ))}
                    </div>
                </div>

                <div className="rounded-[28px] border border-primary/15 bg-white/80 p-6 shadow-soft backdrop-blur-md">
                    <div className="mb-5">
                        <p className="text-sm font-medium text-primary">Nhịp làm việc</p>
                        <h2 className="mt-1 text-xl font-semibold text-gray-900">
                            Luồng xử lý hôm nay
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {workflowCards.map((item) => (
                            <WorkflowCard key={item.title} {...item} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
                <DashboardPanel
                    eyebrow="Lịch hẹn hôm nay"
                    title="Chưa có ca khám nào đang chờ"
                    description="Khi có lịch hẹn mới, khu vực này sẽ giúp bạn theo dõi nhanh các ca đến lượt, các cuộc hẹn cần xác nhận và các buổi khám sắp bắt đầu."
                    href="/doctor/appointments"
                    linkLabel="Xem tất cả lịch hẹn"
                    icon={<CalendarCheck size={18} />}
                />

                <DashboardPanel
                    eyebrow="Hồ sơ cần xử lý"
                    title="Không có hồ sơ chờ cập nhật"
                    description="Danh sách này sẽ hiển thị các bệnh án đang mở, đang chờ kết quả hoặc cần bổ sung ghi chú điều trị."
                    href="/doctor/medical-records"
                    linkLabel="Mở danh sách bệnh án"
                    icon={<FileText size={18} />}
                />
            </section>
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
    variant: "blue" | "pink" | "amber";
    href?: string;
}) {
    const styles = {
        blue: {
            icon: "border-blue-200 bg-blue-100 text-blue-600",
            accent: "from-blue-500/12 via-white/88 to-white/78",
            ring: "group-hover:border-blue-200/80",
        },
        pink: {
            icon: "border-pink-200 bg-pink-100 text-pink-600",
            accent: "from-pink-500/12 via-white/88 to-white/78",
            ring: "group-hover:border-pink-200/80",
        },
        amber: {
            icon: "border-amber-200 bg-amber-100 text-amber-700",
            accent: "from-amber-500/14 via-white/88 to-white/78",
            ring: "group-hover:border-amber-200/80",
        },
    };

    const s = styles[variant];

    const content = (
        <div
            className={`group h-full rounded-[26px] border border-primary/12 bg-linear-to-br ${s.accent} p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 ${s.ring}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${s.icon}`}>
                    {icon}
                </div>

                <ArrowRight className="mt-1 h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>

            <div className="mt-8">
                <div className="text-sm text-gray-500">{title}</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                    {value}
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-500">{note}</p>
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
    variant: "blue" | "pink" | "amber" | "indigo";
}) {
    const styles = {
        blue: "border-blue-200 bg-blue-100 text-blue-600",
        pink: "border-pink-200 bg-pink-100 text-pink-600",
        amber: "border-amber-200 bg-amber-100 text-amber-700",
        indigo: "border-indigo-200 bg-indigo-100 text-indigo-600",
    };

    return (
        <Link
            href={href}
            className="group rounded-[24px] border border-primary/10 bg-white/72 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white"
        >
            <div className="flex items-start justify-between gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${styles[variant]}`}>
                    {icon}
                </div>
                <ArrowRight className="mt-1 h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>

            <div className="mt-5">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
            </div>
        </Link>
    );
}

function WorkflowCard({
    title,
    description,
    icon,
    accent,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    accent: string;
}) {
    return (
        <div className={`rounded-[24px] border border-primary/10 bg-linear-to-br ${accent} p-4 shadow-sm`}>
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-primary shadow-sm">
                    {icon}
                </div>

                <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
                </div>
            </div>
        </div>
    );
}

function DashboardPanel({
    eyebrow,
    title,
    description,
    href,
    linkLabel,
    icon,
}: {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
    linkLabel: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-[28px] border border-primary/15 bg-white/80 p-6 shadow-soft backdrop-blur-md">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-primary">{eyebrow}</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{title}</h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary">
                    {icon}
                </div>
            </div>

            <div className="rounded-[24px] border border-dashed border-primary/15 bg-[linear-gradient(180deg,rgba(248,250,252,0.85),rgba(255,255,255,0.7))] p-6">
                <EmptyState text={description} />
            </div>

            <div className="mt-5">
                <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3"
                >
                    {linkLabel}
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}

function InfoPill({ label, value }: { label: string; value: string }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-2 text-sm text-gray-600 shadow-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold text-gray-900">{value}</span>
        </div>
    );
}

function MiniMetric({
    label,
    value,
    hint,
}: {
    label: string;
    value: string;
    hint: string;
}) {
    return (
        <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
            <p className="mt-2 text-xs leading-5 text-gray-500">{hint}</p>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex min-h-32 flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-white/80 text-primary shadow-sm">
                <FileText size={18} />
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-gray-500">{text}</p>
        </div>
    );
}
