"use client";

import { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    Bell,
    Clock3,
} from "lucide-react";

import { NotificationDTO } from "@/shared/type";
import { getNotifications, getNotificationsBySender } from "@/features/notification/notificationService";

function formatNotificationTime(value: string) {
    return new Date(value).toLocaleString();
}

export default function NotificationList() {
    const [listLoading, setListLoading] = useState(true);
    const [listError, setListError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);

    const loadNotifications = useCallback(async () => {
        try {
            setListError(null);
            setListLoading(true);

            const res = await getNotifications();
            setNotifications(res.data);
        } catch (error) {
            setListError("Could not load the notification list.");
            console.error("[NotificationComposer] Failed to load notifications", error);
        } finally {
            setListLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadNotifications();
    }, [loadNotifications]);

    if (listLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-28 animate-pulse rounded-3xl border border-slate-200/80 bg-white/80"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.86))] shadow-[0_28px_80px_-46px_rgba(15,23,42,0.45)] backdrop-blur-xl">

            <section className="border-b border-white/70 bg-slate-50/60 p-6 lg:border-b-0 lg:border-r lg:border-white/70 sm:p-8">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-bold text-foreground">
                            Thông báo đã nhận
                        </h3>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                        <Bell size={14} />
                        {notifications.length} mục
                    </span>
                </div>

                {listLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-28 animate-pulse rounded-3xl border border-slate-200/80 bg-white/80"
                            />
                        ))}
                    </div>
                ) : listError ? (
                    <div className="rounded-3xl border border-rose-200/80 bg-rose-50/90 p-5 text-sm text-rose-700 shadow-sm">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold">
                                    Không thể tải thông báo
                                </p>
                                <p className="mt-1 leading-6">{listError}</p>
                            </div>
                        </div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-slate-400">
                            <Bell size={22} />
                        </div>
                        <h4 className="mt-4 text-base font-semibold text-foreground">
                            Chưa có thông báo nào
                        </h4>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-foreground/50">
                            Các thông báo gần đây của bạn sẽ hiển thị ở đây.
                        </p>
                    </div>
                ) : (
                    <div className="max-h-190 space-y-3 overflow-y-auto pr-1">
                        {notifications.map((notification) => (
                            <article
                                key={notification.id}
                                className={`rounded-[26px] border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${notification.isRead
                                    ? "border-slate-200/80 bg-white/85"
                                    : "border-primary/15 bg-primary/3"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="truncate text-sm font-bold text-foreground">
                                                {notification.title}
                                            </h4>
                                            {!notification.isRead && (
                                                <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                                                    Mới
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/60">
                                            {notification.content}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                        {notification.type}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-foreground/45">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock3 size={13} />
                                        {formatNotificationTime(notification.createdAt)}
                                    </span>
                                    {notification.referenceId !== null && (
                                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-500">
                                            Ref #{notification.referenceId}
                                        </span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>

    );
}