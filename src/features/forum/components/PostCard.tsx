"use client";

import Link from "next/link";
import {
    CATEGORY_LABELS,
    EForumCategory,
    PostSummaryResponse,
    SPECIALIZATION_COLORS,
    SPECIALIZATION_LABELS,
} from "@/shared/type";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    OPEN:    { label: "Đang mở",  className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
    CLOSED:  { label: "Đã đóng", className: "border-slate-200  bg-slate-100  text-slate-500"    },
    PENDING: { label: "Chờ duyệt",className: "border-amber-200  bg-amber-50   text-amber-700"   },
    HIDDEN:  { label: "Ẩn",      className: "border-red-200    bg-red-50     text-red-700"      },
};

const CATEGORY_ACCENT: Record<EForumCategory, string> = {
    QANDA:              "border-blue-200    bg-blue-50    text-blue-700",
    FAQ:                "border-indigo-200  bg-indigo-50  text-indigo-700",
    MEDICAL_KNOWLEDGE:  "border-teal-200    bg-teal-50    text-teal-700",
    NUTRITION_LIFESTYLE:"border-lime-200    bg-lime-50    text-lime-700",
    MEDICINE_GUIDE:     "border-orange-200  bg-orange-50  text-orange-700",
    HEALTH_NEWS:        "border-cyan-200    bg-cyan-50    text-cyan-700",
    HOSPITAL_GUIDE:     "border-violet-200  bg-violet-50  text-violet-700",
    PATIENT_STORY:      "border-pink-200    bg-pink-50    text-pink-700",
};

function formatCount(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days  = Math.floor(diff / 86_400_000);
    if (mins  < 1)  return "Vừa xong";
    if (mins  < 60) return `${mins} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days  < 30) return `${days} ngày trước`;
    return new Date(dateStr).toLocaleDateString("vi-VN");
}

function getInitials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface PostCardProps {
    post: PostSummaryResponse;
    isAdmin?: boolean;
}
export function PostCard({ post, isAdmin = false }: PostCardProps) {
    const statusConfig = STATUS_CONFIG[post.status] ?? STATUS_CONFIG["OPEN"];
    const categoryAccent = CATEGORY_ACCENT[post.category as EForumCategory] ?? "border-slate-200 bg-slate-50 text-slate-700";
    const specializationColor = SPECIALIZATION_COLORS[post.relatedSpecialization] ?? "bg-slate-100 text-slate-700";

    const displayName = post.isAnonymous ? "Ẩn danh" : (post.author?.displayName ?? "Người dùng");
    const showViolation = isAdmin && post.isViolatingContent;

    return (
        <article
            className={`group relative overflow-hidden rounded-[28px] border bg-white/80 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md ${
                showViolation
                    ? "border-red-200 bg-red-50/60"
                    : "border-white/70"
            }`}
        >
            {/* Violation banner — admin only */}
            {showViolation && (
                <div className="flex items-center gap-2 border-b border-red-200 bg-red-100/80 px-5 py-2">
                    <svg className="h-4 w-4 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <span className="text-xs font-semibold text-red-700">Bài viết bị gắn cờ vi phạm nội dung</span>
                </div>
            )}

            <div className="p-5 sm:p-6">
                {/* ── Top badges row ── */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    {/* Category */}
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${categoryAccent}`}>
                        {CATEGORY_LABELS[post.category as EForumCategory] ?? post.category}
                    </span>

                    {/* Specialization */}
                    {post.relatedSpecialization && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${specializationColor}`}>
                            {SPECIALIZATION_LABELS[post.relatedSpecialization] ?? post.relatedSpecialization}
                        </span>
                    )}

                    {/* Status */}
                    <span className={`ml-auto inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusConfig.className}`}>
                        {statusConfig.label}
                    </span>
                </div>

                {/* ── Title ── */}
                <Link href={`/forum/${post.id}`} className="group/title block">
                    <h2 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 transition group-hover/title:text-teal-700 sm:text-lg">
                        {post.title}
                    </h2>
                </Link>

                {/* ── Preview ── */}
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {post.contentPreview}
                </p>

                {/* ── Tags ── */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 5).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
                            >
                                #{tag}
                            </span>
                        ))}
                        {post.tags.length > 5 && (
                            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-400">
                                +{post.tags.length - 5}
                            </span>
                        )}
                    </div>
                )}

                {/* ── Footer: author + stats ── */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    {/* Author */}
                    <div className="flex items-center gap-2.5">
                        {post.isAnonymous ? (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        ) : post.author?.avatar ? (
                            <img
                                src={post.author.avatar}
                                alt={displayName}
                                className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover"
                            />
                        ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-xs font-semibold text-teal-700">
                                {getInitials(displayName)}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-700">{displayName}</p>
                            {!post.isAnonymous && (
                                <p className="text-xs text-slate-400">
                                    {post.author.isDoctor ? "Bác sĩ" : isAdmin ? "Quản trị viên" : "Thành viên"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        {/* Likes */}
                        <span className="flex items-center gap-1">
                            <svg className="h-4 w-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {formatCount(post.likes)}
                        </span>

                        {/* Comments */}
                        <span className="flex items-center gap-1">
                            <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {formatCount(post.commentCount)}
                        </span>

                        {/* Views */}
                        <span className="flex items-center gap-1">
                            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {formatCount(post.viewCount)}
                        </span>

                        {/* Time */}
                        <span className="hidden sm:inline">{timeAgo(post.createdAt)}</span>
                    </div>
                </div>

                {/* ── Read more link ── */}
                <div className="mt-4 border-t border-slate-100 pt-4">
                    <Link
                        href={`/forum/${post.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition hover:text-teal-800"
                    >
                        Xem thảo luận
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );
}

// "use client";

// import Link from "next/link";
// import { Avatar } from "./Avatar";
// import { timeAgo } from "@/lib/formatDay";
// import { SPECIALIZATION_COLORS, SPECIALIZATION_LABELS } from "@/shared/type";
// import type { PostSummaryResponse } from "@/shared/type";

// interface PostCardProps {
//     post: PostSummaryResponse;
// }

// export function PostCard({ post }: PostCardProps) {
//     return (
//         <Link
//             href={`/forum/${post.id}`}
//             className="group block overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_24px_50px_-30px_rgba(15,23,42,0.28)] sm:p-6"
//         >
//             <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
//                 <div className="min-w-0 flex-1">
//                     <div className="mb-4 flex flex-wrap items-center gap-2">
//                         <span
//                             className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${SPECIALIZATION_COLORS[post.category]}`}
//                         >
//                             {SPECIALIZATION_LABELS[post.category]}
//                         </span>

//                         {post.isVerifiedAnswer && (
//                             <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                                 <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                 </svg>
//                                 Đã có bác sĩ phản hồi
//                             </span>
//                         )}

//                         {post.isAnonymous && (
//                             <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
//                                 Ẩn danh
//                             </span>
//                         )}
//                     </div>

//                     <h3 className="text-xl font-semibold leading-snug text-slate-900 transition group-hover:text-teal-700 sm:text-[1.35rem]">
//                         {post.title}
//                     </h3>

//                     <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
//                         {post.contentPreview}
//                     </p>

//                     {post.tags.length > 0 && (
//                         <div className="mt-4 flex flex-wrap gap-2">
//                             {post.tags.slice(0, 5).map((tag) => (
//                                 <span
//                                     key={tag}
//                                     className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
//                                 >
//                                     #{tag}
//                                 </span>
//                             ))}
//                             {post.tags.length > 5 && (
//                                 <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
//                                     +{post.tags.length - 5} thẻ
//                                 </span>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 <div className="grid gap-3 xl:w-[260px] xl:shrink-0">
//                     <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
//                         <div className="flex items-center gap-3">
//                             <Avatar
//                                 name={post.author.displayName}
//                                 avatar={post.author.avatar}
//                                 size="md"
//                                 isDoctor={post.author.isDoctor}
//                                 isVerified={post.author.isVerifiedDoctor}
//                             />
//                             <div className="min-w-0">
//                                 <p className="truncate text-sm font-semibold text-slate-900">
//                                     {post.author.displayName}
//                                 </p>
//                                 <p className="mt-1 text-xs text-slate-500">
//                                     {post.author.isVerifiedDoctor ? "Bác sĩ xác thực" : "Thành viên cộng đồng"}
//                                 </p>
//                             </div>
//                         </div>
//                         <p className="mt-3 text-xs font-medium text-slate-400">
//                             Đăng {timeAgo(post.createdAt)}
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-3 gap-2">
//                         <div className="rounded-2xl border border-slate-200/80 bg-white p-3 text-center">
//                             <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
//                                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                                 </svg>
//                             </div>
//                             <p className="text-sm font-semibold text-slate-900">{post.likes}</p>
//                             <p className="text-[11px] text-slate-500">Thích</p>
//                         </div>

//                         <div className="rounded-2xl border border-slate-200/80 bg-white p-3 text-center">
//                             <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
//                                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                                 </svg>
//                             </div>
//                             <p className="text-sm font-semibold text-slate-900">{post.commentCount}</p>
//                             <p className="text-[11px] text-slate-500">Phản hồi</p>
//                         </div>

//                         <div className="rounded-2xl border border-slate-200/80 bg-white p-3 text-center">
//                             <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
//                                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                 </svg>
//                             </div>
//                             <p className="text-sm font-semibold text-slate-900">{post.viewCount}</p>
//                             <p className="text-[11px] text-slate-500">Lượt xem</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// }
