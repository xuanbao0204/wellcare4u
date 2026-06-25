import api from "@/lib/axios";
import { ApiResponse, DoctorDTO, PageResponse } from "@/shared/type";

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

export const getDoctorById = async (doctorId: number) => {
  const res = await api.get<ApiResponse<DoctorDTO>>(`/list/doctor/${doctorId}`);
  return res.data;
};