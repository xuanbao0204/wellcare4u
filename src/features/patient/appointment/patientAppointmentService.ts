import api from "@/lib/axios"
import { ApiResponse, AppointmentDTO, DoctorDTO, PageResponse, SlotDTO } from "@/shared/type";

interface DoctorListParams {
  keyword?: string;
  specialization?: string;
  location?: string;
  onlyVerified?: boolean;
  page?: number;
  size?: number;
}

export const getAllDoctors = async (params?: DoctorListParams) => {
  const query = new URLSearchParams(
    Object.entries(params || {})
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const res = await api.get<ApiResponse<PageResponse<DoctorDTO>>>(
    `/list/doctors?${query}`
  );
  return res.data;
};

export const getSlotByDoctorAndDate = async (doctorId: number, date: string) => {
  const res = await api.get<ApiResponse<SlotDTO[]>>(
    `/list/doctor/${doctorId}/available-slots?date=${date}`
  );
  return res.data;
}

export const bookAppointment = async (data: {
  doctorId: number;
  slotId: number;
  reason: string;
  type: string;
}) => {
  const res = await api.post<ApiResponse<any>>("/appointment/book", data);
  return res.data;
};


export const getPatientAppointmentsPage = async (params: {
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
    `/appointment/by-patient?${query}`
  );

  return res.data;
};

export const getPatientAppointments = async () => {
  const res = await api.get<ApiResponse<AppointmentDTO[]>>(
    "/appointment/by-patient"
  );
  return res.data;
};

export const cancelAppointment = async (id: number) => {
  const res = await api.put<ApiResponse<any>>(`/appointment/cancel/${id}`);
  return res.data;
}