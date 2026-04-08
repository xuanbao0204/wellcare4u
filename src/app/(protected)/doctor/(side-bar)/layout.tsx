"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
    { href: "/doctor/dashboard", label: "Dashboard" },
    { href: "/doctor/appointments", label: "Lịch hẹn" },
    { href: "/doctor/medical-records", label: "Hồ sơ bệnh án" },
    { href: "/doctor/prescriptions", label: "Đơn thuốc" },
    { href: "/doctor/examination", label: "Khám bệnh" },
    { href: "/doctor/schedule", label: "Lịch làm việc" },
    { href: "/doctor/manage-appointments", label: "Quản lý lịch hẹn" },
    { href: "/doctor/forum", label: "Diễn đàn" },
    { href: "/doctor/profile", label: "Hồ sơ cá nhân" },
];

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="w-full bg-background text-foreground">
            <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

                    <aside className="rounded-2xl border border-primary/15 bg-white/90 p-4 shadow-sm">
                        <h1 className="mb-4 text-lg font-semibold text-primary">
                            Doctor Panel
                        </h1>

                        <nav className="space-y-2">
                            {menu.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    pathname.startsWith(item.href + "/");

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`block w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${isActive
                                                ? "border-primary/30 bg-primary/10 text-primary"
                                                : "border-transparent text-foreground/80 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <main className="min-h-150 rounded-2xl border border-primary/15 bg-white/90 p-6 shadow-sm">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}