import api from "@/lib/axios"
import { ApiResponse, PatientMedicalRecordsDTO, PatientsSummaryDTO } from "@/shared/type";

export const getAllPatients = async () => {
    const res = await api.get<ApiResponse<PatientsSummaryDTO[]>>("/doctor/patients-manage", { withCredentials: true });
    return res.data;
}

export const getPatientDetail = async (patientId: number) => {
    const res = await api.get<ApiResponse<PatientMedicalRecordsDTO>>(`/doctor/patients-manage/${patientId}`, { withCredentials: true });
    return res.data;
}