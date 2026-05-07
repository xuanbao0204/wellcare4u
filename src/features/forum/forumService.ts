import api from "@/lib/axios";
import {
    ApiResponse,
    PageResponse,
    PostSummaryResponse,
    PostDetailResponse,
    CommentResponse,
    CreatePostRequest,
    CreateCommentRequest,
    ESpecialization,
    EPostSortType,
} from "@/shared/type";

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
        `/forum/posts?${query}`
    );
    return res.data;
};

export const getPostById = async (postId: number) => {
    const res = await api.get<ApiResponse<PostDetailResponse>>(`/forum/posts/${postId}`);
    return res.data;
};

export const createPost = async (req: CreatePostRequest) => {
    const res = await api.post<ApiResponse<PostDetailResponse>>(`/forum/posts`, req);
    return res.data;
};

export const deletePost = async (postId: number) => {
    const res = await api.delete<ApiResponse<null>>(`/forum/posts/${postId}`);
    return res.data;
};

export const likePost = async (postId: number) => {
    const res = await api.post<ApiResponse<PostDetailResponse>>(`/forum/posts/${postId}/like`);
    return res.data;
};

export const addComment = async (postId: number, req: CreateCommentRequest) => {
    const res = await api.post<ApiResponse<CommentResponse>>(
        `/forum/posts/${postId}/comments`,
        req
    );
    return res.data;
};

export const deleteComment = async (commentId: number) => {
    const res = await api.delete<ApiResponse<null>>(`/forum/comments/${commentId}`);
    return res.data;
};