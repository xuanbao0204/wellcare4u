"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
    Activity,
    CalendarDays,
    ChevronLeft,
    ClipboardPlus,
    FileHeart,
    FlaskConical,
    HeartPulse,
    Pill,
    Stethoscope,
    UserRound,
} from "lucide-react";
import { getRecordDetail } from "@/features/medical-records/medicalRecordService";
import { showError } from "@/lib/toast";
import { AppointmentType, MedicalRecordDetail } from "@/shared/type";
import Badge from "@/shared/ui/Badge";

type Props = {
    recordId?: number;
};

type PanelProps = {
    title: string;
    icon: ReactNode;
    description?: string;
    children: ReactNode;
    className?: string;
};

type DetailRowProps = {
    title: string;
    value?: ReactNode;
};

type MetricCardProps = {
    label: string;
    value?: ReactNode;
    hint?: string;
};

const MedicalRecordDetailPage = ({ recordId }: Props) => {
    const router = useRouter();
    const [data, setData] = useState<MedicalRecordDetail>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!recordId) {
                setLoading(false);
                return;
            }

            const res = await getRecordDetail(recordId);

            if (res.status !== 200) {
                showError(res.message);
                setLoading(false);
                return;
            }

            setData(res.data);
            setLoading(false);
        };

        fetch();
    }, [recordId]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#eef7f4_0%,#f8fafc_100%)] px-6 text-sm text-slate-500">
                Đang tải dữ liệu hồ sơ...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#eef7f4_0%,#f8fafc_100%)] px-6 text-sm text-slate-500">
                Không tìm thấy hồ sơ
            </div>
        );
    }

    const createdAt = new Date(data.createdAt).toLocaleString("vi-VN");
    const followUpDate = data.followUpDate
        ? new Date(data.followUpDate).toLocaleString("vi-VN")
        : null;

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#eef7f4_0%,#f7fafc_28%,#f8fafc_100%)] px-4 py-6 md:px-6 md:py-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <section className="overflow-hidden rounded-[30px] border border-emerald-100/70 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] p-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.42)]">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => router.back()}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white/90 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                                >
                                    <ChevronLeft className="size-4" />
                                    Quay lại
                                </button>

                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
                                    <FileHeart className="size-3.5" />
                                    Medical record
                                </div>
                            </div>

                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                                    Hồ sơ khám bệnh chi tiết
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                                    Bản tóm tắt đầy đủ về tình trạng lâm sàng, xét nghiệm, đơn
                                    thuốc và kế hoạch điều trị của bệnh nhân trong lần khám này.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-sm text-slate-600">
                                    Tạo lúc: {createdAt}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-sm text-slate-600">
                                    {getAppointmentTypeLabel(data.appointment?.type) || "Chưa có loại lịch hẹn"}
                                </span>
                            </div>
                        </div>

                        <div className="grid w-full gap-3 sm:grid-cols-3 xl:max-w-xl">
                            <SummaryTile
                                label="Xét nghiệm"
                                value={String(data.tests?.length || 0)}
                                hint="Mục cận lâm sàng"
                            />
                            <SummaryTile
                                label="Toa thuốc"
                                value={String(data.items?.length || 0)}
                                hint="Thuốc đã kê"
                            />
                            <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                                    Trạng thái
                                </p>
                                <div className="mt-3">
                                    <Badge value={data.status} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
                        <div className="rounded-[28px] border border-white/80 bg-white/85 p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative size-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                        {data.patient.avatar ? (
                                            <Image
                                                src={data.patient.avatar}
                                                alt={`${data.patient.firstName} ${data.patient.lastName}`}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                <UserRound className="size-7" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                            Bệnh nhân
                                        </p>
                                        <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                            {data.patient.firstName} {data.patient.lastName}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Bác sĩ phụ trách: {data.doctor.firstName} {data.doctor.lastName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                                        {data.appointment?.slotDate || "Chưa có ngày khám"}
                                    </span>
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                                        {data.appointment?.slotTime || "Chưa có giờ khám"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-slate-900/10 bg-slate-900 p-5 text-white">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200/80">
                                Chẩn đoán chính
                            </p>
                            <p className="mt-3 text-2xl font-semibold">
                                {data.diagnosis || "Chưa có chẩn đoán"}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                {data.conclusion || "Chưa có kết luận điều trị được cập nhật."}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_380px]">
                    <div className="space-y-6">
                        <Panel
                            title="Thông tin lâm sàng"
                            description="Ghi nhận lý do khám, triệu chứng và mã bệnh liên quan."
                            icon={<Stethoscope className="size-5" />}
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <DetailCard title="Lý do khám" value={data.chiefComplaint} />
                                <DetailCard title="Mã ICD" value={data.icdCode} />
                                <div className="md:col-span-2">
                                    <DetailCard title="Triệu chứng" value={data.symptoms} />
                                </div>
                            </div>
                        </Panel>

                        {data.vitalSign && (
                            <Panel
                                title="Chỉ số sinh tồn"
                                description="Các chỉ số nền được lưu trong lần khám này."
                                icon={<HeartPulse className="size-5" />}
                            >
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    <MetricCard
                                        label="Chiều cao"
                                        value={formatValue(data.vitalSign.height, "cm")}
                                    />
                                    <MetricCard
                                        label="Cân nặng"
                                        value={formatValue(data.vitalSign.weight, "kg")}
                                    />
                                    <MetricCard
                                        label="BMI"
                                        value={formatBmi(data.vitalSign.bmi)}
                                        hint="Chỉ số khối cơ thể"
                                    />
                                    <MetricCard
                                        label="Huyết áp"
                                        value={formatValue(data.vitalSign.bloodPressure)}
                                    />
                                    <MetricCard
                                        label="Nhịp tim"
                                        value={formatValue(data.vitalSign.heartRate, "bpm")}
                                    />
                                    <MetricCard
                                        label="Đường huyết"
                                        value={formatValue(data.vitalSign.bloodSugar, "mmol/L")}
                                    />
                                </div>
                            </Panel>
                        )}

                        {data.tests?.length > 0 && (
                            <Panel
                                title="Xét nghiệm và cận lâm sàng"
                                description="Kết quả được đính kèm cùng nhận định cho từng chỉ định."
                                icon={<FlaskConical className="size-5" />}
                            >
                                <div className="space-y-4">
                                    {data.tests.map((test) => (
                                        <article
                                            key={test.id}
                                            className="rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,252,0.95))] p-5"
                                        >
                                            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_260px]">
                                                <div>
                                                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-sky-700">
                                                        <FlaskConical className="size-3.5" />
                                                        Test
                                                    </div>
                                                    <h3 className="mt-3 text-lg font-semibold text-slate-900">
                                                        {test.testName}
                                                    </h3>
                                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                                        {test.resultText || "Chưa có mô tả kết quả"}
                                                    </p>
                                                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                                        <span className="font-medium text-slate-900">
                                                            Kết luận:
                                                        </span>{" "}
                                                        {test.conclusion || "Chưa có kết luận"}
                                                    </div>
                                                </div>

                                                {test.imageUrl && (
                                                    <div className="relative min-h-48 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                                                        <Image
                                                            src={test.imageUrl}
                                                            alt={test.testName || "Medical test image"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </Panel>
                        )}

                        {data.items?.length > 0 && (
                            <Panel
                                title="Đơn thuốc"
                                description="Danh sách thuốc đã kê cùng hướng dẫn sử dụng cho bệnh nhân."
                                icon={<Pill className="size-5" />}
                            >
                                <div className="space-y-4">
                                    {data.items.map((item, index) => (
                                        <article
                                            key={item.id}
                                            className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-38px_rgba(15,23,42,0.55)]"
                                        >
                                            <div className="flex gap-4">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 font-semibold text-emerald-700">
                                                    {index + 1}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        {item.drug || "Chưa có tên thuốc"}
                                                    </h3>

                                                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                                                        <table className="w-full text-sm">
                                                            <thead className="bg-slate-50 text-slate-500">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left font-medium">
                                                                        Liều dùng
                                                                    </th>
                                                                    <th className="px-4 py-3 text-left font-medium">
                                                                        Tần suất
                                                                    </th>
                                                                    <th className="px-4 py-3 text-left font-medium">
                                                                        Thời gian
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr className="border-t border-slate-200 text-slate-700">
                                                                    <td className="px-4 py-3">
                                                                        {item.dosage || "-"}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {item.frequency || "-"}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {item.duration || "-"}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                                                        <span className="font-medium text-slate-900">
                                                            Hướng dẫn:
                                                        </span>{" "}
                                                        {item.instruction || "Không có hướng dẫn"}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </Panel>
                        )}

                        <Panel
                            title="Hướng điều trị"
                            description="Kế hoạch xử trí và tổng kết sau khám."
                            icon={<ClipboardPlus className="size-5" />}
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <DetailCard title="Kế hoạch điều trị" value={data.treatmentPlan} />
                                <DetailCard title="Kết luận" value={data.conclusion} />
                            </div>
                        </Panel>
                    </div>

                    <div className="space-y-6">
                        <Panel
                            title="Tóm tắt hồ sơ"
                            description="Thông tin hành chính và lịch hẹn liên quan."
                            icon={<Activity className="size-5" />}
                            className="sticky top-6"
                        >
                            <div className="space-y-4">
                                <SidebarBox
                                    title="Bác sĩ"
                                    value={`${data.doctor.firstName} ${data.doctor.lastName}`}
                                />
                                <SidebarBox
                                    title="Bệnh nhân"
                                    value={`${data.patient.firstName} ${data.patient.lastName}`}
                                />
                                <SidebarBox
                                    title="Loại lịch hẹn"
                                    value={getAppointmentTypeLabel(data.appointment?.type) || "Chưa có dữ liệu"}
                                />
                                <SidebarBox
                                    title="Ngày khám"
                                    value={data.appointment?.slotDate || "Chưa có dữ liệu"}
                                />
                                <SidebarBox
                                    title="Giờ khám"
                                    value={data.appointment?.slotTime || "Chưa có dữ liệu"}
                                />
                            </div>
                        </Panel>

                        <Panel
                            title="Tái khám"
                            description="Thông tin lịch tái khám nếu đã được hẹn."
                            icon={<CalendarDays className="size-5" />}
                        >
                            {followUpDate ? (
                                <div className="rounded-[26px] border border-emerald-200 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(255,255,255,1))] p-5">
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700/80">
                                        Lịch tái khám
                                    </p>
                                    <p className="mt-3 text-lg font-semibold text-emerald-900">
                                        {new Date(data.followUpDate!).toLocaleDateString("vi-VN")}
                                    </p>
                                    <p className="mt-2 text-sm text-emerald-700">
                                        {followUpDate}
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-5 py-10 text-center">
                                    <p className="text-base font-medium text-slate-700">
                                        Không có lịch tái khám
                                    </p>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Hồ sơ này hiện chưa được đặt lịch hẹn theo dõi tiếp theo.
                                    </p>
                                </div>
                            )}
                        </Panel>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Panel = ({
    title,
    icon,
    description,
    children,
    className = "",
}: PanelProps) => (
    <section
        className={`rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)] ${className}`}
    >
        <div className="mb-5 flex items-start gap-3">
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
        {children}
    </section>
);

const DetailCard = ({ title, value }: DetailRowProps) => (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            {title}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-700">
            {value || "Không có dữ liệu"}
        </p>
    </div>
);

const MetricCard = ({ label, value, hint }: MetricCardProps) => (
    <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            {label}
        </p>
        <p className="mt-3 text-xl font-semibold text-slate-900">{value || "-"}</p>
        {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
);

const SummaryTile = ({
    label,
    value,
    hint,
}: {
    label: string;
    value: string;
    hint: string;
}) => (
    <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            {label}
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </div>
);

const SidebarBox = ({
    title,
    value,
}: {
    title: string;
    value: string;
}) => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            {title}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-700">{value}</p>
    </div>
);

const formatValue = (value?: string | number | null, unit?: string) => {
    if (value === undefined || value === null || value === "") return "-";
    return unit ? `${value} ${unit}` : String(value);
};

const formatBmi = (value?: string | number | null) => {
    if (value === undefined || value === null || value === "") return "-";

    const numeric = Number(value);
    return Number.isNaN(numeric) ? String(value) : numeric.toFixed(1);
};

const getAppointmentTypeLabel = (type?: string) => {
    return AppointmentType.find((t) => t.value === type)?.label || type;
};

export default MedicalRecordDetailPage;
