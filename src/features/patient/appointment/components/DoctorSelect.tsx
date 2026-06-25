import { AlertTriangle, ArrowRight, Hash, Loader2, Search, SearchX, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { showError } from "@/lib/toast";
import { DoctorDTO, ESpecialization, SPECIALIZATION_LABELS } from "@/shared/type";
import DoctorCard from "../../../../shared/sections/DoctorCard";
import { getAllDoctors } from "../patientAppointmentService";
import { SuggestedSpecialization, suggestSpecialization } from "@/features/aiTools/aiTools";

type DoctorSelectStepProps = {
    selectedDoctor?: DoctorDTO | null;
    onSelect: (doctor: DoctorDTO) => void;
};

export default function DoctorSelectStep({ onSelect }: DoctorSelectStepProps) {
    const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(6);
    const [totalPages, setTotalPages] = useState(0);

    const [userSymptom, setUserSymptom] = useState("");
    const [aiSuggestion, setAiSuggestion] = useState<SuggestedSpecialization | null>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    const RANDOM_SPECIALIZATIONS = useMemo(() => {
        const all = Object.values(ESpecialization);
        return all.sort(() => Math.random() - 0.5).slice(0, 8);
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await getAllDoctors({ page, size });
            if (res.status !== 200) {
                showError(res.message);
                return;
            }

            setDoctors(res.data.content);
            setTotalPages(res.data.totalPages);
        };

        fetchDoctors();
    }, [page, size]);


    const handleSymptomSearch = async () => {
        if (!userSymptom.trim()) return;
        setIsLoadingAI(true);
        try {
            const result = await suggestSpecialization(userSymptom); // call API của bạn
            setAiSuggestion(result.data);
        } finally {
            setIsLoadingAI(false);
        }
    }

    function normalizeText(text: string) {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase()
            .trim();
    }

    const filteredDoctors = doctors.filter((doctor) => {
        const target = normalizeText(
            `${doctor.firstName} ${doctor.lastName} ${doctor.specialization || ""}`
        );

        const searchTokens = normalizeText(keyword)
            .split(/\s+/)
            .filter(Boolean);

        if (!searchTokens.length) return true;

        return searchTokens.every((token) => target.includes(token));
    });

    return (
        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)]">
            <div className="flex flex-col gap-6">
                <div className="grid gap-4 xl:grid-cols-2 min-w-260">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                            <Users className="size-3.5" />
                            Doctor directory
                        </div>

                        <h2 className="text-xl font-semibold text-slate-900">
                            Chọn bác sĩ phù hợp cho buổi khám
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Tìm theo tên hoặc chuyên khoa, sau đó tiếp tục sang bước chọn lịch hẹn.
                        </p>

                        <div className="relative mt-4">
                            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Tìm bác sĩ theo tên hoặc chuyên khoa..."
                                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-700 outline-none transition focus:border-emerald-400"
                            />
                            <button
                                type="button"
                                onClick={() => setKeyword("")}
                                disabled={!keyword.trim()}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-300 disabled:opacity-40"
                            >
                                <X className="size-3.5" />
                            </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {RANDOM_SPECIALIZATIONS.map((spec) => {
                                const label = SPECIALIZATION_LABELS[spec];
                                const isActive = keyword === label;

                                return (
                                    <button
                                        key={spec}
                                        type="button"
                                        onClick={() => setKeyword(isActive ? "" : label)}
                                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition
                                            ${isActive
                                                ? "border-emerald-400 bg-emerald-500 text-white"
                                                : "border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                                            }`}
                                    >
                                        <Hash className="size-3 opacity-60" />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-4 min-h-100">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
                            <Sparkles className="size-3.5" />
                            AI Suggest
                        </div>

                        <h2 className="text-xl font-semibold text-slate-900">
                            Gợi ý chuyên khoa từ AI
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Nhập triệu chứng để nhận gợi ý chuyên khoa từ AI.
                        </p>

                        <div className="relative mt-4">
                            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={userSymptom}
                                onChange={(e) => setUserSymptom(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSymptomSearch()}
                                placeholder="VD: đau đầu, sốt, khó thở..."
                                className="w-full rounded-2xl border border-emerald-200 bg-white py-3 pl-11 pr-10 text-slate-700 outline-none transition focus:border-emerald-400"
                            />
                            <button
                                type="button"
                                onClick={handleSymptomSearch}
                                disabled={isLoadingAI || !userSymptom.trim()}
                                aria-label="Gợi ý chuyên khoa"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500 p-1.5 text-white transition hover:bg-emerald-600 disabled:opacity-40"
                            >
                                <Search className="size-3.5" />
                            </button>
                        </div>

                        <div className="mt-3">
                            {isLoadingAI && (
                                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-400">
                                    <Loader2 className="size-4 animate-spin text-emerald-500" />
                                    Đang phân tích triệu chứng...
                                </div>
                            )}

                            {!isLoadingAI && aiSuggestion && (
                                <AISuggestionCard
                                    result={aiSuggestion}
                                    onApply={(suggestion) => {
                                        setKeyword(suggestion);
                                        setAiSuggestion(null);
                                        setUserSymptom("");
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {filteredDoctors.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center">
                        <p className="text-base font-medium text-slate-700">
                            Không tìm thấy bác sĩ phù hợp
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Thử lại với từ khóa khác để xem thêm kết quả.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                onSelect={onSelect}
                                allowBooking={true}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setPage(index)}
                            className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${page === index
                                ? "bg-emerald-600 text-white"
                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}

interface AISuggestionCardProps {
    result: SuggestedSpecialization;
    onApply: (suggestion: string) => void;
}

export function AISuggestionCard({ result, onApply }: AISuggestionCardProps) {
    const matchPercent = Math.round(result.matchingRate * 100);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white px-4 pb-4 pt-3">
            <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-emerald-500" />
            <div className="mb-2.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    <Sparkles className="size-3" />
                    AI gợi ý
                </span>
                <span className="text-[15px] font-semibold text-emerald-800">
                    {result.suggestion}
                </span>
            </div>

            <p className="text-[12.5px] leading-[1.6] text-slate-500">
                {result.message}
            </p>

            <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">
                        Mức độ phù hợp
                    </span>
                    <span className="text-[13px] font-bold text-emerald-600">
                        {matchPercent}%
                    </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-emerald-100">
                    <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${matchPercent}%` }}
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={() => onApply(result.suggestion)}
                disabled={matchPercent < 30 || result.suggestion === null || result.suggestion === undefined}
                className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 text-[13px] font-semibold text-white transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
                Tìm bác sĩ chuyên khoa này
                <ArrowRight className="size-3.5" />
            </button>

            <p className="mt-2 flex items-start gap-1 text-center text-[11px] leading-snug text-slate-400">
                <AlertTriangle className="mt-px size-3 shrink-0" />
                Đây chỉ là gợi ý từ AI, không thay thế chẩn đoán y tế.
            </p>
        </div>
    );
}