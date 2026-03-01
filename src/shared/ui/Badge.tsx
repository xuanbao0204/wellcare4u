"use client";

type Size = "sm" | "md" | "lg";
type Variant = "solid" | "soft" | "outline";

type BadgeProps = {
    value: string;
    variant?: Variant;
    size?: Size;
    className?: string;
};

const sizeClasses: Record<Size, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
};

export default function Badge({
    value,
    variant = "soft",
    size = "md",
    className = "",
}: BadgeProps) {
    const meta = BADGE_REGISTRY[value];

    if (!meta) {
        return (
            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                {value}
            </span>
        );
    }

    return (
        <span
            className={`
                inline-flex items-center
                rounded-full
                font-medium
                ${sizeClasses[size]}
                ${meta.variants[variant]}
                ${className}
            `}
        >
            {meta.label}
        </span>
    );
}

export type BadgeVariantClasses = {
    solid: string;
    soft: string;
    outline: string;
};

export type BadgeMeta = {
    label: string;
    variants: BadgeVariantClasses;
};

export const BADGE_REGISTRY: Record<string, BadgeMeta> = {
    ADMIN: {
        label: "Quản trị viên",
        variants: {
            solid: "bg-red-600 text-white",
            soft: "bg-red-100 text-red-600",
            outline: "border border-red-500 text-red-600",
        },
    },
    DOCTOR: {
        label: "Bác sĩ",
        variants: {
            solid: "bg-blue-600 text-white",
            soft: "bg-blue-100 text-blue-600",
            outline: "border border-blue-500 text-blue-600",
        },
    },
    PATIENT: {
        label: "Bệnh nhân",
        variants: {
            solid: "bg-green-600 text-white",
            soft: "bg-green-100 text-green-600",
            outline: "border border-green-500 text-green-600",
        },
    },
    PENDING: {
        label: "Chờ xác nhận",
        variants: {
            solid: "bg-yellow-500 text-white",
            soft: "bg-yellow-100 text-yellow-700",
            outline: "border border-yellow-500 text-yellow-700",
        },
    },
    CONFIRMED: {
        label: "Đã xác nhận",
        variants: {
            solid: "bg-green-600 text-white",
            soft: "bg-green-100 text-green-600",
            outline: "border border-green-600 text-green-600",
        },
    },
    CANCELLED: {
        label: "Đã hủy",
        variants: {
            solid: "bg-gray-600 text-white",
            soft: "bg-gray-100 text-gray-600",
            outline: "border border-gray-600 text-gray-600",
        },
    },
};