"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { timeAgo } from "@/lib/formatDay";
import type { CommentResponse } from "@/shared/type";

interface CommentItemProps {
    comment: CommentResponse;
    postId: number;
    depth?: number;
    onReplySubmit: (postId: number, content: string, parentId?: number) => Promise<void>;
    onDelete: (commentId: number) => Promise<void>;
    currentUserId?: number;
    isAdmin?: boolean;
}

export function CommentItem({
    comment,
    postId,
    depth = 0,
    onReplySubmit,
    onDelete,
    currentUserId,
    isAdmin,
}: CommentItemProps) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const canDelete =
        isAdmin || (currentUserId !== undefined && comment.author.id === currentUserId);

    async function handleReply() {
        if (!replyText.trim()) return;

        setSubmitting(true);
        try {
            await onReplySubmit(postId, replyText.trim(), comment.id);
            setReplyText("");
            setShowReply(false);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={depth > 0 ? "ml-4 border-l border-slate-200/80 pl-4 sm:ml-8 sm:pl-5" : ""}>
            <article className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
                <div className="flex gap-3 items-center">
                    <Avatar
                        name={comment.author.displayName}
                        avatar={comment.author.avatar}
                        size="md"
                        isDoctor={comment.author.isDoctor}
                        isVerified={comment.author.isVerifiedDoctor}
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-semibold text-slate-900">
                                {comment.author.displayName}
                            </h4>

                            {comment.author.isVerifiedDoctor && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Bác sĩ xác thực
                                </span>
                            )}

                            {comment.isExpertReply && !comment.author.isVerifiedDoctor && (
                                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                                    Phản hồi chuyên môn
                                </span>
                            )}

                            <span className="text-xs text-slate-400">{timeAgo(comment.createdAt)}</span>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {comment.content}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            {depth < 3 && (
                                <button
                                    onClick={() => setShowReply((value) => !value)}
                                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
                                >
                                    Trả lời
                                </button>
                            )}

                            {canDelete && (
                                <button
                                    onClick={() => onDelete(comment.id)}
                                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                >
                                    Xóa bình luận
                                </button>
                            )}
                        </div>

                        {showReply && (
                            <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={3}
                                    placeholder="Viết phản hồi của bạn một cách rõ ràng, lịch sự và đúng trọng tâm..."
                                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                />
                                <div className="mt-3 flex flex-wrap justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setShowReply(false);
                                            setReplyText("");
                                        }}
                                        className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-200/70"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleReply}
                                        disabled={submitting || !replyText.trim()}
                                        className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {submitting ? "Đang gửi..." : "Gửi phản hồi"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>

            {comment.replies?.length > 0 && (
                <div className="mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            depth={depth + 1}
                            onReplySubmit={onReplySubmit}
                            onDelete={onDelete}
                            currentUserId={currentUserId}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
