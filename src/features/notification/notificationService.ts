import api from "@/lib/axios";
import { ApiResponse, NotificationDTO } from "@/shared/type";

export const getNotifications = async () => {
  const res = await api.get<ApiResponse<NotificationDTO[]>>("/notifications");
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await api.get("/notifications/unread-count");
  return res.data;
};

export const markAsRead = async (id: number) => {
  await api.post(`/notifications/${id}/read`);
};