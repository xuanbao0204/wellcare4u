"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BellIcon, ChevronDown, LayoutDashboard, LogOut, Settings, User, UserRound } from "lucide-react";
import { useAuth } from "../AuthContext";
import Dropdown from "../components/DropDown";
import { Care4ULogo } from "../ui/Care4U";
import Badge from "../ui/Badge";
import { useRedirectByRole } from "@/features/auth/redirectByRole";
import { useEffect, useRef, useState } from "react";
import getNotiTypeIcon from "@/features/notification/component/NotificationIcon";
import { useNotifications } from "@/lib/useNotification";

const NavBar = () => {
    const { user, logout, loading, authReady } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const redirectByRole = useRedirectByRole();

    const isReady = !loading && !!user && authReady;
    const { notifications } = useNotifications(isReady);
    const [openNoti, setOpenNoti] = useState(false);
    const notiWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                notiWrapperRef.current &&
                !notiWrapperRef.current.contains(e.target as Node)
            ) {
                setOpenNoti(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    const links = [
        { href: "/", label: "Trang chủ" },
        { href: "/aboutus", label: "Về chúng tôi" },
        { href: "/services", label: "Dịch vụ" },
        { href: "/contact", label: "Liên hệ" },
        { href: "/forum", label: "Diễn đàn"},
    ];

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <nav className="absolute top-0 z-50 w-full px-4 py-4">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/75 px-5 py-3 text-foreground shadow-[0_12px_35px_-24px_rgba(3,0,43,0.55)] backdrop-blur-xl">
                <div className="flex min-w-44 justify-start">
                    <Care4ULogo />
                </div>

                <div className="hidden flex-1 justify-center md:flex">
                    <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 p-1">
                        {links.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-foreground/75 hover:bg-white/70 hover:text-primary"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative noti-wrapper">
                        <button
                            onClick={() => setOpenNoti((prev) => !prev)}
                            className="relative flex items-center justify-center rounded-full border border-primary/15 bg-white p-2.5 transition hover:border-primary/30 hover:bg-white"
                        >
                            <BellIcon size={18} className="text-foreground/70" />

                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white shadow">
                                    {notifications.length <= 9 ? notifications.length : "9+"}
                                </span>
                            )}
                        </button>

                        {openNoti && (
                            <div ref={notiWrapperRef} className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/60 bg-white backdrop-blur-xl shadow-[0_18px_45px_-20px_rgba(3,0,43,0.45)] overflow-hidden animate-in fade-in zoom-in-95">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
                                    <p className="font-semibold text-foreground">
                                        Thông báo
                                    </p>
                                    {notifications.length > 0 && (
                                        <span className="text-primary font-medium">
                                            {notifications.length} mới
                                        </span>
                                    )}
                                </div>

                                <div className="max-h-100 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="p-6 text-foreground/60 text-center">
                                            Không có thông báo
                                        </p>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`px-4 py-3 cursor-pointer transition border-b border-primary/5 last:border-none
                        ${!n.isRead
                                                        ? "bg-primary/5 hover:bg-primary/10"
                                                        : "hover:bg-primary/5"
                                                    }`}
                                            >
                                                <div className="flex gap-4 items-center">
                                                    {getNotiTypeIcon(n.type)}

                                                    <div>
                                                        <p className="text-foreground/40 mt-1">
                                                            {new Date(n.createdAt).toLocaleString()}
                                                        </p>
                                                        <p className="font-medium text-foreground">
                                                            {n.title}
                                                        </p>

                                                        <p className="text-sm text-foreground/60 line-clamp-2 mt-0.5">
                                                            {n.content}
                                                        </p>

                                                    </div>
                                                </div>

                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="text-center text-sm py-2 border-t border-primary/10 text-primary font-medium hover:bg-primary/5 cursor-pointer transition">
                                    Xem tất cả
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex min-w-44 justify-end">
                        {user ? (
                            <Dropdown
                                trigger={
                                    <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-2 py-1.5 transition-colors hover:border-primary/30 hover:bg-white">
                                        <img
                                            src={user.avatar}
                                            alt="avatar"
                                            className="h-9 w-9 rounded-full border border-primary/15 object-cover"
                                        />
                                        <div className="hidden text-left md:block">
                                            <p className="text-sm font-semibold text-foreground">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-xs text-foreground/55"><Badge value={user.role} variant="soft"></Badge></p>
                                        </div>
                                        <ChevronDown size={16} className="text-foreground/55" />
                                    </div>
                                }
                                className="w-72 overflow-hidden border-primary/10 bg-white/95 shadow-[0_18px_45px_-20px_rgba(3,0,43,0.5)] backdrop-blur"
                            >
                                <div className="border-b border-primary/10 bg-linear-to-r from-primary/6 to-secondary/8 px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatar}
                                            alt="avatar"
                                            className="h-12 w-12 rounded-full border border-primary/20 object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-xs font-medium text-foreground/60"><Badge value={user.role} variant="soft"></Badge></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2">
                                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary"
                                        onClick={() => redirectByRole(user.role)}>
                                        <LayoutDashboard size={16} />
                                        Trang chủ người dùng
                                    </button>
                                </div>

                                <div className="border-t border-primary/10 p-2">
                                    <a className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary"
                                        href={`/${user.role.toLowerCase()}/profile`}>
                                        <UserRound size={16} />
                                        Thông tin cá nhân
                                    </a>
                                    <a className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary"
                                        href={`/${user.role.toLowerCase()}/settings`}>
                                        <Settings size={16} />
                                        Cài đặt tài khoản
                                    </a>
                                </div>

                                <div className="border-t border-primary/10 p-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                    >
                                        <LogOut size={16} />
                                        Đăng xuất
                                    </button>
                                </div>
                            </Dropdown>
                        ) : (
                            <Link
                                href={"/login"}
                                className="text-sm font-medium text-foreground/85 transition-colors hover:text-primary "
                            >
                                <div className="flex items-center border-gray-500 border-b-2 border-r-2 rounded-2xl px-5 py-2 gap-2
                                        hover:border-primary/30 hover:bg-white/70 hover:text-primary transition-colors">
                                    <User size={16} className="inline-block" />
                                    <p className="inline-block">Đăng nhập</p>
                                </div>

                            </Link>

                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
