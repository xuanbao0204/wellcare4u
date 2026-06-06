"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    BellIcon, ChevronDown, LayoutDashboard, LogOut,
    Settings, User, UserRound, Menu, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "../AuthContext";
import Dropdown from "../components/DropDown";
import { Care4ULogo } from "../ui/Care4U";
import Badge from "../ui/Badge";
import { useRedirectByRole } from "@/features/auth/redirectByRole";
import getNotiTypeIcon from "@/features/notification/component/NotificationIcon";
import { markAsRead } from "@/features/notification/notificationService";
import { useNotifications } from "@/lib/useNotification";
import { NotificationDTO } from "../type";

const links = [
    { href: "/", label: "Trang chủ" },
    { href: "/aboutus", label: "Về chúng tôi" },
    { href: "/services", label: "Dịch vụ" },
    { href: "/contact", label: "Liên hệ" },
    { href: "/forum", label: "Diễn đàn" },
    { href: "/doctors", label: "Đội ngũ bác sĩ" },
];

const NavBar = () => {
    const { user, logout, loading, authReady } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const redirectByRole = useRedirectByRole();

    const isReady = !loading && !!user && authReady;
    const { notifications, setNotifications } = useNotifications(isReady);
    const [openNoti, setOpenNoti] = useState(false);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const notiWrapperRef = useRef<HTMLDivElement>(null);
    const dropdownWrapperRef = useRef<HTMLDivElement>(null);
    const [selectedNoti, setSelectedNoti] = useState<NotificationDTO | null>(null);

    useEffect(() => { setOpenMobileMenu(false); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = openMobileMenu ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [openMobileMenu]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notiWrapperRef.current && !notiWrapperRef.current.contains(e.target as Node)) {
                setOpenNoti(false);
            }

            if (dropdownWrapperRef.current && !dropdownWrapperRef.current.contains(e.target as Node) && !(e.target as Element).closest("[data-hamburger]")) {
                setOpenMobileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) => n.id === notificationId ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error("[NavBar] Failed to mark notification as read", error);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

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

                <div className="flex min-w-44 items-center justify-end gap-3">

                    {/* Bell */}
                    <div className="relative" ref={notiWrapperRef}>
                        <button
                            onClick={() => setOpenNoti((prev) => !prev)}
                            className="relative flex items-center justify-center rounded-full border border-primary/15 bg-white p-2.5 transition hover:border-primary/30 hover:bg-white"
                        >
                            <BellIcon size={18} className="text-foreground/70" />
                            {notifications.length > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow">
                                    {notifications.length <= 9 ? notifications.length : "9+"}
                                </span>
                            )}
                        </button>

                        {openNoti && (
                            <div className="absolute right-0 mt-3 w-88 overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] shadow-[0_22px_55px_-24px_rgba(3,0,43,0.5)] backdrop-blur-xl animate-in fade-in zoom-in-95">
                                <div className="flex items-center justify-between border-b border-primary/10 px-4 py-3.5">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">Thông báo</p>
                                        <p className="mt-0.5 text-xs text-foreground/45">
                                            {notifications.length} total{unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                                        Live
                                    </span>
                                </div>

                                <div className="max-h-100 overflow-y-auto p-2">
                                    {notifications.length === 0 ? (
                                        <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
                                            <p className="text-sm font-medium text-foreground/70">No notifications</p>
                                            <p className="mt-1 text-xs leading-5 text-foreground/45">New updates will appear here.</p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                onClick={() => { if (!n.isRead) void handleMarkAsRead(n.id); setSelectedNoti(n); }}
                                                className={`group rounded-[22px] border px-3 py-3.5 transition ${n.isRead
                                                    ? "border-transparent hover:border-primary/10 hover:bg-primary/3"
                                                    : "cursor-pointer border-primary/10 bg-primary/4 shadow-sm hover:bg-primary/8"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-sm">
                                                        {getNotiTypeIcon(n.type)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                                                                    {!n.isRead && <span className="inline-flex h-2 w-2 rounded-full bg-primary" />}
                                                                </div>
                                                                <p className="mt-1 text-xs text-foreground/45">{new Date(n.createdAt).toLocaleString()}</p>
                                                            </div>
                                                            {!n.isRead && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); void handleMarkAsRead(n.id); }}
                                                                    className="shrink-0 rounded-full border border-primary/15 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/5"
                                                                >
                                                                    Đánh dấu đã đọc
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/60">{n.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="cursor-pointer border-t border-primary/10 bg-white/80 px-4 py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-primary/5">
                                    Xem tất cả
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block">
                        {user ? (
                            <Dropdown
                                trigger={
                                    <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-2 py-1.5 transition-colors hover:border-primary/30 hover:bg-white">
                                        <img src={user.avatar} alt="avatar" className="h-9 w-9 rounded-full border border-primary/15 object-cover" />
                                        <div className="hidden text-left md:block">
                                            <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                                            <p className="text-xs text-foreground/55"><Badge value={user.role} variant="soft" /></p>
                                        </div>
                                        <ChevronDown size={16} className="text-foreground/55" />
                                    </div>
                                }
                                className="w-72 overflow-hidden border-primary/10 bg-white/95 shadow-[0_18px_45px_-20px_rgba(3,0,43,0.5)] backdrop-blur"
                            >
                                <div className="border-b border-primary/10 bg-linear-to-r from-primary/6 to-secondary/8 px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} alt="avatar" className="h-12 w-12 rounded-full border border-primary/20 object-cover" />
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{user.firstName} {user.lastName}</p>
                                            <p className="text-xs font-medium text-foreground/60"><Badge value={user.role} variant="soft" /></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <button
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary"
                                        onClick={() => redirectByRole(user.role)}
                                    >
                                        <LayoutDashboard size={16} />
                                        Trang chủ người dùng
                                    </button>
                                </div>
                                <div className="border-t border-primary/10 p-2">
                                    <a href={`/${user.role.toLowerCase()}/profile`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary">
                                        <UserRound size={16} />Thông tin cá nhân
                                    </a>
                                    <a href={`/${user.role.toLowerCase()}/settings`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary">
                                        <Settings size={16} />Cài đặt tài khoản
                                    </a>
                                </div>
                                <div className="border-t border-primary/10 p-2">
                                    <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                                        <LogOut size={16} />Đăng xuất
                                    </button>
                                </div>
                            </Dropdown>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 rounded-2xl border-2 border-gray-500 border-b-2 border-r-2 px-5 py-2 text-sm font-medium text-foreground/85 transition-colors hover:border-primary/30 hover:bg-white/70 hover:text-primary">
                                <User size={16} />
                                Đăng nhập
                            </Link>
                        )}
                    </div>

                    <button
                        data-hamburger
                        onClick={() => setOpenMobileMenu((prev) => !prev)}
                        className="flex items-center justify-center rounded-full border border-primary/15 bg-white p-2.5 transition hover:border-primary/30 md:hidden"
                        aria-label="Mở menu"
                    >
                        {openMobileMenu ? <X size={18} className="text-foreground/70" /> : <Menu size={18} className="text-foreground/70" />}
                    </button>
                </div>
            </div>

            <div ref={dropdownWrapperRef} className={`mx-auto mt-2 w-full max-w-7xl overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-[0_12px_35px_-24px_rgba(3,0,43,0.55)] backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden ${openMobileMenu ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}>
                {/* Nav links */}
                <div className="p-3">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground/75 hover:bg-primary/5 hover:text-primary"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="border-t border-primary/10 p-3">
                    {user ? (
                        <>
                            <div className="mb-2 flex items-center gap-3 rounded-xl bg-primary/5 px-3 py-2.5">
                                <img src={user.avatar} alt="avatar" className="h-10 w-10 rounded-full border border-primary/15 object-cover" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-foreground/55"><Badge value={user.role} variant="soft" /></p>
                                </div>
                            </div>

                            <button onClick={() => redirectByRole(user.role)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary">
                                <LayoutDashboard size={16} />Trang chủ người dùng
                            </button>
                            <a href={`/${user.role.toLowerCase()}/profile`} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary">
                                <UserRound size={16} />Thông tin cá nhân
                            </a>
                            <a href={`/${user.role.toLowerCase()}/settings`} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary">
                                <Settings size={16} />Cài đặt tài khoản
                            </a>
                            <button onClick={handleLogout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
                                <LogOut size={16} />Đăng xuất
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10">
                            <User size={16} />Đăng nhập
                        </Link>
                    )}
                </div>
            </div>

            {selectedNoti && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="w-full border-b-2 border-primary/10">
                            <h1 className="py-2 text-center text-lg font-bold text-foreground">Thông báo chi tiết</h1>
                        </div>
                        <h2 className="text-lg font-bold text-foreground">{selectedNoti.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/70">{selectedNoti.content}</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setSelectedNoti(null)} className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;

// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import {
//     BellIcon,
//     ChevronDown,
//     LayoutDashboard,
//     LogOut,
//     Settings,
//     User,
//     UserRound,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// import { useAuth } from "../AuthContext";
// import Dropdown from "../components/DropDown";
// import { Care4ULogo } from "../ui/Care4U";
// import Badge from "../ui/Badge";
// import { useRedirectByRole } from "@/features/auth/redirectByRole";
// import getNotiTypeIcon from "@/features/notification/component/NotificationIcon";
// import { markAsRead } from "@/features/notification/notificationService";
// import { useNotifications } from "@/lib/useNotification";
// import { NotificationDTO } from "../type";

// const NavBar = () => {
//     const { user, logout, loading, authReady } = useAuth();
//     const router = useRouter();
//     const pathname = usePathname();
//     const redirectByRole = useRedirectByRole();

//     const isReady = !loading && !!user && authReady;
//     const { notifications, setNotifications } = useNotifications(isReady);
//     const [openNoti, setOpenNoti] = useState(false);
//     const notiWrapperRef = useRef<HTMLDivElement>(null);
//     const [selectedNoti, setSelectedNoti] = useState<NotificationDTO | null>(null);

//     useEffect(() => {
//         const handleClickOutside = (e: MouseEvent) => {
//             if (
//                 notiWrapperRef.current &&
//                 !notiWrapperRef.current.contains(e.target as Node)
//             ) {
//                 setOpenNoti(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const links = [
//         { href: "/", label: "Trang chủ" },
//         { href: "/aboutus", label: "Về chúng tôi" },
//         { href: "/services", label: "Dịch vụ" },
//         { href: "/contact", label: "Liên hệ" },
//         { href: "/forum", label: "Diễn đàn" },
//         { href: "/doctors", label: "Đội ngũ bác sĩ" },
//     ];

//     const handleLogout = () => {
//         logout();
//         router.push("/login");
//     };

//     const handleMarkAsRead = async (notificationId: number) => {
//         try {
//             await markAsRead(notificationId);
//             setNotifications((prev) =>
//                 prev.map((notification) =>
//                     notification.id === notificationId
//                         ? { ...notification, isRead: true }
//                         : notification
//                 )
//             );
//         } catch (error) {
//             console.error("[NavBar] Failed to mark notification as read", error);
//         }
//     };

//     const unreadCount = notifications.filter((notification) => !notification.isRead).length;

//     return (
//         <nav className="absolute top-0 z-50 w-full px-4 py-4">
//             <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-white/60 bg-white/75 px-5 py-3 text-foreground shadow-[0_12px_35px_-24px_rgba(3,0,43,0.55)] backdrop-blur-xl">
//                 <div className="flex min-w-44 justify-start">
//                     <Care4ULogo />
//                 </div>

//                 <div className="hidden flex-1 justify-center md:flex">
//                     <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 p-1">
//                         {links.map((link) => {
//                             const isActive = pathname === link.href;

//                             return (
//                                 <Link
//                                     key={link.href}
//                                     href={link.href}
//                                     className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive
//                                         ? "bg-white text-primary shadow-sm"
//                                         : "text-foreground/75 hover:bg-white/70 hover:text-primary"
//                                         }`}
//                                 >
//                                     {link.label}
//                                 </Link>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-4">
//                     <div className="relative noti-wrapper">
//                         <button
//                             onClick={() => setOpenNoti((prev) => !prev)}
//                             className="relative flex items-center justify-center rounded-full border border-primary/15 bg-white p-2.5 transition hover:border-primary/30 hover:bg-white"
//                         >
//                             <BellIcon size={18} className="text-foreground/70" />

//                             {notifications.length > 0 && (
//                                 <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white shadow">
//                                     {notifications.length <= 9 ? notifications.length : "9+"}
//                                 </span>
//                             )}
//                         </button>

//                         {openNoti && (
//                             <div
//                                 ref={notiWrapperRef}
//                                 className="absolute right-0 mt-3 w-88 overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] shadow-[0_22px_55px_-24px_rgba(3,0,43,0.5)] backdrop-blur-xl animate-in fade-in zoom-in-95"
//                             >
//                                 <div className="flex items-center justify-between border-b border-primary/10 px-4 py-3.5">
//                                     <div>
//                                         <p className="text-sm font-semibold text-foreground">
//                                             Thông báo
//                                         </p>
//                                         <p className="mt-0.5 text-xs text-foreground/45">
//                                             {notifications.length} total
//                                             {unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
//                                         </p>
//                                     </div>
//                                     <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
//                                         Live
//                                     </span>
//                                 </div>

//                                 <div className="max-h-100 overflow-y-auto p-2">
//                                     {notifications.length === 0 ? (
//                                         <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
//                                             <p className="text-sm font-medium text-foreground/70">
//                                                 No notifications
//                                             </p>
//                                             <p className="mt-1 text-xs leading-5 text-foreground/45">
//                                                 New updates will appear here.
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         notifications.map((n) => (
//                                             <div
//                                                 key={n.id}
//                                                 onClick={() => {
//                                                     if (!n.isRead) {
//                                                         void handleMarkAsRead(n.id);
//                                                     }
//                                                     setSelectedNoti(n);
//                                                 }}
//                                                 className={`group rounded-[22px] border px-3 py-3.5 transition ${n.isRead
//                                                     ? "border-transparent hover:border-primary/10 hover:bg-primary/3"
//                                                     : "border-primary/10 bg-primary/4 shadow-sm hover:bg-primary/8 cursor-pointer"
//                                                     }`}
//                                             >
//                                                 <div className="flex items-start gap-3">
//                                                     <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-sm">
//                                                         {getNotiTypeIcon(n.type)}
//                                                     </div>

//                                                     <div className="min-w-0 flex-1">
//                                                         <div className="flex items-start justify-between gap-3">
//                                                             <div className="min-w-0">
//                                                                 <div className="flex items-center gap-2">
//                                                                     <p className="truncate text-sm font-semibold text-foreground">
//                                                                         {n.title}
//                                                                     </p>
//                                                                     {!n.isRead && (
//                                                                         <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
//                                                                     )}
//                                                                 </div>
//                                                                 <p className="mt-1 text-xs text-foreground/45">
//                                                                     {new Date(n.createdAt).toLocaleString()}
//                                                                 </p>
//                                                             </div>

//                                                             {!n.isRead && (
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={(e) => {
//                                                                         e.stopPropagation();
//                                                                         void handleMarkAsRead(n.id);
//                                                                     }}
//                                                                     className="shrink-0 rounded-full border border-primary/15 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition hover:bg-primary/5"
//                                                                 >
//                                                                     Đánh dấu đã đọc
//                                                                 </button>
//                                                             )}
//                                                         </div>

//                                                         <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/60">
//                                                             {n.content}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     )}
//                                 </div>

//                                 <div className="border-t border-primary/10 bg-white/80 px-4 py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-primary/5 cursor-pointer">
//                                     Xem tất cả
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex min-w-44 justify-end">
//                         {user ? (
//                             <Dropdown
//                                 trigger={
//                                     <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-2 py-1.5 transition-colors hover:border-primary/30 hover:bg-white">
//                                         <img
//                                             src={user.avatar}
//                                             alt="avatar"
//                                             className="h-9 w-9 rounded-full border border-primary/15 object-cover"
//                                         />
//                                         <div className="hidden text-left md:block">
//                                             <p className="text-sm font-semibold text-foreground">
//                                                 {user.firstName} {user.lastName}
//                                             </p>
//                                             <p className="text-xs text-foreground/55">
//                                                 <Badge value={user.role} variant="soft"></Badge>
//                                             </p>
//                                         </div>
//                                         <ChevronDown size={16} className="text-foreground/55" />
//                                     </div>
//                                 }
//                                 className="w-72 overflow-hidden border-primary/10 bg-white/95 shadow-[0_18px_45px_-20px_rgba(3,0,43,0.5)] backdrop-blur"
//                             >
//                                 <div className="border-b border-primary/10 bg-linear-to-r from-primary/6 to-secondary/8 px-4 py-4">
//                                     <div className="flex items-center gap-3">
//                                         <img
//                                             src={user.avatar}
//                                             alt="avatar"
//                                             className="h-12 w-12 rounded-full border border-primary/20 object-cover"
//                                         />
//                                         <div>
//                                             <p className="text-sm font-bold text-foreground">
//                                                 {user.firstName} {user.lastName}
//                                             </p>
//                                             <p className="text-xs font-medium text-foreground/60">
//                                                 <Badge value={user.role} variant="soft"></Badge>
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="p-2">
//                                     <button
//                                         className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary"
//                                         onClick={() => redirectByRole(user.role)}
//                                     >
//                                         <LayoutDashboard size={16} />
//                                         Trang chủ người dùng
//                                     </button>
//                                 </div>

//                                 <div className="border-t border-primary/10 p-2">
//                                     <a
//                                         className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary"
//                                         href={`/${user.role.toLowerCase()}/profile`}
//                                     >
//                                         <UserRound size={16} />
//                                         Thông tin cá nhân
//                                     </a>
//                                     <a
//                                         className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary"
//                                         href={`/${user.role.toLowerCase()}/settings`}
//                                     >
//                                         <Settings size={16} />
//                                         Cài đặt tài khoản
//                                     </a>
//                                 </div>

//                                 <div className="border-t border-primary/10 p-2">
//                                     <button
//                                         onClick={handleLogout}
//                                         className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
//                                     >
//                                         <LogOut size={16} />
//                                         Đăng xuất
//                                     </button>
//                                 </div>
//                             </Dropdown>
//                         ) : (
//                             <Link
//                                 href={"/login"}
//                                 className="text-sm font-medium text-foreground/85 transition-colors hover:text-primary "
//                             >
//                                 <div className="flex items-center border-gray-500 border-b-2 border-r-2 rounded-2xl px-5 py-2 gap-2
//                                         hover:border-primary/30 hover:bg-white/70 hover:text-primary transition-colors">
//                                     <User size={16} className="inline-block" />
//                                     <p className="inline-block">Đăng nhập</p>
//                                 </div>
//                             </Link>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             {selectedNoti && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//                     <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
//                         <div className="w-full border-b-2 border-primary/10" >
//                             <h1 className="text-lg font-bold text-foreground text-center py-2">
//                                 Thông báo chi tiết
//                             </h1>
//                         </div>
//                         <h2 className="text-lg font-bold text-foreground">
//                             {selectedNoti.title}
//                         </h2>

//                         <p className="mt-2 text-sm leading-relaxed text-foreground/70">
//                             {selectedNoti.content}
//                         </p>

//                         <div className="mt-4 flex justify-end">
//                             <button
//                                 onClick={() => setSelectedNoti(null)}
//                                 className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
//                             >
//                                 Đóng
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default NavBar;
