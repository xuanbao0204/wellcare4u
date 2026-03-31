import api from "@/lib/axios"
import { ApiResponse, PersonalProfileData } from "../type";

export const fetchInfo = async () : Promise<ApiResponse<PersonalProfileData>> => {
    const response = await api.get<ApiResponse<PersonalProfileData>>("/user");
    return response.data;
};

export const updateInfo = async (data: any) => {
    const response = await api.put<ApiResponse<PersonalProfileData>>("/user", data);
    return response.data;
};