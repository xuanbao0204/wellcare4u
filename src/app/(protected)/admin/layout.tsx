"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedLayout from "@/shared/layouts/ProtectedPage";
import AppSidebar, { SidebarConfig } from "@/shared/sections/SideBar";
import { useAuth } from "@/shared/AuthContext";
import { BellDot, Calendar, CalendarDays, FileText, LayoutDashboard, LogOut, UserCircle } from "lucide-react";

const menu = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/manage-posts", label: "Quản lý bài viết" },
    { href: "/admin/manage-users", label: "Bệnh nhân" },
    { href: "/admin/manage-doctors", label: "Quản lý Bác sĩ" },
    { href: "/admin/manage-notifications", label: "Quản lý thông báo" },
    { href: "/admin/audit-logs", label: "Audit Logs" },
];

const adminConfig: SidebarConfig = {
    role: "admin",
    roleLabel: "Quản trị viên",
    avatarFallback: "Admin",
    ctaHref: "/admin/dashboard",
    ctaLabel: "Đến trang quản trị",
    ctaIcon: Calendar,
    menu: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/manage-posts", label: "Quản lý bài viết", icon: FileText },
        { href: "/admin/manage-users", label: "Quản lý bệnh nhân", icon: UserCircle },
        { href: "/admin/manage-doctors", label: "Quản lý Bác sĩ", icon: UserCircle },
        { href: "/admin/manage-notifications", label: "Quản lý thông báo", icon: BellDot },
        { href: "/admin/audit-logs", label: "Audit Logs", icon: CalendarDays },
    ],
    footer: (
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600">
            <LogOut className="size-4" />
            Đăng xuất
        </button>
    ),
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const {user} = useAuth();

    return (
        <ProtectedLayout allowedRoles={["ADMIN"]}>
            <div className="w-full bg-background text-foreground">
                <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

                        <AppSidebar
                            config={adminConfig}
                            userName={`Admin. ${user?.firstName} ${user?.lastName}` || "Admin. Unknown"}
                            userEmail={user?.email || "Unknown email"}
                        />

                        <main className="min-h-full rounded-2xl border border-primary/15 bg-white/90 p-6 shadow-sm">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}