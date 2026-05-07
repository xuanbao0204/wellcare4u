import api from "@/lib/axios";
import { ApiResponse, AppointmentDTO, CancelAppointmentRequest, PageResponse } from "@/shared/type";

export const getDoctorAppointmentsPage = async (params: {
  page?: number;
  size?: number;
  status?: string;
  type?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) => {
  const query = new URLSearchParams(
    Object.entries(params || {})
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const res = await api.get<ApiResponse<PageResponse<AppointmentDTO>>>(
    `/appointment/by-doctor?${query}`
  );

  return res.data;
};

export const cancelAppointment = async (id: number, req: CancelAppointmentRequest) => {
  const res = await api.put<ApiResponse<any>>(`/appointment/cancel-by-doctor/${id}`, req);
  return res.data;
};

export const confirmAppointment = async (id: number) => {
  const res = await api.put<ApiResponse<any>>(`/appointment/confirm/${id}`);
  return res.data;
}