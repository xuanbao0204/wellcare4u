"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllPosts } from "@/features/forum/forumService";
import { deletePost } from "@/features/admin/adminService";
import {
    EPostSortType,
    ESpecialization,
    PostSummaryResponse,
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
    Stethoscope,
    FileText,
    Lock,
    Unlock,
    Pin,
    MoreHorizontal,
    AlertTriangle,
} from "lucide-react";

const SORT_OPTIONS: {
    value: EPostSortType;
    label: string;
    description: string;
}[] = [
        {
            value: "NEWEST",
            label: "Mới nhất",
            description: "Hiển thị các chủ đề vừa được đăng.",
        },
        {
            value: "MOST_LIKED",
            label: "Nhiều quan tâm",
            description: "Ưu tiên các bài nhận được nhiều lượt thích.",
        },
        {
            value: "MOST_VIEWED",
            label: "Xem nhiều",
            description: "Các chủ đề đang được đọc nhiều nhất.",
        },
        {
            value: "MOST_COMMENTED",
            label: "Thảo luận sôi nổi",
            description: "Ưu tiên bài có nhiều phản hồi.",
        },
    ];

const PAGE_SIZE = 10;

type TPostStatus = "ACTIVE" | "HIDDEN" | "LOCKED";

type TManagedPost = PostSummaryResponse & {
    status: TPostStatus;
    pinned?: boolean;
    reports?: number;
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

    const [category, setCategory] = useState<
        ESpecialization | undefined
    >();

    const [sort, setSort] =
        useState<EPostSortType>("NEWEST");

    const [actionId, setActionId] =
        useState<number | null>(null);

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

            const managedPosts: TManagedPost[] =
                res.data.content.map((post) => ({
                    ...post,
                    status: "ACTIVE",
                    pinned: false,
                    reports: Math.floor(Math.random() * 5),
                }));

            setPosts(managedPosts);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (e: unknown) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Không thể tải danh sách bài viết."
            );
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

    function handleCategoryChange(cat?: ESpecialization) {
        setCategory(cat);
        setPage(0);
    }

    function handleSortChange(value: EPostSortType) {
        setSort(value);
        setPage(0);
    }

    function updatePost(
        id: number,
        updater: (post: TManagedPost) => TManagedPost
    ) {
        setPosts((prev) =>
            prev.map((p) => (p.id === id ? updater(p) : p))
        );
    }

    async function handleDelete(id: number, title: string) {
        const ok = window.confirm(
            `Xóa bài viết "${title}"?`
        );

        if (!ok) return;

        setActionId(id);

        try {
            await deletePost(id);

            setPosts((prev) =>
                prev.filter((p) => p.id !== id)
            );
        } catch {
            alert("Không thể xoá bài viết.");
        } finally {
            setActionId(null);
        }
    }

    function handleToggleHidden(id: number) {
        updatePost(id, (post) => ({
            ...post,
            status:
                post.status === "HIDDEN"
                    ? "ACTIVE"
                    : "HIDDEN",
        }));
    }

    function handleToggleLocked(id: number) {
        updatePost(id, (post) => ({
            ...post,
            status:
                post.status === "LOCKED"
                    ? "ACTIVE"
                    : "LOCKED",
        }));
    }

    function handleTogglePin(id: number) {
        updatePost(id, (post) => ({
            ...post,
            pinned: !post.pinned,
        }));
    }

    function toggleSelectPost(id: number) {
        setSelectedPosts((prev) =>
            prev.includes(id)
                ? prev.filter((p) => p !== id)
                : [...prev, id]
        );
    }

    function bulkHide() {
        setPosts((prev) =>
            prev.map((p) =>
                selectedPosts.includes(p.id)
                    ? { ...p, status: "HIDDEN" }
                    : p
            )
        );
    }

    function bulkLock() {
        setPosts((prev) =>
            prev.map((p) =>
                selectedPosts.includes(p.id)
                    ? { ...p, status: "LOCKED" }
                    : p
            )
        );
    }

    const totalComments = useMemo(
        () => posts.reduce((s, p) => s + p.commentCount, 0),
        [posts]
    );

    const totalViews = useMemo(
        () => posts.reduce((s, p) => s + p.viewCount, 0),
        [posts]
    );

    const currentSort = SORT_OPTIONS.find(
        (o) => o.value === sort
    );

    const highlightedCategory = category
        ? SPECIALIZATION_LABELS[category]
        : "Tất cả chuyên khoa";

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
                        <StatCard
                            title="Tổng bài viết"
                            value={totalElements}
                        />

                        <StatCard
                            title="Lượt thảo luận"
                            value={totalComments}
                        />

                        <StatCard
                            title="Lượt xem"
                            value={totalViews}
                        />

                        <StatCard
                            title="Đã chọn"
                            value={selectedPosts.length}
                        />
                    </div>
                </div>
            </section>

            {/* Bulk actions */}
            {selectedPosts.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-primary/20 bg-primary/5 p-4">
                    <span className="text-sm font-medium text-primary">
                        Đã chọn {selectedPosts.length} bài viết
                    </span>

                    <button
                        onClick={bulkHide}
                        className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-medium text-white"
                    >
                        Ẩn hàng loạt
                    </button>

                    <button
                        onClick={bulkLock}
                        className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white"
                    >
                        Khóa hàng loạt
                    </button>
                </div>
            )}

            {/* Search */}
            <form
                onSubmit={handleSearch}
                className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-sm"
            >
                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_160px]">

                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30"
                        />

                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) =>
                                setKeyword(e.target.value)
                            }
                            placeholder="Tìm kiếm..."
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none"
                        />
                    </div>

                    <select
                        value={sort}
                        onChange={(e) =>
                            handleSortChange(
                                e.target.value as EPostSortType
                            )
                        }
                        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option
                                key={o.value}
                                value={o.value}
                            >
                                {o.label}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="h-12 rounded-2xl bg-foreground px-5 text-sm font-semibold text-white"
                    >
                        Tìm kiếm
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">

                    <button
                        type="button"
                        onClick={() =>
                            handleCategoryChange(undefined)
                        }
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${!category
                                ? "border-primary/50 bg-primary text-white"
                                : "border-slate-200 bg-white text-foreground/60"
                            }`}
                    >
                        Tất cả
                    </button>

                    {SPECIALIZATION_VALUES.map((spec) => (
                        <button
                            key={spec}
                            type="button"
                            onClick={() =>
                                handleCategoryChange(spec)
                            }
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${category === spec
                                    ? "border-primary/50 bg-primary text-white"
                                    : "border-slate-200 bg-white text-foreground/60"
                                }`}
                        >
                            {SPECIALIZATION_LABELS[spec]}
                        </button>
                    ))}
                </div>

                <p className="mt-3 text-xs text-foreground/40">
                    {currentSort?.description}
                </p>
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
                                        checked={
                                            selectedPosts.length ===
                                            posts.length &&
                                            posts.length > 0
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedPosts(
                                                    posts.map(
                                                        (p) => p.id
                                                    )
                                                );
                                            } else {
                                                setSelectedPosts([]);
                                            }
                                        }}
                                    />
                                </th>

                                <th className="px-5 py-4">
                                    Bài viết
                                </th>

                                <th className="px-5 py-4">
                                    Trạng thái
                                </th>

                                <th className="px-5 py-4">
                                    Reports
                                </th>

                                <th className="px-5 py-4">
                                    Tương tác
                                </th>

                                <th className="px-5 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {!loading &&
                                posts.map((post) => (
                                    <tr
                                        key={post.id}
                                        className="border-b border-slate-100 transition hover:bg-slate-50/50"
                                    >

                                        <td className="px-5 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedPosts.includes(
                                                    post.id
                                                )}
                                                onChange={() =>
                                                    toggleSelectPost(
                                                        post.id
                                                    )
                                                }
                                            />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="max-w-[380px]">

                                                <div className="mb-2 flex flex-wrap items-center gap-2">

                                                    {post.category && (
                                                        <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs text-primary">
                                                            {
                                                                SPECIALIZATION_LABELS[
                                                                post.category
                                                                ]
                                                            }
                                                        </span>
                                                    )}

                                                    {post.pinned && (
                                                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                                                            Ghim
                                                        </span>
                                                    )}

                                                    {post.isVerifiedAnswer && (
                                                        <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700">
                                                            <ShieldCheck size={10} />
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
                                                    {post.title}
                                                </h3>

                                                <p className="mt-1 line-clamp-2 text-xs text-foreground/50">
                                                    {
                                                        post.contentPreview
                                                    }
                                                </p>

                                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-foreground/40">
                                                    <span>
                                                        {post.isAnonymous
                                                            ? "Ẩn danh"
                                                            : post.author
                                                                .displayName}
                                                    </span>

                                                    <span>
                                                        {
                                                            post.createdAt
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                status={
                                                    post.status
                                                }
                                            />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1 text-sm text-red-500">
                                                <AlertTriangle size={14} />
                                                {post.reports}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="space-y-1 text-xs text-foreground/50">
                                                <div className="flex items-center gap-1">
                                                    <Eye size={12} />
                                                    {
                                                        post.viewCount
                                                    }
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp size={12} />
                                                    {post.likes}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <MessageSquare size={12} />
                                                    {
                                                        post.commentCount
                                                    }
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">

                                                <button
                                                    className="rounded-xl border border-slate-200 bg-white p-2 text-foreground/60 hover:bg-slate-50"
                                                >
                                                    <Eye size={15} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleToggleHidden(
                                                            post.id
                                                        )
                                                    }
                                                    className={`rounded-xl p-2 ${post.status ===
                                                            "HIDDEN"
                                                            ? "bg-yellow-500 text-white"
                                                            : "border border-slate-200 bg-white text-foreground/60"
                                                        }`}
                                                >
                                                    {post.status ===
                                                        "HIDDEN" ? (
                                                        <EyeOff size={15} />
                                                    ) : (
                                                        <Eye size={15} />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleToggleLocked(
                                                            post.id
                                                        )
                                                    }
                                                    className={`rounded-xl p-2 ${post.status ===
                                                            "LOCKED"
                                                            ? "bg-red-500 text-white"
                                                            : "border border-slate-200 bg-white text-foreground/60"
                                                        }`}
                                                >
                                                    {post.status ===
                                                        "LOCKED" ? (
                                                        <Lock size={15} />
                                                    ) : (
                                                        <Unlock size={15} />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleTogglePin(
                                                            post.id
                                                        )
                                                    }
                                                    className={`rounded-xl p-2 ${post.pinned
                                                            ? "bg-yellow-500 text-white"
                                                            : "border border-slate-200 bg-white text-foreground/60"
                                                        }`}
                                                >
                                                    <Pin size={15} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            post.id,
                                                            post.title
                                                        )
                                                    }
                                                    disabled={
                                                        actionId ===
                                                        post.id
                                                    }
                                                    className="rounded-xl border border-red-200 bg-white p-2 text-red-500 hover:bg-red-50"
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

                {!loading && posts.length === 0 && (
                    <div className="p-16 text-center">
                        <FileText
                            size={40}
                            className="mx-auto mb-4 text-foreground/20"
                        />

                        <h3 className="text-lg font-semibold">
                            Không có bài viết
                        </h3>

                        <p className="mt-1 text-sm text-foreground/50">
                            Thử tìm kiếm hoặc đổi bộ lọc.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/70 bg-white/70 px-5 py-4 shadow-sm backdrop-blur">

                    <p className="text-sm text-foreground/50">
                        Trang{" "}
                        <span className="font-semibold text-foreground">
                            {page + 1}
                        </span>{" "}
                        / {totalPages}
                    </p>

                    <div className="flex items-center gap-2">

                        <button
                            onClick={() =>
                                setPage((p) =>
                                    Math.max(0, p - 1)
                                )
                            }
                            disabled={page === 0}
                            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
                        >
                            <ChevronLeft size={14} />
                            Trước
                        </button>

                        <button
                            onClick={() =>
                                setPage((p) =>
                                    Math.min(
                                        totalPages - 1,
                                        p + 1
                                    )
                                )
                            }
                            disabled={page >= totalPages - 1}
                            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
                        >
                            Sau
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({
    title,
    value,
}: {
    title: string;
    value: number;
}) {
    return (
        <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                {title}
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
                {value}
            </p>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: TPostStatus;
}) {
    if (status === "ACTIVE") {
        return (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                ACTIVE
            </span>
        );
    }

    if (status === "HIDDEN") {
        return (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                HIDDEN
            </span>
        );
    }

    return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            LOCKED
        </span>
    );
}