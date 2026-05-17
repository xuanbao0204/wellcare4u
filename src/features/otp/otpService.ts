import api from "@/lib/axios";

export enum OtpType {
    REGISTER = "REGISTER",
    FORGOT_PASSWORD = "FORGOT_PASSWORD",
    CHANGE_EMAIL = "CHANGE_EMAIL",
    DELETE_ACCOUNT = "DELETE_ACCOUNT"
}

export type OtpRequest = {
    email: string;
    code: string;
    type: OtpType;
}

export const sendOtp = async (email: string, type: OtpType) => {
    const res = await api.post("/otp/send", { email, type });
    return res.data;
}

export const verifyOtp = async (email: string, code: string, type: OtpType) => {
    const res = await api.post("/otp/verify", { email, code, type });
    return res.data;
}

export const resendOtp = async (email: string, type: OtpType) => {
    const res = await api.post("/otp/resend", { email, type });
    return res.data;
}