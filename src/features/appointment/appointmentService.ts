import api from "@/lib/axios";
import { ApiResponse, CancelAppointmentRequest } from "@/shared/type";

export const cancelAppointment = async (id: number, req: CancelAppointmentRequest) => {
  const res = await api.put<ApiResponse<any>>(`/appointment/cancel/${id}`, req);
  return res.data;
};

export const rebookAppointment = async (data: {
  patientId: number;
  slotId: number;
  reason: string;
  type: string;
}) => {
  const res = await api.post<ApiResponse<any>>("/appointment/rebook", data);
  return res.data;
};