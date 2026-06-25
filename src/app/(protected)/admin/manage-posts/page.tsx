"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { deletePost, getAllPosts } from "@/features/admin/adminService";
import {
    CATEGORY_LABELS,
    EForumCategory,
    EPostSortType,
    EPostStatus,
    POST_STATUS_LABELS,
    PostManageResponse,
    SPECIALIZATION_LABELS,
    SPECIALIZATION_VALUES,
} from "@/shared/type";

import {
    Search,
    Trash2,
    Eye,
    EyeOff,
    ThumbsUp,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    RefreshCw,
    FileText,
    Lock,
    Unlock,
    Pin,
    MoreHorizontal,
    AlertTriangle,
    UserCircle,
    Stethoscope,
} from "lucide-react";

const SORT_OPTIONS: {
    value: EPostSortType;
    label: string;
    description: string;
}[] = [
        { value: "NEWEST", label: "Mới nhất", description: "Hiển thị các chủ đề vừa được đăng." },
        { value: "MOST_LIKED", label: "Nhiều quan tâm", description: "Ưu tiên các bài nhận được nhiều lượt thích." },
        { value: "MOST_VIEWED", label: "Xem nhiều", description: "Các chủ đề đang được đọc nhiều nhất." },
        { value: "MOST_COMMENTED", label: "Thảo luận sôi nổi", description: "Ưu tiên bài có nhiều phản hồi." },
    ];

const PAGE_SIZE = 10;

type TManagedPost = PostManageResponse & {
    pinned?: boolean;
};

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<TManagedPost[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [keyword, setKeyword] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<EForumCategory | undefined>();
    const [sort, setSort] = useState<EPostSortType>("NEWEST");

    const [actionId, setActionId] = useState<number | null>(null);
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getAllPosts({
                page,
                size: PAGE_SIZE,
                category,
                keyword: search,
                sort,
            });

            // status đến từ API, chỉ thêm pinned local
            const managed: TManagedPost[] = res.data.content.map((post) => ({
                ...post,
                pinned: false,
            }));

            setPosts(managed);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Không thể tải danh sách bài viết.");
        } finally {
            setLoading(false);
        }
    }, [page, category, search, sort]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setSearch(keyword.trim());
        setPage(0);
    }

    function handleCategoryChange(cat?: EForumCategory) {
        setCategory(cat);
        setPage(0);
    }

    function handleSortChange(value: EPostSortType) {
        setSort(value);
        setPage(0);
    }

    function updatePost(id: number, updater: (post: TManagedPost) => TManagedPost) {
        setPosts((prev) => prev.map((p) => (p.id === id ? updater(p) : p)));
    }

    async function handleDelete(id: number, title: string) {
        if (!window.confirm(`Xóa bài viết "${title}"?`)) return;
        setActionId(id);
        try {
            await deletePost(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            alert("Không thể xoá bài viết.");
        } finally {
            setActionId(null);
        }
    }

    function handleToggleHidden(id: number) {
        updatePost(id, (post) => ({
            ...post,
            status: post.status === EPostStatus.HIDDEN ? EPostStatus.PUBLISHED : EPostStatus.HIDDEN,
        }));
    }

    function handleToggleLocked(id: number) {
        updatePost(id, (post) => ({
            ...post,
            status: post.status === EPostStatus.LOCKED ? EPostStatus.PUBLISHED : EPostStatus.LOCKED,
        }));
    }

    function handleTogglePin(id: number) {
        updatePost(id, (post) => ({ ...post, pinned: !post.pinned }));
    }

    function toggleSelectPost(id: number) {
        setSelectedPosts((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    }

    function bulkHide() {
        setPosts((prev) =>
            prev.map((p) => (selectedPosts.includes(p.id) ? { ...p, status: EPostStatus.HIDDEN } : p))
        );
    }

    function bulkLock() {
        setPosts((prev) =>
            prev.map((p) => (selectedPosts.includes(p.id) ? { ...p, status: EPostStatus.LOCKED } : p))
        );
    }

    const totalComments = useMemo(() => posts.reduce((s, p) => s + p.commentCount, 0), [posts]);
    const totalViews = useMemo(() => posts.reduce((s, p) => s + p.viewCount, 0), [posts]);
    const currentSort = SORT_OPTIONS.find((o) => o.value === sort);

    return (
        <div className="space-y-6">

            {/* Header */}
            <section className="overflow-hidden rounded-[28px] border border-white/60 bg-white/80 shadow-sm backdrop-blur">
                <div className="px-6 py-6 sm:px-8">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                                Quản trị diễn đàn
                            </div>
                            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                                Quản lý bài viết
                            </h1>
                            <p className="mt-1 max-w-2xl text-sm text-foreground/50">
                                Moderation hệ thống forum sức khỏe.
                            </p>
                        </div>
                        <button
                            onClick={fetchPosts}
                            className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-primary/5 transition-colors"
                        >
                            <RefreshCw size={14} />
                            Làm mới
                        </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4">
                        <StatCard title="Tổng bài viết" value={totalElements} />
                        <StatCard title="Lượt thảo luận" value={totalComments} />
                        <StatCard title="Lượt xem" value={totalViews} />
                        <StatCard title="Đã chọn" value={selectedPosts.length} />
                    </div>
                </div>
            </section>

            {/* Bulk actions */}
            {selectedPosts.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <span className="text-sm font-medium text-primary">
                        Đã chọn {selectedPosts.length} bài viết
                    </span>
                    <button onClick={bulkHide} className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-medium text-white">
                        Ẩn hàng loạt
                    </button>
                    <button onClick={bulkLock} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white">
                        Khóa hàng loạt
                    </button>
                </div>
            )}

            {/* Search */}
            <form onSubmit={handleSearch} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_160px]">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none"
                        />
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => handleSortChange(e.target.value as EPostSortType)}
                        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    <button type="submit" className="h-12 rounded-2xl bg-foreground px-5 text-sm font-semibold text-white">
                        Tìm kiếm
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => handleCategoryChange(undefined)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${!category ? "border-primary/50 bg-primary text-white" : "border-slate-200 bg-white text-foreground/60"}`}
                    >
                        Tất cả
                    </button>
                    {SPECIALIZATION_VALUES.map((spec) => (
                        <button
                            key={spec}
                            type="button"
                            onClick={() => handleCategoryChange(spec as unknown as EForumCategory)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${category === (spec as unknown as EForumCategory) ? "border-primary/50 bg-primary text-white" : "border-slate-200 bg-white text-foreground/60"}`}
                        >
                            {SPECIALIZATION_LABELS[spec]}
                        </button>
                    ))}
                </div>

                <p className="mt-3 text-xs text-foreground/40">{currentSort?.description}</p>
            </form>

            {/* Table */}
            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                            <tr className="text-left text-xs uppercase tracking-wider text-foreground/40">
                                <th className="px-5 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedPosts.length === posts.length && posts.length > 0}
                                        onChange={(e) => {
                                            setSelectedPosts(e.target.checked ? posts.map((p) => p.id) : []);
                                        }}
                                    />
                                </th>
                                <th className="px-5 py-4">Bài viết</th>
                                <th className="px-5 py-4">Trạng thái</th>
                                <th className="px-5 py-4">Kiểm duyệt</th>
                                <th className="px-5 py-4">Tương tác</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {!loading && posts.map((post) => (
                                <tr key={post.id} className="border-b border-slate-100 transition hover:bg-slate-50/50">

                                    {/* Checkbox */}
                                    <td className="px-5 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedPosts.includes(post.id)}
                                            onChange={() => toggleSelectPost(post.id)}
                                        />
                                    </td>

                                    {/* Bài viết */}
                                    <td className="px-5 py-4">
                                        <div className="max-w-95">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                {/* Category */}
                                                {post.category && (
                                                    <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs text-primary">
                                                        {CATEGORY_LABELS[post.category]}
                                                    </span>
                                                )}
                                                {/* Specialization */}
                                                {post.relatedSpecialization && (
                                                    <span className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                                                        <Stethoscope size={10} />
                                                        {SPECIALIZATION_LABELS[post.relatedSpecialization]}
                                                    </span>
                                                )}
                                                {post.pinned && (
                                                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                                                        Ghim
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
                                                {post.title}
                                            </h3>

                                            {/* Tags */}
                                            {post.tags.length > 0 && (
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {post.tags.slice(0, 3).map((tag) => (
                                                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                    {post.tags.length > 3 && (
                                                        <span className="text-[10px] text-foreground/40">
                                                            +{post.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-foreground/40">
                                                <span className="flex items-center gap-1">
                                                    <UserCircle size={11} />
                                                    {post.isAnonymous ? "Ẩn danh" : post.author.displayName}
                                                </span>
                                                <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Trạng thái — từ API */}
                                    <td className="px-5 py-4">
                                        <StatusBadge status={post.status} />
                                    </td>

                                    {/* Kết quả kiểm duyệt — thay Reports */}
                                    <td className="px-5 py-4">
                                        {post.moderationResult ? (
                                            <div className="space-y-1">
                                                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${!post.moderationResult.isViolating
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {post.moderationResult.isViolating ? "Cảnh báo" : "An toàn"}
                                                </span>
                                                {post.moderationResult.reason && (
                                                    <p className="line-clamp-2 max-w-40 text-[10px] text-foreground/50">
                                                        {post.moderationResult.reason}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-foreground/30">—</span>
                                        )}
                                    </td>

                                    {/* Tương tác */}
                                    <td className="px-5 py-4">
                                        <div className="space-y-1 text-xs text-foreground/50">
                                            <div className="flex items-center gap-1">
                                                <Eye size={12} />{post.viewCount}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp size={12} />{post.likes}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageSquare size={12} />{post.commentCount}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="rounded-xl border border-slate-200 bg-white p-2 text-foreground/60 hover:bg-slate-50">
                                                <Eye size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleHidden(post.id)}
                                                className={`rounded-xl p-2 ${post.status === "HIDDEN" ? "bg-yellow-500 text-white" : "border border-slate-200 bg-white text-foreground/60"}`}
                                            >
                                                {post.status === "HIDDEN" ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                            <button
                                                onClick={() => handleToggleLocked(post.id)}
                                                className={`rounded-xl p-2 ${post.status === "LOCKED" ? "bg-red-500 text-white" : "border border-slate-200 bg-white text-foreground/60"}`}
                                            >
                                                {post.status === "LOCKED" ? <Lock size={15} /> : <Unlock size={15} />}
                                            </button>
                                            <button
                                                onClick={() => handleTogglePin(post.id)}
                                                className={`rounded-xl p-2 ${post.pinned ? "bg-yellow-500 text-white" : "border border-slate-200 bg-white text-foreground/60"}`}
                                            >
                                                <Pin size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id, post.title)}
                                                disabled={actionId === post.id}
                                                className="rounded-xl border border-red-200 bg-white p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                            <button className="rounded-xl border border-slate-200 bg-white p-2 text-foreground/60 hover:bg-slate-50">
                                                <MoreHorizontal size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="space-y-3 p-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 animate-pulse rounded-2xl border border-slate-200/80 bg-white/80" />
                        ))}
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="p-16 text-center">
                        <FileText size={40} className="mx-auto mb-4 text-foreground/20" />
                        <h3 className="text-lg font-semibold">Không có bài viết</h3>
                        <p className="mt-1 text-sm text-foreground/50">Thử tìm kiếm hoặc đổi bộ lọc.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-5 py-4 shadow-sm backdrop-blur">
                    <p className="text-sm text-foreground/50">
                        Trang <span className="font-semibold text-foreground">{page + 1}</span> / {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-40"
                        >
                            <ChevronLeft size={14} /> Trước
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-40"
                        >
                            Sau <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value }: { title: string; value: number }) {
    return (
        <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; className: string }> = {
        PENDING_REVIEW: {
            label: POST_STATUS_LABELS.PENDING_REVIEW,
            className: "bg-blue-100 text-blue-700",
        },
        PUBLISHED: {
            label: POST_STATUS_LABELS.PUBLISHED,
            className: "bg-green-100 text-green-700",
        },
        HIDDEN: {
            label: POST_STATUS_LABELS.HIDDEN,
            className: "bg-yellow-100 text-yellow-700",
        },
        LOCKED: {
            label: POST_STATUS_LABELS.LOCKED,
            className: "bg-red-100 text-red-700",
        },
        DELETED: {
            label: POST_STATUS_LABELS.DELETED,
            className: "bg-slate-100 text-slate-500",
        },
    };

    const { label, className } = config[status] ?? {
        label: status,
        className: "bg-slate-100 text-slate-500",
    };

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}>
            {label}
        </span>
    );
}