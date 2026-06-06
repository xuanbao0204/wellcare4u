"use client";

import { useEffect, useMemo, useState } from "react";
import { DoctorDTO } from "@/shared/type";
import { getAllDoctors } from "@/features/common/commonService";
import DoctorTable from "@/features/admin/component/DoctorTable";
import DoctorDetailModal from "@/features/admin/component/DoctorDetailModal";
import {
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";

const statusOptions = [
  { label: "Tất cả", value: "all" },
  { label: "Đã xác minh", value: "verified" },
  { label: "Chờ xác minh", value: "pending" },
] as const;

type StatusFilter = (typeof statusOptions)[number]["value"];

export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDTO | null>(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await getAllDoctors({
        page: 0,
        size: 10,
      });

      setDoctors(res.data.content);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const fullName = `${doctor.lastName} ${doctor.firstName}`.toLowerCase();
      const matchesKeyword =
        !normalizedKeyword ||
        fullName.includes(normalizedKeyword) ||
        doctor.email.toLowerCase().includes(normalizedKeyword) ||
        doctor.specialization.toLowerCase().includes(normalizedKeyword) ||
        doctor.clinicAddress.toLowerCase().includes(normalizedKeyword);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && doctor.verified) ||
        (statusFilter === "pending" && !doctor.verified);

      return matchesKeyword && matchesStatus;
    });
  }, [doctors, keyword, statusFilter]);

  const verifiedCount = doctors.filter((doctor) => doctor.verified).length;
  const pendingCount = doctors.length - verifiedCount;
  const averageExperience = doctors.length
    ? Math.round(
        doctors.reduce((sum, doctor) => sum + doctor.experienceYears, 0) /
          doctors.length
      )
    : 0;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,250,252,0.82))] p-6 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.42)] backdrop-blur-xl sm:p-8">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
                <ShieldCheck size={14} />
                Quản trị bác sĩ
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Quản lý hồ sơ bác sĩ
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/55">
                Theo dõi thông tin chuyên môn, chứng chỉ hành nghề và trạng
                thái xác minh của đội ngũ bác sĩ trên hệ thống.
              </p>
            </div>

            <button
              onClick={fetchDoctors}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/15 bg-white/85 px-4 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Làm mới
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Tổng bác sĩ"
              value={doctors.length}
              icon={<Users size={22} />}
              tone="from-blue-50/95 to-white/72"
            />
            <StatCard
              label="Đã xác minh"
              value={verifiedCount}
              icon={<CheckCircle2 size={22} />}
              tone="from-emerald-50/95 to-white/72"
            />
            <StatCard
              label="Chờ duyệt"
              value={pendingCount}
              icon={<Clock3 size={22} />}
              tone="from-amber-50/95 to-white/72"
            />
            <StatCard
              label="KN trung bình"
              value={`${averageExperience} năm`}
              icon={<Stethoscope size={22} />}
              tone="from-violet-50/95 to-white/72"
            />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.4)] backdrop-blur-xl">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35"
            />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo tên, email, chuyên khoa hoặc phòng khám..."
              className="h-12 w-full rounded-2xl border border-slate-200/80 bg-white/90 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary/30 focus:bg-white focus:shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={`h-12 rounded-2xl border px-4 text-sm font-semibold transition ${
                  statusFilter === option.value
                    ? "border-primary/50 bg-primary text-white shadow-sm"
                    : "border-slate-200/80 bg-white/85 text-foreground/60 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-foreground/45">
          <Sparkles size={14} className="text-primary" />
          Hiển thị {filteredDoctors.length} trong {doctors.length} hồ sơ bác sĩ
        </div>
      </section>

      <DoctorTable
        doctors={filteredDoctors}
        loading={loading}
        onView={(doctor) => setSelectedDoctor(doctor)}
      />

      <DoctorDetailModal
        doctor={selectedDoctor}
        open={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onVerifiedSuccess={fetchDoctors}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-white/75 bg-linear-to-br ${tone} p-4 shadow-sm backdrop-blur`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
            {label}
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-primary shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}
