import { AlertTriangle } from "lucide-react";

type Props = {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    title,
    message,
    confirmText = "Đồng ý",
    cancelText = "Hủy",
    onConfirm,
    onCancel
}: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-105 overflow-hidden rounded-[28px] border border-white/70 bg-white/95 p-6 text-foreground shadow-[0_28px_80px_-38px_rgba(15,23,42,0.65)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/6 via-white/45 to-transparent" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90" />

                <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 shadow-sm">
                        <AlertTriangle size={24} strokeWidth={2.4} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold leading-7 text-foreground">
                            {title}
                        </h2>

                        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="relative mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        onClick={onCancel}
                        className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary active:scale-[0.98]"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded-2xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_-20px_rgba(239,68,68,0.9)] transition hover:bg-red-600 active:scale-[0.98]"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
