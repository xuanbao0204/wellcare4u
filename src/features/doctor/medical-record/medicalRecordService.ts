import api from "@/lib/axios";
import { ApiResponse, CreateRecordData } from "@/shared/type";

export const finalizeRecord = async (data: CreateRecordData) => {
   const res = await api.post("/medical-records/finalize", data);
   return res.data;
}

export const startExam = async (appointmentId: number) => {
    const res = await api.post<ApiResponse<number>>(`/medical-records/create/${appointmentId}`, );
    return res.data;
}

