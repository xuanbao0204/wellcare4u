import DrugAutocomplete from "@/features/drug/components/DrugAutoComplete";
import FloatingInput from "@/shared/components/FloatingInput";
import { DrugDTO, PrescriptionItem } from "@/shared/type";
import { Pencil, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import SuggestionInput from "./SuggestionInput";

type Props = {
    item: PrescriptionItem;

    index: number;

    isEditing: boolean;

    onChange: (
        item: PrescriptionItem
    ) => void;

    onDelete: () => void;

    onEdit: () => void;

    onSave: () => void;
};

export const FREQUENCY_OPTIONS = [
    "1 lần/ngày (Sáng)",
    "1 lần/ngày (Trưa)",
    "1 lần/ngày (Tối)",
    "2 lần/ngày (Sáng - Trưa)",
    "2 lần/ngày (Trưa - Tối)",
    "2 lần/ngày (Sáng - Tối)",
    "3 lần/ngày (Sáng - Trưa - Tối)",
    "Mỗi 6 giờ",
    "Mỗi 8 giờ",
    "Mỗi 12 giờ",
    "Khi cần (Cách nhau ít nhất 4 tiếng)",
];

export const DURATION_OPTIONS = [
    "3 ngày",
    "5 ngày",
    "7 ngày",
    "10 ngày",
    "14 ngày",
    "21 ngày",
    "30 ngày",
];

const fieldClass =
    "rounded-2xl border-slate-200/80 bg-white/90 shadow-sm backdrop-blur transition focus:bg-white focus:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] disabled:bg-slate-50/80";

export default function PrescriptionItemCard({
    item,
    index,
    isEditing,
    onChange,
    onDelete,
    onEdit,
    onSave,
}: Props) {
    const [drug, setDrug] = useState<DrugDTO>();
    return (
        <article
            className={`rounded-3xl border p-5 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all ${isEditing
                ? "border-primary/20 bg-primary/5"
                : "border-white/70 bg-white/80"
                }`}
        >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Thuốc {index + 1}
                    </p>

                    <h3 className="mt-1 truncate text-lg font-semibold text-slate-800">
                        {item.drugName || "Thuốc mới"} {drug?.unit || ""}
                    </h3>

                    {drug && (
                        <p className="bg-green-800 rounded-3xl px-2 text-xs tracking-wider text-white">
                            Liều dùng khuyến nghị {drug.defaultDosage}
                        </p>
                    )}

                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={onEdit}
                            className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-white/85 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]"
                        >
                            <Pencil className="h-4 w-4" />
                            Chỉnh sửa
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onSave}
                            className="inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary/90 active:scale-[0.98]"
                        >
                            <Save className="h-4 w-4" />
                            Lưu
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onDelete}
                        className="inline-flex items-center gap-2 rounded-2xl border border-rose-200/80 bg-white/85 px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 active:scale-[0.98]"
                    >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DrugAutocomplete
                    disabled={!isEditing}
                    selectedDrugId={item.drugId}
                    selectedDrugName={item.drugName}
                    onSelect={(drug: DrugDTO) => {
                        setDrug(drug);
                        onChange({
                            ...item,
                            drugId: drug.id,
                            drugName: drug.name,
                        })
                    }
                    }
                />

                <FloatingInput
                    label="Liều dùng. Ví dụ: 1 viên/lần"
                    disabled={!isEditing}
                    className={fieldClass}
                    value={item.dosage ?? ""}
                    onChange={(e) =>
                        onChange({
                            ...item,
                            dosage: e.target.value,
                        })
                    }
                />

                {/* <FloatingInput
                    label="Tần suất. Ví dụ: 2 lần/ngày"
                    disabled={!isEditing}
                    className={fieldClass}
                    value={item.frequency ?? ""}
                    onChange={(e) =>
                        onChange({
                            ...item,
                            frequency: e.target.value,
                        })
                    }
                /> */}

                <SuggestionInput
                    label="Tần suất"

                    value={item.frequency ?? ""}

                    suggestions={
                        FREQUENCY_OPTIONS
                    }

                    disabled={!isEditing}

                    onChange={(value) =>
                        onChange({
                            ...item,
                            frequency: value,
                        })
                    }
                />

                {/* <FloatingInput
                    label="Thời gian"
                    disabled={!isEditing}
                    className={fieldClass}
                    value={item.duration ?? ""}
                    onChange={(e) =>
                        onChange({
                            ...item,
                            duration: e.target.value,
                        })
                    }
                /> */}

                <SuggestionInput
                    label="Thời gian"

                    value={item.duration ?? ""}

                    suggestions={
                        DURATION_OPTIONS
                    }

                    disabled={!isEditing}

                    onChange={(value) =>
                        onChange({
                            ...item,
                            duration: value,
                        })
                    }
                />

                <div className="md:col-span-2">
                    <FloatingInput
                        label="Hướng dẫn: VD: Uống sau bữa ăn"
                        disabled={!isEditing}
                        className={fieldClass}
                        value={item.instruction ?? ""}
                        onChange={(e) =>
                            onChange({
                                ...item,
                                instruction: e.target.value,
                            })
                        }
                    />
                </div>
            </div>
        </article>
    );
}

