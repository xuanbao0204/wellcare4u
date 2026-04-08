import api from "@/lib/axios";
import { ApiResponse } from "@/shared/type";

export interface TimeSlotDTO {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "FREE" | "BLOCKED" | "BOOKED";
}

export const getSlotsByDoctor = async (
  doctorId: number,
  fromDate: string,
  toDate: string
) => {
  const res = await api.get<ApiResponse<TimeSlotDTO[]>>(
    `/time-slots/doctor/${doctorId}?fromDate=${fromDate}&toDate=${toDate}`
  );
  return res.data;
};

export const blockSlot = async (slotId: number) => {
  await api.put(`/time-slots/${slotId}/block`);
};

export const unblockSlot = async (slotId: number) => {
    const res = await api.put(`/time-slots/${slotId}/unblock`);
    return res.data;
};