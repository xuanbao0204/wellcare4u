import api from "@/lib/axios"
import { ApiResponse } from "@/shared/type";

export interface SuggestedSpecialization {
    userSymptom: string;
	suggestion: string;
	message: string;
	matchingRate: number;
}

export const generatePatientSummary = async () => {
    try {
        const res = await api.get<ApiResponse<String>>("/ai-tools/patient-summary");
        return res.data;
    } catch (error) {
        console.error("Error generating patient summary:", error);
        throw error;
    }
}

export const generateDoctorSummary = async () => {
    try {
        const res = await api.get<ApiResponse<String>>("/ai-tools/doctor-summary");
        return res.data;
    } catch (error) {
        console.error("Error generating doctor summary:", error);
        throw error;
    }
}

export const suggestSpecialization = async (userSymptom: string) => {
    try {
        const res = await api.post<ApiResponse<SuggestedSpecialization>>("/ai-tools/suggest-specialization", { userSymptom: userSymptom });
        return res.data;
    } catch (error) {
        console.error("Error suggesting specialization:", error);
        throw error;
    }
}