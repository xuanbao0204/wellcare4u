import { CalendarDays, Clock3, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSlotByDoctorAndDate } from "@/features/patient/appointment/patientAppointmentService";
import { showError } from "@/lib/toast";
import { BookingData, SlotDTO } from "@/shared/type";

type Props = {
    doctorId: number;
    open: boolean;
    onClose: () => void;
    onSelect: (data: BookingData) => void;
};

export default function FollowUpModal({
    doctorId,
    open,
    onClose,
    onSelect,
}: Props) {
    const [selectedSlot, setSelectedSlot] = useState<SlotDTO>();
    const [date, setDate] = useState("");
    const [slots, setSlots] = useState<SlotDTO[]>([]);

    const handleClose = () => {
        setSelectedSlot(undefined);
        setDate("");
        setSlots([]);
        onClose();
    };

    useEffect(() => {
        if (!date) return;

        (async () => {
            const res = await getSlotByDoctorAndDate(doctorId, date);

            if (res.status !== 200) {
                showError(res.message);
                return;
            }

            setSlots(res.data);
        })();
    }, [date, doctorId]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_32px_100px_-45px_rgba(15,23,42,0.6)]">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(255,255,255,1))] px-6 py-5">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
                            <RefreshCw className="size-3.5" />
                            Follow up
                        </div>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                            Đặt lịch tái khám
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Chọn ngày và khung giờ phù hợp để bệnh nhân quay lại tái khám.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-white hover:text-slate-700"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="grid gap-6 p-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-700">
                                <CalendarDays className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Chọn ngày</p>
                                <p className="text-sm text-slate-500">
                                    Xem các khung giờ còn trống
                                </p>
                            </div>
                        </div>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setSelectedSlot(undefined);
                                setSlots([]);
                            }}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-emerald-400"
                        />

                        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white/80 p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                Trạng thái
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                {date
                                    ? `Đang hiển thị lịch trống cho ngày ${date}.`
                                    : "Hãy chọn ngày để tải danh sách khung giờ."}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sky-700">
                                <Clock3 className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Khung giờ khả dụng</p>
                                <p className="text-sm text-slate-500">
                                    Nhấn chọn một slot để xác nhận tái khám
                                </p>
                            </div>
                        </div>

                        {!date ? (
                            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
                                <p className="text-base font-medium text-slate-700">
                                    Chưa chọn ngày tái khám
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Hệ thống sẽ hiển thị slot ngay sau khi bạn chọn ngày.
                                </p>
                            </div>
                        ) : !slots.length ? (
                            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
                                <p className="text-base font-medium text-slate-700">
                                    Không có slot trống
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Thử chọn ngày khác để tiếp tục đặt lịch tái khám.
                                </p>
                            </div>
                        ) : (
                            <div className="grid max-h-[320px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                                {slots.map((slot) => {
                                    const isSelected = selectedSlot?.id === slot.id;

                                    return (
                                        <button
                                            key={slot.id}
                                            type="button"
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                                                isSelected
                                                    ? "border-emerald-300 bg-emerald-50 shadow-sm"
                                                    : "border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white"
                                            }`}
                                        >
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                                Slot
                                            </p>
                                            <p className="mt-2 text-base font-semibold text-slate-900">
                                                {slot.startTime} - {slot.endTime}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {isSelected
                                                    ? "Đang được chọn để xác nhận"
                                                    : "Nhấn để chọn khung giờ này"}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/80 px-6 py-5 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-slate-500">
                        {selectedSlot
                            ? `Đã chọn ${date} • ${selectedSlot.startTime} - ${selectedSlot.endTime}`
                            : "Chưa có khung giờ nào được chọn"}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            Hủy
                        </button>

                        <button
                            type="button"
                            className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                            onClick={() => {
                                if (!selectedSlot) {
                                    showError("Chọn slot");
                                    return;
                                }

                                onSelect({
                                    doctorId: doctorId,
                                    slotId: selectedSlot.id,
                                    startTime: selectedSlot.startTime,
                                    endTime: selectedSlot.endTime,
                                    date,
                                    reason: "Tái khám",
                                    type: "FOLLOW_UP",
                                });

                                handleClose();
                            }}
                        >
                            Xác nhận lịch hẹn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
