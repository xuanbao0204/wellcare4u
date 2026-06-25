"use client";

import { useAuth } from "@/shared/AuthContext";
import AppSidebar, { SidebarConfig } from "@/shared/sections/SideBar";
import { Bell, Calendar, CalendarDays, FileText, LayoutDashboard, LogOut, UserCircle } from "lucide-react";



const doctorConfig: SidebarConfig = {
    role: "doctor",
    roleLabel: "Bác sĩ",
    avatarFallback: "BS",
    menu: [
        { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard},
        { href: "/doctor/appointments", label: "Lịch hẹn", icon: CalendarDays },
        { href: "/doctor/patients", label: "Bệnh nhân", icon: UserCircle },
        { href: "/doctor/schedule", label: "Lịch làm việc", icon: Calendar },
        { href: "/doctor/manage-posts", label: "Quản lý bài viết", icon: FileText },
        {href: "/doctor/notifications", label: "Thông báo", icon: Bell },
        { href: "/doctor/manage-notifications", label: "Quản lý thông báo", icon: Bell },
    ],
    footer: (
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600">
            <LogOut className="size-4" />
            Đăng xuất
        </button>
    ),
};

export default function DoctorLayout({
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
                        config={doctorConfig}
                        userName={`Dr. ${user?.firstName} ${user?.lastName}` || "BS. Unknown"}
                        userEmail={user?.email || "Unknown email"}
                    />

                    <main className="min-h-150 rounded-2xl border border-primary/15 bg-white/90 p-6 shadow-sm">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}