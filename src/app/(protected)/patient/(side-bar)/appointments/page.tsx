"use client";

import { useEffect, useState } from "react";
import { AppointmentDTO, AppointmentStatus, AppointmentType } from "@/shared/type";
import { cancelAppointment, getPatientAppointmentsPage } from "@/features/patient/appointment/patientAppointmentService";
import Badge from "@/shared/ui/Badge";
import { showError, showSuccess } from "@/lib/toast";
import { parseDateTime } from "@/lib/commonFunctions";

const PatientAppointmentPage = () => {
    const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [status, setStatus] = useState<string | undefined>();
    const [type, setType] = useState<string | undefined>();

    const fetchAppointments = async () => {
        try {
            setLoading(true);

            const res = await getPatientAppointmentsPage({
                page,
                size,
                status,
                type,
                sortBy: "createdAt",
                sortDir: "desc",
            });

            if (res.status !== 200) {
                console.error(res.message);
                return;
            }

            setAppointments(res.data.content);
            setTotalPages(res.data.totalPages);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [page, status, type]);

    const canCancel = (a: AppointmentDTO) => {
        if (a.status !== "PENDING") return false;

        const now = new Date();

        const appointmentTime = parseDateTime(a.slotDate, a.slotTime);

        const diffHours =
            (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        return diffHours >= 24;
    };

    const handleCancel = async (id: number) => {
        if (!confirm("Bạn có chắc muốn huỷ lịch hẹn này?")) return;
        const res = await cancelAppointment(id);
        if (res.status !== 200) {
            showError("Huỷ lịch hẹn thất bại");
            console.log(res.message);
            return;
        }
        showSuccess(res.message);
        fetchAppointments();
    };

    return (
        <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_-25px_rgba(0,10,156,0.35)] backdrop-blur-xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                    Lịch hẹn của tôi
                </h1>
                <p className="mt-1 text-sm text-foreground/70">
                    Quản lý và xem lại các lịch hẹn đã đặt với bác sĩ.
                </p>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">

                <div className="flex flex-wrap items-center gap-2 rounded-full border border-primary/10 bg-primary/5">
                    {AppointmentStatus.map((s) => (
                        <button
                            key={s.label}
                            onClick={() => {
                                if (status === s.value) {
                                    setStatus(undefined);
                                } else {
                                    setPage(0);
                                    setStatus(s.value);
                                }
                            }}
                            className={`rounded-full px-3 py-1.5 text-sm font-medium transition
                        ${status === s.value
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-foreground/70 hover:bg-white/70 hover:text-primary"
                                }`}
                        >
                            <Badge value={s.value} variant="soft" />
                        </button>
                    ))}
                </div>

                <select
                    value={type || ""}
                    onChange={(e) => {
                        setPage(0);
                        setType(e.target.value || undefined);
                    }}
                    className="rounded-xl border border-primary/10 bg-white/80 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur transition focus:border-primary focus:outline-none"
                >
                    <option value="">Tất cả loại</option>
                    {AppointmentType.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="py-16 text-center text-sm text-foreground/50">
                    Đang tải dữ liệu...
                </div>
            ) : appointments.length === 0 ? (
                <div className="py-16 text-center text-sm text-foreground/50">
                    Không có lịch hẹn.
                </div>
            ) : (
                <div className="space-y-5">
                    {appointments.map((a) => (
                        <div
                            key={a.id}
                            className="group rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-[0_25px_60px_-25px_rgba(0,10,156,0.35)] backdrop-blur-xl transition hover:shadow-2xl"
                        >
                            <div className="grid grid-cols-1 md:flex gap-6 items-center ">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={a.doctorAvatar}
                                            className="h-16 w-16 rounded-full border border-primary/15 object-cover"
                                        />

                                        <div>
                                            <p className="text-lg font-semibold">
                                                Bác sĩ:{" "}
                                                <span className="text-primary">{a.doctorName}</span>
                                            </p>
                                            <p className="text-base text-foreground/80">
                                                {
                                                    AppointmentType.find(
                                                        (t) => t.value === a.type
                                                    )?.label
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="rounded-xl border border-primary/10 bg-gray-200/60 p-4 text-center">
                                            <p className="text-sm text-foreground/60 font-bold">
                                                Ngày khám
                                            </p>
                                            <p className="mt-1 text-lg font-semibold">
                                                {new Date(a.slotDate).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-primary/10 bg-gray-200/60 p-4 text-center">
                                            <p className="text-sm text-foreground/60 font-bold">
                                                Thời gian
                                            </p>
                                            <p className="mt-1 text-lg font-semibold text-primary">
                                                {a.slotTime}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-primary/10 bg-gray-200/60 p-4 text-center">
                                            <p className="text-sm text-foreground/60 font-bold">
                                                Trạng thái
                                            </p>
                                            <Badge className="mt-1 text-lg font-bold" value={a.status} />
                                        </div>
                                    </div>

                                    {a.reason && (
                                        <div className="mt-4 rounded-xl border border-primary/10 bg-white/80 p-4 text-[15px] text-foreground/75 leading-relaxed">
                                            <span className="font-medium text-foreground">
                                                Lý do:
                                            </span>{" "}
                                            {a.reason}
                                        </div>
                                    )}
                                </div>

                                <div className="flex min-w-35 flex-col items-center justify-between">
                                    <div className="flex w-full flex-col gap-2">
                                        {canCancel(a) && (
                                            <button
                                                onClick={() => handleCancel(a.id)}
                                                className="w-full rounded-xl border border-red-200 px-4 py-2 text-[15px] font-medium text-red-600 transition hover:bg-red-50"
                                            >
                                                Huỷ lịch
                                            </button>
                                        )}

                                        <button className="w-full rounded-xl bg-primary px-4 py-2 text-[15px] font-semibold text-white shadow-md transition hover:scale-[1.02] hover:bg-primary/90">
                                            Chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-3">
                <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-lg border border-primary/10 bg-white/70 px-4 py-2 text-sm transition disabled:opacity-40 hover:bg-white"
                >
                    Prev
                </button>

                <span className="text-sm text-foreground/70">
                    Trang <span className="font-semibold">{page + 1}</span> /{" "}
                    {totalPages}
                </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg border border-primary/10 bg-white/70 px-4 py-2 text-sm transition disabled:opacity-40 hover:bg-white"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PatientAppointmentPage;