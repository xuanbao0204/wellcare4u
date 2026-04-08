import { AppointmentType, BookingData, DoctorDTO } from "@/shared/type";
import { bookAppointment } from "../patientAppointmentService";
import { showError, showSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";

type ConfirmStepProps = {
    doctor: DoctorDTO;
    data: BookingData;
    onBack: () => void;
};

export default function ConfirmStep({ doctor, data, onBack }: ConfirmStepProps) {
    const router = useRouter();
    const handleConfirm = async () => {
        const res = await bookAppointment({
            doctorId: data.doctorId,
            slotId: data.slotId,
            reason: data.reason,
            type: data.type,
        });
        if (res.status !== 200) {
            showError("Đặt lịch thất bại, vui lòng thử lại");
            console.error(res.message);
            router.push("/patient/appointments/create");
            return;
        }

        showSuccess(res.message);
        router.push("/patient/appointments");
    };

    return (
        <div className="max-w-xl mx-auto rounded-3xl border border-primary/10 bg-white/90 backdrop-blur-xl p-6 shadow-[0_25px_60px_-20px_rgba(0,10,156,0.35)] flex flex-col gap-6">

            <div className="text-center">
                <p className="text-xs font-semibold tracking-widest text-primary/70">
                    XÁC NHẬN LỊCH HẸN
                </p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                    Phiếu đặt lịch khám
                </h2>
                <p className="text-sm text-foreground/50">
                    Vui lòng kiểm tra lại thông tin trước khi xác nhận
                </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 space-y-3">

                <div className="flex justify-between text-sm">
                    <span className="text-foreground/60 font-bold">Bác sĩ</span>
                    <span className="font-medium">
                        {doctor.firstName} {doctor.lastName}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-foreground/60 font-bold">Mã slot</span>
                    <span className="font-medium text-primary">
                        #{data.slotId}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-foreground/60 font-bold">Ngày khám</span>
                    <span className="font-medium">
                        {data.date}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-foreground/60 font-bold">Giờ khám</span>
                    <span className="font-medium">
                        {data.startTime} - {data.endTime}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-foreground/60 font-bold">Loại khám</span>
                    <span className="font-medium">
                        {AppointmentType.find((t) => t.value === data.type)?.label}
                    </span>
                </div>

                <div className="border-t border-primary/10 pt-3 text-sm">
                    <span className="block text-foreground/60 mb-1 font-bold">
                        Lý do khám
                    </span>
                    <p className="text-foreground/80 leading-relaxed">
                        {data.reason || "Không có"}
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-foreground/70">
                Sau khi xác nhận, lịch hẹn sẽ được ghi nhận và không thể chỉnh sửa.
                Vui lòng đến đúng giờ để đảm bảo trải nghiệm tốt nhất.
            </div>

            <div className="flex justify-between gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 rounded-xl border border-primary/20 px-4 py-3 font-medium text-foreground/70 transition hover:bg-primary/5"
                >
                    Quay lại
                </button>

                <button
                    onClick={handleConfirm}
                    className="flex-1 rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                >
                    Xác nhận đặt lịch
                </button>
            </div>
        </div>
    );
}