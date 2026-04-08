"use client";

import BookingStep from "@/features/patient/appointment/components/BookingStep";
import ConfirmStep from "@/features/patient/appointment/components/ConfirmingStep";
import DoctorSelectStep from "@/features/patient/appointment/components/DoctorSelect";
import { BookingData, DoctorDTO } from "@/shared/type";
import { useState } from "react";

export default function CreateAppointmentPage() {
    const [step, setStep] = useState(1);

    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [bookingData, setBookingData] = useState<any>(null);

    return (
        <div className="flex flex-col gap-6 transition-all">
            <div className="flex gap-4 text-sm">
                <span className={step === 1 ? "text-primary font-semibold" : ""}>
                    1. Chọn bác sĩ
                </span>
                <span>→</span>
                <span className={step === 2 ? "text-primary font-semibold" : ""}>
                    2. Lịch & Thông tin
                </span>
                <span>→</span>
                <span className={step === 3 ? "text-primary font-semibold" : ""}>
                    3. Xác nhận
                </span>
            </div>

            {step === 1 && (
                <DoctorSelectStep
                    onSelect={(doc: DoctorDTO) => {
                        setSelectedDoctor(doc);
                        setStep(2);
                    }}
                />
            )}

            {step === 2 && (
                <BookingStep
                    doctor={selectedDoctor}
                    onNext={(data: BookingData) => {
                        setBookingData(data);
                        setStep(3);
                    }}
                    onBack={() => setStep(1)}
                />
            )}

            {step === 3 && (
                <ConfirmStep
                    doctor={selectedDoctor}
                    data={bookingData}
                    onBack={() => setStep(2)}
                />
            )}
        </div>
    );
}