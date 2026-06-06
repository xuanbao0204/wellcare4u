"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeInfo,
  Filter,
  History,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { AuditLog, getAuditLogs } from "@/features/admin/adminService";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAuditLogs({ page, size, keyword });
      setLogs(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error("[AuditLogsPage] Failed to fetch audit logs", err);
      setError("Không thể tải danh sách nhật ký.");
    } finally {
      setLoading(false);
    }
  }, [page, size, keyword]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  const metrics = useMemo(() => {
    const uniqueActors = new Set(
      logs.map((log) => `${log.actor.firstName} ${log.actor.lastName}`)
    ).size;
    const uniqueEntities = new Set(logs.map((log) => log.entityType)).size;
    const recentCount = logs.filter((log) => {
      const logTime = new Date(log.timestamp).getTime();
      return Date.now() - logTime <= 24 * 60 * 60 * 1000;
    }).length;

    return {
      uniqueActors,
      uniqueEntities,
      recentCount,
    };
  }, [logs]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(0);
    void fetchLogs();
  };

  const actionTone = (action: string) => {
    const normalized = action.toUpperCase();

    if (
      normalized.includes("DELETE") ||
      normalized.includes("LOCK") ||
      normalized.includes("DISABLE") ||
      normalized.includes("REMOVE")
    ) {
      return "border-rose-200/80 bg-rose-50/90 text-rose-700";
    }

    if (
      normalized.includes("CREATE") ||
      normalized.includes("ADD") ||
      normalized.includes("VERIFY") ||
      normalized.includes("APPROVE")
    ) {
      return "border-emerald-200/80 bg-emerald-50/90 text-emerald-700";
    }

    return "border-primary/15 bg-primary/5 text-primary";
  };

  const entityTone = (entityType: string) => {
    const normalized = entityType.toUpperCase();

    if (normalized.includes("USER") || normalized.includes("ACCOUNT")) {
      return "border-sky-200/80 bg-sky-50/90 text-sky-700";
    }

    if (normalized.includes("POST") || normalized.includes("COMMENT")) {
      return "border-violet-200/80 bg-violet-50/90 text-violet-700";
    }

    if (normalized.includes("APPOINT")) {
      return "border-amber-200/80 bg-amber-50/90 text-amber-700";
    }

    return "border-slate-200 bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.97),rgba(248,250,252,0.88))] shadow-[0_28px_80px_-46px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="border-b border-white/80 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles size={13} />
                Nhật ký quản trị
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Audit Logs
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/55">
                Theo dõi các thay đổi quan trọng của hệ thống, xem ai đã làm gì, trên đối tượng nào và vào thời điểm nào.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard
                label="Tổng nhật ký"
                value={totalElements || logs.length}
                icon={<History size={16} />}
              />
              <MetricCard
                label="Người thao tác"
                value={metrics.uniqueActors}
                icon={<Users size={16} />}
                tone="border-sky-200/70 bg-sky-50/80 text-sky-700"
              />
              <MetricCard
                label="Trong 24 giờ"
                value={metrics.recentCount}
                icon={<Activity size={16} />}
                tone="border-emerald-200/70 bg-emerald-50/80 text-emerald-700"
              />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Danh sách nhật ký
              </h2>
              <p className="mt-1 text-sm text-foreground/50">
                Sử dụng tìm kiếm và bộ lọc để xem nhanh các hoạt động quản trị.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row lg:min-w-[560px]"
            >
              <div className="relative w-full">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm theo hành động, đối tượng hoặc người thao tác..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={size}
                  onChange={(e) => {
                    setPage(0);
                    setSize(Number(e.target.value));
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value={5}>5 / trang</option>
                  <option value={10}>10 / trang</option>
                  <option value={20}>20 / trang</option>
                  <option value={50}>50 / trang</option>
                </select>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  <Filter size={16} />
                  Lọc
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-[24px] border border-slate-200/80 bg-white/80"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-rose-200/80 bg-rose-50/90 p-5 text-sm text-rose-700 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Không tải được nhật ký</p>
                  <p className="mt-1 leading-6">{error}</p>
                </div>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-slate-400">
                <BadgeInfo size={24} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                Chưa có nhật ký phù hợp
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-foreground/50">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc số lượng hiển thị mỗi trang.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-sm">
              <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/40 md:grid">
                <div>Người thao tác</div>
                <div>Hành động</div>
                <div>Đối tượng</div>
                <div>Thời gian</div>
              </div>

              <div className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="grid gap-4 px-5 py-4 transition hover:bg-primary/[0.02] md:grid-cols-[1.5fr_1fr_1fr_1fr] md:items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">
                        {log.actor.firstName} {log.actor.lastName}
                      </p>
                      <p className="mt-1 truncate text-sm text-foreground/50">
                        {log.actor.email}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${actionTone(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${entityTone(log.entityType)}`}
                      >
                        {log.entityType} #{log.entityId}
                      </span>
                    </div>

                    <div className="text-sm text-foreground/60">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>

                    <div className="md:col-span-4">
                      <p className="text-sm leading-6 text-foreground/60">
                        <span className="font-medium text-foreground/75">Chi tiết:</span>{" "}
                        {log.action} trên {log.entityType} #{log.entityId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-foreground/55">
              Trang <span className="font-semibold text-foreground">{page + 1}</span>
              {totalPages > 0 && (
                <>
                  {" "}
                  / <span className="font-semibold text-foreground">{totalPages}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0 || loading}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-foreground/70 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                Trước
              </button>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading || (totalPages > 0 && page + 1 >= totalPages)}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  tone = "border-primary/10 bg-white/80 text-primary",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: string;
}) {
  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${tone}`}>
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/80 shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
            {label}
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}
