"use client";

import ActionButton from "@/shared/components/ActionButton";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
    { href: "/patient/dashboard", label: "Dashboard" },
    { href: "/patient/appointments", label: "Lịch hẹn" },
    { href: "/patient/medical-records", label: "Hồ sơ bệnh án" },
    { href: "/patient/prescriptions", label: "Đơn thuốc" },
    { href: "/patient/profile", label: "Hồ sơ cá nhân" },
];

export default function PatientLayout({
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
                            Patient Panel
                        </h1>

                        <nav className="space-y-2">
                            <Link
                                href={"/patient/appointments/create"}
                                className="w-full rounded-xl bg-primary text-white px-4 py-5 text-base font-semibold text-center shadow-md hover:shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mb-4 "
                            >
                                <Calendar/> Đặt lịch khám ngay
                            </Link>


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