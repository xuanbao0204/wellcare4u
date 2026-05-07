"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AppointmentDTO,
    AppointmentStatus,
    AppointmentType,
} from "@/shared/type";
import {
    cancelAppointment,
    checkInAppointment,
    getPatientAppointmentsPage,
} from "@/features/patient/appointment/patientAppointmentService";
import Badge from "@/shared/ui/Badge";
import { showError, showSuccess } from "@/lib/toast";
import { parseDateTime } from "@/lib/commonFunctions";
import {
    ArrowLeftCircle,
    ArrowRightCircle,
    CalendarDays,
    Clock3,
    Filter,
    FileText,
    Stethoscope,
    LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import AppointmentDetailModal, { generateProgress } from "@/shared/components/appointment/AppointmentDetail";
import CancelAppointmentModal from "@/shared/components/appointment/CancelAppointmentModal";

type ActionState = {
    id: number | null;
    type: "confirm" | "cancel" | "start" | null;
};

const PatientAppointmentPage = () => {
    const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [status, setStatus] = useState<string | undefined>();
    const [type, setType] = useState<string | undefined>();

    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);

    const [cancelAppointment, setCancelAppointment] = useState<AppointmentDTO|null>(null);

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        const res = await getPatientAppointmentsPage({
            page,
            size,
            status,
            type,
            sortBy: "createdAt",
            sortDir: "desc",
        });

        if (res.status === 200) {
            setAppointments(res.data.content);
            setTotalPages(res.data.totalPages);
        }

        setLoading(false);
    }, [page, size, status, type]);

    useEffect(() => {
        const run = async () => {
            await fetchAppointments();
        };

        void run();
    }, [fetchAppointments]);

    const canCancel = (a: AppointmentDTO) => {
        if (a.status !== "PENDING") return false;

        const now = new Date();
        const appointmentTime = parseDateTime(a.slotDate, a.slotTime);

        const diffHours =
            (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        return diffHours >= 24;
    };

    // const handleCancel = async (id: number) => {
    //     if (!confirm("Bạn có chắc muốn huỷ lịch hẹn này?")) return;

    //     const res = await cancelAppointment(id);

    //     if (res.status !== 200) {
    //         showError("Huỷ lịch hẹn thất bại");
    //         return;
    //     }

    //     showSuccess(res.message);
    //     fetchAppointments();
    // };

    const handleCheckIn = async (id: number) => {

        if (!confirm("Sau khi check-in bạn phải giữ vị trí và đợi đến lượt. Bạn đã chắc chắn?")) return;

        const res = await checkInAppointment(id);
        if (res.status !== 200) {
            showError("Lỗi khi check-in");
            return;
        }

        showSuccess(res.message);
        fetchAppointments();
    }

    const pageCountLabel = useMemo(() => {
        if (totalPages === 0) return "0 / 0";
        return `${page + 1} / ${totalPages}`;
    }, [page, totalPages]);

    const [actionState, setActionState] = useState<ActionState>({
        id: null,
        type: null,
    });

    const renderAction = (appointment: AppointmentDTO) => {
        const isCancelling =
            actionState.id === appointment.id &&
            actionState.type === "cancel";
        const isStarting =
            actionState.id === appointment.id &&
            actionState.type === "start";
        const isBusy =
            actionState.id === appointment.id && actionState.type !== null;

        if (appointment.status === "PENDING") {
            return (
                <>

                    {canCancel(appointment) ? (
                        <button
                            onClick={() => setCancelAppointment(appointment)}
                            disabled={isBusy}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isCancelling ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                                <CalendarDays className="h-4 w-4" />
                            )}
                            Hủy lịch hẹn
                        </button>
                    ) : (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
                            Hành động hủy chỉ có thể được thực hiện trước 24h
                        </div>
                    )}
                </>
            );
        }

        if ((appointment.status === "CONFIRMED") && (appointment.checkedIn === false)) {
            return (
                <button
                    onClick={() => handleCheckIn(appointment.id)}
                    disabled={isBusy}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isCancelling ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        <CalendarDays className="h-4 w-4" />
                    )}
                    Check-in
                </button>
            )
        }

        if (appointment.status === "COMPLETED") {
            return (
                <Link
                    href={`/medical-records/${appointment.recordId}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isStarting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        <Stethoscope className="h-4 w-4" />
                    )}
                    Xem kết quả
                </Link>
            );
        }

        return (
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600">
                Không có hành động nào có thể thực hiện
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto flex flex-col gap-6">
                <section className="rounded-2xl border border-primary/15 bg-white/90 p-6 shadow-sm">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-sm font-medium text-primary">
                                Lịch hẹn của tôi
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">
                                Theo dõi lịch hẹn một cách rõ ràng và dễ dùng
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-foreground/70 md:text-base">
                                Xem nhanh lịch khám, trạng thái xử lý và các thông
                                tin quan trọng trong một nơi duy nhất.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-primary/15 bg-white/90 p-5 shadow-sm md:p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                    <Filter className="h-4 w-4" />
                                    Bộ lọc lịch hẹn
                                </div>
                                <p className="mt-1 text-sm text-foreground/65">
                                    Chọn trạng thái hoặc loại lịch hẹn để tìm nhanh
                                    hơn.
                                </p>
                            </div>

                            <select
                                value={type || ""}
                                onChange={(e) => {
                                    setPage(0);
                                    setType(e.target.value || undefined);
                                }}
                                className="w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/35 md:w-64"
                            >
                                <option value="">Tất cả loại lịch hẹn</option>
                                {AppointmentType.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {AppointmentStatus.map((s) => {
                                const isActive = status === s.value;

                                return (
                                    <button
                                        key={s.value}
                                        onClick={() => {
                                            setPage(0);
                                            setStatus(
                                                isActive ? undefined : s.value
                                            );
                                        }}
                                        className={`rounded-xl border px-3 py-2 transition ${isActive
                                            ? "border-primary/30 bg-primary/10 shadow-sm"
                                            : "border-primary/15 bg-white hover:bg-primary/5"
                                            }`}
                                    >
                                        <Badge value={s.value} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    {loading ? (
                        <div className="rounded-2xl border border-primary/15 bg-white/90 px-6 py-14 text-center shadow-sm">
                            <p className="text-base font-medium text-foreground">
                                Đang tải lịch hẹn...
                            </p>
                            <p className="mt-2 text-sm text-foreground/60">
                                Vui lòng chờ trong giây lát.
                            </p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-14 text-center shadow-sm">
                            <p className="text-lg font-semibold text-foreground">
                                Chưa có lịch hẹn phù hợp
                            </p>
                            <p className="mt-2 text-sm text-foreground/65">
                                Hãy thử đổi bộ lọc hoặc quay lại sau để xem các lịch
                                hẹn mới.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((a) => {
                                const typeLabel =
                                    AppointmentType.find(
                                        (item) => item.value === a.type
                                    )?.label || a.type;

                                return (
                                    <article
                                        key={a.id}
                                        className="rounded-2xl border border-primary/15 bg-white/90 p-5 shadow-sm transition hover:border-primary/25 md:p-6"
                                    >
                                        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                            <div className="flex flex-1 flex-col gap-5">
                                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <img
                                                            src={a.doctorAvatar}
                                                            alt={a.doctorName}
                                                            className="h-14 w-14 shrink-0 rounded-full border border-primary/10 object-cover shadow-sm"
                                                        />

                                                        <div>
                                                            <p className="text-lg font-semibold text-foreground">
                                                                {a.doctorName}
                                                            </p>
                                                            <p className="mt-1 text-sm text-foreground/65">
                                                                Bác sĩ phụ trách
                                                            </p>
                                                            <div className="mt-3">
                                                                <Badge value={a.status} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="font-bold rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 shadow-sm md:min-w-55">
                                                        {generateProgress(a)}
                                                    </div>
                                                </div>

                                                <div className="grid gap-3 md:grid-cols-3">
                                                    <div className="rounded-xl border border-primary/15 bg-white p-4 shadow-sm">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                                            <Stethoscope className="h-4 w-4" />
                                                            Loại lịch hẹn
                                                        </div>
                                                        <p className="mt-2 text-sm text-foreground/75">
                                                            {typeLabel}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-primary/15 bg-white p-4 shadow-sm">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                                            <CalendarDays className="h-4 w-4" />
                                                            Ngày khám
                                                        </div>
                                                        <p className="mt-2 text-sm text-foreground/75">
                                                            {a.slotDate}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-primary/15 bg-white p-4 shadow-sm">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                                            <Clock3 className="h-4 w-4" />
                                                            Giờ hẹn
                                                        </div>
                                                        <p className="mt-2 text-sm text-foreground/75">
                                                            {a.slotTime}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="xl:w-65">
                                                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                                                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                                                        Hành động có thể thực hiện
                                                    </p>

                                                    <div className="mt-4 space-y-2">
                                                        <button
                                                            onClick={() => setSelectedAppointment(a)}
                                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary/80 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            Xem chi tiết
                                                        </button>

                                                        {renderAction(a)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-primary/15 bg-white/90 p-4 shadow-sm">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <p className="text-sm text-foreground/65">
                            Trang hiện tại:{" "}
                            <span className="font-medium text-foreground">
                                {pageCountLabel}
                            </span>
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className="rounded-xl border border-primary/15 bg-white p-2.5 text-foreground shadow-sm transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ArrowLeftCircle className="h-5 w-5" />
                            </button>

                            <button
                                disabled={page + 1 >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="rounded-xl border border-primary/15 bg-white p-2.5 text-foreground shadow-sm transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ArrowRightCircle className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            {selectedAppointment && <AppointmentDetailModal appointment={selectedAppointment} onClose={() => { setSelectedAppointment(null) }} renderActions={renderAction} />}
            {cancelAppointment && (
                <CancelAppointmentModal
                    role="PATIENT"
                    appointment={cancelAppointment}
                    onClose={() => setCancelAppointment(null)}
                    onSuccess={fetchAppointments}
                    setActionState={setActionState}
                />
            )}
        </div>
    );
};

export default PatientAppointmentPage;
