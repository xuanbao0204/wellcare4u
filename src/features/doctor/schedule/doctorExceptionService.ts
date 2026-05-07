import api from "@/lib/axios";
import { ApiResponse } from "@/shared/type";

export interface DoctorExceptionDTO {
    id: number;
    doctorId: number;
    doctorName: string;
    date: string;
    reason: string;
}

export interface CreateExceptionRequest {
    date: string;
    reason?: string;
}

export const getDayOffsByDoctor = async () => {
    const res = await api.get<ApiResponse<DoctorExceptionDTO[]>>(
        `/doctor/exceptions`
    );
    return res.data;
};

export const createDayOff = async (
    data: CreateExceptionRequest
) => {
    const res = await api.post<ApiResponse<DoctorExceptionDTO>>(
        `/doctor/exceptions`,
        data
    );
    return res.data;
};

export const revokeDayOff = async (date: string) => {
    await api.delete(`/doctor/exceptions?date=${date}`);
};