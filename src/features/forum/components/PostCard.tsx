"use client";

import Link from "next/link";
import { Avatar } from "./Avatar";
import { timeAgo } from "@/lib/formatDay";
import { SPECIALIZATION_COLORS, SPECIALIZATION_LABELS } from "@/shared/type";
import type { PostSummaryResponse } from "@/shared/type";

interface PostCardProps {
    post: PostSummaryResponse;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Link
            href={`/forum/${post.id}`}
            className="group block overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_24px_50px_-30px_rgba(15,23,42,0.28)] sm:p-6"
        >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${SPECIALIZATION_COLORS[post.category]}`}
                        >
                            {SPECIALIZATION_LABELS[post.category]}
                        </span>

                        {post.isVerifiedAnswer && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Đã có bác sĩ phản hồi
                            </span>
                        )}

                        {post.isAnonymous && (
                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                Ẩn danh
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-semibold leading-snug text-slate-900 transition group-hover:text-teal-700 sm:text-[1.35rem]">
                        {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                        {post.contentPreview}
                    </p>

                    {post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {post.tags.slice(0, 5).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                                >
                                    #{tag}
                                </span>
                            ))}
                            {post.tags.length > 5 && (
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                                    +{post.tags.length - 5} thẻ
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid gap-3 xl:w-[260px] xl:shrink-0">
                    <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
                        <div className="flex items-center gap-3">
                            <Avatar
                                name={post.author.displayName}
                                avatar={post.author.avatar}
                                size="md"
                                isDoctor={post.author.isDoctor}
                                isVerified={post.author.isVerifiedDoctor}
                            />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {post.author.displayName}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {post.author.isVerifiedDoctor ? "Bác sĩ xác thực" : "Thành viên cộng đồng"}
                                </p>
                            </div>
                        </div>
                        <p className="mt-3 text-xs font-medium text-slate-400">
                            Đăng {timeAgo(post.createdAt)}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-3 text-center">
                            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{post.likes}</p>
                            <p className="text-[11px] text-slate-500">Thích</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200/80 bg-white p-3 text-center">
                            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{post.commentCount}</p>
                            <p className="text-[11px] text-slate-500">Phản hồi</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200/80 bg-white p-3 text-center">
                            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{post.viewCount}</p>
                            <p className="text-[11px] text-slate-500">Lượt xem</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
