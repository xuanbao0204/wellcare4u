"use client";

import { useEffect, useState } from "react";
import { AppointmentDTO, AppointmentType, SlotDTO } from "@/shared/type";
import { cancelAppointment, rebookAppointment } from "@/features/appointment/appointmentService";
import { getSlotByDoctorAndDate } from "@/features/patient/appointment/patientAppointmentService";
import { showError, showSuccess } from "@/lib/toast";
import { CalendarDays, ChevronRight, Clock, Loader2 } from "lucide-react";

type ActionState = {
  id: number | null;
  type: "confirm" | "cancel" | "start" | null;
};

type Props = {
  appointment: AppointmentDTO;
  role: "DOCTOR" | "PATIENT";
  onClose: () => void;
  onSuccess?: () => void;
  setActionState: (state: ActionState) => void;
};

const getNext14Days = (): string[] => {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // start from tomorrow
    return d.toISOString().split("T")[0];
  });
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
};

const CancelAppointmentModal = ({
  appointment,
  role,
  onClose,
  onSuccess,
  setActionState,
}: Props) => {
  const isDoctor = role === "DOCTOR";

  const [step, setStep] = useState<1 | 2>(1);

  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<SlotDTO[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotDTO | null>(null);
  const [slotError, setSlotError] = useState("");

  const [loading, setLoading] = useState(false);

  const dates = getNext14Days();

  useEffect(() => {
    if (!selectedDate || !isDoctor) return;
    setSelectedSlot(null);
    setSlotsLoading(true);
    setSlots([]);

    getSlotByDoctorAndDate(appointment.doctorId, selectedDate)
      .then((res) => setSlots(res.data ?? []))
      .catch(() => showError("Không thể tải danh sách slot"))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate]);

  const handleNext = () => {
    if (!reason.trim()) {
      setReasonError("Vui lòng nhập lý do huỷ lịch");
      return;
    }
    setReasonError("");

    if (isDoctor) {
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (isDoctor && !selectedSlot) {
      setSlotError("Vui lòng chọn một slot thay thế cho bệnh nhân");
      return;
    }
    setSlotError("");
    setLoading(true);
    setActionState({ id: appointment.id, type: "cancel" });

    try {
      const cancelRes = await cancelAppointment(appointment.id, { reason });
      if (cancelRes.status !== 200) {
        showError(cancelRes.message || "Huỷ lịch thất bại");
        return;
      }
      if (isDoctor && selectedSlot) {
        const rebookRes = await rebookAppointment({
          patientId: appointment.patientId,
          reason: appointment.reason,
          type: "RESCHEDULE",
          slotId: selectedSlot.id,
        });
        if (rebookRes.status !== 200) {
          showError("Huỷ thành công nhưng đặt lại lịch thất bại. Vui lòng đặt thủ công.");
          onSuccess?.();
          onClose();
          return;
        }
      }

      showSuccess(
        isDoctor
          ? "Huỷ lịch và đặt lại thành công"
          : "Huỷ lịch thành công"
      );
      onSuccess?.();
      onClose();
    } catch {
      showError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      setActionState({ id: null, type: null });
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-gray-400/60 max-h-[90vh] overflow-y-auto"
      >

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Huỷ lịch hẹn</h2>
            <p className="text-sm text-slate-500">Lịch hẹn #{appointment.id}</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>

        {isDoctor && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className={`font-medium ${step === 1 ? "text-primary" : "text-slate-400"}`}>
              1. Lý do huỷ
            </span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={`font-medium ${step === 2 ? "text-primary" : "text-slate-400"}`}>
              2. Chọn lịch thay thế
            </span>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-sm text-slate-500">Bạn đang huỷ lịch khám với:</p>
          <div className="mt-2 flex items-center gap-3">
            <img
              src={appointment.patientAvatar}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-slate-900">{appointment.patientName}</p>
              <p className="text-xs text-slate-500">
                {appointment.slotDate} • {appointment.slotTime}
              </p>
            </div>
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                ⚠️ Hành động này không thể hoàn tác
              </p>
              {isDoctor && (
                <p className="mt-1 text-xs text-red-600">
                  Là bác sĩ, bạn cần chọn một lịch hẹn thay thế cho bệnh nhân ở bước tiếp theo.
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-700">Lý do huỷ</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Nhập lý do huỷ lịch..."
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
              />
              {reasonError && (
                <p className="mt-1 text-sm text-red-500">{reasonError}</p>
              )}
            </div>
          </>
        )}

        {step === 2 && isDoctor && (
          <>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm text-amber-800">
                Chọn lịch hẹn mới để thay thế cho bệnh nhân{" "}
                <span className="font-semibold">{appointment.patientName}</span>
              </p>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <CalendarDays size={14} /> Chọn ngày
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-medium transition
                      ${selectedDate === date
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-primary/50"
                      }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Clock size={14} /> Chọn giờ
                </p>

                {slotsLoading && (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 size={20} className="animate-spin text-primary" />
                  </div>
                )}

                {!slotsLoading && slots.length === 0 && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 py-6 text-center text-sm text-slate-400">
                    Không có slot trống trong ngày này
                  </div>
                )}

                {!slotsLoading && slots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-xl border px-3 py-2 text-xs font-medium transition
                          ${selectedSlot?.id === slot.id
                            ? "border-primary bg-primary text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-primary/50"
                          }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}

                {slotError && (
                  <p className="mt-2 text-sm text-red-500">{slotError}</p>
                )}
              </div>
            )}

            {selectedSlot && (
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="text-xs text-slate-500">Lịch thay thế đã chọn</p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {formatDate(selectedDate)} • {selectedSlot.startTime} - {selectedSlot.endTime}
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-between gap-3">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Quay lại
            </button>
          ) : (
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Đóng
            </button>
          )}

          {step === 1 ? (
            <button
              onClick={handleNext}
              disabled={loading}
              className="rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDoctor ? "Tiếp theo →" : loading ? "Đang huỷ..." : "Xác nhận huỷ"}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedSlot}
              className="rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Đang xử lý...
                </span>
              ) : (
                "Xác nhận huỷ & đặt lại"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;

// "use client";

// import { useState } from "react";
// import { AppointmentDTO } from "@/shared/type";
// import { cancelAppointment } from "@/features/shared/appointmentService";
// import { showError, showSuccess } from "@/lib/toast";

// type ActionState = {
//   id: number | null;
//   type: "confirm" | "cancel" | "start" | null;
// };

// type CancelAppointmentModalProps = {
//   appointment: AppointmentDTO;
//   onClose: () => void;
//   onSuccess?: () => void;
//   setActionState: (state: ActionState) => void;
// };

// const CancelAppointmentModal = ({
//   appointment,
//   onClose,
//   onSuccess,
//   setActionState
// }: CancelAppointmentModalProps) => {
//   const [reason, setReason] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleCancel = async () => {
//     if (!reason.trim()) {
//       setError("Vui lòng nhập lý do huỷ lịch");
//       return;
//     }

//     setError("");
//     setLoading(true);
//     setActionState({ id: appointment.id, type: "cancel" });

//     try {
//       const res = await cancelAppointment(appointment.id, { reason });

//       if (res.status !== 200) {
//         showError(res.message || "Huỷ lịch thất bại");
//         return;
//       }

//       showSuccess(res.message || "Huỷ lịch thành công");

//       onSuccess?.(); // refresh list bên ngoài
//       onClose();     // đóng modal
//     } catch {
//       showError("Huỷ lịch thất bại");
//     } finally {
//       setLoading(false);
//       setActionState({ id: null, type: null });
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/10 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="w-full max-w-lg rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-gray-400/60"
//       >
//         {/* HEADER */}
//         <div className="flex items-start justify-between">
//           <div>
//             <h2 className="text-xl font-semibold text-slate-900">
//               Huỷ lịch hẹn
//             </h2>
//             <p className="text-sm text-slate-500">
//               Lịch hẹn #{appointment.id}
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50"
//             disabled={loading}
//           >
//             Đóng
//           </button>
//         </div>

//         {/* INFO */}
//         <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
//           <p className="text-sm text-slate-700">
//             Bạn đang huỷ lịch khám với:
//           </p>

//           <div className="mt-2 flex items-center gap-3">
//             <img
//               src={appointment.patientAvatar}
//               className="h-10 w-10 rounded-full object-cover"
//             />
//             <div>
//               <p className="font-medium text-slate-900">
//                 {appointment.patientName}
//               </p>
//               <p className="text-xs text-slate-500">
//                 {appointment.slotDate} • {appointment.slotTime}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* WARNING */}
//         <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
//           <p className="text-sm text-red-700 font-medium">
//             ⚠️ Hành động này không thể hoàn tác
//           </p>
//         </div>

//         {/* INPUT */}
//         <div className="mt-4">
//           <label className="text-sm font-medium text-slate-700">
//             Lý do huỷ
//           </label>

//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             rows={4}
//             placeholder="Nhập lý do huỷ lịch..."
//             className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
//             disabled={loading}
//           />

//           {error && (
//             <p className="mt-1 text-sm text-red-500">{error}</p>
//           )}
//         </div>

//         {/* ACTIONS */}
//         <div className="mt-5 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
//             disabled={loading}
//           >
//             Huỷ
//           </button>

//           <button
//             onClick={handleCancel}
//             disabled={loading}
//             className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
//           >
//             {loading ? "Đang huỷ..." : "Xác nhận huỷ"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CancelAppointmentModal;