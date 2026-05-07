import { CalendarCheck2, CircleAlert, Clock3, FileText, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/lib/toast";
import { AppointmentType, BookingData, DoctorDTO } from "@/shared/type";
import { bookAppointment } from "../patientAppointmentService";

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
        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)]">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
                        <ShieldCheck className="size-3.5" />
                        Final review
                    </div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                        Xác nhận phiếu đặt lịch khám
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Kiểm tra lại toàn bộ thông tin trước khi gửi yêu cầu đặt lịch đến hệ
                        thống.
                    </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_320px]">
                    <div className="space-y-6">
                        <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(255,255,255,1))] p-5">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-2xl border border-emerald-200 bg-white p-3 text-emerald-700">
                                    <UserRound className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Bác sĩ phụ trách
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Người sẽ tiếp nhận yêu cầu khám của bạn
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/80 bg-white/80 p-4">
                                <p className="text-lg font-semibold text-slate-900">
                                    {doctor.firstName} {doctor.lastName}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {doctor.specialization || "Chưa có chuyên khoa"}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sky-700">
                                    <CalendarCheck2 className="size-5" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">
                                        Thông tin cuộc hẹn
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Tóm tắt chi tiết lịch khám bạn sắp đặt
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <DetailTile title="Mã slot" value={`#${data.slotId}`} />
                                <DetailTile title="Ngày khám" value={data.date} />
                                <DetailTile
                                    title="Giờ khám"
                                    value={`${data.startTime} - ${data.endTime}`}
                                />
                                <DetailTile
                                    title="Loại khám"
                                    value={
                                        AppointmentType.find((item) => item.value === data.type)
                                            ?.label || data.type
                                    }
                                />
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-700">
                                    <FileText className="size-5" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">
                                        Lý do khám
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Thông tin này sẽ được gửi cùng yêu cầu đặt lịch
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                                {data.reason || "Không có"}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-5 text-white">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-200/80">
                                Tóm tắt nhanh
                            </p>
                            <div className="mt-4 space-y-3">
                                <QuickRow
                                    icon={<CalendarCheck2 className="size-4" />}
                                    label="Ngày"
                                    value={data.date}
                                />
                                <QuickRow
                                    icon={<Clock3 className="size-4" />}
                                    label="Khung giờ"
                                    value={`${data.startTime} - ${data.endTime}`}
                                />
                                <QuickRow
                                    icon={<UserRound className="size-4" />}
                                    label="Bác sĩ"
                                    value={`${doctor.firstName} ${doctor.lastName}`}
                                />
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-amber-200 bg-amber-50/80 p-5">
                            <div className="flex items-start gap-3">
                                <div className="rounded-2xl border border-amber-200 bg-white p-3 text-amber-700">
                                    <CircleAlert className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-amber-900">
                                        Lưu ý trước khi xác nhận
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-amber-800">
                                        Sau khi xác nhận, lịch hẹn sẽ được ghi nhận và không thể
                                        chỉnh sửa trực tiếp. Vui lòng đến đúng giờ để buổi khám
                                        diễn ra thuận lợi hơn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-slate-500">
                        Nếu cần chỉnh sửa thông tin, bạn có thể quay lại bước trước.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            Quay lại
                        </button>

                        <button
                            onClick={handleConfirm}
                            className="rounded-2xl bg-linear-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                        >
                            Xác nhận đặt lịch
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DetailTile({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                {title}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
        </div>
    );
}

function QuickRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="rounded-xl border border-white/10 bg-white/10 p-2 text-emerald-200">
                {icon}
            </div>
            <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-medium text-white">{value}</p>
            </div>
        </div>
    );
}
