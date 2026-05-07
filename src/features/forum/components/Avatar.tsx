import { getInitials } from "@/shared/type";

interface AvatarProps {
    name: string;
    avatar?: string;
    size?: "sm" | "md" | "lg";
    isDoctor?: boolean;
    isVerified?: boolean;
}

const SIZE_MAP = {
    sm: { outer: "h-9 w-9", text: "text-xs", badge: "h-4 w-4 text-[9px]" },
    md: { outer: "h-11 w-11", text: "text-sm", badge: "h-[18px] w-[18px] text-[9px]" },
    lg: { outer: "h-14 w-14", text: "text-base", badge: "h-5 w-5 text-[10px]" },
};

export function Avatar({ name, avatar, size = "md", isDoctor, isVerified }: AvatarProps) {
    const currentSize = SIZE_MAP[size];

    return (
        <div className="relative inline-flex shrink-0 rounded-full bg-white/70 p-0.5 shadow-sm">
            {avatar ? (
                <img
                    src={avatar}
                    alt={name}
                    className={`${currentSize.outer} rounded-full border border-white/70 object-cover shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]`}
                />
            ) : (
                <div
                    className={`${currentSize.outer} ${currentSize.text} flex items-center justify-center rounded-full border border-white/80 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${
                        isDoctor
                            ? "bg-gradient-to-br from-teal-50 via-teal-100 to-cyan-100 text-teal-800"
                            : "bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 text-sky-800"
                    }`}
                >
                    {getInitials(name)}
                </div>
            )}

            {isVerified && (
                <span
                    title="Bác sĩ đã xác thực"
                    className={`absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center rounded-full border border-white bg-emerald-500 font-bold text-white shadow-sm ${currentSize.badge}`}
                >
                    ✓
                </span>
            )}
        </div>
    );
}
