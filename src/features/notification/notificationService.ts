import api from "@/lib/axios";
import { ApiResponse, NotificationDTO } from "@/shared/type";

export type NotificationTarget =
  | "BROADCAST"
  | "ROLE"
  | "SINGLE"
  | "IDS";

export type NotificationType =
  | "SYSTEM"
  | "INFO"
  | "WARNING"
  | "REMIND";

// export type NotificationRequest =
//   | {
//     target: "BROADCAST";
//     type: NotificationType;
//     title: string;
//     content: string;
//   }
//   | {
//     target: "ROLE";
//     role: string;
//     type: NotificationType;
//     title: string;
//     content: string;
//   }
//   | {
//     target: "IDS";
//     receiverIds: number[];
//     type: NotificationType;
//     title: string;
//     content: string;
//   };

export interface NotificationRequest {
  target: NotificationTarget;

  role?: string;

  receiverIds?: number[];

  type: NotificationType;

  title: string;

  content: string;
}

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

export const sendNotification = async (
  payload: NotificationRequest,
  endpoint: string
) => {

  const res = await api.post(
    endpoint,
    payload
  );

  return res.data;
};

export const getNotificationsBySender = async () => {
  const res = await api.get<ApiResponse<NotificationDTO[]>>("/notifications/by-sender");
  return res.data;
};


//Doctor area
export const getMyPatients = async (): Promise<Record<number, string>> => {
  const res = await api.get("/doctor/notifications/my-patients");
  return res.data.data;
};