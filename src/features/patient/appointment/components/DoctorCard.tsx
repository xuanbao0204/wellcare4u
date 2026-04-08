import Badge from "@/shared/ui/Badge";
import { DoctorDTO } from "@/shared/type";

interface DoctorCardProps {
    doctor: DoctorDTO;
    onSelect: (doctor: DoctorDTO) => void;
}

export default function DoctorCard({ doctor, onSelect }: DoctorCardProps) {
    return (
        <div className="rounded-2xl border border-primary/15 bg-white/80 backdrop-blur-md p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <img
                    src={doctor.avatar || "/images/default-avatar.png"}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <p className="font-semibold">
                        {doctor.firstName} {doctor.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                </div>
            </div>

            {doctor.verified && (
                <Badge
                    value="VERIFIED"
                />
            )}

            <button
                onClick={() => onSelect(doctor)}
                className="mt-auto bg-primary text-white rounded-lg py-2 hover:bg-primary/90 transition-colors"
            >
                Đặt lịch
            </button>
        </div>
    );
}