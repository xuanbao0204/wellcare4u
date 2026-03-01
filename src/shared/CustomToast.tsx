import { CheckCircle2, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Props {
    type: ToastType;
    message: string;
}

const typeStyles: Record<
    ToastType,
    {
        icon: React.ReactNode;
        border: string;
        glow: string;
    }
> = {
    success: {
        icon: <CheckCircle2 className="text-emerald-400" size={22} />,
        border: "border-emerald-400/40",
        glow: "shadow-[0_0_25px_rgba(16,185,129,0.35)]",
    },
    error: {
        icon: <XCircle className="text-rose-400" size={22} />,
        border: "border-rose-400/40",
        glow: "shadow-[0_0_25px_rgba(244,63,94,0.35)]",
    },
    info: {
        icon: <Info className="text-primary" size={22} />,
        border: "border-primary/40",
        glow: "shadow-[0_0_25px_rgba(59,130,246,0.35)]",
    },
    warning: {
        icon: <Info className="text-yellow-400" size={22} />,
        border: "border-yellow-400/40",
        glow: "shadow-[0_0_25px_rgba(245,158,11,0.35)]",
    },
};

export default function CustomToast({ type, message }: Props) {
    const styles = typeStyles[type];

    return (
        <div
            className={`
        group
        relative
        flex items-center gap-4
        min-w-85
        min-h-16
        rounded-3xl
        border
        ${styles.border}
        ${styles.glow}
        bg-white/10
        backdrop-blur-xs
        px-6 py-4
        text-foreground
        transition-all duration-500 ease-out
        animate-toastIn
      `}
        >
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="flex items-center justify-center">
                {styles.icon}
            </div>

            <p className="text-sm font-semibold tracking-wide">
                {message}
            </p>
        </div>
    );
}