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

export interface UpdateScheduleRequest {
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    isActive: boolean;
}

export const getSchedulesByDoctor = async (doctorId: number) => {
    const res = await api.get<ApiResponse<DoctorScheduleDTO[]>>(
        `/doctor/schedules/get/${doctorId}`
    );
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

export const updateSchedule = async (
    scheduleId: number,
    data: UpdateScheduleRequest
) => {
    const res = await api.put<ApiResponse<DoctorScheduleDTO>>(
        `/doctor/schedules/${scheduleId}`,
        data
    );
    return res.data;
};

export const deleteSchedule = async (scheduleId: number) => {
    await api.delete(`/doctor/schedules/delete/${scheduleId}`);
};
// import api from "@/lib/axios";
// import { ApiResponse } from "@/shared/type";

// export interface DoctorScheduleDTO {
//   id: number;
//   dayOfWeek: number;
//   dayOfWeekName: string;
//   startTime: string;
//   endTime: string;
//   slotDurationMinutes: number;
//   isActive: boolean;
// }

// export interface CreateScheduleRequest {
//   dayOfWeek: number;
//   startTime: string;
//   endTime: string;
//   slotDurationMinutes: number;
// }

// export const getSchedulesByDoctor = async (doctorId: number) => {
//   const res = await api.get<ApiResponse<DoctorScheduleDTO[]>>(`/doctor/schedules/get/${doctorId}`);
//   return res.data;
// };

// export const createSchedule = async (
//   doctorId: number,
//   data: CreateScheduleRequest
// ) => {
//   const res = await api.post<ApiResponse<DoctorScheduleDTO>>(
//     `/doctor/schedules/create/${doctorId}`,
//     data
//   );
//   return res.data;
// };
