import api from "@/lib/axios"
import { ApiResponse } from "@/shared/type";


export type DoctorProfileData = {
    bio: string;
    certification: string;
    specialization: string;
    experienceYears: number;
    consultationFee: number;
    clinicAddress: string;
    verified: boolean;
}

export const getDoctorProfile = async () => {
    const response = await api.get<ApiResponse<DoctorProfileData>>("/doctor/profile");
    return response.data;
}

export const updateDoctorProfile = async (data: Partial<DoctorProfileData>) => {
    const response = await api.put<ApiResponse<DoctorProfileData>>("/doctor/profile", data);
    return response.data;
}