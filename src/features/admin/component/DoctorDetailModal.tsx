import { useState } from "react";
import { DoctorDTO } from "@/shared/type";
import {
  BadgeCheck,
  BriefcaseMedical,
  Building2,
  ExternalLink,
  FileBadge,
  Mail,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

interface Props {
  doctor: DoctorDTO | null;
  open: boolean;
  onClose: () => void;
  onVerifiedSuccess?: () => void;
}

export default function DoctorDetailModal({
  doctor,
  open,
  onClose,
  onVerifiedSuccess,
}: Props) {
  const [viewedCertificationDoctorId, setViewedCertificationDoctorId] =
    useState<number | null>(null);

  if (!open || !doctor) return null;

  const hasViewedCertification = viewedCertificationDoctorId === doctor.id;

  const handleClose = () => {
    setViewedCertificationDoctorId(null);
    onClose();
  };

  const handleViewCertification = () => {
    setViewedCertificationDoctorId(doctor.id);

    if (doctor.certification) {
      const certificationWindow = window.open(
        doctor.certification,
        "_blank",
        "noopener,noreferrer"
      );

      if (certificationWindow) {
        certificationWindow.opener = null;
      }
    }
  };

  const handleVerify = async () => {
    try {
      // TODO:
      // await verifyDoctor(doctor.id)

      alert("Đã xác minh");

      onVerifiedSuccess?.();
      handleClose();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-[0_34px_100px_-44px_rgba(15,23,42,0.65)] backdrop-blur-xl">
        <div className="relative overflow-hidden border-b border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,250,252,0.78))] p-6">
          <div className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {doctor.avatar ? (
                <img
                  src={doctor.avatar}
                  alt={`${doctor.lastName} ${doctor.firstName}`}
                  className="h-16 w-16 rounded-3xl border border-white/80 object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/80 bg-white/75 text-primary shadow-sm">
                  <UserRound size={26} />
                </div>
              )}

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <FileBadge size={13} />
                  Hồ sơ bác sĩ
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {doctor.lastName} {doctor.firstName}
                </h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-foreground/55">
                  <Mail size={15} />
                  {doctor.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-foreground/55 shadow-sm transition hover:bg-white hover:text-foreground"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoTile
              icon={<BriefcaseMedical size={18} />}
              label="Chuyên khoa"
              value={doctor.specialization}
            />
            <InfoTile
              icon={<BadgeCheck size={18} />}
              label="Kinh nghiệm"
              value={`${doctor.experienceYears} năm`}
            />
            <InfoTile
              icon={
                doctor.verified ? (
                  <ShieldCheck size={18} />
                ) : (
                  <ShieldAlert size={18} />
                )
              }
              label="Trạng thái"
              value={doctor.verified ? "Đã xác minh" : "Chờ xác minh"}
              tone={
                doctor.verified
                  ? "border-emerald-200/80 bg-emerald-50/90 text-emerald-700"
                  : "border-amber-200/80 bg-amber-50/90 text-amber-700"
              }
            />
          </div>

          <div className="mt-4 rounded-[24px] border border-white/70 bg-white/72 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Building2 size={17} className="text-primary" />
              Thông tin phòng khám
            </div>
            <p className="text-sm leading-7 text-foreground/60">
              {doctor.clinicAddress || "Chưa cập nhật địa chỉ phòng khám."}
            </p>
          </div>

          <div className="mt-4 rounded-[24px] border border-white/70 bg-white/72 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserRound size={17} className="text-primary" />
              Giới thiệu
            </div>
            <p className="text-sm leading-7 text-foreground/60">
              {doctor.bio || "Bác sĩ chưa cập nhật phần giới thiệu."}
            </p>
          </div>

          <div className="mt-4 rounded-[24px] border border-primary/10 bg-primary/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Chứng chỉ hành nghề
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground/55">
                  Cần xem chứng chỉ trước khi xác minh tài khoản bác sĩ.
                </p>
              </div>

              <button
                onClick={handleViewCertification}
                disabled={!doctor.certification}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ExternalLink size={16} />
                Xem chứng chỉ
              </button>
            </div>
          </div>

          {!hasViewedCertification && !doctor.verified && (
            <div className="mt-4 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm font-medium text-amber-700">
              Cần xem chứng chỉ trước khi xác minh bác sĩ.
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/70 bg-white/75 p-5 sm:flex-row sm:justify-end">
          <button
            onClick={handleClose}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-foreground/65 shadow-sm transition hover:bg-slate-50"
          >
            Đóng
          </button>

          <button
            disabled={!hasViewedCertification || doctor.verified}
            onClick={handleVerify}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShieldCheck size={17} />
            Xác minh bác sĩ
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
  tone = "border-white/70 bg-white/72 text-foreground",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className={`rounded-[22px] border p-4 shadow-sm ${tone}`}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-primary shadow-sm">
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/40">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}
