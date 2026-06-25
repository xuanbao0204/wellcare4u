"use client";

import NotificationList from "@/features/notification/component/NotificationList";
import { Sparkles } from "lucide-react";

export default function NotificationManagePage() {
    return (
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.86))] shadow-[0_28px_80px_-46px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="p-6 sm:p-8">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    <Sparkles size={13} />
                    Quản lý thông báo
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Quản lý các thông báo của bạn
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/55">
                    Xem xét các thông báo gần đây
                </p>
            </div>
            <NotificationList />
        </div>

    );
}