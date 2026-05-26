"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedLayout from "@/shared/layouts/ProtectedPage";

const menu = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/manage-posts", label: "Quản lý bài viết" },
    { href: "/admin/manage-users", label: "Bệnh nhân" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <ProtectedLayout allowedRoles={["ADMIN"]}>
            <div className="w-full bg-background text-foreground">
                <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

                        {/* Sidebar */}
                        <aside className="rounded-2xl border border-primary/15 bg-white/90 p-4 shadow-sm">
                            <h1 className="mb-4 text-lg font-semibold text-primary">
                                Admin Panel
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
                                            className={`block w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                                                isActive
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

                        {/* Content */}
                        <main className="min-h-150 rounded-2xl border border-primary/15 bg-white/90 p-6 shadow-sm">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}