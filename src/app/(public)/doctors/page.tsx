"use client";

import { getAllDoctors } from "@/features/patient/appointment/patientAppointmentService";
import { showError } from "@/lib/toast";
import { useAuth } from "@/shared/AuthContext";
import DoctorCard from "@/shared/sections/DoctorCard";
import { DoctorDTO } from "@/shared/type";
import { Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DoctorsPage() {

    const {user} = useAuth();
    const router = useRouter();

    const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
    const [keyword, setKeyword] = useState("");
    const [page] = useState(0);
    const [size] = useState(5);

    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await getAllDoctors({ page, size });
            if (res.status !== 200) {
                showError(res.message);
                return;
            }

            setDoctors(res.data.content);
        };

        fetchDoctors();
    }, [page, size]);

    const filteredDoctors = doctors.filter((doctor) => {
        const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
        const specialization = doctor.specialization?.toLowerCase() || "";
        const search = keyword.trim().toLowerCase();

        if (!search) return true;
        return fullName.includes(search) || specialization.includes(search);
    });

    return (
        <section className="flex flex-col items-center justify-center mt-5 rounded-[28px] ">
            <div className="max-w-7xl rounded-[28px] gap-6 border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)]">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_320px]">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
                            <Users className="size-3.5" />
                            Doctor directory
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Đội ngũ bác sỹ của chúng tôi
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Với đội ngũ bác sỹ giàu kinh nghiệm và tận tâm, chúng tôi cam kết mang đến cho bạn sự chăm sóc sức khỏe tốt nhất. Hãy tìm kiếm và đặt lịch hẹn với bác sỹ phù hợp ngay hôm nay.
                        </p>
                    </div>

                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm bác sĩ theo tên hoặc chuyên khoa..."
                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-700 outline-none transition focus:border-emerald-400"
                        />
                    </div>
                </div>

                {filteredDoctors.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-14 text-center">
                        <p className="text-base font-medium text-slate-700">
                            Không tìm thấy bác sĩ phù hợp
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Thử lại với từ khóa khác để xem thêm kết quả.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} allowBooking={!!user && user.role === "PATIENT"} onSelect={() => router.push(`/patient/appointments/create?doctorId=${doctor.id}`)} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}