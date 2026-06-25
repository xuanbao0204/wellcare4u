"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Bell,
  Clock3,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";

import { NotificationDTO } from "@/shared/type";

import {
  getNotificationsBySender,
  NotificationRequest,
  NotificationTarget,
  sendNotification,
} from "../notificationService";
import TargetFields from "./TargetField";
import api from "@/lib/axios";

interface Props {
  sendEndpoint: string;
  allowedTargets: NotificationTarget[];
  receiverEndpoint: string;
}

function formatNotificationTime(value: string) {
  return new Date(value).toLocaleString();
}

export default function NotificationComposer({ sendEndpoint, allowedTargets, receiverEndpoint }: Props) {
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [form, setForm] = useState<NotificationRequest>({
    target: allowedTargets[0],
    type: "SYSTEM",
    title: "",
    content: "",
  });

  const [receivers, setReceivers] = useState<Record<number, string>>({});
  const [patientsLoading, setPatientsLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setListError(null);
      setListLoading(true);

      const res = await getNotificationsBySender();
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

  useEffect(() => {
    if (form.target !== "IDS") return;

    if (Object.keys(receivers).length > 0) return;

    const loadReceivers = async () => {
      const res = await api.get(receiverEndpoint);
      setReceivers(res.data.data);
    };
    void loadReceivers();
  }, [form.target, receiverEndpoint]);

  const handleSend = async () => {
    try {
      if (!form.title.trim()) {
        alert("Title required");
        return;
      }

      if (!form.content.trim()) {
        alert("Content required");
        return;
      }

      if (form.target === "ROLE" && !form.role) {
        alert("Role required");
        return;
      }

      if (
        form.target === "IDS" &&
        (!form.receiverIds || form.receiverIds.length === 0)
      ) {
        alert("Please select at least one receiver");
        return;
      }

      setLoading(true);

      await sendNotification(form, sendEndpoint);
      await loadNotifications();

      alert("Notification sent");
      setForm({
        target: allowedTargets[0],
        type: "SYSTEM",
        title: "",
        content: "",
      });
    } catch (err) {
      const responseError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      alert(responseError.response?.data?.message || "Send failed");
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.86))] shadow-[0_28px_80px_-46px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="border-b border-white/80 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles size={13} />
              Quản lý thông báo Quản trị viên
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Quản lý và gửi thông báo
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/55">
              Xem xét các thông báo gần đây ở bên trái và soạn một thông điệp có mục tiêu ở bên phải.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-primary/10 bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                Số thông báo đã gửi
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {notifications.length}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700/80">
                Chưa đọc
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-700">
                {unreadCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="border-b border-white/70 bg-slate-50/60 p-6 lg:border-b-0 lg:border-r lg:border-white/70 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Feed thông báo
              </h3>
              <p className="mt-1 text-sm text-foreground/50">
                Các mục mới nhất xuất hiện khi bạn gửi thông báo.
              </p>
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
                Các thông báo gần đây của bạn sẽ hiển thị ở đây sau khi được tạo.
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

        <section className="bg-white/90 p-6 sm:p-8">
          <div className="mb-5">
            <h3 className="text-base font-bold text-foreground">Sender</h3>
            <p className="mt-1 text-sm text-foreground/50">
              Soạn một thông báo được hoàn thiện cho người dùng.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                Người nhận
              </label>
              <select
                value={form.target}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    target: e.target.value as NotificationTarget,
                    role: undefined,
                    receiverIds: [],
                  }))
                }
              >
                {allowedTargets.map((target) => (
                  <option key={target} value={target}>
                    {target}
                  </option>
                ))}
              </select>
            </div>

            <TargetFields form={form}
              setForm={setForm}
              receivers={receivers}
              patientsLoading={patientsLoading} />

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                  Loại thông báo
                </label>
                <select
                  value={form.type}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as NotificationRequest["type"],
                    }))
                  }
                >
                  <option value="SYSTEM">Hệ thống</option>
                  <option value="INFO">Thông tin</option>
                  <option value="WARNING">Cảnh báo</option>
                  <option value="REMIND">Nhắc nhở</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                  Tiêu đề
                </label>
                <input
                  value={form.title}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="Nhập tiêu đề ngắn gọn....Ví dụ: 'Nhắc nhở lịch hẹn ngày mai'"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                  Nội dung
                </label>
                <textarea
                  rows={6}
                  value={form.content}
                  className="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="Nhập nội dung thông báo....Ví dụ: 'Bạn có một cuộc hẹn sắp tới vào ngày mai'"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleSend}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_-18px_rgba(0,10,156,0.7)] transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Gửi thông báo
                </>
              )}
            </button>

            <p className="text-xs leading-5 text-foreground/45">
              Tip: Soạn tiêu đề ngắn gọn và nội dung rõ ràng để đảm bảo người nhận hiểu được thông điệp bạn muốn truyền tải.
            </p>
          </div>
        </section>
      </div >
    </div >
  );
}
