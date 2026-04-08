import { MedicalRecordDetail } from "@/shared/type";
import Badge from "@/shared/ui/Badge";

type MedicalRecordListProps = {
    records: MedicalRecordDetail[];
    selectedRecord: MedicalRecordDetail | null;
    onSelect: (id: number) => void;
};

const MedicalRecordList = ({ records, selectedRecord, onSelect }: MedicalRecordListProps) => {
    return (
        <div className="rounded-3xl border border-white/60 bg-white/75 p-4 backdrop-blur-xl shadow-[0_20px_60px_-25px_rgba(0,10,156,0.35)]">
            <h2 className="mb-4 text-lg font-semibold">
                Hồ sơ khám
            </h2>

            <div className="space-y-2">
                {records.length === 0 ? (
                    <p className="text-sm text-foreground/60">
                        Không có hồ sơ khám nào.
                    </p>
                ) : null}
                {records.map((r) => {
                    const active = selectedRecord === r;

                    return (
                        <div
                            key={r.id}
                            onClick={() => onSelect(r.id)}
                            className={`cursor-pointer rounded-2xl p-4 transition
                                ${
                                    active
                                        ? "bg-primary/10 border border-primary/20"
                                        : "hover:bg-white/70"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm">
                                    {r.doctor.firstName} {r.doctor.lastName}
                                </p>
                                <Badge value={r.status} />
                            </div>

                            <p className="mt-1 text-xs text-foreground/60">
                                {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                            </p>

                            <p className="mt-2 text-sm text-foreground/75 line-clamp-2">
                                {r.diagnosis || "Chưa có chẩn đoán"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MedicalRecordList;