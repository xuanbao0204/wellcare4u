import { parseDateTime } from "@/lib/commonFunctions";
import { formatDateTime } from "@/lib/formatDay";
import { AppointmentDTO, AppointmentType } from "@/shared/type";
import Badge from "@/shared/ui/Badge";

type AppointmentDetailModalProps = {
    appointment: AppointmentDTO;
    onClose: () => void;
    renderActions?: (appointment: AppointmentDTO) => React.ReactNode;
};

  const getAppointmentTypeLabel = (value: string) => {
    return AppointmentType.find((item) => item.value === value)?.label || value;
  };

export const generateProgress = (a: AppointmentDTO) => {
    if (a.status === "CANCELLED") {
        return (
            <p className="text-sm text-red-600">
                Đã hủy bởi {a.cancelBy === "PATIENT" ? "Bệnh nhân" : "Bác sỹ"}
            </p>
        );
    }

    if (a.checkedIn) {
        return (
            <p className="text-sm text-green-600">
                Bệnh nhân đã check-in
            </p>
        );
    }

    if (a.status === "COMPLETED") {
        return (
            <p className="text-sm text-primary">
                Đã hoàn thành khám
            </p>
        );
    }

    const now = new Date();
    const startTime = a.slotTime.split(" - ")[0];
    const appointmentTime = parseDateTime(a.slotDate, startTime);

    if ((appointmentTime.getTime() < now.getTime()) && (!a.checkedIn)) {
        return (
            <p className="text-sm text-foreground/60">
                Đã quá giờ hẹn
            </p>
        );
    }

    return (
        <p className="text-sm text-foreground/70">
            Đang chờ...
        </p>
    );
};

const AppointmentDetailModal = ({
    appointment,
    onClose,
    renderActions,
}: AppointmentDetailModalProps) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/10 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-gray-400/60"
            >

                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Chi tiết lịch hẹn
                        </h2>
                        <p className="text-sm text-slate-500">
                            Lịch hẹn #{appointment.id}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50"
                    >
                        Đóng
                    </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-xs text-slate-500">Bác sỹ</p>
                        <div className="mt-2 flex items-center gap-3">
                            <img
                                src={appointment.doctorAvatar}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <p className="font-medium text-slate-900">
                                {appointment.doctorName}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-xs text-slate-500">Bệnh nhân</p>
                        <div className="mt-2 flex items-center gap-3">
                            <img
                                src={appointment.patientAvatar}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <p className="font-medium text-slate-900">
                                {appointment.patientName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-xs text-slate-500">Ngày khám</p>
                        <p className="mt-1 font-medium text-slate-900">
                            {appointment.slotDate}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-xs text-slate-500">Giờ khám</p>
                        <p className="mt-1 font-medium text-slate-900">
                            {appointment.slotTime}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                        <p className="text-xs text-slate-500">Loại</p>
                        <p className="mt-1 font-medium text-slate-900">
                            {getAppointmentTypeLabel(appointment.type)}
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs text-slate-500">Lý do khám</p>
                    <p className="mt-2 text-sm text-slate-700">
                        {appointment.reason || "Không có ghi chú"}
                    </p>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs text-slate-500">Thời điểm tạo lịch</p>
                    <p className="mt-1 text-sm text-slate-700">
                        {formatDateTime(appointment.createdAt)}
                    </p>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                    {generateProgress(appointment)}
                </div>

                {appointment.status === "CANCELLED" && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm font-medium text-red-700">
                            Thông tin huỷ lịch
                        </p>

                        <p className="mt-2 text-sm text-red-600">
                            Người huỷ:{" "}
                            {appointment.cancelBy === "PATIENT"
                                ? "Bệnh nhân"
                                : "Bác sỹ"}
                        </p>

                        <p className="text-sm text-red-600">
                            Thời điểm huỷ: {formatDateTime(appointment.cancelledAt)}
                        </p>

                        {appointment.cancelReason && (
                            <p className="text-sm text-red-600">
                                Lý do: {appointment.cancelReason}
                            </p>
                        )}
                    </div>
                )}

                {renderActions && (
                    <div className="mt-5 space-y-2">
                        {renderActions(appointment)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetailModal;