import { ChevronLeft, ChevronRight, Clock3, FileText, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import { showError } from "@/lib/toast";
import { getTimePeriod } from "@/lib/commonFunctions";
import { AppointmentType, BookingData, DoctorDTO, SlotDTO } from "@/shared/type";
import { getSlotByDoctorAndDate } from "../patientAppointmentService";

type BookingStepProps = {
    doctor: DoctorDTO;
    onNext: (data: BookingData) => void;
    onBack: () => void;
};

export default function BookingStep({ doctor, onNext, onBack }: BookingStepProps) {
    const [selectedSlot, setSelectedSlot] = useState<SlotDTO>();
    const [reason, setReason] = useState("");
    const [type, setType] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [slots, setSlots] = useState<SlotDTO[]>([]);
    const [startIndex, setStartIndex] = useState(0);

    const getNext30Days = () => {
        const dates: string[] = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(nextDate.getDate() + i);
            dates.push(nextDate.toISOString().split("T")[0]);
        }

        return dates;
    };

    useEffect(() => {
        if (!date) return;

        const fetchAvailableSlots = async () => {
            const res = await getSlotByDoctorAndDate(doctor.id, date);
            if (res.status !== 200) {
                showError(res.message);
                setSlots([]);
                return;
            }

            setSlots(res.data);
        };

        fetchAvailableSlots();
    }, [date, doctor.id]);

    const groupedSlots = {
        morning: slots.filter((slot) => getTimePeriod(slot.startTime) === "morning"),
        afternoon: slots.filter((slot) => getTimePeriod(slot.startTime) === "afternoon"),
        evening: slots.filter((slot) => getTimePeriod(slot.startTime) === "evening"),
    };

    const dates = getNext30Days();
    const visibleDates = dates.slice(startIndex, startIndex + 7);

    return (
        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)]">
            <div className="flex flex-col gap-6">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_320px]">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-sky-700">
                            <Clock3 className="size-3.5" />
                            Schedule builder
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Chọn lịch khám với bác sĩ {doctor.firstName} {doctor.lastName}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Chọn ngày, khung giờ phù hợp và thêm thông tin cần thiết để hoàn tất
                            yêu cầu đặt lịch.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        <SummaryCard
                            label="Chuyên khoa"
                            value={doctor.specialization || "Chưa cập nhật"}
                        />
                        <SummaryCard
                            label="Khung giờ đã chọn"
                            value={
                                selectedSlot
                                    ? `${selectedSlot.startTime} - ${selectedSlot.endTime}`
                                    : "Chưa chọn"
                            }
                        />
                        <SummaryCard
                            label="Ngày khám"
                            value={date || "Chưa chọn ngày"}
                        />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <button
                            onClick={() => setStartIndex(Math.max(0, startIndex - 7))}
                            disabled={startIndex === 0}
                            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
                        >
                            <ChevronLeft className="size-4" />
                        </button>

                        <div className="grid flex-1 gap-2 md:grid-cols-4 xl:grid-cols-7">
                            {visibleDates.map((itemDate) => {
                                const isActive = date === itemDate;

                                return (
                                    <button
                                        key={itemDate}
                                        onClick={() => {
                                            setDate(itemDate);
                                            setSelectedSlot(undefined);
                                        }}
                                        className={`rounded-2xl border px-3 py-3 text-center transition-all ${isActive
                                                ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="text-xs uppercase tracking-[0.12em] text-current/60">
                                            {new Date(itemDate).toLocaleDateString("vi-VN", {
                                                weekday: "short",
                                            })}
                                        </div>
                                        <div className="mt-1 text-sm font-semibold">
                                            {new Date(itemDate).getDate()}/
                                            {new Date(itemDate).getMonth() + 1}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setStartIndex(Math.min(dates.length - 7, startIndex + 7))}
                            disabled={startIndex + 7 >= dates.length}
                            className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                Chọn một khung giờ phù hợp
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                {selectedSlot
                                    ? `Đã chọn: ${selectedSlot.startTime} - ${selectedSlot.endTime}`
                                    : "Khung giờ trống sẽ hiển thị theo ngày bạn chọn."}
                            </p>
                        </div>
                        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500">
                            {slots.length} slot khả dụng
                        </div>
                    </div>

                    {!date ? (
                        <EmptyState
                            title="Chưa chọn ngày khám"
                            description="Hãy chọn một ngày ở phía trên để xem các khung giờ trống."
                        />
                    ) : slots.length === 0 ? (
                        <EmptyState
                            title="Không có lịch cho ngày này"
                            description="Thử chọn ngày khác để xem thêm slot khả dụng."
                        />
                    ) : (
                        <div className="space-y-5">
                            {[
                                { key: "morning", label: "Buổi sáng", data: groupedSlots.morning },
                                { key: "afternoon", label: "Buổi chiều", data: groupedSlots.afternoon },
                                { key: "evening", label: "Buổi tối", data: groupedSlots.evening },
                            ].map(
                                (section) =>
                                    section.data.length > 0 && (
                                        <div key={section.key}>
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {section.label}
                                                </p>
                                                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                                    {section.data.length} khung giờ
                                                </p>
                                            </div>

                                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                                {section.data.map((slot) => {
                                                    const isSelected = selectedSlot?.id === slot.id;

                                                    return (
                                                        <button
                                                            key={slot.id}
                                                            onClick={() =>
                                                                setSelectedSlot(
                                                                    isSelected ? undefined : slot,
                                                                )
                                                            }
                                                            className={`rounded-2xl border px-4 py-4 text-left transition-all ${isSelected
                                                                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                                                                    : "border-slate-200 bg-slate-50/80 text-slate-600 hover:border-slate-300 hover:bg-white"
                                                                }`}
                                                        >
                                                            <p className="text-xs uppercase tracking-[0.14em] text-current/60">
                                                                Available slot
                                                            </p>
                                                            <p className="mt-2 text-base font-semibold">
                                                                {slot.startTime} - {slot.endTime}
                                                            </p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ),
                            )}
                        </div>
                    )}
                </div>

                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                                <NotebookPen className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Nội dung buổi khám
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Chia sẻ lý do để bác sĩ nắm trước tình trạng của bạn.
                                </p>
                            </div>
                        </div>

                        <textarea
                            placeholder="Mô tả lý do khám, triệu chứng hoặc mong muốn tư vấn..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-slate-700 outline-none transition focus:border-emerald-400"
                        />
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sky-700">
                                <FileText className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Loại cuộc hẹn
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Chọn hình thức phù hợp với nhu cầu khám.
                                </p>
                            </div>
                        </div>

                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-slate-700 outline-none transition focus:border-emerald-400"
                        >
                            <option value="">Chọn loại khám</option>
                            {AppointmentType.filter((appointment) =>
                                [
                                    "EXAMINATION",
                                    "CONSULTATION",
                                    "GENERAL_CHECK_UP",
                                    "VACCINATION",
                                ].includes(appointment.value),
                            ).map((appointment) => (
                                <option key={appointment.value} value={appointment.value}>
                                    {appointment.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-slate-500">
                        Hoàn tất thông tin để tiếp tục sang bước xác nhận.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={() => {
                                if (!selectedSlot) return showError("Vui lòng chọn slot");
                                if (!type) return showError("Vui lòng chọn loại appointment");
                                onNext({
                                    slotId: selectedSlot.id,
                                    doctorId: doctor.id,
                                    startTime: selectedSlot.startTime,
                                    endTime: selectedSlot.endTime,
                                    date,
                                    reason,
                                    type,
                                });
                            }}
                            className="rounded-2xl bg-linear-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                {label}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
        </div>
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
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center">
            <p className="text-base font-medium text-slate-700">{title}</p>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    );
}
