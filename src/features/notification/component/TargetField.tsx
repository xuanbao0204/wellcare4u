// import { NotificationRequest } from "../notificationService";

// interface Props {
//     form: NotificationRequest;
//     setForm: React.Dispatch<
//         React.SetStateAction<NotificationRequest>
//     >;
// }

// export default function TargetFields({
//     form,
//     setForm
// }: Props) {

//     if (form.target !== "ROLE") {
//         return null;
//     }

//     return (
//         <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4">
//             <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
//                 Role
//             </label>

//             <select
//                 value={form.role || ""}
//                 className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
//                 onChange={(e) =>
//                     setForm((prev) => ({
//                         ...prev,
//                         role: e.target.value
//                     }))
//                 }
//             >
//                 <option value="">
//                     Select a role
//                 </option>

//                 <option value="PATIENT">
//                     PATIENT
//                 </option>

//                 <option value="DOCTOR">
//                     DOCTOR
//                 </option>
//             </select>

//             <p className="mt-2 text-xs leading-5 text-foreground/45">
//                 This field only appears when the target is role-based.
//             </p>
//         </div>
//     );
// }

import { Search, UserCheck, X } from "lucide-react";
import { useState } from "react";
import { NotificationRequest } from "../notificationService";

interface Props {
    form: NotificationRequest;
    setForm: React.Dispatch<React.SetStateAction<NotificationRequest>>;
    /** Map<userId, fullName> — truyền vào khi target IDS khả dụng */
    receivers?: Record<number, string>;
    patientsLoading?: boolean;
}

export default function TargetFields({ form, setForm, receivers = {}, patientsLoading = false }: Props) {

    const [search, setSearch] = useState("");

    if (form.target === "ROLE") {
        return (
            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                    Role
                </label>
                <select
                    value={form.role || ""}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                >
                    <option value="">Select a role</option>
                    <option value="PATIENT">PATIENT</option>
                    <option value="DOCTOR">DOCTOR</option>
                </select>
                <p className="mt-2 text-xs leading-5 text-foreground/45">
                    This field only appears when the target is role-based.
                </p>
            </div>
        );
    }

    if (form.target === "IDS") {
        const selected: number[] = form.receiverIds ?? [];

        const entries = Object.entries(receivers).map(([id, name]) => ({
            id: Number(id),
            name,
        }));

        const filtered = search.trim()
            ? entries.filter((e) => e.name.toLowerCase().includes(search.trim().toLowerCase()))
            : entries;

        const toggle = (id: number) => {
            const next = selected.includes(id)
                ? selected.filter((s) => s !== id)
                : [...selected, id];
            setForm((prev) => ({ ...prev, receiverIds: next }));
        };

        const removeSelected = (id: number) => {
            setForm((prev) => ({
                ...prev,
                receiverIds: selected.filter((s) => s !== id),
            }));
        };

        return (
            <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                    Chọn người nhận ({selected.length} đã chọn)
                </label>

                {/* Selected tags */}
                {selected.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selected.map((id) => (
                            <span
                                key={id}
                                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary"
                            >
                                <UserCheck size={11} />
                                {receivers[id] ?? `#${id}`}
                                <button
                                    onClick={() => removeSelected(id)}
                                    className="ml-0.5 rounded-full hover:text-rose-500 transition-colors"
                                >
                                    <X size={11} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Search */}
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm bệnh nhân..."
                        className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-8 pr-4 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                </div>

                {/* List */}
                <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                    {patientsLoading ? (
                        <div className="space-y-2 py-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-10 animate-pulse rounded-2xl bg-slate-200/70" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <p className="py-4 text-center text-sm text-foreground/40">
                            {search ? "Không tìm thấy bệnh nhân" : "Chưa có bệnh nhân nào"}
                        </p>
                    ) : (
                        filtered.map(({ id, name }) => {
                            const isChecked = selected.includes(id);
                            return (
                                <button
                                    key={id}
                                    onClick={() => toggle(id)}
                                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition hover:-translate-y-0.5 ${
                                        isChecked
                                            ? "border-primary/20 bg-primary/6 text-primary font-semibold"
                                            : "border-transparent bg-white text-foreground hover:border-slate-200 hover:shadow-sm"
                                    }`}
                                >
                                    {/* Custom checkbox */}
                                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border-2 transition ${
                                        isChecked ? "border-primary bg-primary" : "border-slate-300"
                                    }`}>
                                        {isChecked && (
                                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                                <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </span>
                                    <UserCheck size={13} className={isChecked ? "text-primary" : "text-slate-400"} />
                                    <span className="truncate">{name}</span>
                                    <span className="ml-auto text-xs text-foreground/30">#{id}</span>
                                </button>
                            );
                        })
                    )}
                </div>

                <p className="text-xs leading-5 text-foreground/45">
                    Chọn một hoặc nhiều người nhận từ danh sách.
                </p>
            </div>
        );
    }

    return null;
}