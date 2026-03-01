type Variant = "primary" | "secondary";

interface ActionButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
    primary:
        "bg-gradient-to-r from-primary to-secondary text-white",
    secondary:
        "bg-gray-200 text-gray-900",
};

export default function ActionButton({
    children,
    variant = "primary",
    className,
    ...props
}: ActionButtonProps) {
    return (
        <button
            {...props}
            className={`w-full py-3 font-bold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className ?? ""}`}
        >
            {children}
        </button>
    );
}