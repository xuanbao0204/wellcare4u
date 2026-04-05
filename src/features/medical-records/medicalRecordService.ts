import api from "@/lib/axios"
import { MedicalRecordDTO } from "./types";
import { MedicalRecordListDTO } from "./types";
import { ApiResponse } from "@/shared/type";

export const getAllRecordByPatientId = async(patientId: number) => {
    const res = await api.get<MedicalRecordListDTO[]>(`/medical-records/patient/${patientId}`);
    return res.data;
}

export const getAllRecordByDoctorId = async(doctorId: number) => {
    const res = await api.get<ApiResponse<MedicalRecordListDTO[]>>(`/medical-records/doctor/${doctorId}`);
    return res.data;
}

export const getRecordDetail = async(recordId: number) => {
    const res = await api.get<ApiResponse<MedicalRecordDTO>>(`/medical-records/detail/${recordId}`);
    return res.data;
}