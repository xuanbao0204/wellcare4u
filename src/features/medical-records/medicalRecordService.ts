import api from "@/lib/axios"
import { MedicalRecordDTO } from "./types";
import { MedicalRecordListDTO } from "./types";
import { ApiResponse, MedicalRecordDetail, MedicalRecordDetailPrint } from "@/shared/type";

export const getAllRecordByPatientId = async(patientId: number) => {
    const res = await api.get<ApiResponse<MedicalRecordListDTO[]>>(`/medical-records/patient/${patientId}`);
    return res.data;
}

export const getAllRecordByDoctorId = async(doctorId: number) => {
    const res = await api.get<ApiResponse<MedicalRecordListDTO[]>>(`/medical-records/doctor/${doctorId}`);
    return res.data;
}

export const getRecordDetail = async(recordId: number) => {
    const res = await api.get<ApiResponse<MedicalRecordDetail>>(`/medical-records/detail/${recordId}`);
    return res.data;
}

export const getRecordDetailPrint = async(recordId: number) => {
    const res = await api.get<ApiResponse<MedicalRecordDetailPrint>>(`/medical-records/detail/print/${recordId}`);
    return res.data;
}