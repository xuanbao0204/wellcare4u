"use client";

import { CalendarCheck2, ClipboardList, Stethoscope, UserRoundSearch } from "lucide-react";
import BookingStep from "@/features/patient/appointment/components/BookingStep";
import ConfirmStep from "@/features/patient/appointment/components/ConfirmingStep";
import DoctorSelectStep from "@/features/patient/appointment/components/DoctorSelect";
import { BookingData, DoctorDTO } from "@/shared/type";
import { useState } from "react";

const steps = [
    {
        id: 1,
        title: "Chọn bác sĩ",
        description: "Tìm bác sĩ phù hợp với nhu cầu khám.",
        icon: <UserRoundSearch className="size-4" />,
    },
    {
        id: 2,
        title: "Lịch & thông tin",
        description: "Chọn ngày giờ và nội dung cuộc hẹn.",
        icon: <CalendarCheck2 className="size-4" />,
    },
    {
        id: 3,
        title: "Xác nhận",
        description: "Kiểm tra lại trước khi gửi yêu cầu đặt lịch.",
        icon: <ClipboardList className="size-4" />,
    },
];

export default function CreateAppointmentPage() {
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorDTO | null>(null);
    const [bookingData, setBookingData] = useState<BookingData | null>(null);

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#eef7f4_0%,#f7fafc_28%,#f8fafc_100%)] p-4 md:p-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <section className="overflow-hidden rounded-[30px] border border-emerald-100/80 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.97),rgba(248,250,252,0.94))] p-6 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.42)]">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-sm font-medium text-emerald-700">
                                <Stethoscope className="size-4" />
                                Đặt lịch khám
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                                Đặt lịch theo quy trình rõ ràng như một cổng booking thực tế
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
                                Chọn bác sĩ, xem lịch trống và xác nhận thông tin cuộc hẹn trong
                                một luồng trực quan, dễ theo dõi trên cả desktop lẫn mobile.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-105">
                            <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                    Bước hiện tại
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">
                                    {step}/3
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {steps[step - 1].title}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                    Bác sĩ
                                </p>
                                <p className="mt-2 text-base font-semibold text-slate-900">
                                    {selectedDoctor
                                        ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}`
                                        : "Chưa chọn"}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {selectedDoctor?.specialization || "Bắt đầu bằng bước chọn bác sĩ"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                    Lịch hẹn
                                </p>
                                <p className="mt-2 text-base font-semibold text-slate-900">
                                    {bookingData?.date || "Chưa chọn ngày"}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {bookingData
                                        ? `${bookingData.startTime} - ${bookingData.endTime}`
                                        : "Chưa có khung giờ"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-[28px] border border-slate-200/80 bg-white/88 p-4 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)] backdrop-blur">
                    <div className="mb-4 rounded-full bg-slate-100">
                        <div
                            className="h-2 rounded-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all"
                            style={{ width: `${(step / steps.length) * 100}%` }}
                        />
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        {steps.map((item) => {
                            const active = item.id === step;
                            const done = item.id < step;

                            return (
                                <div
                                    key={item.id}
                                    className={`rounded-2xl border px-4 py-4 transition-all ${
                                        active
                                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                            : done
                                              ? "border-emerald-100 bg-emerald-50/60 text-emerald-700"
                                              : "border-slate-200 bg-slate-50/80 text-slate-500"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`flex size-10 items-center justify-center rounded-2xl border ${
                                                active
                                                    ? "border-emerald-200 bg-white text-emerald-700"
                                                    : done
                                                      ? "border-emerald-100 bg-white text-emerald-600"
                                                      : "border-slate-200 bg-white text-slate-400"
                                            }`}
                                        >
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.16em] text-current/60">
                                                Bước {item.id}
                                            </p>
                                            <p className="mt-1 text-sm font-semibold">
                                                {item.title}
                                            </p>
                                            <p className="mt-1 text-sm text-current/70">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {step === 1 && (
                    <DoctorSelectStep
                        onSelect={(doc: DoctorDTO) => {
                            setSelectedDoctor(doc);
                            setStep(2);
                        }}
                    />
                )}

                {step === 2 && selectedDoctor && (
                    <BookingStep
                        doctor={selectedDoctor}
                        onNext={(data: BookingData) => {
                            setBookingData(data);
                            setStep(3);
                        }}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && selectedDoctor && bookingData && (
                    <ConfirmStep
                        doctor={selectedDoctor}
                        data={bookingData}
                        onBack={() => setStep(2)}
                    />
                )}
            </div>
        </div>
    );
}
