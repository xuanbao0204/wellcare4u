import api from "@/lib/axios"
import { ApiResponse } from "@/shared/type";

export const activeAccount = async (email: string) => {
    try {
        const response = await api.put<ApiResponse<any>>("/account/activate", { email });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const deactiveAccount = async (email: string) => {
    try {
        const response = await api.put<ApiResponse<any>>("/account/deactivate", { email });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
        const response = await api.put<ApiResponse<any>>("/account/change-password", { currentPassword, newPassword });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const deleteAccount = async (password: string) => {
    try {
        const response = await api.put<ApiResponse<any>>("/account/delete", { password });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};