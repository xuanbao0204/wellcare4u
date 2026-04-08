import api from "@/lib/axios";
import { LoginRequest, LoginResponse, RegisterRequest } from "./type";
import { ApiResponse } from "@/shared/type";


export const login = async (loginRequest: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login",
        loginRequest
    );

    return response.data;
};

export const register = async (registerRequest: RegisterRequest): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>("/auth/register",
        registerRequest
    );

    return response.data;
};