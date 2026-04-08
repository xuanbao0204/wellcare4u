import api from "@/lib/axios";
import { ApiResponse } from "@/shared/type";

export interface DoctorScheduleDTO {
  id: number;
  dayOfWeek: number;
  dayOfWeekName: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isActive: boolean;
}

export interface CreateScheduleRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export const getSchedulesByDoctor = async (doctorId: number) => {
  const res = await api.get<ApiResponse<DoctorScheduleDTO[]>>(`/doctor/schedules/get/${doctorId}`);
  return res.data;
};

export const createSchedule = async (
  doctorId: number,
  data: CreateScheduleRequest
) => {
  const res = await api.post<ApiResponse<DoctorScheduleDTO>>(
    `/doctor/schedules/create/${doctorId}`,
    data
  );
  return res.data;
};