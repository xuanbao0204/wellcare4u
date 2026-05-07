import Image from "next/image";
import { BriefcaseMedical, MapPin, ShieldCheck, Wallet } from "lucide-react";
import Badge from "@/shared/ui/Badge";
import { DoctorDTO } from "@/shared/type";

interface DoctorCardProps {
    doctor: DoctorDTO;
    onSelect: (doctor: DoctorDTO) => void;
}

export default function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
    return (
        <article className="group flex h-full flex-col gap-4 rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_70px_-42px_rgba(15,23,42,0.45)]">
            <div className="flex items-start gap-4">
                <div className="relative size-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <Image
                        src={doctor.avatar || "/images/default-avatar.png"}
                        alt={`${doctor.firstName} ${doctor.lastName}`}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                {doctor.firstName} {doctor.lastName}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                {doctor.specialization || "Chưa cập nhật chuyên khoa"}
                            </p>
                        </div>

                        {doctor.verified && (
                            <div className="shrink-0">
                                <Badge value="VERIFIED" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <InfoTile
                    icon={<BriefcaseMedical className="size-4" />}
                    label="Kinh nghiệm"
                    value={`${doctor.experienceYears || 0} năm`}
                />
                <InfoTile
                    icon={<Wallet className="size-4" />}
                    label="Phí tư vấn"
                    value={`Trung bình ${formatCurrency(doctor.consultationFee)}`}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500">
                        <MapPin className="size-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                            Địa chỉ phòng khám
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {doctor.clinicAddress || "Chưa cập nhật địa chỉ phòng khám"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-emerald-200 bg-white p-2 text-emerald-700">
                        <ShieldCheck className="size-4" />
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700/70">
                            Hồ sơ bác sĩ
                        </p>
                        <p className="mt-2 text-sm leading-6 text-emerald-900">
                            {doctor.bio || "Bác sĩ đã sẵn sàng tiếp nhận lịch hẹn của bạn."}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onSelect(doctor)}
                className="mt-auto rounded-2xl bg-linear-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
            >
                Chọn bác sĩ này
            </button>
        </article>
    );
}

function InfoTile({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                        {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

function formatCurrency(value?: number) {
    if (!value) return "Liên hệ";
    return `${value.toLocaleString("vi-VN")}đ`;
}
