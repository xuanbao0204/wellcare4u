import { AlertTriangle, Bell, CheckCircle2, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning" | "notification";

interface Props {
    type: ToastType;
    title?: string;
    message: string;
}

const typeStyles: Record<
    ToastType,
    {
        icon: React.ReactNode;
        accent: string;
        iconBox: string;
        title: string;
    }
> = {
    success: {
        icon: <CheckCircle2 size={22} strokeWidth={2.4} />,
        accent: "bg-emerald-500",
        iconBox: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        title: "text-emerald-700",
    },
    error: {
        icon: <XCircle size={22} strokeWidth={2.4} />,
        accent: "bg-rose-500",
        iconBox: "bg-rose-50 text-rose-600 ring-rose-100",
        title: "text-rose-700",
    },
    info: {
        icon: <Info size={22} strokeWidth={2.4} />,
        accent: "bg-primary",
        iconBox: "bg-primary/8 text-primary ring-primary/10",
        title: "text-primary",
    },
    warning: {
        icon: <AlertTriangle size={22} strokeWidth={2.4} />,
        accent: "bg-amber-500",
        iconBox: "bg-amber-50 text-amber-600 ring-amber-100",
        title: "text-amber-700",
    },

    notification: {
        icon: <Bell size={22} strokeWidth={2.4} />,
        accent: "bg-secondary",
        iconBox: "bg-secondary/8 text-secondary ring-secondary/10",
        title: "text-primary",
    },
};

export default function CustomToast({ type, title, message }: Props) {
    const styles = typeStyles[type];

    return (
        <div
            className={`
                relative flex min-h-20 w-[min(420px,calc(100vw-2rem))] overflow-hidden
                rounded-[24px] border border-slate-200/80 bg-white/95
                px-4 py-4 text-foreground shadow-[0_24px_60px_-32px_rgba(15,23,42,0.55)]
                backdrop-blur-xl transition-all duration-500 ease-out animate-toastIn
                dark:border-white/10 dark:bg-slate-950/95 dark:text-white
            `}
        >
            <div className={`absolute inset-y-0 left-0 w-1.5 ${styles.accent}`} />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-white/40 to-transparent dark:from-white/8 dark:via-transparent" />

            <div
                className={`
                    relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center
                    rounded-2xl ring-1 ${styles.iconBox}
                `}
            >
                {styles.icon}
            </div>

            <div className="relative min-w-0 flex-1 pl-3 pr-1">
                <div className="mb-1 flex items-start justify-between gap-3">
                    <h3 className={`truncate text-sm font-bold leading-5 ${styles.title}`}>
                        {title ?? type.charAt(0).toUpperCase() + type.slice(1)}
                    </h3>
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 dark:bg-white/30" />
                </div>
                <p className="line-clamp-2 text-sm font-medium leading-5 text-slate-600 dark:text-white/75">
                    {message}
                </p>
            </div>
        </div>
    );
}
