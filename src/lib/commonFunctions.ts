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