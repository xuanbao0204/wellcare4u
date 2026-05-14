"use client";

import { useEffect, useState, useCallback } from "react";
import {
    getAccounts,
    activeAccount,
    lockAccount,
    deleteAccount,
    verifyDoctor,
    unverifyDoctor,
    AdminAccountDTO,
} from "@/features/admin/adminService";
import { PageResponse } from "@/shared/type";
import {
    Search,
    CheckCircle,
    Lock,
    Trash2,
    ShieldCheck,
    ShieldOff,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
} from "lucide-react";

const roleLabel: Record<string, string> = {
    ADMIN: "Quản trị viên",
    DOCTOR: "Bác sĩ",
    PATIENT: "Bệnh nhân",
    STAFF: "Nhân viên",
};

const roleColor: Record<string, string> = {
    ADMIN: "bg-purple-50 text-purple-700",
    DOCTOR: "bg-teal-50 text-teal-700",
    PATIENT: "bg-blue-50 text-blue-700",
    STAFF: "bg-amber-50 text-amber-700",
};

const statusColor: Record<string, string> = {
    ACTIVE: "bg-green-50 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
    LOCKED: "bg-red-50 text-red-700",
    DELETED: "bg-red-100 text-red-900",
};

const statusLabel: Record<string, string> = {
    ACTIVE: "Hoạt động",
    INACTIVE: "Chưa kích hoạt",
    LOCKED: "Đã khoá",
    DELETED: "Đã xoá",
};

export default function AdminUsersPage() {
    const [data, setData] = useState<PageResponse<AdminAccountDTO> | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const size = 10;

    const fetchData = useCallback(() => {
        setLoading(true);
        getAccounts({ role: role || undefined, status: status || undefined, keyword: keyword || undefined, page, size })
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [role, status, keyword, page]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handle = async (fn: () => Promise<unknown>, id: number) => {
        setActionLoading(id);
        try { await fn(); await fetchData(); } catch { alert("Thao tác thất bại."); } finally { setActionLoading(null); }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Quản lý người dùng</h1>
                <p className="mt-1 text-sm text-foreground/50">
                    Xem, kích hoạt, khoá, xoá tài khoản và xác minh bác sĩ
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-50">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                    <input
                        className="w-full rounded-xl border border-primary/20 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-primary/50"
                        placeholder="Tìm theo tên, email..."
                        value={keyword}
                        onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
                    />
                </div>

                <select
                    className="rounded-xl border border-primary/20 bg-white px-3 py-2 text-sm outline-none"
                    value={role}
                    onChange={(e) => { setRole(e.target.value); setPage(0); }}
                >
                    <option value="">Tất cả vai trò</option>
                    <option value="ADMIN">Quản trị viên</option>
                    <option value="DOCTOR">Bác sĩ</option>
                    <option value="PATIENT">Bệnh nhân</option>
                </select>

                <select
                    className="rounded-xl border border-primary/20 bg-white px-3 py-2 text-sm outline-none"
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(0); }}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Chưa kích hoạt</option>
                    <option value="LOCKED">Đã khoá</option>
                </select>

                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-2 text-sm font-medium hover:bg-primary/5"
                >
                    <RefreshCw size={14} /> Làm mới
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-primary/10">
                <table className="w-full text-sm">
                    <thead className="bg-primary/5 text-left text-xs uppercase tracking-wide text-foreground/50">
                        <tr>
                            <th className="px-4 py-3">Người dùng</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Vai trò</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3">Đăng nhập lần cuối</th>
                            <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="py-10 text-center text-foreground/40">Đang tải...</td>
                            </tr>
                        ) : !data || data.content.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-10 text-center text-foreground/40">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            data.content.map((acc) => (
                                <tr key={acc.id} className="hover:bg-primary/2 transition-colors">
                                    {/* Name + avatar */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {acc.avatar ? (
                                                <img src={acc.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                    {(acc.firstName?.[0] ?? "") + (acc.lastName?.[0] ?? "")}
                                                </div>
                                            )}
                                            <span className="font-medium">
                                                {acc.firstName} {acc.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-foreground/70">{acc.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColor[acc.role] ?? "bg-gray-100"}`}>
                                            {roleLabel[acc.role] ?? acc.role}
                                        </span>
                                        {acc.role === "DOCTOR" && acc.verified !== undefined && (
                                            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${acc.verified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                                                {acc.verified ? "✓ Đã xác minh" : "Chờ duyệt"}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[acc.status] ?? "bg-gray-100"}`}>
                                            {statusLabel[acc.status] ?? acc.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-foreground/50 text-xs">{acc.lastLoginAt ?? "—"}</td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            {acc.status !== "ACTIVE" && acc.status !== "DELETED" && (
                                                <ActionBtn
                                                    title="Kích hoạt"
                                                    icon={<CheckCircle size={14} />}
                                                    color="text-green-600 hover:bg-green-50"
                                                    loading={actionLoading === acc.id}
                                                    onClick={() => handle(() => activeAccount(acc.id), acc.id)}
                                                />
                                            )}
                                            {acc.status === "ACTIVE" && (
                                                <ActionBtn
                                                    title="Khoá"
                                                    icon={<Lock size={14} />}
                                                    color="text-amber-600 hover:bg-amber-50"
                                                    loading={actionLoading === acc.id}
                                                    onClick={() => handle(() => lockAccount(acc.id), acc.id)}
                                                />
                                            )}
                                            {acc.role === "DOCTOR" && !acc.verified && (
                                                <ActionBtn
                                                    title="Xác minh bác sĩ"
                                                    icon={<ShieldCheck size={14} />}
                                                    color="text-teal-600 hover:bg-teal-50"
                                                    loading={actionLoading === acc.id}
                                                    onClick={() => handle(() => verifyDoctor(acc.id), acc.id)}
                                                />
                                            )}
                                            {acc.role === "DOCTOR" && acc.verified && (
                                                <ActionBtn
                                                    title="Hủy xác minh"
                                                    icon={<ShieldOff size={14} />}
                                                    color="text-orange-500 hover:bg-orange-50"
                                                    loading={actionLoading === acc.id}
                                                    onClick={() => handle(() => unverifyDoctor(acc.id), acc.id)}
                                                />
                                            )}
                                            {acc.status !== "DELETED" && (
                                                <ActionBtn
                                                    title="Xoá"
                                                    icon={<Trash2 size={14} />}
                                                    color="text-red-500 hover:bg-red-50"
                                                    loading={actionLoading === acc.id}
                                                    onClick={() => {
                                                        if (confirm(`Xoá tài khoản ${acc.email}?`))
                                                            handle(() => deleteAccount(acc.id), acc.id);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <p className="text-foreground/50">
                        Trang {page + 1} / {data.totalPages} · {data.totalElements} kết quả
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="flex items-center gap-1 rounded-xl border border-primary/20 px-3 py-1.5 disabled:opacity-40 hover:bg-primary/5"
                        >
                            <ChevronLeft size={14} /> Trước
                        </button>
                        <button
                            disabled={data.last}
                            onClick={() => setPage(p => p + 1)}
                            className="flex items-center gap-1 rounded-xl border border-primary/20 px-3 py-1.5 disabled:opacity-40 hover:bg-primary/5"
                        >
                            Sau <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ActionBtn({
    title,
    icon,
    color,
    onClick,
    loading,
}: {
    title: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
    loading: boolean;
}) {
    return (
        <button
            title={title}
            onClick={onClick}
            disabled={loading}
            className={`flex items-center gap-1 rounded-lg p-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${color}`}
        >
            {icon}
            <span className="hidden sm:inline">{title}</span>
        </button>
    );
}