import api from "@/lib/axios";
import { LoginRequest, LoginResponse } from "./type";
import { ApiResponse } from "@/shared/type";


export const login = async (loginRequest: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login",
        loginRequest
    );

    return response.data;
};