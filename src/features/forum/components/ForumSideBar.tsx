"use client";

import { SPECIALIZATION_LABELS, SPECIALIZATION_VALUES, type ESpecialization } from "@/shared/type";

interface ForumSidebarProps {
    activeCategory?: ESpecialization;
    onCategoryChange: (cat?: ESpecialization) => void;
}

const QUICK_GUIDES = [
    "Viết tiêu đề nêu đúng vấn đề chính để người đọc hiểu ngay tình huống.",
    "Nêu rõ triệu chứng, thời gian xuất hiện và các thuốc đã sử dụng trước đó.",
    "Bảo vệ quyền riêng tư, không chia sẻ thông tin cá nhân hoặc hồ sơ nhạy cảm.",
];

export function ForumSidebar({ activeCategory, onCategoryChange }: ForumSidebarProps) {
    return (
        <aside className="space-y-4">
            <div className="overflow-hidden rounded-[28px] border border-white/60 bg-[linear-gradient(160deg,rgba(13,148,136,0.96),rgba(15,118,110,0.9),rgba(17,24,39,0.88))] p-5 text-white shadow-[0_24px_50px_-30px_rgba(15,23,42,0.8)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-100">Tiêu chuẩn cộng đồng</p>
                <h3 className="mt-2 text-xl font-semibold leading-snug">
                    Diễn đàn hướng tới trao đổi có trách nhiệm và dễ tiếp cận.
                </h3>
                <div className="mt-4 space-y-3">
                    {QUICK_GUIDES.map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm leading-6 text-slate-100">
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Điều hướng</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-900">Chuyên khoa</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {SPECIALIZATION_VALUES.length}
                    </span>
                </div>

                <div className="space-y-1.5">
                    <button
                        onClick={() => onCategoryChange(undefined)}
                        className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                            !activeCategory
                                ? "bg-teal-600 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        <span>Tất cả chủ đề</span>
                        <span className={!activeCategory ? "text-teal-100" : "text-slate-300"}>•</span>
                    </button>

                    {SPECIALIZATION_VALUES.map((spec) => (
                        <button
                            key={spec}
                            onClick={() => onCategoryChange(spec)}
                            className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                                activeCategory === spec
                                    ? "bg-teal-50 text-teal-700 ring-1 ring-teal-200"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            <span>{SPECIALIZATION_LABELS[spec]}</span>
                            <span className={activeCategory === spec ? "text-teal-400" : "text-slate-300"}>›</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nhận diện phản hồi</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">Huy hiệu trên diễn đàn</h3>
                <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Bác sĩ xác thực
                        </span>
                        <p className="mt-2 text-sm leading-6 text-emerald-800">
                            Tài khoản bác sĩ đã được xác minh danh tính và chuyên môn trên hệ thống.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-3">
                        <span className="inline-flex rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                            Phản hồi chuyên môn
                        </span>
                        <p className="mt-2 text-sm leading-6 text-blue-800">
                            Bình luận mang tính định hướng chuyên môn, giúp người hỏi dễ tham khảo hơn.
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
