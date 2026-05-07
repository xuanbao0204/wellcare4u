"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/features/forum/components/Avatar";
import { CommentItem } from "@/features/forum/components/CommentItem"; 
import { getPostById, likePost, addComment, deletePost, deleteComment } from "@/features/forum/forumService"
import { PostDetailResponse, SPECIALIZATION_COLORS, SPECIALIZATION_LABELS } from "@/shared/type";
import { useAuth } from "@/shared/AuthContext";
import { timeAgo } from "@/lib/formatDay";

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const postId = Number(params.postId);

    const [post, setPost] = useState<PostDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [liked, setLiked] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commenting, setCommenting] = useState(false);


    const {user} = useAuth();
    const currentUserId = user?.id;
    const isAdmin = user?.role === "ADMIN";

    const fetchPost = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getPostById(postId);
            setPost(res.data);
        } catch (e: any) {
            setError(e.message || "Failed to load post.");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => { fetchPost(); }, [fetchPost]);

    async function handleLike() {
        if (!post || liked) return;
        try {
            const res = await likePost(postId);
            setPost(res.data);
            setLiked(true);
        } catch { /* ignore */ }
    }

    async function handleCommentSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!commentText.trim()) return;
        setCommenting(true);
        try {
            await addComment(postId, { content: commentText.trim() });
            setCommentText("");
            fetchPost();
        } catch { /* ignore */ } finally {
            setCommenting(false);
        }
    }

    async function handleReplySubmit(pid: number, content: string, parentId?: number) {
        await addComment(pid, { content, parentCommentId: parentId });
        fetchPost();
    }

    async function handleDeletePost() {
        if (!confirm("Delete this post? This cannot be undone.")) return;
        await deletePost(postId);
        router.push("/forum");
    }

    async function handleDeleteComment(commentId: number) {
        if (!confirm("Delete this comment?")) return;
        await deleteComment(commentId);
        fetchPost();
    }

    // ── Loading skeleton ────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <div className="h-4 bg-slate-200 rounded w-32 mb-6 animate-pulse" />
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse space-y-4">
                        <div className="h-3 bg-slate-200 rounded w-20" />
                        <div className="h-7 bg-slate-200 rounded w-3/4" />
                        <div className="space-y-2">
                            <div className="h-3 bg-slate-200 rounded" />
                            <div className="h-3 bg-slate-200 rounded" />
                            <div className="h-3 bg-slate-200 rounded w-4/5" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Error state ─────────────────────────────────────────────────
    if (error || !post) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 font-medium mb-4">{error || "Post not found"}</p>
                    <Link href="/forum"
                        className="px-5 py-2.5 bg-teal-600 text-white text-sm rounded-xl hover:bg-teal-700 transition-colors">
                        Back to Forum
                    </Link>
                </div>
            </div>
        );
    }

    const canDeletePost =
        isAdmin || (currentUserId !== undefined && post.author.id === currentUserId);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

                {/* Back link */}
                <Link
                    href="/forum"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600
                     mb-6 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Forum
                </Link>

                {/* ── Post body ── */}
                <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
                    <div className="p-6">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                                ${SPECIALIZATION_COLORS[post.category]}`}>
                                {SPECIALIZATION_LABELS[post.category]}
                            </span>

                            {post.isVerifiedAnswer && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs
                                 font-medium bg-emerald-50 text-emerald-700">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 
                      00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 
                      0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Expert Answer Available
                                </span>
                            )}

                            {post.isAnonymous && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium
                                 bg-slate-100 text-slate-500">
                                    Anonymous
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug mb-4">
                            {post.title}
                        </h1>

                        {/* Content */}
                        <div className="prose prose-slate prose-sm max-w-none mb-6">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </p>
                        </div>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map((tag) => (
                                    <span key={tag}
                                        className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Author + meta */}
                        <div className="flex items-center justify-between flex-wrap gap-3
                            pt-5 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    name={post.author.displayName}
                                    avatar={post.author.avatar}
                                    size="md"
                                    isDoctor={post.author.isDoctor}
                                    isVerified={post.author.isVerifiedDoctor}
                                />
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {post.author.displayName}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {post.author.isVerifiedDoctor ? "Verified Doctor · " : ""}
                                        {timeAgo(post.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Stat actions */}
                            <div className="flex items-center gap-3">
                                {/* Like */}
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm
                              border transition-all
                              ${liked
                                            ? "bg-rose-50 border-rose-200 text-rose-600"
                                            : "border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-500"}`}
                                >
                                    <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"}
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 
                         00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {post.likes}
                                </button>

                                {/* Views */}
                                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 
                         4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {post.viewCount}
                                </span>

                                {/* Delete (author/admin) */}
                                {canDeletePost && (
                                    <button
                                        onClick={handleDeletePost}
                                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-red-500
                               transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 
                           7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </article>

                {/* ── Comments section ── */}
                <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800">
                            {post.comments.length} {post.comments.length === 1 ? "Answer" : "Answers"}
                        </h2>
                        {post.isVerifiedAnswer && (
                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 
                    00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 
                    0l4-4z" clipRule="evenodd" />
                                </svg>
                                Includes expert advice
                            </span>
                        )}
                    </div>

                    <div className="px-6 divide-y divide-slate-100">
                        {post.comments.length === 0 ? (
                            <p className="py-10 text-center text-slate-400 text-sm">
                                No answers yet. Be the first to help!
                            </p>
                        ) : (
                            post.comments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    postId={postId}
                                    onReplySubmit={handleReplySubmit}
                                    onDelete={handleDeleteComment}
                                    currentUserId={currentUserId}
                                    isAdmin={isAdmin}
                                />
                            ))
                        )}
                    </div>

                    {/* Add comment form */}
                    <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Write an Answer</h3>
                        <form onSubmit={handleCommentSubmit} className="flex gap-3">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                rows={3}
                                placeholder="Share your knowledge or experience..."
                                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                           placeholder:text-slate-400 bg-white"
                            />
                            <button
                                type="submit"
                                disabled={commenting || !commentText.trim()}
                                className="self-end px-5 py-3 bg-teal-600 text-white text-sm font-medium rounded-xl
                           hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                            >
                                {commenting ? "Posting…" : "Post"}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}