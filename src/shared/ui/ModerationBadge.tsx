interface ModerationBadgeProps {
    severity: string;
}

export function ModerationBadge({
    severity,
}: ModerationBadgeProps) {

    const styles = {
        SAFE: "bg-green-100 text-green-800",
        MINOR: "bg-yellow-100 text-yellow-800",
        MODERATE: "bg-orange-100 text-orange-800",
        SEVERE: "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                styles[severity as keyof typeof styles] ??
                "bg-gray-100 text-gray-700"
            }`}
        >
            {severity}
        </span>
    );
}