"use client";

import { CreatePostModal } from "@/features/forum/components/CreatePostModal";
import { ForumSidebar } from "@/features/forum/components/ForumSideBar";
import { PostCard } from "@/features/forum/components/PostCard";
import { PostSkeleton } from "@/features/forum/components/PostSkeleton";
import { createPost, getAllPosts } from "@/features/forum/forumService";
import { useAuth } from "@/shared/AuthContext";
import {
    CATEGORY_LABELS,
    CreatePostRequest,
    EForumCategory,
    EPostSortType,
    ESpecialization,
    PostSummaryResponse,
    SPECIALIZATION_LABELS,
    SPECIALIZATION_VALUES,
} from "@/shared/type";
import { useCallback, useEffect, useMemo, useState } from "react";

const SORT_OPTIONS: { value: EPostSortType; label: string; description: string }[] = [
    { value: "NEWEST", label: "Mới nhất", description: "Hiển thị các chủ đề vừa được đăng." },
    { value: "MOST_LIKED", label: "Nhiều quan tâm", description: "Ưu tiên các bài nhận được nhiều lượt thích." },
    { value: "MOST_VIEWED", label: "Xem nhiều", description: "Các chủ đề đang được đọc nhiều nhất." },
    { value: "MOST_COMMENTED", label: "Thảo luận sôi nổi", description: "Ưu tiên bài có nhiều phản hồi." },
];

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS) as [EForumCategory, string][];

const PAGE_SIZE = 10;

export default function ForumPage() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [posts, setPosts] = useState<PostSummaryResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter state — tách riêng category (EForumCategory) và specialization (ESpecialization)
    const [keyword, setKeyword] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<EForumCategory | undefined>();
    const [specialization, setSpecialization] = useState<ESpecialization | undefined>();
    const [sort, setSort] = useState<EPostSortType>("NEWEST");
    const [showModal, setShowModal] = useState(false);

    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        if (user) {
            setIsAdmin(user.role === "ADMIN");
        }
    }, [user]);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getAllPosts({
                page,
                size: PAGE_SIZE,
                category,
                relatedSpecialization: specialization,
                keyword: search,
                sort,
            });
            setPosts(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Không thể tải danh sách bài viết.");
        } finally {
            setLoading(false);
        }
    }, [page, category, specialization, search, sort]);

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

    function handleSpecializationChange(spec?: ESpecialization) {
        setSpecialization(spec);
        setPage(0);
    }

    function handleSortChange(value: EPostSortType) {
        setSort(value);
        setPage(0);
    }

    function handleClearFilters() {
        setSearch("");
        setKeyword("");
        setCategory(undefined);
        setSpecialization(undefined);
        setSort("NEWEST");
        setPage(0);
    }

    async function handleCreatePost(data: CreatePostRequest) {
        try {
            setIsPosting(true);
            await createPost(data);
            handleClearFilters();

        } catch { }
        finally {
            setIsPosting(false);
            fetchPosts();
        }
    }

    const totalComments = useMemo(
        () => posts.reduce((sum, post) => sum + post.commentCount, 0),
        [posts],
    );
    const totalViews = useMemo(
        () => posts.reduce((sum, post) => sum + post.viewCount, 0),
        [posts],
    );

    const activeFilterCount = [category, specialization, search].filter(Boolean).length;
    const currentSort = SORT_OPTIONS.find((option) => option.value === sort);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(13,148,136,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_22%),linear-gradient(180deg,#f7fbfc_0%,#f3f7fb_48%,#eef4f8_100%)]">
            <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,rgba(255,255,255,0.6),rgba(255,255,255,0))]" />

            <div className="relative px-4 py-6 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">

                {/* ── Hero + Search ── */}
                <section className="overflow-hidden rounded-[30px] border border-white/60 bg-white/70 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.32)] backdrop-blur-xl">
                    <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 xl:grid-cols-[minmax(0,1.45fr)_360px] xl:px-10">

                        {/* Left column */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="max-w-3xl">
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                                        Diễn đàn sức khỏe WellCare4u
                                    </div>
                                    <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                                        Không gian hỏi đáp y khoa chuyên nghiệp, rõ ràng và đáng tin cậy.
                                    </h1>
                                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                                        Đặt câu hỏi, chia sẻ trải nghiệm điều trị và nhận phản hồi từ cộng đồng cùng đội ngũ bác sĩ đã xác thực.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-teal-500/20 bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(13,148,136,0.7)] transition-all hover:-translate-y-0.5 hover:bg-teal-700"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tạo chủ đề mới
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Chủ đề hiện có</p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-900">{totalElements}</p>
                                    <p className="mt-1 text-sm text-slate-500">Các bài hỏi đáp đang được công khai.</p>
                                </div>
                                <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Lượt thảo luận</p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-900">{totalComments}</p>
                                    <p className="mt-1 text-sm text-slate-500">Tổng phản hồi trong trang hiện tại.</p>
                                </div>
                                <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Lượt quan tâm</p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-900">{totalViews}</p>
                                    <p className="mt-1 text-sm text-slate-500">Tổng lượt xem các chủ đề đang hiển thị.</p>
                                </div>
                            </div>

                            {/* Search + filters */}
                            <form onSubmit={handleSearch} className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                                {/* Row 1: keyword + sort + submit */}
                                <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_200px_160px]">
                                    <div className="relative">
                                        <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35m1.35-5.15a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            placeholder="Tìm theo triệu chứng, chủ đề, từ khóa..."
                                            className="h-12 w-full rounded-2xl border border-slate-200/80 bg-white/90 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                        />
                                    </div>
                                    <select
                                        value={sort}
                                        onChange={(e) => handleSortChange(e.target.value as EPostSortType)}
                                        className="h-12 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                    >
                                        {SORT_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="submit"
                                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-900/5 bg-slate-900 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(15,23,42,0.8)] transition hover:bg-slate-800"
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>

                                {/* Row 2: category + specialization dropdowns */}
                                {/* <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <select
                                        value={category ?? ""}
                                        onChange={(e) => handleCategoryChange(e.target.value ? e.target.value as EForumCategory : undefined)}
                                        className="h-11 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                    >
                                        <option value="">Tất cả loại bài</option>
                                        {CATEGORY_OPTIONS.map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={specialization ?? ""}
                                        onChange={(e) => handleSpecializationChange(e.target.value ? e.target.value as ESpecialization : undefined)}
                                        className="h-11 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                    >
                                        <option value="">Tất cả chuyên khoa</option>
                                        {SPECIALIZATION_VALUES.map((spec) => (
                                            <option key={spec} value={spec}>{SPECIALIZATION_LABELS[spec]}</option>
                                        ))}
                                    </select>
                                </div> */}

                                {/* Row 3: active filter chips */}
                                <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Đang lọc</span>

                                        {category && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                {CATEGORY_LABELS[category]}
                                                <button type="button" onClick={() => handleCategoryChange(undefined)} className="text-blue-400 transition hover:text-blue-700">×</button>
                                            </span>
                                        )}

                                        {specialization && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                                                {SPECIALIZATION_LABELS[specialization]}
                                                <button type="button" onClick={() => handleSpecializationChange(undefined)} className="text-teal-400 transition hover:text-teal-700">×</button>
                                            </span>
                                        )}

                                        {search && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                                                &quot;{search}&quot;
                                                <button type="button" onClick={() => { setSearch(""); setKeyword(""); setPage(0); }} className="text-slate-400 transition hover:text-slate-700">×</button>
                                            </span>
                                        )}

                                        {!category && !specialization && !search && (
                                            <span className="text-xs text-slate-400">Không có bộ lọc nào đang áp dụng.</span>
                                        )}

                                        {activeFilterCount > 0 && (
                                            <button type="button" onClick={handleClearFilters} className="text-xs font-medium text-slate-500 underline underline-offset-2 transition hover:text-slate-800">
                                                Xóa tất cả
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500">{currentSort?.description}</p>
                                </div>
                            </form>
                        </div>

                        {/* Right column */}
                        <div className="grid gap-4 self-start">
                            {/* Category quick-filter */}
                            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Loại bài viết</p>
                                        <h2 className="mt-1 text-lg font-semibold text-slate-900">Danh mục nhanh</h2>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{CATEGORY_OPTIONS.length} danh mục</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleCategoryChange(undefined)}
                                        className={`rounded-full border px-3 py-2 text-xs font-medium transition ${!category ? "border-teal-500 bg-teal-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                                    >
                                        Tất cả
                                    </button>
                                    {CATEGORY_OPTIONS.map(([value, label]) => (
                                        <button
                                            key={value}
                                            onClick={() => handleCategoryChange(value)}
                                            className={`rounded-full border px-3 py-2 text-xs font-medium transition ${category === value ? "border-teal-500 bg-teal-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Specialization quick-filter */}
                            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Khám phá nhanh</p>
                                        <h2 className="mt-1 text-lg font-semibold text-slate-900">Chuyên khoa nổi bật</h2>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{SPECIALIZATION_VALUES.length} chuyên khoa</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleSpecializationChange(undefined)}
                                        className={`rounded-full border px-3 py-2 text-xs font-medium transition ${!specialization ? "border-teal-500 bg-teal-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                                    >
                                        Tất cả chuyên khoa
                                    </button>
                                    {SPECIALIZATION_VALUES.slice(0, 8).map((spec) => (
                                        <button
                                            key={spec}
                                            onClick={() => handleSpecializationChange(spec)}
                                            className={`rounded-full border px-3 py-2 text-xs font-medium transition ${specialization === spec ? "border-teal-500 bg-teal-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                                        >
                                            {SPECIALIZATION_LABELS[spec]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Post list ── */}
                <section className="mt-6 grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
                    <div className="hidden xl:block">
                        <div className="sticky top-6">
                            <ForumSidebar
                                activeCategory={specialization}
                                onCategoryChange={handleSpecializationChange}
                            />
                        </div>
                    </div>

                    <div className="min-w-0 space-y-5">
                        {/* List header */}
                        <div className="rounded-[28px] border border-white/70 bg-white/75 px-5 py-4 shadow-sm backdrop-blur">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bảng thảo luận</p>
                                    <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                        {loading ? "Đang tải chủ đề..." : `${totalElements} chủ đề đang hiển thị`}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">Xem, theo dõi và tham gia các cuộc trao đổi theo từng chuyên khoa.</p>
                                </div>

                                {/* Horizontal specialization scroll filter */}
                                {/* <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                                    <button
                                        onClick={() => handleSpecializationChange(undefined)}
                                        className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition ${!specialization ? "border-teal-500 bg-teal-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                                    >
                                        Tất cả
                                    </button>
                                    {SPECIALIZATION_VALUES.slice(0, 10).map((spec) => (
                                        <button
                                            key={spec}
                                            onClick={() => handleSpecializationChange(spec)}
                                            className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition ${specialization === spec ? "border-teal-500 bg-teal-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                                        >
                                            {SPECIALIZATION_LABELS[spec]}
                                        </button>
                                    ))}
                                </div> */}
                            </div>
                        </div>

                        {/* Skeleton */}
                        {loading && (
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="animate-pulse rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur">
                                        <div className="mb-4 flex gap-2">
                                            <div className="h-7 w-24 rounded-full bg-slate-200" />
                                            <div className="h-7 w-28 rounded-full bg-slate-200" />
                                        </div>
                                        <div className="mb-3 h-7 w-3/4 rounded-2xl bg-slate-200" />
                                        <div className="mb-2 h-4 w-full rounded-full bg-slate-200" />
                                        <div className="mb-5 h-4 w-5/6 rounded-full bg-slate-200" />
                                        <div className="grid gap-3 md:grid-cols-[1fr_280px]">
                                            <div className="h-10 rounded-2xl bg-slate-200" />
                                            <div className="h-10 rounded-2xl bg-slate-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error */}
                        {error && !loading && (
                            <div className="rounded-[28px] border border-red-200 bg-red-50/90 p-8 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-red-800">Không thể tải diễn đàn</h3>
                                <p className="mt-2 text-sm text-red-700">{error}</p>
                                <button onClick={fetchPosts} className="mt-5 inline-flex rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700">Tải lại</button>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && !error && posts.length === 0 && (
                            <div className="rounded-[28px] border border-white/70 bg-white/80 p-12 text-center shadow-sm backdrop-blur">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-slate-400 shadow-sm">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12h6m-6 4h3m-7 4h14a2 2 0 002-2V8l-6-4H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="mt-5 text-xl font-semibold text-slate-900">Chưa có chủ đề phù hợp</h3>
                                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                                    Hãy thử đổi từ khóa, chọn danh mục khác hoặc tạo một chủ đề mới để bắt đầu cuộc thảo luận.
                                </p>
                                <button onClick={() => setShowModal(true)} className="mt-6 inline-flex rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
                                    Đăng câu hỏi đầu tiên
                                </button>
                            </div>
                        )}

                        {/* Posts */}

                        {isPosting && (
                            <div className="space-y-4">
                                <PostSkeleton />
                            </div>
                        )}

                        {!loading && !error && posts.length > 0 && (
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <PostCard key={post.id} post={post} isAdmin={isAdmin} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-white/70 bg-white/70 px-4 py-4 shadow-sm backdrop-blur">
                                <button
                                    onClick={() => setPage((v) => Math.max(0, v - 1))}
                                    disabled={page === 0}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Trang trước
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                                    const start = Math.max(0, Math.min(page - 2, totalPages - 5));
                                    const pageNumber = start + index;
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setPage(pageNumber)}
                                            className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${page === pageNumber ? "bg-teal-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                                        >
                                            {pageNumber + 1}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setPage((v) => Math.min(totalPages - 1, v + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Trang sau
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {showModal && (
                <CreatePostModal
                    mode="create"
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreatePost}
                    userRole={user!.role}
                />
            )}
        </div>
    );
}