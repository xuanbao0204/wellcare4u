import { AppointmentType, BookingData, DoctorDTO, SlotDTO } from "@/shared/type";
import { useState, useEffect } from "react";
import { getSlotByDoctorAndDate } from "../patientAppointmentService";
import { showError } from "@/lib/toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTimePeriod } from "@/lib/commonFunctions";

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
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            dates.push(d.toISOString().split("T")[0]);
        }
        return dates;
    };

    const fetchAvailableSlots = async () => {
        if (!date) return;
        const res = await getSlotByDoctorAndDate(doctor.id, date);
        if (res.status !== 200) {
            showError(res.message);
            setSlots([]);
            return;
        }
        setSlots(res.data);
    };

    const groupedSlots = {
        morning: slots.filter(s => getTimePeriod(s.startTime) === "morning"),
        afternoon: slots.filter(s => getTimePeriod(s.startTime) === "afternoon"),
        evening: slots.filter(s => getTimePeriod(s.startTime) === "evening"),
    };

    useEffect(() => {
        fetchAvailableSlots();
    }, [date]);

    const dates = getNext30Days();
    const visibleDates = dates.slice(startIndex, startIndex + 7);

    return (
        <div className="w-full mx-auto p-6 rounded-2xl bg-white/80 backdrop-blur-md shadow-2xl border border-gray-200 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-foreground">
                Chọn lịch - {doctor.firstName} {doctor.lastName}
            </h2>

            <div className="mx-auto flex items-center gap-2">
                <button
                    onClick={() => setStartIndex(Math.max(0, startIndex - 7))}
                    disabled={startIndex === 0}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    <ChevronLeft />
                </button>

                <div className="flex gap-2 overflow-hidden">
                    {visibleDates.map((d) => (
                        <button
                            key={d}
                            onClick={() => setDate(d)}
                            className={`min-w-17.5 px-3 py-2 rounded-xl border text-center transition-all duration-200 ${date === d
                                ? "bg-primary text-white shadow-lg scale-105"
                                : "bg-white/70 border-gray-200 hover:bg-primary/10"
                                }`}
                        >
                            <div className={`text-xs text-foreground/70 ${date === d ? "text-white/70" : ""}`}>
                                {new Date(d).toLocaleDateString("vi-VN", { weekday: "long" })}
                            </div>
                            <div className={`font-semibold text-foreground ${date === d ? "text-white" : ""}`}>
                                {new Date(d).getDate()}/{new Date(d).getMonth() + 1}
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setStartIndex(Math.min(dates.length - 7, startIndex + 7))}
                    disabled={startIndex + 7 >= dates.length}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    <ChevronRight />
                </button>
            </div>

            <p className="text-foreground mb-2 col-span-full">Chọn một slot thời gian phù hợp
                <span className="font-semibold">{selectedSlot ? ` - Đã chọn: ${selectedSlot.startTime} - ${selectedSlot.endTime}` : ""}</span>
            </p>

            <div className="mt-2 min-h-64 max-h-100 overflow-y-auto p-4 border border-gray-200 shadow-2xl rounded-xl bg-white/70">
                {slots.length === 0 && date && (
                    <p className="text-foreground/50 mt-2 text-center">Không có lịch nào cho ngày này.</p>
                )}

                <div className="w-full flex flex-col gap-4 mt-2 max-h-72 overflow-y-auto pr-1">
                    {[
                        { key: "morning", label: "Buổi sáng", data: groupedSlots.morning },
                        { key: "afternoon", label: "Buổi chiều", data: groupedSlots.afternoon },
                        { key: "evening", label: "Buổi tối", data: groupedSlots.evening },
                    ].map(section =>
                        section.data.length > 0 && (
                            <div key={section.key}>

                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-foreground/70">
                                        {section.label}
                                    </span>
                                    <span className="text-xs text-foreground/40">
                                        {section.data.length} khung giờ
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                    {section.data.map((s) => {
                                        const isSelected = selectedSlot?.id === s.id;

                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() =>
                                                    isSelected
                                                        ? setSelectedSlot(undefined)
                                                        : setSelectedSlot(s)
                                                }
                                                className={`flex flex-col items-center justify-center rounded-xl border px-3 py-5 text-sm transition-all duration-200
                                                    ${isSelected
                                                        ? "bg-primary text-white border-primary shadow-md scale-105"
                                                        : "bg-white/80 border-gray-200 hover:bg-primary/5 hover:shadow-sm"
                                                    }
                                                `}
                                            >
                                                <span className="font-semibold">
                                                    {s.startTime} - {s.endTime}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            <textarea
                placeholder="Lý do khám..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border rounded-xl p-3 bg-white/70 backdrop-blur-sm text-foreground placeholder:text-foreground/50"
            />

            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border rounded-xl p-3 bg-white/70 backdrop-blur-sm text-foreground"
            >
                <option value="">Chọn loại khám</option>
                {AppointmentType
                    .filter(a => ["EXAMINATION", "CONSULTATION", "GENERAL_CHECK_UP", "VACCINATION"].includes(a.value))
                    .map((a) => (
                        <option key={a.value} value={a.value}>
                            {a.label}
                        </option>
                    ))
                }
            </select>

            <div className="flex justify-between mt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
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
                            type
                        });
                    }}
                    className="px-6 py-3 rounded-xl bg-primary text-white shadow-lg hover:scale-105 transition-all"
                >
                    Tiếp tục
                </button>
            </div>
        </div>
    );
}