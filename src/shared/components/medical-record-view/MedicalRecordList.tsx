import { MedicalRecordListDTO } from "@/features/medical-records/types";

type MedicalRecordListProps = {
    records: MedicalRecordListDTO[];
    onSelect: (id: number) => void;
};

const MedicalRecordList = ({ records, onSelect }: MedicalRecordListProps) => {
    return (
        <div className="space-y-6">

            {records.length === 0 && (
                <div className="py-20 text-center text-sm text-foreground/50">
                    Không có hồ sơ khám nào.
                </div>
            )}

            {records.map((r) => (
                <div
                    key={r.recordId}
                    onClick={() => onSelect(r.recordId)}
                    className="group cursor-pointer rounded-3xl bg-white/80 backdrop-blur-xl p-5 md:p-6
      border border-white/40
      shadow-[0_25px_70px_-30px_rgba(0,10,156,0.25)]
      hover:shadow-[0_35px_90px_-30px_rgba(0,10,156,0.35)]
      transition-all duration-200"
                >

                    {/* TOP */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        {/* LEFT */}
                        <div className="flex gap-4 items-start">
                            <img
                                src={r.doctor.avatar || "/images/default-avatar.png"}
                                alt={`${r.doctor.firstName} ${r.doctor.lastName}`}
                                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shrink-0 border border-white/60"
                            />

                            <div className="space-y-1">
                                <p className="text-base md:text-lg font-semibold leading-tight">
                                    Bác sĩ{" "}
                                    <span className="text-primary">
                                        {r.doctor.firstName} {r.doctor.lastName}
                                    </span>
                                </p>

                                <p className="text-sm md:text-base text-foreground/70">
                                    Ngày khám:{" "}
                                    <span className="font-medium">
                                        {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* ACTION */}
                        <div className="self-start md:self-auto">
                            <button
                                className="px-4 py-2 rounded-xl text-sm font-medium
            bg-primary/90 text-white
            shadow-md shadow-primary/20
            hover:bg-primary hover:scale-[1.03]
            transition-all duration-200"
                            >
                                Xem chi tiết
                            </button>
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

                    {/* DIAGNOSIS */}
                    <div className="text-sm md:text-[15px] text-foreground/75 leading-relaxed">
                        <span className="font-semibold text-foreground">
                            Chẩn đoán:
                        </span>{" "}
                        {r.diagnosis || (
                            <span className="italic text-foreground/50">
                                Chưa có chẩn đoán
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MedicalRecordList;