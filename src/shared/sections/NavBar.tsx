"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { useAuth } from "../AuthContext";
import Dropdown from "../components/DropDown";
import { Care4ULogo } from "../ui/Care4U";
import Badge from "../ui/Badge";

const NavBar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/aboutus", label: "About" },
        { href: "/services", label: "Services" },
        { href: "/contact", label: "Contact" },
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
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                                        isActive
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

                <div className="flex min-w-44 justify-end">
                    {user && (
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
                                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary">
                                    <UserRound size={16} />
                                    Thông tin cá nhân
                                </button>
                                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/7 hover:text-primary">
                                    <Settings size={16} />
                                    Cài đặt tài khoản
                                </button>
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
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
