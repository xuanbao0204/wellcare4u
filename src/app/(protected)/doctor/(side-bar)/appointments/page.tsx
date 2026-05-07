"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  LoaderCircle,
  SearchX,
  Stethoscope,
  Tag,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  cancelAppointment,
  confirmAppointment,
  getDoctorAppointmentsPage,
} from "@/features/doctor/appointments/doctorAppointmentService";
import { startExam } from "@/features/doctor/medical-record/medicalRecordService";
import { parseDateTime } from "@/lib/commonFunctions";
import { showError, showSuccess } from "@/lib/toast";
import {
  AppointmentDTO,
  AppointmentStatus,
  AppointmentType,
} from "@/shared/type";
import Badge from "@/shared/ui/Badge";
import ActionButton from "@/shared/components/ActionButton";
import AppointmentDetailModal, { generateProgress } from "@/shared/components/appointment/AppointmentDetail";
import Link from "next/link";
import CancelAppointmentModal from "@/shared/components/appointment/CancelAppointmentModal";

type ActionState = {
  id: number | null;
  type: "confirm" | "cancel" | "start" | null;
};

const todayDate = new Intl.DateTimeFormat("en-GB").format(new Date());

export default function AppointmentsPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionState, setActionState] = useState<ActionState>({
    id: null,
    type: null,
  });

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [status, setStatus] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);
  const [cancelAppointment, setCancelAppointment] = useState<AppointmentDTO | null>();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getDoctorAppointmentsPage({
        page,
        size,
        status,
        type,
        sortBy: "createdAt",
        sortDir: "desc",
      });

      if (res.status !== 200) {
        showError(res.message || "Failed to load appointments");
        return;
      }

      setAppointments(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      showError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [page, size, status, type]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const summary = useMemo(() => {
    return appointments.reduce(
      (acc, appointment) => {
        acc.total += 1;

        if (appointment.status === "PENDING") acc.pending += 1;
        if (appointment.status === "CONFIRMED") acc.confirmed += 1;
        if (appointment.slotDate === todayDate) acc.today += 1;

        return acc;
      },
      {
        total: 0,
        pending: 0,
        confirmed: 0,
        today: 0,
      }
    );
  }, [appointments]);

  const handleConfirm = async (id: number) => {
    setActionState({ id, type: "confirm" });

    try {
      const res = await confirmAppointment(id);

      if (res.status !== 200) {
        showError(res.message || "Failed to confirm appointment");
        return;
      }

      showSuccess(res.message || "Appointment confirmed");
      await fetchAppointments();
    } catch {
      showError("Failed to confirm appointment");
    } finally {
      setActionState({ id: null, type: null });
    }
  };

  const handleStart = async (appointmentId: number) => {
    setActionState({ id: appointmentId, type: "start" });

    try {
      const res = await startExam(appointmentId);
      router.push(`/doctor/medical-records/create/${res.data}`);
    } catch {
      showError("Failed to start examination");
    } finally {
      setActionState({ id: null, type: null });
    }
  };

  const pageLabel = totalPages === 0 ? 0 : page + 1;

  type CancelWindow = "free" | "late" | "blocked";

  const getCancelWindow = (appointment: AppointmentDTO): CancelWindow => {
    const cancellableStatuses = ["PENDING", "CONFIRMED"];
    if (!cancellableStatuses.includes(appointment.status)) return "blocked";

    const now = new Date();
    const appointmentTime = parseDateTime(appointment.slotDate, appointment.slotTime);
    const diffHours = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Appointment time has already passed
    if (diffHours <= 0) return "blocked";

    // Too close to appointment — clinic can no longer accommodate the slot change
    if (diffHours < 2) return "blocked";

    // Late window — allow but warn doctor it may impact the patient
    if (diffHours < 24) return "late";

    // Plenty of time — cancel freely
    return "free";
  };

  const renderCancelAction = (appointment: AppointmentDTO, isBusy: boolean, isCancelling: boolean) => {
    const window = getCancelWindow(appointment);

    if (window === "blocked") {
      const now = new Date();
      const appointmentTime = parseDateTime(appointment.slotDate, appointment.slotTime);
      const isPast = appointmentTime.getTime() <= now.getTime();

      return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
          {isPast
            ? "Lịch hẹn đã qua — không thể hủy"
            : "Không thể hủy trong vòng 2 giờ trước lịch hẹn"}
        </div>
      );
    }

    if (window === "late") {
      return (
        <div className="flex flex-col gap-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Còn dưới 24 giờ — hủy muộn có thể ảnh hưởng đến bệnh nhân
          </div>
          <button
            onClick={() => setCancelAppointment(appointment)}
            disabled={isBusy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCancelling
              ? <LoaderCircle className="h-4 w-4 animate-spin" />
              : <CalendarDays className="h-4 w-4" />}
            Hủy lịch hẹn
          </button>
        </div>
      );
    }

    // free window
    return (
      <button
        onClick={() => setCancelAppointment(appointment)}
        disabled={isBusy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCancelling
          ? <LoaderCircle className="h-4 w-4 animate-spin" />
          : <CalendarDays className="h-4 w-4" />}
        Hủy lịch hẹn
      </button>
    );
  };

  const renderAction = (appointment: AppointmentDTO) => {
    const isConfirming = actionState.id === appointment.id && actionState.type === "confirm";
    const isCancelling = actionState.id === appointment.id && actionState.type === "cancel";
    const isStarting = actionState.id === appointment.id && actionState.type === "start";
    const isBusy = actionState.id === appointment.id && actionState.type !== null;

    if (appointment.status === "PENDING") {
      return (
        <>
          <button
            onClick={() => handleConfirm(appointment.id)}
            disabled={isBusy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming
              ? <LoaderCircle className="h-4 w-4 animate-spin" />
              : <CheckCircle2 className="h-4 w-4" />}
            Xác nhận
          </button>

          {renderCancelAction(appointment, isBusy, isCancelling)}
        </>
      );
    }

    if (appointment.status === "CONFIRMED") {
      return (
        <>
          <button
            onClick={() => handleStart(appointment.id)}
            disabled={isBusy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isStarting
              ? <LoaderCircle className="h-4 w-4 animate-spin" />
              : <Stethoscope className="h-4 w-4" />}
            Bắt đầu khám
          </button>

          {renderCancelAction(appointment, isBusy, isCancelling)}
        </>
      );
    }

    if (appointment.status === "IN_PROGRESS") {
      return (
        <button
          onClick={() => handleStart(appointment.id)}
          disabled={isBusy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isStarting
            ? <LoaderCircle className="h-4 w-4 animate-spin" />
            : <Stethoscope className="h-4 w-4" />}
          Tiếp tục khám
        </button>
      );
    }

    if (appointment.status === "COMPLETED") {
      return (
        <Link
          href={`/medical-records/${appointment.recordId}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
        >
          <Stethoscope className="h-4 w-4" />
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
    <section className="space-y-6 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm shadow-slate-200/60">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <CalendarDays className="h-3.5 w-3.5" />
              Quản lý lịch hẹn
            </div>

            <h1 className="mt-4 text-2xl font-semibold text-slate-900 md:text-3xl">
              Tất cả lịch hẹn của bệnh nhân
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base">
              Xử lý cuộc hẹn mới, xem các yêu cầu và bắt đầu khám khi đã được xác nhận
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-105">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Ở trang này</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {summary.total}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                lịch hẹn ở trang hiện tại
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 shadow-sm">
              <p className="text-sm font-medium text-amber-700">Đang chờ</p>
              <p className="mt-2 text-2xl font-semibold text-amber-900">
                {summary.pending}
              </p>
              <p className="mt-1 text-xs text-amber-700/80">
                yêu cầu đang chờ xử lý
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 shadow-sm">
              <p className="text-sm font-medium text-emerald-700">
                Đã xác nhận
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-900">
                {summary.confirmed}
              </p>
              <p className="mt-1 text-xs text-emerald-700/80">
                lịch hẹn đã được xác nhận và chờ khám
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm shadow-slate-200/60">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Filter className="h-4 w-4 text-primary" />
              Lọc
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setPage(0);
                  setStatus(undefined);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${!status
                  ? "border-primary/20 bg-primary/5 text-primary shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                Tất cả trạng thái
              </button>

              {AppointmentStatus.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setPage(0);
                    setStatus(status === item.value ? undefined : item.value);
                  }}
                  className={`rounded-full border px-1 py-1 transition ${status === item.value
                    ? "border-primary/20 bg-primary/5 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  <Badge value={item.value} />
                </button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-xs">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Loại lịch hẹn
            </label>

            <div className="relative">
              <select
                value={type || ""}
                onChange={(event) => {
                  setPage(0);
                  setType(event.target.value || undefined);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary/30 focus:bg-white"
              >
                <option value="">Tất cả loại</option>
                {AppointmentType.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            Hôm nay: {summary.today}
          </span>
          {status && (
            <span className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-primary">
              Đang áp dụng bộ lọc trạng thái lịch hẹn
            </span>
          )}
          {type && (
            <span className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-primary">
              Đang áp dụng bộ lọc loại lịch hẹn
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm shadow-slate-200/60">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Hàng đợi
            </h2>
            <p className="text-sm text-slate-500">
              Xem và thực hiện hành động
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
            Trang {pageLabel} của {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4">
                  <div className="h-5 w-40 rounded bg-slate-200" />
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="h-20 rounded-xl bg-slate-200" />
                    <div className="h-20 rounded-xl bg-slate-200" />
                    <div className="h-20 rounded-xl bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
            <div className="rounded-full bg-slate-100 p-4 text-slate-500">
              <SearchX className="h-8 w-8" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Danh sách trống
            </h3>
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
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Xem trang {pageLabel} của {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 0 || loading}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Trước
          </button>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
            {pageLabel} / {totalPages}
          </div>

          <button
            disabled={page + 1 >= totalPages || loading}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {selectedAppointment && <AppointmentDetailModal appointment={selectedAppointment} onClose={() => { setSelectedAppointment(null) }} renderActions={renderAction} />}
      {cancelAppointment && (
        <CancelAppointmentModal
          role="DOCTOR"
          appointment={cancelAppointment}
          onClose={() => setCancelAppointment(null)}
          onSuccess={fetchAppointments}
          setActionState={setActionState}
        />
      )}
    </section>
  );
}
