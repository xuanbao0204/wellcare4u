"use client";

import {
    CalendarCheck2,
    ClipboardList,
    Sparkles,
    Stethoscope,
    UserRoundSearch,
} from "lucide-react";

import BookingStep from "@/features/patient/appointment/components/BookingStep";
import ConfirmStep from "@/features/patient/appointment/components/ConfirmingStep";
import DoctorSelectStep from "@/features/patient/appointment/components/DoctorSelect";
import AIRobotMascot from "@/features/ai/components/AIRobotMascot";

import { BookingData, DoctorDTO, SlotDTO } from "@/shared/type";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getDoctorById } from "@/features/patient/appointment/patientAppointmentService";

import { driver } from "driver.js";

export type BookingFormState = {
    selectedDoctor: DoctorDTO | null;
    bookingData: BookingData | null;

    selectedSlot: SlotDTO | null;

    reason: string;
    type: string;
    date: string;

    step: number;
};

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

const STORAGE_KEY = "appointment-booking-state";

export default function CreateAppointmentPage() {
    const router = useRouter();

    const searchParams = useSearchParams();

    const doctorId = searchParams.get("doctorId");
    const initialDoctorId = doctorId ? parseInt(doctorId) : undefined;
    const isGuideMode = searchParams.get("mode") === "guide";
    const specialty = searchParams.get("specialty");

    const [bookingState, setBookingState] = useState<BookingFormState>({
        selectedDoctor: null,
        bookingData: null,

        selectedSlot: null,

        reason: "",
        type: "",
        date: "",

        step: initialDoctorId ? 2 : 1,
    });

    useEffect(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);

        if (!saved) return;

        try {
            const parsed: BookingFormState = JSON.parse(saved);

            setBookingState(parsed);
        } catch (err) {
            console.error("Restore booking state failed", err);
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(bookingState),
        );
    }, [bookingState]);

    // Robot message
    const [robotMessage, setRobotMessage] = useState("");

    const fetchInitialDoctor = async (doctorId: number) => {
        try {
            const res = await getDoctorById(doctorId);
            // setSelectedDoctor(res.data);

            setBookingState((prev) => ({
                ...prev,
                selectedDoctor: res.data,
            }));
        } catch (error) {
            console.error("Error fetching initial doctor:", error);
        }
    };

    // Fetch doctor from query
    useEffect(() => {
        if (!initialDoctorId) return;

        const run = async () => {
            await fetchInitialDoctor(initialDoctorId);
        };

        void run();
    }, [initialDoctorId]);

    // Guide mode
    useEffect(() => {
        if (!isGuideMode) return;

        const driverObj = driver({
            showProgress: true,
            animate: true,

            onHighlightStarted: (element) => {
                if (!element) return;

                const elId = element.id;

                if (elId === "header-section") {
                    setRobotMessage(
                        `Chào bạn! Mình sẽ hướng dẫn bạn đặt lịch ${specialty ? `khoa ${specialty}` : ""
                        } nhé!`,
                    );
                }

                if (elId === "steps-indicator") {
                    setRobotMessage(
                        "Chúng ta sẽ thực hiện qua 3 bước đơn giản này.",
                    );
                }

                if (elId === "main-content") {
                    setRobotMessage(
                        "Đầu tiên, bạn hãy chọn một bác sĩ phù hợp trong danh sách bên dưới.",
                    );
                }
            },

            onDestroyed: () => {
                setRobotMessage("");
            },

            steps: [
                {
                    element: "#header-section",
                    popover: {
                        title: "Bắt đầu",
                        description:
                            "Đây là khu vực tổng quan của quy trình đặt lịch.",
                    },
                },
                {
                    element: "#steps-indicator",
                    popover: {
                        title: "Quy trình",
                        description:
                            "Bạn sẽ hoàn thành lần lượt 3 bước để đặt lịch.",
                    },
                },
                {
                    element: "#main-content",
                    popover: {
                        title: "Thực hiện",
                        description:
                            "Hãy bắt đầu bằng việc chọn bác sĩ phù hợp.",
                    },
                },
            ],
        });

        const timer = setTimeout(() => {
            driverObj.drive();
        }, 800);

        return () => {
            clearTimeout(timer);
            driverObj.destroy();
        };
    }, [isGuideMode, specialty]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_20%),linear-gradient(180deg,#f7fbfa_0%,#f8fafc_100%)] p-4 md:p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),transparent)]" />

            <div className="relative mx-auto flex max-w-7xl flex-col gap-6">
                {/* HEADER */}
                <section
                    id="header-section"
                    className="relative overflow-hidden rounded-[28px] border border-primary/15 bg-white/85 p-6 shadow-sm backdrop-blur-xl"
                >
                    <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_52%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_44%)]" />

                    <div className="relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/90 px-3 py-1 text-sm font-medium text-primary shadow-sm">
                                <Stethoscope className="size-4" />
                                Đặt lịch khám
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                                Đặt lịch theo quy trình rõ ràng như một cổng
                                booking thực tế
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/70 md:text-base">
                                Chọn bác sĩ, xem lịch trống và xác nhận thông
                                tin cuộc hẹn trong một luồng trực quan, dễ theo
                                dõi trên cả desktop lẫn mobile.
                            </p>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <div className="rounded-2xl border border-primary/15 bg-white/80 px-4 py-3 shadow-sm">
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/45">
                                        Trạng thái
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-foreground">
                                        {isGuideMode
                                            ? "Đang bật guide mode"
                                            : "Đặt lịch thủ công"}
                                    </p>
                                </div>

                                {specialty && (
                                    <div className="rounded-2xl border border-primary/15 bg-white/80 px-4 py-3 shadow-sm">
                                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/45">
                                            Chuyên khoa
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            {specialty}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 xl:min-w-105">
                            <div className="rounded-2xl border border-primary/15 bg-white/80 p-4 shadow-sm backdrop-blur-md">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/45">
                                    Bước hiện tại
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-foreground">
                                    {bookingState.step}/3
                                </p>

                                <p className="mt-1 text-sm text-foreground/65">
                                    {steps[bookingState.step - 1].title}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-primary/15 bg-white/80 p-4 shadow-sm backdrop-blur-md">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/45">
                                    Bác sĩ
                                </p>

                                <p className="mt-2 text-base font-semibold text-foreground">
                                    {bookingState.selectedDoctor
                                        ? `${bookingState.selectedDoctor.firstName} ${bookingState.selectedDoctor.lastName}`
                                        : "Chưa chọn"}
                                </p>

                                <p className="mt-1 text-sm text-foreground/65">
                                    {bookingState.selectedDoctor?.specialization ||
                                        "Bắt đầu bằng bước chọn bác sĩ"}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-primary/15 bg-white/80 p-4 shadow-sm backdrop-blur-md">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/45">
                                    Lịch hẹn
                                </p>

                                <p className="mt-2 text-base font-semibold text-foreground">
                                    {bookingState.bookingData?.date || "Chưa chọn ngày"}
                                </p>

                                <p className="mt-1 text-sm text-foreground/65">
                                    {bookingState.bookingData
                                        ? `${bookingState.bookingData.startTime} - ${bookingState.bookingData.endTime}`
                                        : "Chưa có khung giờ"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STEP INDICATOR */}
                <section
                    id="steps-indicator"
                    className="rounded-[28px] border border-primary/15 bg-white/85 p-4 shadow-sm backdrop-blur-xl"
                >
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Tiến trình đặt lịch
                            </p>
                            <p className="text-sm text-foreground/65">
                                Theo dõi bước hiện tại và những phần đã hoàn thành.
                            </p>
                        </div>

                        {isGuideMode && (
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                                <Sparkles className="size-4" />
                                Guide mode đang hỗ trợ từng bước
                            </div>
                        )}
                    </div>

                    <div className="mb-4 rounded-full bg-primary/10">
                        <div
                            className="h-2 rounded-full bg-linear-to-r from-primary via-emerald-500 to-sky-500 transition-all"
                            style={{
                                width: `${(bookingState.step / steps.length) * 100}%`,
                            }}
                        />
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        {steps.map((item) => {
                            const active = item.id === bookingState.step;
                            const done = item.id < bookingState.step;

                            return (
                                <div
                                    key={item.id}
                                    className={`rounded-2xl border px-4 py-4 transition-all ${active
                                        ? "border-primary/25 bg-primary/8 text-primary shadow-sm"
                                        : done
                                            ? "border-primary/15 bg-primary/5 text-primary/80"
                                            : "border-primary/10 bg-white/70 text-foreground/55"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`flex size-10 items-center justify-center rounded-2xl border ${active
                                                ? "border-primary/20 bg-white text-primary"
                                                : done
                                                    ? "border-primary/15 bg-white text-primary/80"
                                                    : "border-primary/10 bg-white text-foreground/45"
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

                {/* MAIN CONTENT */}
                <main id="main-content">
                    {isGuideMode && (
                        <section className="mb-4 rounded-[28px] border border-primary/15 bg-white/80 p-4 shadow-sm backdrop-blur-xl md:p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
                                        <Sparkles className="size-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            Hướng dẫn đang bật cho quy trình này
                                        </p>
                                        <p className="mt-1 text-sm leading-6 text-foreground/65">
                                            Mỗi bước sẽ được làm nổi bật để bạn dễ quan sát hơn.
                                            {specialty
                                                ? ` Hệ thống đang ưu tiên gợi ý theo chuyên khoa ${specialty}.`
                                                : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-primary/15 bg-white/85 px-4 py-3 text-sm text-foreground/70 shadow-sm">
                                    Bước hiện tại:{" "}
                                    <span className="font-semibold text-foreground">
                                        {steps[bookingState.step - 1].title}
                                    </span>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="rounded-[28px] border border-primary/15 bg-white/70 p-3 shadow-sm backdrop-blur-xl md:p-4">
                        <div className="rounded-3xl border border-white/70 bg-white/65 p-1.5 backdrop-blur-md">
                            {bookingState.step === 1 && (
                                <DoctorSelectStep
                                    selectedDoctor={bookingState.selectedDoctor}
                                    onSelect={(doc: DoctorDTO) => {
                                        setBookingState((prev) => ({
                                            ...prev,
                                            selectedDoctor: doc,
                                            step: 2,
                                        }));
                                    }}
                                />
                            )}

                            {bookingState.step === 2 && bookingState.selectedDoctor && (
                                <BookingStep
                                    doctor={bookingState.selectedDoctor}

                                    selectedSlot={bookingState.selectedSlot}
                                    setSelectedSlot={(slot) =>
                                        setBookingState((prev) => ({
                                            ...prev,
                                            selectedSlot: slot,
                                        }))
                                    }

                                    reason={bookingState.reason}
                                    setReason={(value) =>
                                        setBookingState((prev) => ({
                                            ...prev,
                                            reason: value,
                                        }))
                                    }

                                    type={bookingState.type}
                                    setType={(value) =>
                                        setBookingState((prev) => ({
                                            ...prev,
                                            type: value,
                                        }))
                                    }

                                    date={bookingState.date}
                                    setDate={(value) =>
                                        setBookingState((prev) => ({
                                            ...prev,
                                            date: value,
                                        }))
                                    }

                                    onNext={(data: BookingData) => {
                                        setBookingState((prev) => ({
                                            ...prev,
                                            bookingData: data,
                                            step: 3,
                                        }));
                                    }}

                                    onBack={() => {
                                        if (initialDoctorId) {
                                            router.push("/doctors");
                                            return;
                                        }

                                        setBookingState((prev) => ({
                                            ...prev,
                                            step: 1,
                                        }));
                                    }}
                                />
                            )}

                            {bookingState.step === 3 &&
                                bookingState.selectedDoctor &&
                                bookingState.bookingData && (
                                    <ConfirmStep
                                        doctor={bookingState.selectedDoctor}
                                        data={bookingState.bookingData}
                                        onBack={() => setBookingState((prev) => ({ ...prev, step: 2 }))}
                                    />
                                )}
                        </div>
                    </section>
                </main>
            </div>

            <AIRobotMascot
                message={robotMessage}
                onClick={() => {
                    console.log("Robot clicked");
                }}
            />
        </div>
    );
}
