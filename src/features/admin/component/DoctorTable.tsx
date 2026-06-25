"use client";

import { DoctorDTO } from "@/shared/type";
import {
  BadgeCheck,
  ChevronRight,
  FileSearch,
  Mail,
  MapPin,
  Stethoscope,
  UserRound,
} from "lucide-react";

interface Props {
  doctors: DoctorDTO[];
  loading?: boolean;
  onView: (doctor: DoctorDTO) => void;
}

export default function DoctorTable({ doctors, loading, onView }: Props) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl border border-slate-100 bg-slate-50/80"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.42)] backdrop-blur-xl">
      <div className="flex flex-col gap-2 border-b border-white/70 px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Danh sách bác sĩ
          </h2>
          <p className="mt-1 text-sm text-foreground/50">
            Kiểm tra hồ sơ, chứng chỉ và trạng thái xác minh.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
          <Stethoscope size={14} />
          {doctors.length} hồ sơ
        </span>
      </div>

      {doctors.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/80 bg-white/85 text-primary shadow-sm">
            <FileSearch size={26} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Không tìm thấy bác sĩ
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-foreground/50">
            Thử thay đổi từ khóa hoặc bộ lọc trạng thái để xem thêm hồ sơ.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-100 bg-slate-50/60">
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-foreground/40">
                <th className="px-5 py-4">Bác sĩ</th>
                <th className="px-5 py-4">Chuyên khoa</th>
                <th className="px-5 py-4">Phòng khám</th>
                <th className="px-5 py-4">Kinh nghiệm</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100/80">
              {doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="group transition hover:bg-primary/[0.03]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {doctor.avatar ? (
                        <img
                          src={doctor.avatar}
                          alt={`${doctor.lastName} ${doctor.firstName}`}
                          className="h-12 w-12 rounded-2xl border border-primary/10 object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary shadow-sm">
                          <UserRound size={20} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">
                          {doctor.lastName} {doctor.firstName}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-foreground/45">
                          <Mail size={13} />
                          {doctor.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full border border-sky-200/80 bg-sky-50/90 px-3 py-1 text-xs font-semibold text-sky-700">
                      {doctor.specialization}
                    </span>
                  </td>

                  <td className="max-w-60 px-5 py-4">
                    <p className="flex items-start gap-1.5 text-sm leading-6 text-foreground/60">
                      <MapPin
                        size={14}
                        className="mt-1 shrink-0 text-primary/60"
                      />
                      <span className="line-clamp-2">
                        {doctor.clinicAddress || "Chưa cập nhật"}
                      </span>
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-foreground/70">
                    {doctor.experienceYears} năm
                  </td>

                  <td className="px-5 py-4">
                    {doctor.verified ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <BadgeCheck size={14} />
                        Đã xác minh
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/90 px-3 py-1 text-xs font-semibold text-amber-700">
                        Chờ xác minh
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onView(doctor)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                      Chi tiết
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
