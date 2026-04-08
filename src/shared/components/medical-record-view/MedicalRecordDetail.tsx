import { showError } from "@/lib/toast";
import { MedicalRecordDetail } from "@/shared/type";
import Badge from "@/shared/ui/Badge";
import { useEffect, useState } from "react";

const MedicalRecordDetailPage = ({ record }: { record: MedicalRecordDetail | null }) => {
    const [data, setData] = useState<MedicalRecordDetail>();

    useEffect(() => {
        if (record)
            setData(record);
        else {
            showError("Không thể tải hồ sơ khám bệnh. Vui lòng thử lại sau.");
            return;
        }
    }, [record]);

    if (!data) {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-primary/20 text-foreground/50">
                Chọn một hồ sơ để xem chi tiết
            </div>
        );
    }

    if (!data && !record) {
        return (
            <div className="rounded-3xl bg-white p-6">
                Đang tải...
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 backdrop-blur-xl shadow-[0_25px_60px_-25px_rgba(0,10,156,0.35)] space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">
                        Hồ sơ khám bệnh
                    </h2>
                    <p className="text-sm text-foreground/70">
                        {new Date(data.createdAt).toLocaleString("vi-VN")}
                    </p>
                </div>

                <Badge value={data.status} />
            </div>

            {/* DOCTOR */}
            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-sm text-foreground/60">Bác sĩ</p>
                <p className="text-lg font-semibold text-primary">
                    {data.doctor.firstName} {data.doctor.lastName}
                </p>
            </div>

            {/* CONTENT */}
            <Section title="Triệu chứng" value={data.symptoms!} />
            <Section title="Chẩn đoán" value={data.diagnosis!} />
            <Section title="Kế hoạch điều trị" value={data.treatmentPlan!} />
            <Section title="Kết luận" value={data.conclusion!} />

            {/* VITAL */}
            {data.vitalSign && (
                <div>
                    <h3 className="mb-3 text-lg font-semibold">
                        Chỉ số sinh tồn
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                        <InfoBox label="BMI" value={data.vitalSign.bmi!} />
                        <InfoBox label="Huyết áp" value={data.vitalSign.bloodPressure!} />
                        <InfoBox label="Nhịp tim" value={data.vitalSign.heartRate!} />
                    </div>
                </div>
            )}
        </div>
    );
};

type SectionProps = {
    title: string;
    value: string | number;
};

const Section = ({ title, value }: SectionProps) => (
    <div>
        <p className="text-sm text-foreground/60">{title}</p>
        <p className="mt-1 text-[15px] leading-relaxed text-foreground/80">
            {value || "Không có dữ liệu"}
        </p>
    </div>
);

const InfoBox = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-xl border border-primary/10 bg-white p-3">
        <p className="text-xs text-foreground/60">{label}</p>
        <p className="font-semibold">{value || "-"}</p>
    </div>
);

export default MedicalRecordDetailPage;