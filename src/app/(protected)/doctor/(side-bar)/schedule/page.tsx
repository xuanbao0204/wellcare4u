"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    createSchedule,
    deleteSchedule,
    getSchedulesByDoctor,
    updateSchedule,
    type DoctorScheduleDTO,
    type UpdateScheduleRequest,
} from "@/features/doctor/schedule/doctorScheduleService";
import {
    blockSlot,
    getSlotsByDoctor,
    unblockSlot,
    type TimeSlotDTO,
} from "@/features/doctor/schedule/timeSlotService";
import {
    createDayOff,
    getDayOffsByDoctor,
    revokeDayOff,
    type DoctorExceptionDTO,
} from "@/features/doctor/schedule/doctorExceptionService";
import { showError, showSuccess } from "@/lib/toast";
import { useAuth } from "@/shared/AuthContext";
import ActionButton from "@/shared/components/ActionButton";
import Loader from "@/shared/ui/Loader";
import {
    Ban,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Pencil,
    ShieldCheck,
    Trash2,
    X,
} from "lucide-react";

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
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

type TabKey = "schedule" | "slots" | "dayoff";
type SlotStatus = TimeSlotDTO["status"] | "AVAILABLE";

const cardClassName =
    "rounded-[28px] border border-primary/15 bg-white/80 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)] backdrop-blur-xl";

const subCardClassName =
    "rounded-3xl border border-primary/10 bg-white/75 shadow-sm backdrop-blur";

const fieldClassName =
    "w-full rounded-2xl border border-primary/15 bg-white/85 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/35 focus:ring-4 focus:ring-primary/10";

const getWeekRange = (weekOffset: number) => {
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

const getWeekDays = (startDate: Date) => {
    const monday = new Date(startDate);
    return Array.from({ length: 7 }).map((_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return {
            date: date.toISOString().split("T")[0],
            dayOfWeek: index + 1,
        };
    });
};

export default function DoctorSchedulePage() {
    const { user } = useAuth();
    const doctorId = user?.id;

    const [activeTab, setActiveTab] = useState<TabKey>("schedule");
    const [schedules, setSchedules] = useState<DoctorScheduleDTO[]>([]);
    const [slots, setSlots] = useState<TimeSlotDTO[]>([]);
    const [exceptions, setExceptions] = useState<DoctorExceptionDTO[]>([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [blockingDate, setBlockingDate] = useState<string | null>(null);

    const [form, setForm] = useState({
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        slotDurationMinutes: "",
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<UpdateScheduleRequest>({
        startTime: "",
        endTime: "",
        slotDurationMinutes: 30,
        isActive: true,
    });
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [dayReasons, setDayReasons] = useState<Record<string, string>>({});

    const weekRange = useMemo(() => getWeekRange(weekOffset), [weekOffset]);
    const weekDays = useMemo(() => getWeekDays(weekRange.startDate), [weekRange]);

    const getDayLabel = (value: number) =>
        DAYS.find((day) => day.value === value)?.label || String(value);

    const isAvailableStatus = (status: SlotStatus) =>
        status === "FREE" || status === "AVAILABLE";

    const loadSchedules = useCallback(async () => {
        if (!doctorId) return;
        const res = await getSchedulesByDoctor(doctorId);
        if (res.status !== 200) { showError(res.message); return; }
        setSchedules(res.data);
    }, [doctorId]);

    const loadSlots = useCallback(async () => {
        if (!doctorId) return;
        const res = await getSlotsByDoctor(doctorId, weekRange.from, weekRange.to);
        if (res.status !== 200) { showError(res.message); return; }
        setSlots(res.data);
    }, [doctorId, weekRange]);

    const loadExceptions = useCallback(async () => {
        if (!doctorId) return;
        const res = await getDayOffsByDoctor();
        if (res.status !== 200) { showError(res.message); return; }
        setExceptions(res.data);
    }, [doctorId]);

    useEffect(() => { loadSchedules(); }, [loadSchedules]);
    useEffect(() => { loadSlots(); }, [loadSlots]);
    useEffect(() => { loadExceptions(); }, [loadExceptions]);

    const exceptionDateSet = useMemo(
        () => new Set(exceptions.map((e) => e.date)),
        [exceptions]
    );

    const groupedSlots = useMemo(() => {
        const map: Record<string, TimeSlotDTO[]> = {};
        slots.forEach((slot) => {
            if (!map[slot.date]) map[slot.date] = [];
            map[slot.date].push(slot);
        });
        Object.keys(map).forEach((date) => {
            map[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
        });
        return map;
    }, [slots]);

    const stats = useMemo(() => ({
        availableCount: slots.filter((s) => isAvailableStatus(s.status as SlotStatus)).length,
        blockedCount: slots.filter((s) => s.status === "BLOCKED").length,
        bookedCount: slots.filter((s) => s.status === "BOOKED").length,
    }), [slots]);

    const dayOffSummaries = useMemo(() => {
        return weekDays.map(({ date, dayOfWeek }) => {
            const daySlots = groupedSlots[date] || [];
            const available = daySlots.filter((s) => isAvailableStatus(s.status as SlotStatus));
            const blocked = daySlots.filter((s) => s.status === "BLOCKED");
            const booked = daySlots.filter((s) => s.status === "BOOKED");
            const hasOfficialException = exceptionDateSet.has(date);
            const exceptionRecord = exceptions.find((e) => e.date === date);

            return {
                date,
                dayOfWeek,
                daySlots,
                available,
                blocked,
                booked,
                hasOfficialException,
                exceptionRecord,
                isFullDayOff:
                    daySlots.length > 0 &&
                    available.length === 0 &&
                    blocked.length > 0,
            };
        });
    }, [groupedSlots, weekDays, exceptionDateSet, exceptions]);

    const handleCreate = async () => {
        if (!doctorId) return;
        setIsSubmitting(true);
        try {
            const res = await createSchedule(doctorId, {
                ...form,
                dayOfWeek: Number(form.dayOfWeek),
                slotDurationMinutes: Number(form.slotDurationMinutes),
            });
            if (res.status !== 200 && res.status !== 201) {
                showError(res.message);
                return;
            }
            showSuccess("Schedule created successfully");
            setForm({ dayOfWeek: "", startTime: "", endTime: "", slotDurationMinutes: "" });
            await loadSchedules();
            await loadSlots();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditStart = (schedule: DoctorScheduleDTO) => {
        setEditingId(schedule.id);
        setEditForm({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            slotDurationMinutes: schedule.slotDurationMinutes,
            isActive: schedule.isActive,
        });
    };

    const handleEditCancel = () => {
        setEditingId(null);
    };

    const handleEditSave = async (scheduleId: number) => {
        setIsSavingEdit(true);
        try {
            const res = await updateSchedule(scheduleId, editForm);
            if (res.status !== 200) { showError(res.message); return; }
            showSuccess("Schedule updated");
            setEditingId(null);
            await loadSchedules();
            await loadSlots();
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleDelete = async (scheduleId: number) => {
        if (!confirm("Delete this schedule? All future AVAILABLE slots will be removed.")) return;
        setDeletingId(scheduleId);
        try {
            await deleteSchedule(scheduleId);
            showSuccess("Schedule deleted");
            await loadSchedules();
            await loadSlots();
        } finally {
            setDeletingId(null);
        }
    };

    const handleBlock = async (id: number) => {
        await blockSlot(id);
        await loadSlots();
    };

    const handleUnblock = async (id: number) => {
        await unblockSlot(id);
        await loadSlots();
    };

    const handleBlockDay = async (date: string) => {
        if (!doctorId) return;
        setBlockingDate(date);
        try {
            const res = await createDayOff({
                date,
                reason: dayReasons[date] || "",
            });
            if (res.status !== 200 && res.status !== 201) {
                showError(res.message);
                return;
            }
            showSuccess("Day-off registered");
            setDayReasons((prev) => ({ ...prev, [date]: "" }));
            await loadSlots();
            await loadExceptions();
        } finally {
            setBlockingDate(null);
        }
    };

    const handleUnblockDay = async (date: string) => {
        if (!doctorId) return;
        setBlockingDate(date);
        try {
            await revokeDayOff(date);
            showSuccess("Day-off revoked");
            await loadSlots();
            await loadExceptions();
        } finally {
            setBlockingDate(null);
        }
    };

    const maxOffset = Math.floor(30 / 7);

    if (!user) return <Loader />;

    return (
        <section className="mx-auto w-full space-y-6">
            {/*  Header  */}
            <div className="relative overflow-hidden rounded-4xl border border-primary/15 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.9))] p-6 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl md:p-8">
                <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl space-y-3">
                        <span className="inline-flex items-center rounded-full border border-primary/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                            Cài đặt lịch làm việc
                        </span>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-primary md:text-3xl">
                                Quản lý lịch làm việc của bác sỹ
                            </h1>
                            <p className="text-sm leading-6 text-foreground/65 md:text-base">
                                Quản lý về lịch tuần, các slots và thiết lập ngày nghỉ
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            { label: "Khung giờ làm việc", value: schedules.length, color: "text-primary" },
                            { label: "Số slots", value: stats.availableCount, color: "text-emerald-600" },
                            { label: "Đã khóa", value: stats.blockedCount, color: "text-amber-600" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">{label}</p>
                                <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/*  Tabs  */}
            <div className="flex flex-wrap gap-2 rounded-[26px] border border-primary/10 bg-white/70 p-2 backdrop-blur">
                {[
                    { key: "schedule" as TabKey, label: "Lịch làm việc", icon: CalendarDays },
                    { key: "slots" as TabKey, label: "Quản lý slots", icon: Clock3 },
                    { key: "dayoff" as TabKey, label: "Quản lý ngày nghỉ", icon: Ban },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${active
                                    ? "bg-primary text-white shadow-md"
                                    : "text-foreground/65 hover:bg-primary/5 hover:text-primary"
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/*  Schedule Tab  */}
            {activeTab === "schedule" && (
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    {/* Create form */}
                    <section className={cardClassName}>
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                                <CalendarDays size={14} />
                                Quản lý lịch làm việc
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900">Tạo, chỉnh sửa lịch làm việc</h2>
                            <p className="text-sm leading-6 text-foreground/60">
                                Cài đặt ngày, khung giờ, và thời gian cho mỗi lượt khám
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <label className="space-y-2 text-sm">
                                <span className="font-medium text-slate-700">Ngày</span>
                                <select
                                    value={form.dayOfWeek}
                                    onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                                    className={fieldClassName}
                                >
                                    <option value="">Chọn ngày</option>
                                    {DAYS.map((day) => (
                                        <option key={day.value} value={day.value}>{day.label}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="space-y-2 text-sm">
                                <span className="font-medium text-slate-700">Thời lượng lượt khám</span>
                                <select
                                    value={form.slotDurationMinutes}
                                    onChange={(e) => setForm({ ...form, slotDurationMinutes: e.target.value })}
                                    className={fieldClassName}
                                >
                                    <option value="">Chọn thời lượng</option>
                                    {DURATIONS.map((d) => (
                                        <option key={d} value={d}>{d} min</option>
                                    ))}
                                </select>
                            </label>

                            <label className="space-y-2 text-sm">
                                <span className="font-medium text-slate-700">Thời gian bắt đầu</span>
                                <select
                                    value={form.startTime}
                                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                    className={fieldClassName}
                                >
                                    <option value="">Chọn thời gian bắt đầu</option>
                                    {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </label>

                            <label className="space-y-2 text-sm">
                                <span className="font-medium text-slate-700">Thời gian kết thúc</span>
                                <select
                                    value={form.endTime}
                                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                                    className={fieldClassName}
                                >
                                    <option value="">Chọn thời gian kết thúc</option>
                                    {TIMES.filter((t) => !form.startTime || t > form.startTime).map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="w-full md:w-56 mx-auto">
                                <ActionButton onClick={handleCreate} disabled={isSubmitting}>
                                    {isSubmitting ? "Đang tạo..." : "Tạo lịch"}
                                </ActionButton>
                            </div>
                        </div>
                    </section>

                    {/* Schedule list */}
                    <section className={cardClassName}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                                    <Clock3 size={14} />
                                    Lịch đang hoạt động
                                </div>
                                <h2 className="text-xl font-semibold text-slate-900">Các ngày làm việc đã cài đặt</h2>
                            </div>
                            <div className="rounded-2xl border border-primary/10 bg-white/80 px-4 py-3 text-right shadow-sm">
                                <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">Total</p>
                                <p className="mt-1 text-2xl font-semibold text-primary">{schedules.length}</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {schedules.length === 0 && (
                                <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/5 px-6 py-10 text-center text-sm text-foreground/55">
                                    Chưa thiết lập
                                </div>
                            )}

                            {[...schedules]
                                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                                .map((schedule) =>
                                    editingId === schedule.id ? (
                                        /*  Inline edit form  */
                                        <article key={schedule.id} className={`${subCardClassName} p-4`}>
                                            <div className="mb-3 flex items-center justify-between gap-2">
                                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                    {getDayLabel(schedule.dayOfWeek)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={handleEditCancel}
                                                    className="rounded-full p-1 text-foreground/40 hover:bg-primary/5 hover:text-foreground/70"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            <div className="grid gap-3 md:grid-cols-2">
                                                <label className="space-y-1.5 text-sm">
                                                    <span className="font-medium text-slate-700">Start time</span>
                                                    <select
                                                        value={editForm.startTime}
                                                        onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                                                        className={fieldClassName}
                                                    >
                                                        {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                </label>

                                                <label className="space-y-1.5 text-sm">
                                                    <span className="font-medium text-slate-700">End time</span>
                                                    <select
                                                        value={editForm.endTime}
                                                        onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                                                        className={fieldClassName}
                                                    >
                                                        {TIMES.filter((t) => t > editForm.startTime).map((t) => (
                                                            <option key={t} value={t}>{t}</option>
                                                        ))}
                                                    </select>
                                                </label>

                                                <label className="space-y-1.5 text-sm">
                                                    <span className="font-medium text-slate-700">Duration</span>
                                                    <select
                                                        value={editForm.slotDurationMinutes}
                                                        onChange={(e) => setEditForm({ ...editForm, slotDurationMinutes: Number(e.target.value) })}
                                                        className={fieldClassName}
                                                    >
                                                        {DURATIONS.map((d) => <option key={d} value={d}>{d} min</option>)}
                                                    </select>
                                                </label>

                                                <label className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-white/85 px-4 py-3 text-sm shadow-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={editForm.isActive}
                                                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                                                        className="h-4 w-4 rounded accent-primary"
                                                    />
                                                    <span className="font-medium text-slate-700">Active</span>
                                                </label>
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    type="button"
                                                    disabled={isSavingEdit}
                                                    onClick={() => handleEditSave(schedule.id)}
                                                    className="flex-1 rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-50"
                                                >
                                                    {isSavingEdit ? "Đang lưu..." : "Lưu thay đổi"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleEditCancel}
                                                    className="rounded-2xl border border-primary/15 bg-white px-4 py-2.5 text-sm font-medium text-foreground/65 transition hover:bg-primary/5"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        </article>
                                    ) : (
                                        /*  Read-only card  */
                                        <article key={schedule.id} className={`${subCardClassName} p-4`}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                            {getDayLabel(schedule.dayOfWeek)}
                                                        </span>
                                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                            {schedule.slotDurationMinutes} phút/slot
                                                        </span>
                                                        {!schedule.isActive && (
                                                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                                                                Không hoạt động
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-base font-semibold text-slate-900">
                                                        {schedule.startTime} – {schedule.endTime}
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditStart(schedule)}
                                                        className="rounded-xl border border-primary/15 bg-white p-2 text-primary/70 transition hover:bg-primary/5 hover:text-primary"
                                                        title="Edit schedule"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={deletingId === schedule.id}
                                                        onClick={() => handleDelete(schedule.id)}
                                                        className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-500 transition hover:bg-rose-100 disabled:opacity-50"
                                                        title="Delete schedule"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                )}
                        </div>
                    </section>
                </div>
            )}

            {/*  Slots Tab  */}
            {activeTab === "slots" && (
                <section className={cardClassName}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                                <Clock3 size={14} />
                                Quản lý slots
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900">Quản lý các slot, xem tổng quan và thực hiện các hành động</h2>
                        </div>

                        <div className="flex items-center gap-3 self-start lg:self-auto">
                            <button
                                type="button"
                                disabled={weekOffset <= 0}
                                onClick={() => setWeekOffset((prev) => prev - 1)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/85 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                <ChevronLeft size={16} />
                                Trước
                            </button>

                            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-2.5 text-center">
                                <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">Tuần</p>
                                <p className="text-sm font-semibold text-primary">
                                    {weekRange.from} – {weekRange.to}
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={weekOffset >= maxOffset}
                                onClick={() => setWeekOffset((prev) => prev + 1)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/85 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                Sau
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {weekDays.map(({ date, dayOfWeek }) => {
                            const daySlots = groupedSlots[date] || [];
                            const isToday = date === new Date().toISOString().split("T")[0];
                            const hasException = exceptionDateSet.has(date);

                            return (
                                <article key={date} className={`${subCardClassName} p-4`}>
                                    <div className={`rounded-2xl border px-4 py-3 ${hasException
                                            ? "border-amber-300 bg-amber-50"
                                            : isToday
                                                ? "border-sky-300 bg-sky-50"
                                                : "border-primary/10 bg-white/80"
                                        }`}>
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-semibold text-slate-900">{getDayLabel(dayOfWeek)}</p>
                                            <div className="flex items-center gap-1.5">
                                                {isToday && (
                                                    <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                                                        Hôm nay
                                                    </span>
                                                )}
                                                {hasException && (
                                                    <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                                                        Ngày nghỉ
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="mt-1 text-sm text-foreground/55">{date}</p>
                                    </div>

                                    <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                                        {daySlots.length === 0 && (
                                            <div className="rounded-2xl border border-dashed border-primary/15 bg-primary/5 px-3 py-5 text-center text-xs text-foreground/45">
                                                Không có lịch
                                            </div>
                                        )}

                                        {daySlots.map((slot) => {
                                            const isAvailable = isAvailableStatus(slot.status as SlotStatus);
                                            return (
                                                <div key={slot.id} className="rounded-2xl border border-primary/10 bg-white/85 px-3 py-3 shadow-sm">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {slot.startTime} – {slot.endTime}
                                                            </p>
                                                            <p className="text-xs text-foreground/45">{slot.status}</p>
                                                        </div>

                                                        {isAvailable && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleBlock(slot.id)}
                                                                className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-95"
                                                            >
                                                                Khóa slot
                                                            </button>
                                                        )}
                                                        {slot.status === "BLOCKED" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUnblock(slot.id)}
                                                                className="rounded-full border border-primary/20 bg-white px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/5"
                                                            >
                                                                Còn trống
                                                            </button>
                                                        )}
                                                        {slot.status === "BOOKED" && (
                                                            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600">
                                                                Đã được đặt
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {/*  Day Off Tab  */}
            {activeTab === "dayoff" && (
                <section className={cardClassName}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                                <Ban size={14} />
                                Ngày nghỉ
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900">Quản lý ngày nghỉ dựa theo ngày</h2>
                            <p className="max-w-3xl text-sm leading-6 text-foreground/60">
                                Đăng ký ngày nghỉ theo từng ngày cụ thể. Các slot còn trống sẽ bị hủy bỏ, ngoại trừ những slot đã được đặt. Bạn phải hủy các slot đã được đặt
                                một cách thủ công và phải liên hệ bệnh nhân để giải quyết về việc đặt lịch lại.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 text-right">
                            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-800">
                                Các slot đẫ được đặt sẽ được giữ nguyên
                            </div>
                            {exceptions.length > 0 && (
                                <p className="text-xs text-foreground/45">
                                    {exceptions.length} ngày nghỉ
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Navigation (same week selector) */}
                    <div className="mt-5 flex items-center gap-3 self-start">
                        <button
                            type="button"
                            disabled={weekOffset <= 0}
                            onClick={() => setWeekOffset((prev) => prev - 1)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/85 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            <ChevronLeft size={16} />
                            Trước
                        </button>

                        <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-2.5 text-center">
                            <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">Tuần</p>
                            <p className="text-sm font-semibold text-primary">
                                {weekRange.from} – {weekRange.to}
                            </p>
                        </div>

                        <button
                            type="button"
                            disabled={weekOffset >= maxOffset}
                            onClick={() => setWeekOffset((prev) => prev + 1)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/85 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            Tiếp theo
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="mt-6 grid gap-4 xl:grid-cols-2">
                        {dayOffSummaries.map((summary) => {
                            const isBusy = blockingDate === summary.date;
                            const isOfficialDayOff = summary.hasOfficialException;
                            const isBeforeToday = (date: string) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return new Date(date) < today;
                            };
                            const isPast = isBeforeToday(summary.date);

                            return (
                                <article key={summary.date} className={`${subCardClassName} p-5 ${isOfficialDayOff ? "border-amber-200 bg-amber-50/40" : ""
                                    }`}>
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                                    {getDayLabel(summary.dayOfWeek)}
                                                </span>
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${isOfficialDayOff
                                                        ? "border border-amber-300 bg-amber-100 text-amber-800"
                                                        : summary.isFullDayOff
                                                            ? "border border-orange-200 bg-orange-50 text-orange-700"
                                                            : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    }`}>
                                                    {isOfficialDayOff
                                                        ? "Ngày nghỉ"
                                                        : summary.isFullDayOff
                                                            ? "Một phần bị khóa"
                                                            : "Một phần được mở"}
                                                </span>
                                            </div>

                                            <p className="text-lg font-semibold text-slate-900">{summary.date}</p>

                                            {/* Official exception reason */}
                                            {isOfficialDayOff && summary.exceptionRecord?.reason && (
                                                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                                    📝 {summary.exceptionRecord.reason}
                                                </p>
                                            )}

                                            <p className="text-sm text-foreground/55">
                                                {summary.blocked.length} đã khóa&nbsp;•&nbsp;
                                                {summary.available.length} còn mở&nbsp;•&nbsp;
                                                {summary.booked.length} đã được đặt
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {/* Reason input — only show when not an official day off yet */}
                                            {!isOfficialDayOff && (
                                                <input
                                                    type="text"
                                                    value={dayReasons[summary.date] || ""}
                                                    onChange={(e) =>
                                                        setDayReasons((prev) => ({
                                                            ...prev,
                                                            [summary.date]: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Lý do (tùy chọn)"
                                                    className="w-full rounded-2xl border border-primary/15 bg-white/85 px-3 py-2 text-xs text-foreground shadow-sm outline-none transition focus:border-primary/35 focus:ring-2 focus:ring-primary/10"
                                                />
                                            )}

                                            <div className="flex flex-wrap gap-2">
                                                {/* Block day — only if not yet official exception */}
                                                {!isOfficialDayOff && (
                                                    <button
                                                        type="button"
                                                        disabled={isBusy || isPast}
                                                        onClick={() => handleBlockDay(summary.date)}
                                                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
                                                    >
                                                        <Ban size={14} />
                                                        {isBusy ? "Đang thực hiện..." : "Đăng ký ngày nghỉ"}
                                                    </button>
                                                )}

                                                {/* Revoke — only if official exception exists */}
                                                {isOfficialDayOff && (
                                                    <button
                                                        type="button"
                                                        disabled={isBusy || isPast}
                                                        onClick={() => handleUnblockDay(summary.date)}
                                                        className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/85 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
                                                    >
                                                        <ShieldCheck size={14} />
                                                        {isBusy ? "Đang thực hiện..." : "Thu hồi ngày nghỉ"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </section>
    );
}

// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//     createSchedule,
//     getSchedulesByDoctor,
//     type DoctorScheduleDTO,
// } from "@/features/doctor/schedule/doctorScheduleService";
// import {
//     blockSlot,
//     getSlotsByDoctor,
//     unblockSlot,
//     type TimeSlotDTO,
// } from "@/features/doctor/schedule/timeSlotService";
// import { showError } from "@/lib/toast";
// import { useAuth } from "@/shared/AuthContext";
// import ActionButton from "@/shared/components/ActionButton";
// import Loader from "@/shared/ui/Loader";
// import {
//     Ban,
//     CalendarDays,
//     ChevronLeft,
//     ChevronRight,
//     Clock3,
//     ShieldCheck,
// } from "lucide-react";

// const DAYS = [
//     { value: 1, label: "Thu 2" },
//     { value: 2, label: "Thu 3" },
//     { value: 3, label: "Thu 4" },
//     { value: 4, label: "Thu 5" },
//     { value: 5, label: "Thu 6" },
//     { value: 6, label: "Thu 7" },
//     { value: 7, label: "Chu nhat" },
// ];

// const DURATIONS = [15, 30, 45, 60];

// const TIMES = [
//     "06:00",
//     "07:00",
//     "08:00",
//     "09:00",
//     "10:00",
//     "11:00",
//     "12:00",
//     "13:00",
//     "14:00",
//     "15:00",
//     "16:00",
//     "17:00",
//     "18:00",
//     "19:00",
//     "20:00",
// ];

// type TabKey = "schedule" | "slots" | "dayoff";
// type SlotStatus = TimeSlotDTO["status"] | "AVAILABLE";

// const cardClassName =
//     "rounded-[28px] border border-primary/15 bg-white/80 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)] backdrop-blur-xl";

// const subCardClassName =
//     "rounded-3xl border border-primary/10 bg-white/75 shadow-sm backdrop-blur";

// const fieldClassName =
//     "w-full rounded-2xl border border-primary/15 bg-white/85 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/35 focus:ring-4 focus:ring-primary/10";

// const getWeekRange = (weekOffset: number) => {
//     const now = new Date();
//     const day = now.getDay();
//     const diff = day === 0 ? -6 : 1 - day;

//     const monday = new Date(now);
//     monday.setDate(now.getDate() + diff + weekOffset * 7);

//     const sunday = new Date(monday);
//     sunday.setDate(monday.getDate() + 6);

//     return {
//         from: monday.toISOString().split("T")[0],
//         to: sunday.toISOString().split("T")[0],
//         startDate: monday,
//     };
// };

// const getWeekDays = (startDate: Date) => {
//     const monday = new Date(startDate);

//     return Array.from({ length: 7 }).map((_, index) => {
//         const date = new Date(monday);
//         date.setDate(monday.getDate() + index);

//         return {
//             date: date.toISOString().split("T")[0],
//             dayOfWeek: index + 1,
//         };
//     });
// };

// export default function DoctorSchedulePage() {
//     const { user } = useAuth();
//     const doctorId = user?.id;

//     const [activeTab, setActiveTab] = useState<TabKey>("schedule");
//     const [schedules, setSchedules] = useState<DoctorScheduleDTO[]>([]);
//     const [slots, setSlots] = useState<TimeSlotDTO[]>([]);
//     const [weekOffset, setWeekOffset] = useState(0);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [blockingDate, setBlockingDate] = useState<string | null>(null);
//     const [form, setForm] = useState({
//         dayOfWeek: "",
//         startTime: "",
//         endTime: "",
//         slotDurationMinutes: "",
//     });

//     const weekRange = useMemo(() => getWeekRange(weekOffset), [weekOffset]);
//     const weekDays = useMemo(() => getWeekDays(weekRange.startDate), [weekRange]);

//     const getDayLabel = (value: number) =>
//         DAYS.find((day) => day.value === value)?.label || String(value);

//     const isAvailableStatus = (status: SlotStatus) =>
//         status === "FREE" || status === "AVAILABLE";

//     const loadSchedules = useCallback(async () => {
//         if (!doctorId) return;

//         const res = await getSchedulesByDoctor(doctorId);
//         if (res.status !== 200) {
//             showError(res.message);
//             return;
//         }

//         setSchedules(res.data);
//     }, [doctorId]);

//     const loadSlots = useCallback(async () => {
//         if (!doctorId) return;

//         const res = await getSlotsByDoctor(doctorId, weekRange.from, weekRange.to);
//         if (res.status !== 200) {
//             showError(res.message);
//             return;
//         }

//         setSlots(res.data);
//     }, [doctorId, weekRange]);

//     useEffect(() => {
//         loadSchedules();
//     }, [loadSchedules]);

//     useEffect(() => {
//         loadSlots();
//     }, [loadSlots]);

//     const groupedSlots = useMemo(() => {
//         const map: Record<string, TimeSlotDTO[]> = {};

//         slots.forEach((slot) => {
//             if (!map[slot.date]) map[slot.date] = [];
//             map[slot.date].push(slot);
//         });

//         Object.keys(map).forEach((date) => {
//             map[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
//         });

//         return map;
//     }, [slots]);

//     const stats = useMemo(() => {
//         const availableCount = slots.filter((slot) =>
//             isAvailableStatus(slot.status as SlotStatus)
//         ).length;
//         const blockedCount = slots.filter((slot) => slot.status === "BLOCKED").length;
//         const bookedCount = slots.filter((slot) => slot.status === "BOOKED").length;

//         return { availableCount, blockedCount, bookedCount };
//     }, [slots]);

//     const dayOffSummaries = useMemo(() => {
//         return weekDays.map(({ date, dayOfWeek }) => {
//             const daySlots = groupedSlots[date] || [];
//             const available = daySlots.filter((slot) =>
//                 isAvailableStatus(slot.status as SlotStatus)
//             );
//             const blocked = daySlots.filter((slot) => slot.status === "BLOCKED");
//             const booked = daySlots.filter((slot) => slot.status === "BOOKED");

//             return {
//                 date,
//                 dayOfWeek,
//                 daySlots,
//                 available,
//                 blocked,
//                 booked,
//                 isFullDayOff:
//                     daySlots.length > 0 &&
//                     available.length === 0 &&
//                     blocked.length > 0,
//             };
//         });
//     }, [groupedSlots, weekDays]);

//     const handleCreate = async () => {
//         if (!doctorId) return;

//         setIsSubmitting(true);

//         try {
//             await createSchedule(doctorId, {
//                 ...form,
//                 dayOfWeek: Number(form.dayOfWeek),
//                 slotDurationMinutes: Number(form.slotDurationMinutes),
//             });

//             setForm({
//                 dayOfWeek: "",
//                 startTime: "",
//                 endTime: "",
//                 slotDurationMinutes: "",
//             });

//             await loadSchedules();
//             await loadSlots();
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleBlock = async (id: number) => {
//         await blockSlot(id);
//         await loadSlots();
//     };

//     const handleUnblock = async (id: number) => {
//         await unblockSlot(id);
//         await loadSlots();
//     };

//     const handleBlockDay = async (date: string) => {
//         const daySlots = groupedSlots[date] || [];
//         const targetSlots = daySlots.filter((slot) =>
//             isAvailableStatus(slot.status as SlotStatus)
//         );

//         if (targetSlots.length === 0) return;

//         setBlockingDate(date);
//         try {
//             await Promise.all(targetSlots.map((slot) => blockSlot(slot.id)));
//             await loadSlots();
//         } finally {
//             setBlockingDate(null);
//         }
//     };

//     const handleUnblockDay = async (date: string) => {
//         const daySlots = groupedSlots[date] || [];
//         const targetSlots = daySlots.filter((slot) => slot.status === "BLOCKED");

//         if (targetSlots.length === 0) return;

//         setBlockingDate(date);
//         try {
//             await Promise.all(targetSlots.map((slot) => unblockSlot(slot.id)));
//             await loadSlots();
//         } finally {
//             setBlockingDate(null);
//         }
//     };

//     const maxOffset = Math.floor(30 / 7);

//     if (!user) return <Loader />;

//     return (
//         <section className="mx-auto w-full space-y-6">
//             <div className="relative overflow-hidden rounded-[32px] border border-primary/15 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.9))] p-6 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl md:p-8">
//                 <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
//                 <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />

//                 <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//                     <div className="max-w-2xl space-y-3">
//                         <span className="inline-flex items-center rounded-full border border-primary/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
//                             Schedule settings
//                         </span>
//                         <div className="space-y-2">
//                             <h1 className="text-2xl font-bold text-primary md:text-3xl">
//                                 Modern schedule management
//                             </h1>
//                             <p className="text-sm leading-6 text-foreground/65 md:text-base">
//                                 Keep the same logic, but manage weekly templates, slots,
//                                 and day-off actions in a cleaner tabbed workflow.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="grid gap-3 sm:grid-cols-3">
//                         <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
//                             <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">
//                                 Templates
//                             </p>
//                             <p className="mt-2 text-2xl font-semibold text-primary">
//                                 {schedules.length}
//                             </p>
//                         </div>

//                         <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
//                             <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">
//                                 Open slots
//                             </p>
//                             <p className="mt-2 text-2xl font-semibold text-emerald-600">
//                                 {stats.availableCount}
//                             </p>
//                         </div>

//                         <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
//                             <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">
//                                 Blocked
//                             </p>
//                             <p className="mt-2 text-2xl font-semibold text-amber-600">
//                                 {stats.blockedCount}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="flex flex-wrap gap-2 rounded-[26px] border border-primary/10 bg-white/70 p-2 backdrop-blur">
//                 {[
//                     { key: "schedule" as TabKey, label: "Work schedule", icon: CalendarDays },
//                     { key: "slots" as TabKey, label: "Time slots", icon: Clock3 },
//                     { key: "dayoff" as TabKey, label: "Day off", icon: Ban },
//                 ].map((tab) => {
//                     const Icon = tab.icon;
//                     const active = activeTab === tab.key;

//                     return (
//                         <button
//                             key={tab.key}
//                             type="button"
//                             onClick={() => setActiveTab(tab.key)}
//                             className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
//                                 active
//                                     ? "bg-primary text-white shadow-md"
//                                     : "text-foreground/65 hover:bg-primary/5 hover:text-primary"
//                             }`}
//                         >
//                             <Icon size={16} />
//                             {tab.label}
//                         </button>
//                     );
//                 })}
//             </div>

//             {activeTab === "schedule" && (
//                 <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
//                     <section className={cardClassName}>
//                         <div className="space-y-2">
//                             <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
//                                 <CalendarDays size={14} />
//                                 Work schedule
//                             </div>
//                             <h2 className="text-xl font-semibold text-slate-900">
//                                 Create recurring schedule
//                             </h2>
//                             <p className="text-sm leading-6 text-foreground/60">
//                                 Set weekly working days, working hours, and slot duration.
//                             </p>
//                         </div>

//                         <div className="mt-6 grid gap-4 md:grid-cols-2">
//                             <label className="space-y-2 text-sm">
//                                 <span className="font-medium text-slate-700">Day</span>
//                                 <select
//                                     value={form.dayOfWeek}
//                                     onChange={(event) =>
//                                         setForm({ ...form, dayOfWeek: event.target.value })
//                                     }
//                                     className={fieldClassName}
//                                 >
//                                     <option value="">Select day</option>
//                                     {DAYS.map((day) => (
//                                         <option key={day.value} value={day.value}>
//                                             {day.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </label>

//                             <label className="space-y-2 text-sm">
//                                 <span className="font-medium text-slate-700">Duration</span>
//                                 <select
//                                     value={form.slotDurationMinutes}
//                                     onChange={(event) =>
//                                         setForm({
//                                             ...form,
//                                             slotDurationMinutes: event.target.value,
//                                         })
//                                     }
//                                     className={fieldClassName}
//                                 >
//                                     <option value="">Select duration</option>
//                                     {DURATIONS.map((duration) => (
//                                         <option key={duration} value={duration}>
//                                             {duration} min
//                                         </option>
//                                     ))}
//                                 </select>
//                             </label>

//                             <label className="space-y-2 text-sm">
//                                 <span className="font-medium text-slate-700">Start time</span>
//                                 <select
//                                     value={form.startTime}
//                                     onChange={(event) =>
//                                         setForm({ ...form, startTime: event.target.value })
//                                     }
//                                     className={fieldClassName}
//                                 >
//                                     <option value="">Select start time</option>
//                                     {TIMES.map((time) => (
//                                         <option key={time} value={time}>
//                                             {time}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </label>

//                             <label className="space-y-2 text-sm">
//                                 <span className="font-medium text-slate-700">End time</span>
//                                 <select
//                                     value={form.endTime}
//                                     onChange={(event) =>
//                                         setForm({ ...form, endTime: event.target.value })
//                                     }
//                                     className={fieldClassName}
//                                 >
//                                     <option value="">Select end time</option>
//                                     {TIMES.filter(
//                                         (time) => !form.startTime || time > form.startTime
//                                     ).map((time) => (
//                                         <option key={time} value={time}>
//                                             {time}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </label>
//                         </div>

//                         <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                             <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-foreground/70">
//                                 Create the weekly template here, then fine-tune availability in the slot tab.
//                             </div>

//                             <div className="w-full md:w-56">
//                                 <ActionButton onClick={handleCreate} disabled={isSubmitting}>
//                                     {isSubmitting ? "Creating..." : "Create schedule"}
//                                 </ActionButton>
//                             </div>
//                         </div>
//                     </section>

//                     <section className={cardClassName}>
//                         <div className="flex items-start justify-between gap-4">
//                             <div className="space-y-2">
//                                 <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
//                                     <Clock3 size={14} />
//                                     Active templates
//                                 </div>
//                                 <h2 className="text-xl font-semibold text-slate-900">
//                                     Working days configured
//                                 </h2>
//                                 <p className="text-sm leading-6 text-foreground/60">
//                                     Quick overview of recurring weekly schedules.
//                                 </p>
//                             </div>

//                             <div className="rounded-2xl border border-primary/10 bg-white/80 px-4 py-3 text-right shadow-sm">
//                                 <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">
//                                     Total
//                                 </p>
//                                 <p className="mt-1 text-2xl font-semibold text-primary">
//                                     {schedules.length}
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="mt-6 space-y-3">
//                             {schedules.length === 0 && (
//                                 <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/5 px-6 py-10 text-center text-sm text-foreground/55">
//                                     No schedule template yet.
//                                 </div>
//                             )}

//                             {[...schedules]
//                                 .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
//                                 .map((schedule) => (
//                                     <article key={schedule.id} className={`${subCardClassName} p-4`}>
//                                         <div className="flex items-start justify-between gap-4">
//                                             <div className="space-y-2">
//                                                 <div className="flex flex-wrap items-center gap-2">
//                                                     <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
//                                                         {getDayLabel(schedule.dayOfWeek)}
//                                                     </span>
//                                                     <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
//                                                         {schedule.slotDurationMinutes} min/slot
//                                                     </span>
//                                                 </div>
//                                                 <p className="text-base font-semibold text-slate-900">
//                                                     {schedule.startTime} - {schedule.endTime}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </article>
//                                 ))}
//                         </div>
//                     </section>
//                 </div>
//             )}

//             {activeTab === "slots" && (
//                 <section className={cardClassName}>
//                     <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                         <div className="space-y-2">
//                             <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
//                                 <Clock3 size={14} />
//                                 Time slots
//                             </div>
//                             <h2 className="text-xl font-semibold text-slate-900">
//                                 Compact weekly slot board
//                             </h2>
//                             <p className="text-sm leading-6 text-foreground/60">
//                                 A shorter, denser weekly view for faster scanning.
//                             </p>
//                         </div>

//                         <div className="flex items-center gap-3 self-start lg:self-auto">
//                             <button
//                                 type="button"
//                                 disabled={weekOffset <= 0}
//                                 onClick={() => setWeekOffset((prev) => prev - 1)}
//                                 className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/85 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
//                             >
//                                 <ChevronLeft size={16} />
//                                 Prev
//                             </button>

//                             <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-2.5 text-center">
//                                 <p className="text-xs uppercase tracking-[0.14em] text-foreground/45">
//                                     Week
//                                 </p>
//                                 <p className="text-sm font-semibold text-primary">
//                                     {weekRange.from} - {weekRange.to}
//                                 </p>
//                             </div>

//                             <button
//                                 type="button"
//                                 disabled={weekOffset >= maxOffset}
//                                 onClick={() => setWeekOffset((prev) => prev + 1)}
//                                 className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/85 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
//                             >
//                                 Next
//                                 <ChevronRight size={16} />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
//                         {weekDays.map(({ date, dayOfWeek }) => {
//                             const daySlots = groupedSlots[date] || [];
//                             const isToday = date === new Date().toISOString().split("T")[0];

//                             return (
//                                 <article key={date} className={`${subCardClassName} p-4`}>
//                                     <div
//                                         className={`rounded-2xl border px-4 py-3 ${
//                                             isToday
//                                                 ? "border-amber-300 bg-amber-50"
//                                                 : "border-primary/10 bg-white/80"
//                                         }`}
//                                     >
//                                         <div className="flex items-center justify-between gap-2">
//                                             <p className="font-semibold text-slate-900">
//                                                 {getDayLabel(dayOfWeek)}
//                                             </p>
//                                             {isToday && (
//                                                 <span className="rounded-full bg-amber-500 px-2 py-1 text-[11px] font-semibold text-white">
//                                                     Today
//                                                 </span>
//                                             )}
//                                         </div>
//                                         <p className="mt-1 text-sm text-foreground/55">{date}</p>
//                                     </div>

//                                     <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
//                                         {daySlots.length === 0 && (
//                                             <div className="rounded-2xl border border-dashed border-primary/15 bg-primary/5 px-3 py-5 text-center text-xs text-foreground/45">
//                                                 No schedule
//                                             </div>
//                                         )}

//                                         {daySlots.map((slot) => {
//                                             const isAvailable = isAvailableStatus(
//                                                 slot.status as SlotStatus
//                                             );

//                                             return (
//                                                 <div
//                                                     key={slot.id}
//                                                     className="rounded-2xl border border-primary/10 bg-white/85 px-3 py-3 shadow-sm"
//                                                 >
//                                                     <div className="flex items-center justify-between gap-3">
//                                                         <div>
//                                                             <p className="text-sm font-semibold text-slate-900">
//                                                                 {slot.startTime} - {slot.endTime}
//                                                             </p>
//                                                             <p className="text-xs text-foreground/45">
//                                                                 {slot.status}
//                                                             </p>
//                                                         </div>

//                                                         {isAvailable && (
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() => handleBlock(slot.id)}
//                                                                 className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-95"
//                                                             >
//                                                                 Block
//                                                             </button>
//                                                         )}

//                                                         {slot.status === "BLOCKED" && (
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() => handleUnblock(slot.id)}
//                                                                 className="rounded-full border border-primary/20 bg-white px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/5"
//                                                             >
//                                                                 Open
//                                                             </button>
//                                                         )}

//                                                         {slot.status === "BOOKED" && (
//                                                             <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600">
//                                                                 Booked
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </article>
//                             );
//                         })}
//                     </div>
//                 </section>
//             )}

//             {activeTab === "dayoff" && (
//                 <section className={cardClassName}>
//                     <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//                         <div className="space-y-2">
//                             <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
//                                 <Ban size={14} />
//                                 Day off
//                             </div>
//                             <h2 className="text-xl font-semibold text-slate-900">
//                                 Manage day-off by date
//                             </h2>
//                             <p className="max-w-3xl text-sm leading-6 text-foreground/60">
//                                 Block all available slots for a day, or reopen them later. Booked slots stay untouched.
//                             </p>
//                         </div>

//                         <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-800">
//                             Safe for existing bookings.
//                         </div>
//                     </div>

//                     <div className="mt-6 grid gap-4 xl:grid-cols-2">
//                         {dayOffSummaries.map((summary) => {
//                             const isBusy = blockingDate === summary.date;

//                             return (
//                                 <article key={summary.date} className={`${subCardClassName} p-5`}>
//                                     <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//                                         <div className="space-y-2">
//                                             <div className="flex flex-wrap items-center gap-2">
//                                                 <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
//                                                     {getDayLabel(summary.dayOfWeek)}
//                                                 </span>
//                                                 <span
//                                                     className={`rounded-full px-3 py-1 text-xs font-medium ${
//                                                         summary.isFullDayOff
//                                                             ? "border border-amber-200 bg-amber-50 text-amber-700"
//                                                             : "border border-emerald-200 bg-emerald-50 text-emerald-700"
//                                                     }`}
//                                                 >
//                                                     {summary.isFullDayOff ? "Day off" : "Partially open"}
//                                                 </span>
//                                             </div>

//                                             <p className="text-lg font-semibold text-slate-900">
//                                                 {summary.date}
//                                             </p>
//                                             <p className="text-sm text-foreground/55">
//                                                 {summary.blocked.length} blocked • {summary.available.length} open • {summary.booked.length} booked
//                                             </p>
//                                         </div>

//                                         <div className="flex flex-wrap gap-2">
//                                             <button
//                                                 type="button"
//                                                 disabled={summary.available.length === 0 || isBusy}
//                                                 onClick={() => handleBlockDay(summary.date)}
//                                                 className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
//                                             >
//                                                 <Ban size={14} />
//                                                 {isBusy ? "Processing..." : "Block day"}
//                                             </button>

//                                             <button
//                                                 type="button"
//                                                 disabled={summary.blocked.length === 0 || isBusy}
//                                                 onClick={() => handleUnblockDay(summary.date)}
//                                                 className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/85 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
//                                             >
//                                                 <ShieldCheck size={14} />
//                                                 Reopen day
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </article>
//                             );
//                         })}
//                     </div>
//                 </section>
//             )}
//         </section>
//     );
// }
