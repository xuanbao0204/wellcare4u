"use client";

import { useEffect, useState } from "react";
import { createSchedule, getSchedulesByDoctor, } from "@/features/doctor/schedule/doctorScheduleService";

import { blockSlot, unblockSlot, getSlotsByDoctor, } from "@/features/doctor/schedule/timeSlotService";

import ActionButton from "@/shared/components/ActionButton";
import { useAuth } from "@/shared/AuthContext";
import Loader from "@/shared/ui/Loader";
import { showError } from "@/lib/toast";
import { Pencil } from "lucide-react";

const DAYS = [
    { value: 1, label: "Thứ 2" },
    { value: 2, label: "Thứ 3" },
    { value: 3, label: "Thứ 4" },
    { value: 4, label: "Thứ 5" },
    { value: 5, label: "Thứ 6" },
    { value: 6, label: "Thứ 7" },
    { value: 7, label: "Chủ nhật" },
];

const DURATIONS = [15, 30, 45, 60];

const TIMES = [
    "06:00", "07:00", "08:00", "09:00", "10:00",
    "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00"
];



export default function DoctorSchedulePage() {

    const [activeTab, setActiveTab] = useState<"schedule" | "slot">("schedule");

    const { user } = useAuth();
    if (!user) return <Loader />;
    const doctorId = user.id;

    const [schedules, setSchedules] = useState<any[]>([]);
    const [slots, setSlots] = useState<any[]>([]);
    const [weekOffset, setWeekOffset] = useState(0);

    const [form, setForm] = useState({
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        slotDurationMinutes: "",
    });

    const getWeekRange = () => {
        const now = new Date();

        const day = now.getDay();
        const diff = day === 0 ? -6 : 1 - day;

        const monday = new Date(now);
        monday.setDate(now.getDate() + diff + weekOffset * 7);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        return {
            from: monday.toISOString().split("T")[0],
            to: sunday.toISOString().split("T")[0],
            startDate: monday,
        };
    };

    const getWeekDays = () => {
        const { startDate } = getWeekRange();

        const day = startDate.getDay();
        const diff = day === 0 ? -6 : 1 - day;

        const monday = new Date(startDate);
        monday.setDate(startDate.getDate() + diff);

        return Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);

            return {
                date: d.toISOString().split("T")[0],
                dayOfWeek: i + 1,
            };
        });
    };

    const groupSlotsByDate = (slots: any[]) => {
        const map: Record<string, any[]> = {};

        slots.forEach((slot) => {
            if (!map[slot.date]) map[slot.date] = [];
            map[slot.date].push(slot);
        });

        Object.keys(map).forEach(date => {
            map[date].sort((a, b) =>
                a.startTime.localeCompare(b.startTime)
            );
        });

        return map;
    };

    const weekDays = getWeekDays();

    useEffect(() => {
        loadSchedules();
    }, []);

    useEffect(() => {
        loadSlots();
    }, [weekOffset]);

    const loadSchedules = async () => {
        const res = await getSchedulesByDoctor(doctorId);
        if (res.status !== 200) return showError(res.message);
        setSchedules(res.data);
    };

    const loadSlots = async () => {
        const { from, to } = getWeekRange();

        const res = await getSlotsByDoctor(doctorId, from, to);
        if (res.status !== 200) return showError(res.message);
        setSlots(res.data);
    };

    const handleCreate = async () => {
        await createSchedule(doctorId, {
            ...form,
            dayOfWeek: Number(form.dayOfWeek),
            slotDurationMinutes: Number(form.slotDurationMinutes),
        });

        await loadSchedules();
        await loadSlots();
    };

    const handleBlock = async (id: number) => {
        await blockSlot(id);
        await loadSlots();
    };

    const handleUnblock = async (id: number) => {
        await unblockSlot(id);
        await loadSlots();
    };

    const groupedSlots = groupSlotsByDate(slots);

    const maxOffset = Math.floor(30 / 7);

    const disablePrev = weekOffset <= 0;
    const disableNext = weekOffset >= maxOffset;

    const getDayLabel = (value: number) => {
        return DAYS.find(d => d.value === value)?.label || value;
    };

    return (
        <section className="mx-auto w-full p-6 space-y-6">

            <div className="rounded-3xl border border-primary/20 bg-white/80 backdrop-blur-md shadow-xl p-6">
                <h2 className="text-2xl font-bold text-primary">
                    Quản lý lịch làm việc
                </h2>
                <p className="text-sm text-foreground/60 mt-2">
                    Thiết lập lịch khám và quản lý các khung giờ làm việc của bạn
                </p>
            </div>

            <div className="w-full flex gap-2 border-b border-primary/10 pb-2">

                <button
                    onClick={() => setActiveTab("schedule")}
                    className={`w-auto
                        px-4 py-2 rounded-xl text-sm font-medium transition
                        ${activeTab === "schedule"
                                        ? "bg-primary text-white shadow"
                                        : "text-foreground/60 hover:bg-primary/5"}
                    `}
                >
                    Lịch làm việc
                </button>

                <button
                    onClick={() => setActiveTab("slot")}
                    className={`w-auto
                        px-4 py-2 rounded-xl text-sm font-medium transition
                        ${activeTab === "slot"
                                        ? "bg-primary text-white shadow"
                                        : "text-foreground/60 hover:bg-primary/5"}
                    `}
                >
                    Khung giờ (Slots)
                </button>

            </div>

            {activeTab === "schedule" && (
                <>
                    <div className="rounded-3xl border border-primary/20 bg-white/80 backdrop-blur-md shadow-xl p-6 space-y-4">

                        <div className="grid grid-cols-2 gap-4">

                            <select
                                value={form.dayOfWeek}
                                onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                                className="input"
                            >
                                <option value="">Chọn ngày</option>
                                {DAYS.map(d => (
                                    <option key={d.value} value={d.value}>
                                        {d.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={form.slotDurationMinutes}
                                onChange={(e) => setForm({ ...form, slotDurationMinutes: e.target.value })}
                                className="input"
                            >
                                <option value="">Thời lượng</option>
                                {DURATIONS.map(d => (
                                    <option key={d} value={d}>
                                        {d} phút
                                    </option>
                                ))}
                            </select>

                            <select
                                value={form.startTime}
                                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                className="input"
                            >
                                <option value="">Giờ bắt đầu</option>
                                {TIMES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>

                            <select
                                value={form.endTime}
                                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                                className="input"
                            >
                                <option value="">Giờ kết thúc</option>
                                {TIMES.filter(t => !form.startTime || t > form.startTime).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>

                        </div>

                        <ActionButton onClick={handleCreate}>
                            Tạo lịch
                        </ActionButton>
                    </div>

                    <div className="rounded-3xl border border-primary/20 bg-white/80 backdrop-blur-md shadow-xl p-6">

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-primary">
                                Lịch làm việc
                            </h3>

                            <span className="text-sm text-foreground/60">
                                {schedules.length} ngày đã thiết lập
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {[...schedules]
                                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                                .map((s) => (
                                    <div
                                        key={s.id}
                                        className="
                                    group
                                    flex flex-col justify-between
                                    rounded-2xl border border-primary/10
                                    bg-white/70 backdrop-blur
                                    px-5 py-4
                                    shadow-sm
                                    transition
                                    hover:shadow-md hover:border-primary/20
                                "
                                    >
                                        <div className="space-y-2">

                                            <p className="font-semibold text-base text-primary">
                                                {getDayLabel(s.dayOfWeek)}
                                            </p>

                                            <p className="text-sm text-foreground/70">
                                                {s.startTime} → {s.endTime}
                                            </p>

                                            <p className="text-xs text-foreground/50">
                                                Slot: {s.slotDurationMinutes} phút
                                            </p>

                                        </div>

                                        <div className="flex justify-end mt-4">
                                            <button
                                                className="
                                            flex items-center gap-1
                                            text-xs text-primary
                                            px-3 py-1.5
                                            rounded-lg
                                            border border-primary/15
                                            bg-white/60
                                            transition
                                            hover:bg-primary hover:text-white hover:border-primary
                                            opacity-80 group-hover:opacity-100
                                        "
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}

                        </div>
                    </div>

                </>)}

            {activeTab === "slot" && (

                <div className="rounded-3xl border border-primary/20 bg-white/80 backdrop-blur-md shadow-xl p-6">
                    <div className="flex items-center justify-between">

                        <button
                            disabled={disablePrev}
                            onClick={() => setWeekOffset(p => p - 1)}
                            className="text-sm px-3 py-1.5 rounded-lg border border-primary/15 hover:bg-primary/5 disabled:opacity-40"
                        >
                            ← Trước
                        </button>

                        <div className="text-center">
                            <p className="text-xs text-foreground/50">Tuần</p>
                            <p className="font-semibold text-primary">
                                {getWeekRange().from} → {getWeekRange().to}
                            </p>
                        </div>

                        <button
                            disabled={disableNext}
                            onClick={() => setWeekOffset(p => p + 1)}
                            className="text-sm px-3 py-1.5 rounded-lg border border-primary/15 hover:bg-primary/5 disabled:opacity-40"
                        >
                            Sau →
                        </button>

                    </div>

                    <div className="overflow-x-auto overflow-y-scroll max-h-200">
                        <div className="grid grid-cols-7 gap-4 min-w-225 py-2.5">

                            {weekDays.map(({ date, dayOfWeek }) => {
                                const daySlots = groupedSlots[date] || [];

                                const isToday =
                                    date === new Date().toISOString().split("T")[0];

                                return (
                                    <div key={date} className="space-y-3">

                                        <div
                                            className={`text-center space-y-1 ${isToday ? "bg-amber-100 border border-amber-300 rounded-xl py-2 shadow-sm" : "py-2"}`}>
                                            <p className={`text-base font-semibold ${isToday ? "text-amber-600" : "text-primary"}`}>
                                                {getDayLabel(dayOfWeek)}
                                            </p>

                                            <div className="flex items-center justify-center gap-2">
                                                <p className={`text-sm ${isToday ? "text-amber-600 font-medium" : "text-foreground/60"}`}>
                                                    {date}
                                                </p>

                                                {isToday && (
                                                    <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                                                        Hôm nay
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {daySlots.length === 0 && (
                                                <p className="text-xs text-center text-foreground/40">
                                                    Không có lịch
                                                </p>
                                            )}

                                            {daySlots.map(slot => (
                                                <div
                                                    key={slot.id}
                                                    className="rounded-2xl border p-3 text-center bg-white/70 shadow-sm"
                                                >
                                                    <p className="text-sm font-medium">
                                                        {slot.startTime} - {slot.endTime}
                                                    </p>

                                                    <div className="mt-2 flex justify-center">
                                                        {slot.status === "AVAILABLE" && (
                                                            <button
                                                                onClick={() => handleBlock(slot.id)}
                                                                className="text-xs px-3 py-1 rounded-full bg-primary text-white"
                                                            >
                                                                Block
                                                            </button>
                                                        )}

                                                        {slot.status === "BLOCKED" && (
                                                            <button
                                                                onClick={() => handleUnblock(slot.id)}
                                                                className="text-xs px-3 py-1 rounded-full border text-primary"
                                                            >
                                                                Unblock
                                                            </button>
                                                        )}

                                                        {slot.status === "BOOKED" && (
                                                            <span className="text-xs text-red-500">
                                                                Đã đặt
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </div>)}
        </section>
    );
}