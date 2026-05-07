import { AppointmentStatus } from "@/shared/type";

export const getTimePeriod = (time: string) => {
    const [hour] = time.split(":").map(Number);

    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
};


export const getAppointmentStatusLabel = (status: string) => {
    const appointmentStatus = AppointmentStatus.find((s) => s.value === status);
    return appointmentStatus ? appointmentStatus.label : status;
};

export const parseDateTime = (dateStr: string, timeStr: string) => {
    const [day, month, year] = dateStr.split("/");

    const startTime = timeStr.split(" - ")[0];

    return new Date(`${year}-${month}-${day}T${startTime}`);
};

export const getBMILabel = (bmi: number) => {
    if (bmi < 18.5) {
        return {
            label: "Thiếu cân",
            color: "text-amber-700 bg-amber-50 border-amber-200",
        };
    }
    if (bmi < 25) {
        return {
            label: "Bình thường",
            color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        };
    }
    if (bmi < 30) {
        return {
            label: "Thừa cân",
            color: "text-orange-700 bg-orange-50 border-orange-200",
        };
    }
    return {
        label: "Béo phì",
        color: "text-rose-700 bg-rose-50 border-rose-200",
    };
};

export const getHeartRateLabel = (hr?: number) => {
    if (!hr) return null;
    if (hr < 60) {
        return {
            label: "Chậm",
            color: "text-amber-700 bg-amber-50 border-amber-200",
        };
    }
    if (hr <= 100) {
        return {
            label: "Bình thường",
            color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        };
    }
    return {
        label: "Nhanh",
        color: "text-rose-700 bg-rose-50 border-rose-200",
    };
};

export const getBloodPressureLabel = (bp?: string) => {
    if (!bp) return null;

    const [sys, dia] = bp.split("/").map(Number);
    if (!sys || !dia) return null;

    if (sys < 90 || dia < 60) {
        return {
            label: "Huyết áp thấp",
            color: "text-amber-700 bg-amber-50 border-amber-200",
        };
    }
    if (sys < 120 && dia < 80) {
        return {
            label: "Bình thường",
            color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        };
    }
    if (sys < 140 && dia < 90) {
        return {
            label: "Tiền tăng huyết áp",
            color: "text-orange-700 bg-orange-50 border-orange-200",
        };
    }
    return {
        label: "Tăng huyết áp",
        color: "text-rose-700 bg-rose-50 border-rose-200",
    };
};

export const getBloodSugarLabel = (sugar?: number) => {
    if (!sugar) return null;

    if (sugar < 3.9) {
        return {
            label: "Thấp",
            color: "text-amber-700 bg-amber-50 border-amber-200",
        };
    }
    if (sugar <= 7.8) {
        return {
            label: "Bình thường",
            color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        };
    }
    return {
        label: "Cao",
        color: "text-rose-700 bg-rose-50 border-rose-200",
    };
};