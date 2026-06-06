"use client";

import { CATEGORY_LABELS, PostManageResponse, SPECIALIZATION_LABELS } from "@/shared/type";
import { ModerationBadge } from "@/shared/ui/ModerationBadge";
import { Eye, Heart, MessageCircle, PenBox, Trash2 } from "lucide-react";

interface Props {
    post: PostManageResponse;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

function formatCount(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();

    const mins = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (mins < 1) return "Vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 30) return `${days} ngày trước`;

    return new Date(dateStr).toLocaleDateString("vi-VN");
}

export function PostManageCard({
    post,
    onDelete,
    onEdit,
}: Props) {

    const moderation = post.moderationResult;

    return (
        <article
            className={`group relative overflow-hidden rounded-[28px] border bg-white/80 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md
                ${moderation?.isViolating
                    ? "border-red-200 bg-red-50/30"
                    : "border-white/70"
                }`}
        >

            {/* Violation Banner */}

            {/* {moderation?.isViolating && (
                <div className="flex items-center gap-2 border-b border-red-200 bg-red-100/80 px-5 py-2">

                    <svg
                        className="h-4 w-4 shrink-0 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                        />
                    </svg>

                    <span className="text-xs font-semibold text-red-700">
                        AI phát hiện nội dung có dấu hiệu vi phạm
                    </span>

                </div>
            )} */}

            <div className="p-5 sm:p-6">

                {/* Top */}

                <div className="mb-3 flex flex-wrap items-center gap-2">

                    <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                        {CATEGORY_LABELS[post.category]}
                    </span>

                    {post.relatedSpecialization && (
                        <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                            {SPECIALIZATION_LABELS[post.relatedSpecialization]}
                        </span>
                    )}

                    {moderation?.severity && (
                        <div className="ml-auto">
                            <ModerationBadge
                                severity={moderation.severity}
                            />
                        </div>
                    )}

                </div>

                {/* Title */}

                <h2 className="text-lg font-semibold leading-snug text-slate-900">
                    {post.title}
                </h2>

                {/* Content */}

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {post.content}
                </p>

                {/* Moderation Result */}

                {moderation && (
                    <div
                        className={`mt-5 rounded-3xl border p-4
                        ${moderation?.isViolating
                                ? "border-red-200 bg-red-50"
                                : "border-green-200 bg-green-50"
                            }`}
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <h4
                                    className={`font-semibold
                                    ${moderation.isViolating
                                            ? "text-red-800"
                                            : "text-green-800"
                                        }`}
                                >
                                    Kết quả kiểm duyệt AI
                                </h4>
                                { }
                                <p className="mt-1 text-xs text-slate-500">
                                    Confidence {(moderation.confidence * 100).toFixed(0)}%
                                </p>

                            </div>

                            {moderation.severity && (
                                <ModerationBadge
                                    severity={moderation.severity}
                                />
                            )}

                        </div>

                        <div className="mt-4 space-y-2 text-sm">

                            <p>
                                <span className="font-semibold">
                                    Trạng thái:
                                </span>{" "}
                                {moderation.isViolating
                                    ? "Vi phạm"
                                    : "An toàn"}
                            </p>

                            {moderation.reason && (
                                <p>
                                    <span className="font-semibold">
                                        Lý do:
                                    </span>{" "}
                                    {moderation.reason}
                                </p>
                            )}

                            {moderation.recommendedAction && (
                                <p>
                                    <span className="font-semibold">
                                        Khuyến nghị:
                                    </span>{" "}
                                    {moderation.recommendedAction}
                                </p>
                            )}

                            {moderation.medicalEmergency && (
                                <div className="rounded-xl border border-red-300 bg-red-100 p-3 text-red-800">
                                    ⚠ Có dấu hiệu tình huống y tế khẩn cấp
                                </div>
                            )}

                        </div>

                        {moderation.violatingContent?.length > 0 && (

                            <div className="mt-4">

                                <h5 className="mb-2 text-sm font-semibold">
                                    Nội dung bị gắn cờ
                                </h5>

                                <ul className="space-y-2">

                                    {moderation.violatingContent.map((item, idx) => (

                                        <li
                                            key={idx}
                                            className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm text-red-700"
                                        >
                                            {item}
                                        </li>

                                    ))}

                                </ul>

                            </div>

                        )}

                        {moderation.categories?.length > 0 && (

                            <div className="mt-4 flex flex-wrap gap-2">

                                {moderation.categories.map((category) => (

                                    <span
                                        key={category}
                                        className="rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                                    >
                                        {category}
                                    </span>

                                ))}

                            </div>

                        )}

                    </div>
                )}
                {/* Footer */}

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">

                    <div>

                        <p className="text-sm font-semibold text-slate-700">
                            {post.author.displayName}
                        </p>

                        <p className="text-xs text-slate-400">
                            {timeAgo(post.createdAt)}
                        </p>

                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">

                        <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {formatCount(post.likes)}
                        </span>

                        <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {formatCount(post.commentCount)}
                        </span>

                        <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {formatCount(post.viewCount)}
                        </span>

                    </div>

                </div>

                {/* Actions */}

                <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4">

                    <button
                        onClick={() => onEdit(post.id)}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        <PenBox className="h-4 w-4" />
                        Chỉnh sửa
                    </button>

                    <button
                        onClick={() => onDelete(post.id)}
                        className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    >
                        <Trash2 className="h-4 w-4" />
                        Xóa bài viết
                    </button>

                </div>

            </div>

        </article>
    );
}