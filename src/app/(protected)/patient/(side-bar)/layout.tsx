"use client";

import { useAuth } from "@/shared/AuthContext";
import AppSidebar, { SidebarConfig } from "@/shared/sections/SideBar";
import { Calendar, CalendarDays, FileText, LayoutDashboard, LogOut, Pill, UserCircle } from "lucide-react";

const patientConfig: SidebarConfig = {
    role: "patient",
    roleLabel: "Bệnh nhân",
    avatarFallback: "BN",
    ctaHref: "/patient/appointments/create",
    ctaLabel: "Đặt lịch khám ngay",
    ctaIcon: Calendar,
    menu: [
        { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/patient/appointments", label: "Lịch hẹn", icon: CalendarDays },
        { href: "/patient/medical-records", label: "Hồ sơ bệnh án", icon: FileText },
        { href: "/patient/prescriptions", label: "Đơn thuốc", icon: Pill },
        { href: "/patient/profile", label: "Hồ sơ cá nhân", icon: UserCircle },
        { href: "/patient/manage-posts", label: "Quản lý bài viết", icon: FileText },
    ],
    footer: (
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600">
            <LogOut className="size-4" />
            Đăng xuất
        </button>
    ),
};

export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const {user} = useAuth();

    return (
        <div className="w-full bg-background text-foreground">
            <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                    <AppSidebar
                        config={patientConfig}
                        userName={`Pt. ${user?.firstName} ${user?.lastName}` || "Pt. Unknown"}
                        userEmail={user?.email || "Unknown email"}
                    />
                    <main className="min-h-full rounded-2xl border border-primary/15 bg-white/90 p-6 shadow-sm">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}