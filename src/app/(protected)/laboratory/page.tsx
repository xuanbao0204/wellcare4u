"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    FlaskConical,
    Clock3,
    CheckCircle2,
    Upload,
    ArrowUpDown,
    ClipboardList,
    Stethoscope,
    ImageIcon,
    Save,
    ChevronDown,
    ChevronUp,
    CloudUpload,
    Beaker,
} from "lucide-react";

import { uploadToCloudinary } from "@/shared/services/uploadFile";
import { MedicalTest } from "@/shared/type";
import { completeTest, getMyCompletedTestsToday, getMyPendingTests } from "@/features/doctor/medical-test/medicalTestService";
import { useTestSocket } from "@/hooks/useTestLoader";
import { formatDateTime } from "@/lib/formatDay";

type SortOrder = "asc" | "desc";

function getStepIndex(test: MedicalTest) {
    if (test.resultText && test.conclusion) return 2;
    if (test.resultText || test.conclusion) return 1;
    return 0;
}

const STEPS = ["Nhận mẫu", "Nhập kết quả", "Hoàn thành"];

export default function LaboratoryPage() {
    const [tests, setTests] = useState<MedicalTest[]>([]);
    const [selected, setSelected] = useState<MedicalTest | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const [resultText, setResultText] = useState("");
    const [conclusion, setConclusion] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [drafts, setDrafts] = useState<Record<number, { resultText: string; conclusion: string; imageUrl: string }>>({});

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [draftSaved, setDraftSaved] = useState(false);

    const [completedToday, setCompletedToday] = useState(0);

    const loadData = async () => {
        const data = await getMyPendingTests();
        const countCompleted = await getMyCompletedTestsToday();
        setCompletedToday(countCompleted);
        setTests(data);
    };

    useTestSocket({
        NEW_TEST_ORDERED: (payload) => {
            setTests((prev) => {
                const exists = prev.some((t) => t.id === payload.id);
                if (exists) return prev;
                return [...prev, payload as MedicalTest];
            });
        },
    });

    useEffect(() => {
        loadData();
    }, []);

    const sortedTests = [...tests].sort((a, b) => {
        const ta = new Date(a.orderedAt ?? "").getTime();
        const tb = new Date(b.orderedAt ?? "").getTime();
        return sortOrder === "asc" ? ta - tb : tb - ta;
    });

    const chooseTest = (test: MedicalTest) => {
        if (selected) saveDraft();
        setSelected(test);

        const draft = drafts[test.id!];
        setResultText(draft?.resultText ?? test.resultText ?? "");
        setConclusion(draft?.conclusion ?? test.conclusion ?? "");
        setImageUrl(draft?.imageUrl ?? test.imageUrl ?? "");
        setDraftSaved(false);
    };

    const saveDraft = () => {
        if (!selected) return;
        setDrafts((prev) => ({
            ...prev,
            [selected.id!]: { resultText, conclusion, imageUrl },
        }));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
    };

    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const url = await uploadToCloudinary(file, {
                folder: "medical-tests",
                publicId: `test-${selected?.id}`,
            });
            setImageUrl(url);
        } finally {
            setUploading(false);
        }
    };

    const handleComplete = async () => {
        if (!selected) return;
        try {
            setSaving(true);
            await completeTest(selected.id!, { resultText, conclusion, imageUrl });
            await loadData();
            const { [selected.id!]: _, ...rest } = drafts;
            setDrafts(rest);
            setSelected(null);
            setResultText("");
            setConclusion("");
            setImageUrl("");
        } finally {
            setSaving(false);
        }
    };

    const stepIndex = selected ? getStepIndex({ ...selected, resultText, conclusion }) : 0;
    const canSubmit = !saving && resultText.trim().length > 0 && conclusion.trim().length > 0;

    return (
        <div className="space-y-6 mt-7 relative min-h-screen overflow-hidden bg-slate-50">
                <div className="relative z-10 mx-auto max-w-7xl border border-primary/20 p-6 rounded-3xl bg-white/75">

                    <div className="mb-6">
                        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-semibold text-primary">
                            <Beaker size={14} />
                            PHÒNG XÉT NGHIỆM
                        </p>
                        <h1 className="text-3xl font-bold text-foreground">Quản lý xét nghiệm</h1>
                        <p className="mt-1 text-foreground/60">
                            Xử lý mẫu và trả kết quả xét nghiệm cho bác sĩ phụ trách
                        </p>
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-4">
                        <StatCard
                            value={tests.length}
                            label="Đang chờ xử lý"
                            color="text-orange-500"
                            bg="bg-orange-50 border-orange-100"
                        />
                        <StatCard
                            value={selected ? 1 : 0}
                            label="Đang thực hiện"
                            color="text-primary"
                            bg="bg-primary/5 border-primary/10"
                        />
                        <StatCard
                            value={completedToday}
                            label="Hoàn thành hôm nay"
                            color="text-green-600"
                            bg="bg-green-50 border-green-100"
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

                        <div className="rounded-3xl border border-primary/10 bg-white/80 p-5 shadow-[0_8px_30px_rgba(59,130,246,0.08)] backdrop-blur-xl">

                            <div className="mb-4 flex flex-col items-center justify-between">
                                <div className="flex items-center gap-2 mb-4">
                                    <FlaskConical size={16} className="text-primary" />
                                    <span className="font-semibold">Danh sách chờ</span>
                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                        {tests.length}
                                    </span>
                                </div>

                                <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
                                    <button
                                        onClick={() => setSortOrder("asc")}
                                        className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${sortOrder === "asc"
                                                ? "bg-white text-primary shadow-sm"
                                                : "text-foreground/50 hover:text-foreground/80"
                                            }`}
                                    >
                                        <ChevronUp size={11} />
                                        Cũ nhất
                                    </button>
                                    <button
                                        onClick={() => setSortOrder("desc")}
                                        className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${sortOrder === "desc"
                                                ? "bg-white text-primary shadow-sm"
                                                : "text-foreground/50 hover:text-foreground/80"
                                            }`}
                                    >
                                        <ChevronDown size={11} />
                                        Mới nhất
                                    </button>
                                </div>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                {sortedTests.length === 0 && (
                                    <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/3 p-8 text-center">
                                        <FlaskConical size={28} className="mx-auto mb-2 text-primary/30" />
                                        <p className="text-sm text-foreground/50">
                                            Không có xét nghiệm nào đang chờ
                                        </p>
                                    </div>
                                )}

                                {sortedTests.map((item, idx) => (
                                    <TestListItem
                                        key={item.id}
                                        test={item}
                                        index={sortOrder === "asc" ? idx + 1 : sortedTests.length - idx}
                                        isActive={selected?.id === item.id}
                                        hasDraft={!!drafts[item.id!]}
                                        onClick={() => chooseTest(item)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-[0_8px_30px_rgba(59,130,246,0.08)] backdrop-blur-xl">
                            {!selected ? (
                                <EmptyDetail />
                            ) : (
                                <div className="space-y-5">

                                    {/* detail header */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold">{selected.testName}</h2>
                                            <p className="mt-1 text-sm text-foreground/50">
                                                {selected.note || "Không có ghi chú từ bác sĩ"}
                                            </p>
                                        </div>
                                        <StatusBadge stepIndex={stepIndex} />
                                    </div>

                                    {/* progress tracker */}
                                    <ProgressTracker stepIndex={stepIndex} />

                                    {/* result text */}
                                    <div>
                                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground/70">
                                            <ClipboardList size={14} className="text-primary" />
                                            Kết quả xét nghiệm
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            className="h-36 w-full rounded-xl border border-primary/15 bg-white/60 p-4 text-sm outline-none transition placeholder:text-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary/15"
                                            placeholder={"Nhập chỉ số và kết quả đo được...\nVD: Hemoglobin: 13.5 g/dL (BT: 12–16 g/dL)"}
                                            value={resultText}
                                            onChange={(e) => setResultText(e.target.value)}
                                        />
                                    </div>

                                    {/* conclusion */}
                                    <div>
                                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground/70">
                                            <Stethoscope size={14} className="text-indigo-500" />
                                            Kết luận / Nhận định
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            className="h-28 w-full rounded-xl border border-primary/15 bg-white/60 p-4 text-sm outline-none transition placeholder:text-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary/15"
                                            placeholder="Nhận định chuyên môn về kết quả..."
                                            value={conclusion}
                                            onChange={(e) => setConclusion(e.target.value)}
                                        />
                                    </div>

                                    {/* upload */}
                                    <div>
                                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground/70">
                                            <ImageIcon size={14} className="text-amber-500" />
                                            Ảnh đính kèm
                                            <span className="text-xs font-normal text-foreground/40">(tuỳ chọn)</span>
                                        </label>

                                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/25 bg-primary/3 px-4 py-3.5 transition hover:border-primary/50 hover:bg-primary/6">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <CloudUpload size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground/80">
                                                    {uploading ? "Đang tải lên..." : "Tải ảnh kết quả"}
                                                </p>
                                                <p className="text-xs text-foreground/40">PNG, JPG — tối đa 10 MB</p>
                                            </div>
                                            <input
                                                hidden
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    e.target.files && handleUpload(e.target.files[0])
                                                }
                                            />
                                        </label>
                                    </div>

                                    {/* image preview */}
                                    {imageUrl && (
                                        <div className="overflow-hidden rounded-2xl border border-primary/10">
                                            <Image
                                                src={imageUrl}
                                                alt="Ảnh kết quả xét nghiệm"
                                                width={800}
                                                height={400}
                                                className="w-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* actions */}
                                    <div className="flex items-center gap-3 pt-1">
                                        <button
                                            onClick={handleComplete}
                                            disabled={!canSubmit}
                                            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:scale-[1.02] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                                        >
                                            <CheckCircle2 size={16} />
                                            {saving ? "Đang lưu..." : "Hoàn thành xét nghiệm"}
                                        </button>

                                        <button
                                            onClick={saveDraft}
                                            className="flex items-center gap-2 rounded-xl border border-foreground/15 px-5 py-3 text-sm font-medium text-foreground/60 transition hover:border-primary/30 hover:text-primary"
                                        >
                                            <Save size={15} />
                                            {draftSaved ? "Đã lưu!" : "Lưu nháp"}
                                        </button>

                                        {!resultText && !conclusion && (
                                            <p className="ml-auto text-xs text-foreground/40">
                                                * Bắt buộc điền kết quả và kết luận
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
        </div>
    );
}

function StatCard({
    value,
    label,
    color,
    bg,
}: {
    value: number;
    label: string;
    color: string;
    bg: string;
}) {
    return (
        <div className={`rounded-2xl border p-4 ${bg}`}>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="mt-0.5 text-sm text-foreground/55">{label}</div>
        </div>
    );
}

function TestListItem({
    test,
    index,
    isActive,
    hasDraft,
    onClick,
}: {
    test: MedicalTest;
    index: number;
    isActive: boolean;
    hasDraft: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`group w-full rounded-2xl border p-4 text-left transition ${isActive
                    ? "border-primary bg-primary/6"
                    : "border-foreground/8 bg-white/50 hover:border-primary/20 hover:bg-primary/3"
                }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 truncate">
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                }`}
                        >
                            {index}
                        </span>
                        <span className="truncate text-sm font-semibold">{test.testName} - Mã #{test.id}</span>
                    </div>
                    <p className="mt-1.5 truncate pl-7 text-xs text-foreground font-bold">
                        Bệnh nhân: {test.patientSummary.fullName}
                    </p>
                    <p className="mt-1.5 truncate pl-7 text-xs text-foreground/45">
                        {test.note || "Không có ghi chú"}
                    </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span
                        className={`h-2 w-2 rounded-full ${isActive ? "bg-primary" : "bg-orange-400"
                            }`}
                    />
                    {hasDraft && (
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                            Nháp
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-2.5 flex items-center gap-1.5 pl-7 text-xs text-orange-500">
                <Clock3 size={11} />
                {formatDateTime(test.orderedAt!)}
            </div>
        </button>
    );
}

function ProgressTracker({ stepIndex }: { stepIndex: number }) {
    const steps = ["Nhận mẫu", "Nhập kết quả", "Hoàn thành"];
    const pct = Math.round((stepIndex / (steps.length - 1)) * 100);

    return (
        <div className="rounded-2xl border border-primary/10 bg-primary/4 px-5 py-4">
            <div className="mb-2 flex items-center justify-between text-xs font-medium">
                <span className="text-foreground/60">Tiến độ hoàn thành</span>
                <span className="text-primary">
                    {stepIndex} / {steps.length - 1} bước
                </span>
            </div>

            {/* track */}
            <div className="h-1.5 overflow-hidden rounded-full bg-primary/15">
                <div
                    className="h-full rounded-full bg-linear-to-r from-primary to-indigo-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>

            {/* step labels */}
            <div className="mt-2.5 flex justify-between">
                {steps.map((label, i) => (
                    <div key={label} className="flex items-center gap-1">
                        <div
                            className={`h-2 w-2 rounded-full transition-colors ${i <= stepIndex ? "bg-primary" : "bg-primary/20"
                                }`}
                        />
                        <span
                            className={`text-[10px] font-medium ${i <= stepIndex ? "text-primary" : "text-foreground/35"
                                }`}
                        >
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusBadge({ stepIndex }: { stepIndex: number }) {
    const configs = [
        { label: "Chờ xử lý", color: "bg-orange-50 text-orange-600 border-orange-200" },
        { label: "Đang nhập liệu", color: "bg-primary/8 text-primary border-primary/20" },
        { label: "Sẵn sàng gửi", color: "bg-green-50 text-green-600 border-green-200" },
    ];
    const { label, color } = configs[Math.min(stepIndex, 2)];

    return (
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${color}`}>
            {label}
        </span>
    );
}

function EmptyDetail() {
    return (
        <div className="flex h-full min-h-100 flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8">
                <FlaskConical size={28} className="text-primary/50" />
            </div>
            <p className="font-medium text-foreground/50">Chọn một xét nghiệm bên trái</p>
            <p className="max-w-xs text-sm text-foreground/35">
                Danh sách hiển thị theo thứ tự thời gian. Nhấn vào một mục để bắt đầu nhập kết quả.
            </p>
        </div>
    );
}