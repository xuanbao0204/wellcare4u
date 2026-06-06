"use client";

import { useState, type FormEvent } from "react";
import {
    AlertTriangle,
    EyeOff,
    Hash,
    MessageCircle,
    PenLine,
    Send,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    Tag,
    X,
} from "lucide-react";
import {
    ESpecialization,
    type CreatePostRequest,
    SPECIALIZATION_LABELS,
    SPECIALIZATION_VALUES,
    EForumCategory,
    CATEGORY_LABELS,
    CATEGORY_CONFIG,
} from "@/shared/type";

interface CreatePostModalProps {
    mode: "create" | "edit";
    onClose: () => void;
    initialData?: Partial<CreatePostRequest>;
    onSubmit: (data: CreatePostRequest) => Promise<void>;
    userRole: string;
}

export function CreatePostModal({
    mode,
    onClose,
    onSubmit,
    initialData,
    userRole,
}: CreatePostModalProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [relatedSpecialization, setRelatedSpecialization] = useState<ESpecialization | null>(initialData?.relatedSpecialization || null);

    const [category, setCategory] = useState<EForumCategory>(initialData?.category || EForumCategory.QANDA);
    const [isAnonymous, setIsAnonymous] = useState(initialData?.isAnonymous || false);
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [allowComment, setAllowComment] = useState(initialData?.allowComment ?? true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    function addTag() {
        const cleaned = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
        if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
            setTags((current) => [...current, cleaned]);
        }
        setTagInput("");
    }

    const availableCategories = Object.entries(CATEGORY_CONFIG)
        .filter(([_, config]) => config.roles.includes(userRole))
        .map(([category]) => category as EForumCategory);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError("Vui lòng nhập đầy đủ tiêu đề và nội dung câu hỏi.");
            return;
        }

        setError("");
        setSubmitting(true);

        const data: CreatePostRequest = {
            title: title.trim(),
            content: content.trim(),
            category,
            relatedSpecialization,
            isAnonymous,
            tags,
            allowComment,
        };
        onClose();
        try {
            await onSubmit({
                title: title.trim(),
                content: content.trim(),
                category,
                relatedSpecialization,
                isAnonymous,
                tags,
                allowComment,
            });

        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[34px] border border-white/65 bg-white/90 shadow-[0_34px_110px_-42px_rgba(15,23,42,0.62)] backdrop-blur-xl">
                <div className="relative overflow-hidden border-b border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.82))] px-6 py-6 sm:px-8">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-teal-300/20 blur-3xl" />
                    <div className="relative flex items-start justify-between gap-4">
                        <div className="max-w-2xl">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700 shadow-sm">
                                <PenLine size={14} />
                                Tạo chủ đề mới
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                                {mode === "edit" ? "Chỉnh sửa bài viết" : "Đăng câu hỏi lên diễn đàn"}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Trình bày triệu chứng rõ ràng, chọn đúng chuyên
                                khoa và thêm thẻ phù hợp để cộng đồng phản hồi
                                chính xác hơn.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-800"
                            aria-label="Đóng modal"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <section className="space-y-5">
                                <div className="rounded-[28px] border border-white/70 bg-white/78 p-5 shadow-sm backdrop-blur">
                                    <div className="mb-4 flex items-center gap-3">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-teal-700">
                                            <Sparkles size={18} />
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                Nội dung bài viết
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Tiêu đề ngắn gọn, nội dung đủ
                                                bối cảnh.
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                                            Tiêu đề câu hỏi{" "}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="Ví dụ: Tôi bị đau ngực khi vận động mạnh trong 3 ngày gần đây"
                                            maxLength={200}
                                            className="h-14 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                                        />
                                        <p className="mt-2 text-right text-xs text-slate-400">
                                            {title.length}/200 ký tự
                                        </p>
                                    </div>

                                    <div className="mt-5">
                                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                                            Nội dung chi tiết{" "}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            value={content}
                                            onChange={(e) =>
                                                setContent(e.target.value)
                                            }
                                            rows={10}
                                            placeholder="Mô tả triệu chứng, thời điểm xuất hiện, thuốc đã dùng, tiền sử bệnh và các thông tin liên quan khác..."
                                            maxLength={5000}
                                            className="w-full resize-none rounded-3xl border border-slate-200/80 bg-white/90 px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                                        />
                                        <p className="mt-2 text-right text-xs text-slate-400">
                                            {content.length}/5000 ký tự
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[26px] border border-amber-200/80 bg-amber-50/85 p-4 text-sm leading-6 text-amber-800 shadow-sm">
                                    <div className="mb-1 flex items-center gap-2 font-semibold">
                                        <AlertTriangle size={16} />
                                        Lưu ý quyền riêng tư
                                    </div>
                                    Nên tránh đăng thông tin định danh cá nhân
                                    như số điện thoại, địa chỉ, mã bệnh án hoặc
                                    ảnh giấy tờ y tế nếu không thật sự cần thiết.
                                </div>
                            </section>

                            <aside className="space-y-4">

                                <SideCard
                                    icon={<Hash size={18} />}
                                    title="Danh mục"
                                    description="Chọn loại bài viết."
                                >

                                    <select
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(
                                                e.target.value as EForumCategory
                                            )
                                        }
                                        className="h-12 w-full rounded-2xl border border-slate-200/80 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                    >
                                        {availableCategories.map((value) => (
                                            <option key={value} value={value}>
                                                {CATEGORY_CONFIG[value].label}
                                            </option>
                                        ))}
                                    </select>
                                </SideCard>

                                <SideCard
                                    icon={<Stethoscope size={18} />}
                                    title="Chuyên khoa"
                                    description="Giúp bài viết đến đúng nhóm bác sĩ."
                                >
                                    <select
                                        value={relatedSpecialization || ""}
                                        onChange={(e) =>
                                            setRelatedSpecialization(
                                                e.target.value as ESpecialization | null
                                            )
                                        }
                                        className="h-12 w-full rounded-2xl border border-slate-200/80 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                                    >
                                        <option value="">Không chọn</option>
                                        {Object.values(ESpecialization).map((value) => (
                                            <option key={value} value={value}>
                                                {SPECIALIZATION_LABELS[value]}
                                            </option>
                                        ))}
                                    </select>
                                </SideCard>

                                <SideCard
                                    icon={<Hash size={18} />}
                                    title="Từ khóa chủ đề"
                                    description="Tối đa 5 thẻ để người đọc dễ tìm kiếm."
                                >
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) =>
                                                setTagInput(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addTag();
                                                }
                                            }}
                                            placeholder="vd: dau-nguc"
                                            className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
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

                                    {tags.length > 0 ? (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"
                                                >
                                                    <Tag size={12} />#{tag}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setTags(
                                                                (current) =>
                                                                    current.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item !==
                                                                            tag
                                                                    )
                                                            )
                                                        }
                                                        className="text-teal-500 transition hover:text-teal-800"
                                                        aria-label={`Xóa thẻ ${tag}`}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </SideCard>

                                <ToggleCard
                                    icon={<EyeOff size={18} />}
                                    title="Đăng ẩn danh"
                                    description="Tên hiển thị của bạn sẽ được ẩn với người dùng khác trên diễn đàn."
                                    checked={isAnonymous}
                                    onChange={setIsAnonymous}
                                />

                                {userRole === "ADMIN" && (
                                    <ToggleCard
                                        icon={<MessageCircle size={18} />}
                                        title="Cho phép bình luận"
                                        description="Người dùng có thể bình luận dưới bài viết của bạn."
                                        checked={allowComment}
                                        onChange={setAllowComment}
                                    />
                                )}
                            </aside>
                        </div>

                        {error && (
                            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/70 bg-white/78 px-6 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <ShieldCheck size={15} className="text-teal-600" />
                            Bài viết nên rõ ràng, lịch sự và tôn trọng cộng
                            đồng.
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Send size={16} />
                                {submitting
                                    ? mode === "create"
                                        ? "Đang đăng bài..."
                                        : "Đang lưu..."
                                    : mode === "create"
                                        ? "Đăng chủ đề"
                                        : "Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SideCard({
    icon,
    title,
    description,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-[26px] border border-white/70 bg-slate-50/72 p-4 shadow-sm backdrop-blur">
            <div className="mb-3 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white text-teal-700 shadow-sm">
                    {icon}
                </span>
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        {title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        {description}
                    </p>
                </div>
            </div>
            {children}
        </section>
    );
}

function ToggleCard({
    icon,
    title,
    description,
    checked,
    onChange,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-start gap-3 rounded-[26px] border border-white/70 bg-slate-50/72 p-4 shadow-sm backdrop-blur transition hover:bg-white/80">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white text-teal-700 shadow-sm">
                {icon}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-900">
                    {title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {description}
                </span>
            </span>
            <span className="relative mt-1 shrink-0">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer sr-only"
                />
                <span className="block h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-teal-500" />
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
            </span>
        </label>
    );
}
