import api from "@/lib/axios"
import { PatientDTO } from "@/shared/type";

export const getPatientProfile = async () => {
    const response = await api.get("/patient/profile");
    return response.data;
};

export const updatePatientProfile = async (profileData: Partial<PatientDTO>) => {
    const response = await api.put("/patient/profile", profileData);
    return response.data;

};