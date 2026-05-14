import api from "@/lib/axios";
import { ApiResponse, EPostSortType, ESpecialization, PageResponse, PostSummaryResponse } from "@/shared/type";

export interface DashboardStats {
    totalAccounts: number;
    totalPatients: number;
    totalDoctors: number;
    totalAdmins: number;
    activeAccounts: number;
    inactiveAccounts: number;
    lockedAccounts: number;
    verifiedDoctors: number;
    pendingVerificationDoctors: number;
    totalAppointments: number;
    pendingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    totalPosts: number;
    totalComments: number;
    recentNotifications: RecentNotification[];
}

export interface RecentNotification {
    id: number;
    title: string;
    content: string;
    type: string;
    createdAt: string;
}

export interface AdminAccountDTO {
    id: number;
    userId: number;
    email: string;
    role: string;
    status: string;
    firstName: string;
    lastName: string;
    gender: string;
    phone: string;
    avatar: string;
    dob: string;
    verified?: boolean;
    specialization?: string;
    experienceYears?: number;
    clinicAddress?: string;
    consultationFee?: number;
    certification?: string;
    createdAt: string;
    lastLoginAt: string;
}

export interface AdminPostDTO {
    id: number;
    title: string;
    contentPreview: string;
    category: string;
    authorName: string;
    authorEmail: string;
    isAnonymous: boolean;
    isVerifiedAnswer: boolean;
    viewCount: number;
    likes: number;
    commentCount: number;
    tags: string[];
    createdAt: string;
}

export interface SendNotificationPayload {
    target: "BROADCAST" | "ROLE" | "SINGLE" | "IDS";
    role?: string;
    receiverId?: number;
    receiverIds?: number[];
    type: "INFO" | "WARNING" | "SYSTEM";
    title: string;
    content: string;
    referenceId?: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const res = await api.get<ApiResponse<DashboardStats>>("/admin/dashboard/stats");
    return res.data.data;
};

export const getAccounts = async (params: {
    role?: string;
    status?: string;
    keyword?: string;
    page?: number;
    size?: number;
}): Promise<PageResponse<AdminAccountDTO>> => {
    const res = await api.get<ApiResponse<PageResponse<AdminAccountDTO>>>("/admin/accounts", { params });
    return res.data.data;
};

export const activeAccount = async (id: number) =>
    api.put(`/admin/accounts/${id}/active`);

export const lockAccount = async (id: number) =>
    api.put(`/admin/accounts/${id}/lock`);

export const deleteAccount = async (id: number) =>
    api.delete(`/admin/accounts/${id}`);

export const verifyDoctor = async (id: number) =>
    api.put(`/admin/accounts/${id}/verify-doctor`);

export const unverifyDoctor = async (id: number) =>
    api.put(`/admin/accounts/${id}/unverify-doctor`);

export const getAllPosts = async (params: {
    page?: number;
    size?: number;
    category?: ESpecialization;
    keyword?: string;
    sort?: EPostSortType;
}) => {
    const query = new URLSearchParams(
        Object.entries(params || {})
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
            .map(([k, v]) => [k, String(v)])
    ).toString();

    const res = await api.get<ApiResponse<PageResponse<PostSummaryResponse>>>(
        `/admin/posts?${query}`
    );
    return res.data;
};

export const deletePost = async (postId: number) =>
    api.delete(`/admin/posts/${postId}`);

export const sendNotification = async (payload: SendNotificationPayload) =>
    api.post("/admin/notifications/send", payload);

export const exportAccounts = () =>
    `${process.env.NEXT_PUBLIC_API_URL}/admin/export/accounts`;

export const exportAppointments = () =>
    `${process.env.NEXT_PUBLIC_API_URL}/admin/export/appointments`;