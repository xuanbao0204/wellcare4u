"use client";

import { useState } from "react";
import {
    type ESpecialization,
    type CreatePostRequest,
    SPECIALIZATION_LABELS,
    SPECIALIZATION_VALUES,
} from "@/shared/type";

interface CreatePostModalProps {
    onClose: () => void;
    onSubmit: (data: CreatePostRequest) => Promise<void>;
}

export function CreatePostModal({ onClose, onSubmit }: CreatePostModalProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState<ESpecialization>(SPECIALIZATION_VALUES[0]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    function addTag() {
        const cleaned = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
        if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
            setTags((current) => [...current, cleaned]);
        }
        setTagInput("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError("Vui lòng nhập đầy đủ tiêu đề và nội dung câu hỏi.");
            return;
        }

        setError("");
        setSubmitting(true);
        try {
            await onSubmit({
                title: title.trim(),
                content: content.trim(),
                category,
                isAnonymous,
                tags,
            });
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/60 bg-white/90 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.5)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-5 sm:px-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Tạo chủ đề mới</p>
                        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Đăng câu hỏi lên diễn đàn</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Trình bày rõ ràng để cộng đồng và bác sĩ có thể phản hồi chính xác hơn.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 sm:px-8">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-800">
                                    Tiêu đề câu hỏi <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ví dụ: Tôi bị đau ngực khi vận động mạnh trong 3 ngày gần đây"
                                    maxLength={200}
                                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                />
                                <p className="mt-2 text-right text-xs text-slate-400">{title.length}/200 ký tự</p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-800">
                                    Nội dung chi tiết <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={8}
                                    placeholder="Mô tả triệu chứng, thời điểm xuất hiện, thuốc đã dùng, tiền sử bệnh và các thông tin liên quan khác..."
                                    maxLength={5000}
                                    className="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                />
                                <p className="mt-2 text-right text-xs text-slate-400">{content.length}/5000 ký tự</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
                                <label className="mb-2 block text-sm font-semibold text-slate-800">
                                    Chuyên khoa phù hợp
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as ESpecialization)}
                                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                >
                                    {SPECIALIZATION_VALUES.map((value) => (
                                        <option key={value} value={value}>
                                            {SPECIALIZATION_LABELS[value]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
                                <label className="mb-2 block text-sm font-semibold text-slate-800">
                                    Từ khóa chủ đề
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addTag();
                                            }
                                        }}
                                        placeholder="vd: dau-nguc"
                                        className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        disabled={tags.length >= 5}
                                        className="rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Thêm
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-slate-400">Tối đa 5 thẻ để người đọc dễ tìm kiếm hơn.</p>
                                {tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"
                                            >
                                                #{tag}
                                                <button
                                                    type="button"
                                                    onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                                                    className="text-teal-500 transition hover:text-teal-800"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <label className="flex cursor-pointer items-start gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
                                <div className="relative mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-teal-500" />
                                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Đăng ẩn danh</p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Tên hiển thị của bạn sẽ được ẩn với người dùng khác trên diễn đàn.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm leading-6 text-amber-800">
                        Nên tránh đăng thông tin định danh cá nhân như số điện thoại, địa chỉ, mã bệnh án hoặc ảnh giấy tờ y tế nếu không thật sự cần thiết.
                    </div>

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200/70 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Đang đăng bài..." : "Đăng chủ đề"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
