"use client";

import { ReactNode, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
    Activity,
    ClipboardPlus,
    FileText,
    FlaskConical,
    HeartPulse,
    Pill,
    Stethoscope,
} from "lucide-react";
import { finalizeRecord } from "@/features/doctor/medical-record/medicalRecordService";
import {
    BookingData,
    CreateRecordData,
    MedicalRecordDetail,
    MedicalTest,
    PrescriptionItem,
    VitalSign,
} from "@/shared/type";
import FloatingInput from "@/shared/components/FloatingInput";
import ActionButton from "@/shared/components/ActionButton";
import TextAreaInput from "@/shared/components/TextAreaInput";
import TestModal from "@/features/doctor/medical-record/AddTestModal";
import { deleteFile, getPublicIdFromUrl } from "@/shared/services/uploadFile";
import Loader from "@/shared/ui/Loader";
import FollowUpModal from "@/features/doctor/medical-record/FollowUpModal";
import { useAuth } from "@/shared/AuthContext";
import { getRecordDetail } from "@/features/medical-records/medicalRecordService";
import { getBloodPressureLabel, getBloodSugarLabel, getBMILabel, getHeartRateLabel } from "@/lib/commonFunctions";

type SectionCardProps = {
    title: string;
    description?: string;
    icon: ReactNode;
    children: ReactNode;
    actions?: ReactNode;
    className?: string;
};

function SectionCard({
    title,
    description,
    icon,
    children,
    actions,
    className = "",
}: SectionCardProps) {
    return (
        <section
            className={`rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.38)] backdrop-blur ${className}`}
        >
            <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                        {description && (
                            <p className="mt-1 text-sm text-slate-500">{description}</p>
                        )}
                    </div>
                </div>
                {actions}
            </div>
            {children}
        </section>
    );
}

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-base font-medium text-slate-700">{title}</p>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    );
}

export default function MedicalExamPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { recordId } = useParams();
    const [recordDetail, setRecordDetail] = useState<MedicalRecordDetail>();
    const [step, setStep] = useState(1);

    const [vital, setVital] = useState<VitalSign>({});
    const [tests, setTests] = useState<MedicalTest[]>([]);
    const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);
    const [followUpDate, setFollowUpDate] = useState<BookingData>();

    const [openFollowUp, setOpenFollowUp] = useState(false);
    const [addTestModal, setAddTestModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [form, setForm] = useState<CreateRecordData>({
        recordId: Number(recordId),
        chiefComplaint: "",
        symptoms: "",
        diagnosis: "",
        icdCode: "",
        treatmentPlan: "",
        conclusion: "",
        followUpDate: followUpDate,
        vital: vital,
        tests: tests,
        items: prescriptionItems,
        isDone: false,
    });

    useEffect(() => {
        if (!recordId) return;

        const fetchData = async () => {
            const res = await getRecordDetail(Number(recordId));

            if (res.status === 200) {
                const data = res.data;

                setRecordDetail(data);
                setForm((prev) => ({
                    ...prev,
                    recordId: Number(recordId),
                    chiefComplaint: data.chiefComplaint || "",
                    symptoms: data.symptoms || "",
                    diagnosis: data.diagnosis || "",
                    icdCode: data.icdCode || "",
                    treatmentPlan: data.treatmentPlan || "",
                    conclusion: data.conclusion || "",
                    vital: data.vitalSign || {},
                    tests: data.tests || [],
                    items: data.items || [],
                }));
                setVital(data.vitalSign || {});
                setTests(data.tests || []);
                setPrescriptionItems(data.items || []);
            }
        };

        fetchData();
    }, [recordId]);

    const steps = [
        { label: "Sinh hiệu", icon: <HeartPulse className="size-4" /> },
        { label: "Triệu chứng", icon: <Stethoscope className="size-4" /> },
        { label: "Xét nghiệm", icon: <FlaskConical className="size-4" /> },
        { label: "Thuốc", icon: <Pill className="size-4" /> },
        { label: "Kết luận", icon: <ClipboardPlus className="size-4" /> },
    ];

    const handleAddTest = (test: MedicalTest) => {
        setTests((prev) => [...prev, test]);
        setForm((prev) => ({
            ...prev,
            tests: [...prev.tests, test],
        }));
    };

    const handleDeleteTest = async (index: number) => {
        const test = tests[index];

        try {
            await deleteFile(getPublicIdFromUrl(test.imageUrl!));
        } catch {
            // Keep record editing uninterrupted if uploaded media cannot be deleted.
        }

        const newTests = tests.filter((_, i) => i !== index);

        setTests(newTests);
        setForm((prev) => ({
            ...prev,
            tests: newTests,
        }));
    };

    const updateItem = (index: number, field: string, value: string) => {
        setPrescriptionItems((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
        );
    };

    const getBMI = () => {
        if (!vital.height || !vital.weight) return null;
        return vital.weight / Math.pow(vital.height / 100, 2);
    };

    const bmi = getBMI();
    const bloodPressureStatus = getBloodPressureLabel(vital.bloodPressure);
    const heartRateStatus = getHeartRateLabel(vital.heartRate);
    const bloodSugarStatus = getBloodSugarLabel(vital.bloodSugar);
    const completion = Math.round((step / steps.length) * 100);
    const finalForm: CreateRecordData = {
        ...form,
        recordId: Number(recordId),
        vital,
        tests,
        items: prescriptionItems,
        followUpDate,
    };

    if (!user) return null;
    if (!recordId) return <Loader />;

    return (
        <div className="flex min-h-screen flex-col gap-6 overflow-hidden bg-[linear-gradient(180deg,#eef7f4_0%,#f7fafc_32%,#f8fafc_100%)] p-4 text-[15px] md:p-6 md:text-[16px]">
            <section className="shrink-0 overflow-hidden rounded-[30px] border border-emerald-100/80 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] p-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.42)]">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-sm font-medium text-emerald-700">
                            <Activity className="size-4" />
                            Hồ sơ khám bệnh
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                            Tạo bệnh án với bố cục rõ ràng như một phiếu khám thực tế
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
                            Ghi nhận sinh hiệu, triệu chứng, cận lâm sàng và đơn thuốc trong
                            cùng một luồng làm việc mạch lạc để dễ rà soát trước khi hoàn tất.
                        </p>
                    </div>

                    <div className="grid w-full gap-3 sm:grid-cols-3 xl:max-w-xl">
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                                Tiến độ
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">
                                {step}/{steps.length}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                {completion}% quy trình hoàn tất
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                                Xét nghiệm
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">
                                {tests.length}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Mục đang đính kèm
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                                Kê đơn
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">
                                {prescriptionItems.length}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">Thuốc trong toa</p>
                        </div>
                    </div>
                </div>

                {recordDetail && (
                    <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
                        <div className="rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-sm">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={recordDetail.patient.avatar!}
                                        alt={`${recordDetail.patient.firstName} ${recordDetail.patient.lastName}`}
                                        width={64}
                                        height={64}
                                        className="size-16 rounded-2xl border border-slate-200 object-cover"
                                    />
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                            Bệnh nhân
                                        </p>
                                        <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                            {recordDetail.patient.firstName} {recordDetail.patient.lastName}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Mã hồ sơ #{recordDetail.id}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                                        {recordDetail.appointment?.slotDate || "Chưa có ngày khám"}
                                    </span>
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                                        {recordDetail.appointment?.slotTime || "Chưa có giờ khám"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-white/80 bg-slate-900 p-5 text-white shadow-sm">
                            <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-200/80">
                                Tóm tắt nhanh
                            </p>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-xs text-slate-300">Lý do khám</p>
                                    <p className="mt-2 line-clamp-2 text-sm text-white/90">
                                        {form.chiefComplaint || "Chưa cập nhật"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-xs text-slate-300">Tái khám</p>
                                    <p className="mt-2 text-sm text-white/90">
                                        {followUpDate
                                            ? `${followUpDate.date} • ${followUpDate.startTime} - ${followUpDate.endTime}`
                                            : "Chưa đặt lịch"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section className="shrink-0 rounded-[28px] border border-slate-200/80 bg-white/88 p-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)] backdrop-blur">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                    <div className="w-full rounded-full bg-slate-100">
                        <div
                            className="h-2 rounded-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all"
                            style={{ width: `${completion}%` }}
                        />
                    </div>

                    <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        {steps.map((item, index) => {
                            const currentStep = index + 1;
                            const active = step === currentStep;
                            const done = step > currentStep;

                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => setStep(currentStep)}
                                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${active
                                            ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                                            : done
                                                ? "border-emerald-100 bg-emerald-50/60 text-emerald-700"
                                                : "border-slate-200 bg-slate-50/80 text-slate-500 hover:border-slate-300"
                                        }`}
                                >
                                    <div
                                        className={`flex size-10 items-center justify-center rounded-2xl border ${active
                                                ? "border-emerald-200 bg-white text-emerald-700"
                                                : done
                                                    ? "border-emerald-100 bg-white text-emerald-600"
                                                    : "border-slate-200 bg-white text-slate-400"
                                            }`}
                                    >
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.16em] text-current/60">
                                            Bước {currentStep}
                                        </p>
                                        <p className="mt-0.5 text-sm font-semibold">{item.label}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="flex-1 overflow-y-auto pb-2">
                {step === 1 && (
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
                        <SectionCard
                            title="Sinh hiệu"
                            description="Nhập các chỉ số nền để hỗ trợ đánh giá nhanh tình trạng hiện tại."
                            icon={<HeartPulse className="size-5" />}
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="relative">
                                    <FloatingInput
                                        label="Chiều cao"
                                        name="height"
                                        value={vital.height}
                                        className="rounded-2xl border-slate-200 bg-white pr-12"
                                        onChange={(e) =>
                                            setVital({ ...vital, height: Number(e.target.value) })
                                        }
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        cm
                                    </span>
                                </div>

                                <div className="relative">
                                    <FloatingInput
                                        label="Cân nặng"
                                        name="weight"
                                        value={vital.weight}
                                        className="rounded-2xl border-slate-200 bg-white pr-12"
                                        onChange={(e) =>
                                            setVital({ ...vital, weight: Number(e.target.value) })
                                        }
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        kg
                                    </span>
                                </div>

                                <div className="relative md:col-span-2">
                                    <FloatingInput
                                        label="Huyết áp"
                                        name="bloodPressure"
                                        value={vital.bloodPressure}
                                        className="rounded-2xl border-slate-200 bg-white pr-16"
                                        onChange={(e) =>
                                            setVital({ ...vital, bloodPressure: e.target.value })
                                        }
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        mmHg
                                    </span>
                                </div>

                                <div className="relative">
                                    <FloatingInput
                                        label="Nhịp tim"
                                        name="heartRate"
                                        value={vital.heartRate}
                                        className="rounded-2xl border-slate-200 bg-white pr-14"
                                        onChange={(e) =>
                                            setVital({ ...vital, heartRate: Number(e.target.value) })
                                        }
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        bpm
                                    </span>
                                </div>

                                <div className="relative">
                                    <FloatingInput
                                        label="Đường huyết"
                                        name="bloodSugar"
                                        value={vital.bloodSugar}
                                        className="rounded-2xl border-slate-200 bg-white pr-16"
                                        onChange={(e) =>
                                            setVital({
                                                ...vital,
                                                bloodSugar: Number(e.target.value),
                                            })
                                        }
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        mmol/L
                                    </span>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Đánh giá nhanh"
                            description="Các cảnh báo trực quan giúp bác sĩ kiểm tra chỉ số bất thường."
                            icon={<Activity className="size-5" />}
                            className="h-fit"
                        >
                            <div className="space-y-4">
                                {bmi && (
                                    <div className="rounded-3xl border border-emerald-100 bg-[linear-gradient(135deg,rgba(236,253,245,0.92),rgba(255,255,255,0.9))] p-5">
                                        <p className="text-sm text-slate-500">BMI</p>
                                        <div className="mt-3 flex items-end justify-between gap-3">
                                            <div>
                                                <p className="text-3xl font-semibold text-slate-900">
                                                    {bmi.toFixed(1)}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Chỉ số khối cơ thể
                                                </p>
                                            </div>
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-medium ${getBMILabel(bmi).color}`}
                                            >
                                                {getBMILabel(bmi).label}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {bloodPressureStatus && (
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                        <p className="text-sm text-slate-500">Huyết áp</p>
                                        <div className="mt-2 flex items-center justify-between gap-3">
                                            <p className="text-base font-medium text-slate-900">
                                                {vital.bloodPressure}
                                            </p>
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-medium ${bloodPressureStatus.color}`}
                                            >
                                                {bloodPressureStatus.label}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {heartRateStatus && (
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                        <p className="text-sm text-slate-500">Nhịp tim</p>
                                        <div className="mt-2 flex items-center justify-between gap-3">
                                            <p className="text-base font-medium text-slate-900">
                                                {vital.heartRate} bpm
                                            </p>
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-medium ${heartRateStatus.color}`}
                                            >
                                                {heartRateStatus.label}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {bloodSugarStatus && (
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                        <p className="text-sm text-slate-500">Đường huyết</p>
                                        <div className="mt-2 flex items-center justify-between gap-3">
                                            <p className="text-base font-medium text-slate-900">
                                                {vital.bloodSugar} mmol/L
                                            </p>
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-medium ${bloodSugarStatus.color}`}
                                            >
                                                {bloodSugarStatus.label}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {!bmi && !bloodPressureStatus && !heartRateStatus && !bloodSugarStatus && (
                                    <EmptyState
                                        title="Chưa có chỉ số để phân tích"
                                        description="Thêm sinh hiệu để hệ thống hiển thị nhận định nhanh cho lần khám này."
                                    />
                                )}
                            </div>
                        </SectionCard>
                    </div>
                )}

                {step === 2 && (
                    <SectionCard
                        title="Triệu chứng và chẩn đoán"
                        description="Ghi lại lý do khám, triệu chứng nổi bật và định hướng chẩn đoán."
                        icon={<Stethoscope className="size-5" />}
                    >
                        <div className="grid gap-5">
                            <TextAreaInput
                                label="Lý do khám"
                                value={form.chiefComplaint}
                                disabled
                                className="rounded-2xl border-slate-200 bg-slate-50/70"
                                onChange={(e) =>
                                    setForm({ ...form, chiefComplaint: e.target.value })
                                }
                            />

                            <TextAreaInput
                                label="Triệu chứng"
                                value={form.symptoms}
                                rows={4}
                                className="rounded-2xl border-slate-200 bg-white"
                                onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                            />

                            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                                <TextAreaInput
                                    label="Chẩn đoán"
                                    value={form.diagnosis}
                                    rows={4}
                                    className="rounded-2xl border-slate-200 bg-white"
                                    onChange={(e) =>
                                        setForm({ ...form, diagnosis: e.target.value })
                                    }
                                />

                                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                                    <p className="mb-4 text-sm font-medium text-slate-600">
                                        Mã bệnh theo ICD
                                    </p>
                                    <FloatingInput
                                        label="Mã ICD"
                                        value={form.icdCode}
                                        className="rounded-2xl border-slate-200 bg-white"
                                        onChange={(e) =>
                                            setForm({ ...form, icdCode: e.target.value })
                                        }
                                    />
                                    <p className="mt-3 text-xs leading-5 text-slate-500">
                                        Dùng để chuẩn hóa chẩn đoán và thuận tiện cho thống kê
                                        bệnh án sau này.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                )}

                {step === 3 && (
                    <SectionCard
                        title="Xét nghiệm và cận lâm sàng"
                        description="Theo dõi các chỉ định và kết quả đã thêm vào bệnh án hiện tại."
                        icon={<FlaskConical className="size-5" />}
                        actions={
                            <button
                                type="button"
                                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                                onClick={() => setAddTestModal(true)}
                            >
                                + Thêm xét nghiệm
                            </button>
                        }
                    >
                        {!tests.length ? (
                            <EmptyState
                                title="Chưa có xét nghiệm nào được thêm"
                                description="Thêm kết quả hoặc chỉ định cận lâm sàng để hoàn thiện bệnh án."
                            />
                        ) : (
                            <div className="grid gap-4">
                                {tests.map((test, i) => (
                                    <article
                                        key={i}
                                        className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.96))] p-5"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {test.testName}
                                                </h3>
                                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                                    {test.resultText || "Chưa có mô tả kết quả"}
                                                </p>
                                                <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                                    {test.conclusion || "Chưa có kết luận"}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTest(i)}
                                                className="rounded-full border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </SectionCard>
                )}

                {addTestModal && (
                    <TestModal
                        recordId={Number(recordId)}
                        open={addTestModal}
                        onClose={() => setAddTestModal(false)}
                        onAdd={handleAddTest}
                    />
                )}

                {step === 4 && (
                    <SectionCard
                        title="Kê đơn thuốc"
                        description="Tạo toa thuốc rõ ràng, dễ rà soát trước khi chốt hồ sơ."
                        icon={<Pill className="size-5" />}
                        actions={
                            <button
                                type="button"
                                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                                onClick={() =>
                                    setPrescriptionItems((prev) => [
                                        ...prev,
                                        {
                                            drug: "",
                                            dosage: "",
                                            frequency: "",
                                            duration: "",
                                            instruction: "",
                                        },
                                    ])
                                }
                            >
                                + Thêm thuốc
                            </button>
                        }
                    >
                        {!prescriptionItems.length ? (
                            <EmptyState
                                title="Chưa có thuốc nào trong toa"
                                description="Thêm thuốc, liều dùng và hướng dẫn để hoàn tất phần kê đơn."
                            />
                        ) : (
                            <div className="space-y-5">
                                {prescriptionItems.map((item, i) => {
                                    const isEditing = editingIndex === i;

                                    return (
                                        <article
                                            key={i}
                                            className={`rounded-[28px] border p-5 transition-all ${isEditing
                                                    ? "border-emerald-200 bg-emerald-50/40 shadow-sm"
                                                    : "border-slate-200 bg-slate-50/70"
                                                }`}
                                        >
                                            <div className="mb-4 flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                                        Thuốc {i + 1}
                                                    </p>
                                                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                                                        {item.drug || "Thuốc mới"}
                                                    </h3>
                                                </div>

                                                <div className="flex gap-2">
                                                    {!isEditing && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingIndex(i)}
                                                            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white"
                                                        >
                                                            Chỉnh sửa
                                                        </button>
                                                    )}

                                                    {isEditing && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingIndex(null)}
                                                            className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                                                        >
                                                            Lưu
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newItems = prescriptionItems.filter(
                                                                (_, index) => index !== i,
                                                            );
                                                            setPrescriptionItems(newItems);

                                                            if (editingIndex === i) {
                                                                setEditingIndex(null);
                                                            }
                                                        }}
                                                        className="rounded-full border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <FloatingInput
                                                    label="Tên thuốc"
                                                    value={item.drug || ""}
                                                    disabled={!isEditing}
                                                    className="rounded-2xl border-slate-200 bg-white"
                                                    onChange={(e) =>
                                                        updateItem(i, "drug", e.target.value)
                                                    }
                                                />

                                                <FloatingInput
                                                    label="Liều dùng"
                                                    value={item.dosage || ""}
                                                    disabled={!isEditing}
                                                    className="rounded-2xl border-slate-200 bg-white"
                                                    onChange={(e) =>
                                                        updateItem(i, "dosage", e.target.value)
                                                    }
                                                />

                                                <FloatingInput
                                                    label="Tần suất"
                                                    value={item.frequency || ""}
                                                    disabled={!isEditing}
                                                    className="rounded-2xl border-slate-200 bg-white"
                                                    onChange={(e) =>
                                                        updateItem(i, "frequency", e.target.value)
                                                    }
                                                />

                                                <FloatingInput
                                                    label="Thời gian"
                                                    value={item.duration || ""}
                                                    disabled={!isEditing}
                                                    className="rounded-2xl border-slate-200 bg-white"
                                                    onChange={(e) =>
                                                        updateItem(i, "duration", e.target.value)
                                                    }
                                                />

                                                <div className="md:col-span-2">
                                                    <FloatingInput
                                                        label="Hướng dẫn"
                                                        value={item.instruction || ""}
                                                        disabled={!isEditing}
                                                        className="rounded-2xl border-slate-200 bg-white"
                                                        onChange={(e) =>
                                                            updateItem(i, "instruction", e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </SectionCard>
                )}

                {step === 5 && (
                    <SectionCard
                        title="Kết luận và hẹn tái khám"
                        description="Hoàn thiện kế hoạch điều trị và lựa chọn lịch tái khám nếu cần."
                        icon={<FileText className="size-5" />}
                    >
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
                            <div className="space-y-5">
                                <TextAreaInput
                                    label="Phác đồ điều trị"
                                    rows={4}
                                    className="rounded-2xl border-slate-200 bg-white"
                                    value={form.treatmentPlan}
                                    onChange={(e) =>
                                        setForm({ ...form, treatmentPlan: e.target.value })
                                    }
                                />

                                <TextAreaInput
                                    label="Kết luận"
                                    rows={4}
                                    className="rounded-2xl border-slate-200 bg-white"
                                    value={form.conclusion}
                                    onChange={(e) =>
                                        setForm({ ...form, conclusion: e.target.value })
                                    }
                                />
                            </div>

                            <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
                                <p className="text-sm font-medium text-slate-700">
                                    Lịch tái khám
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Có thể bỏ qua nếu bệnh nhân chưa cần hẹn lại sau buổi khám này.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setOpenFollowUp(true)}
                                    className="mt-5 w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                >
                                    Đặt ngày tái khám
                                </button>

                                {followUpDate ? (
                                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700/80">
                                            Đã chọn
                                        </p>
                                        <p className="mt-2 text-base font-semibold text-emerald-900">
                                            {followUpDate.date}
                                        </p>
                                        <p className="mt-1 text-sm text-emerald-700">
                                            {followUpDate.startTime} - {followUpDate.endTime}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white/90 p-4 text-sm text-slate-500">
                                        Chưa có lịch tái khám được đặt.
                                    </div>
                                )}

                                <FollowUpModal
                                    doctorId={user.id!}
                                    open={openFollowUp}
                                    onClose={() => setOpenFollowUp(false)}
                                    onSelect={(data) => {
                                        setFollowUpDate(data);
                                        setForm((prev) => ({
                                            ...prev,
                                            followUpDate: data,
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </SectionCard>
                )}
            </div>

            <div className="sticky bottom-0 shrink-0 rounded-[28px] border border-slate-200/80 bg-white/92 p-4 shadow-[0_-18px_45px_-35px_rgba(15,23,42,0.55)] backdrop-blur">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-700">
                            Bước hiện tại: {steps[step - 1].label}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Rà soát nội dung trước khi chuyển bước hoặc hoàn tất bệnh án.
                        </p>
                    </div>

                    <div className="flex w-full gap-3 md:w-auto">
                        <ActionButton
                            variant="secondary"
                            className="rounded-2xl bg-slate-100 px-6 text-slate-700 shadow-none md:w-auto"
                            onClick={() => setStep(step - 1)}
                            disabled={step === 1}
                        >
                            Quay lại
                        </ActionButton>

                        {step < 5 ? (
                            <ActionButton
                                variant="primary"
                                className="rounded-2xl px-6 md:w-auto"
                                onClick={() => setStep(step + 1)}
                            >
                                Tiếp tục
                            </ActionButton>
                        ) : (
                            <ActionButton
                                className="rounded-2xl px-6 md:w-auto"
                                onClick={async () => {
                                    await finalizeRecord(finalForm);
                                    router.push("/doctor/medical-records");
                                }}
                            >
                                Hoàn tất bệnh án
                            </ActionButton>
                        )}
                    </div>
                </div>
            </div>
            <FollowUpModal
                doctorId={user.id!}
                open={openFollowUp}
                onClose={() => setOpenFollowUp(false)}
                onSelect={(data) => {
                    setFollowUpDate(data);
                    setForm((prev) => ({
                        ...prev,
                        followUpDate: data,
                    }));
                }}
            />
        </div>
    );
}
