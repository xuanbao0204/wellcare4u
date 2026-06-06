"use client";

import { X, Menu, ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";

export interface SidebarMenuItem {
    href: string;
    label: string;
    icon?: LucideIcon;
    badge?: string | number;
}

export interface SidebarConfig {
    role: string;
    roleLabel: string;
    avatarFallback?: string;
    accentColor?: string;
    menu: SidebarMenuItem[];
    ctaHref?: string;
    ctaLabel?: string;
    ctaIcon?: LucideIcon;
    footer?: ReactNode;
}

interface AppSidebarProps {
    config: SidebarConfig;
    userName?: string;
    userEmail?: string;
    avatarUrl?: string;
}

function NavItem({
    item,
    isActive,
    onClick,
}: {
    item: SidebarMenuItem;
    isActive: boolean;
    onClick?: () => void;
}) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
        >
            {isActive && (
                <span className="absolute inset-y-2 left-0 w-0.5 -translate-x-3 rounded-full bg-white/60" />
            )}

            {Icon && (
                <Icon
                    className={`size-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary"
                        }`}
                />
            )}

            <span className="flex-1 truncate">{item.label}</span>

            {item.badge !== undefined && (
                <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive
                            ? "bg-white/20 text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                >
                    {item.badge}
                </span>
            )}

            {!isActive && (
                <ChevronRight className="size-3.5 shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
        </Link>
    );
}

function SidebarContent({
    config,
    userName,
    userEmail,
    avatarUrl,
    onClose,
}: AppSidebarProps & { onClose?: () => void }) {
    const pathname = usePathname();
    const CtaIcon = config.ctaIcon;

    return (
        <div className="flex h-full flex-col">

            <div className="border-b border-slate-100 pb-4">
                <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                        {config.roleLabel}
                    </span>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 lg:hidden"
                            aria-label="Đóng menu"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>
                {(userName || userEmail) && (
                    <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={userName}
                                    className="size-10 rounded-xl object-cover ring-2 ring-primary/20"
                                />
                            ) : (
                                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary ring-2 ring-primary/20">
                                    {config.avatarFallback ??
                                        userName?.slice(0, 2).toUpperCase() ??
                                        "U"}
                                </div>
                            )}
                            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-400" />
                        </div>

                        <div className="min-w-0 flex-1">
                            {userName && (
                                <p className="truncate text-sm font-semibold text-slate-800">
                                    {userName}
                                </p>
                            )}
                            {userEmail && (
                                <p className="truncate text-[11px] text-slate-400">
                                    {userEmail}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {config.ctaHref && config.ctaLabel && (
                <Link
                    href={config.ctaHref}
                    onClick={onClose}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition-all hover:brightness-105 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]"
                >
                    {CtaIcon && <CtaIcon className="size-4" />}
                    {config.ctaLabel}
                </Link>
            )}

            <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto">
                {config.menu.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                    return (
                        <NavItem
                            key={item.href}
                            item={item}
                            isActive={isActive}
                            onClick={onClose}
                        />
                    );
                })}
            </nav>

            {config.footer && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                    {config.footer}
                </div>
            )}
        </div>
    );
}

export default function AppSidebar(props: AppSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => { setIsOpen(false); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            <aside className="sticky top-6 hidden h-fit rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm lg:block">
                <SidebarContent {...props} />
            </aside>

            <button
                onClick={() => setIsOpen(true)}
                className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 rounded-r-2xl bg-primary px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/40 transition-all hover:brightness-105 active:scale-95 lg:hidden ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                aria-label="Mở menu"
            >
                <Menu className="size-4" />
            </button>

            <div
                className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsOpen(false)}
            />
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-slate-100 bg-white p-5 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent {...props} onClose={() => setIsOpen(false)} />
            </aside>
        </>
    );
}