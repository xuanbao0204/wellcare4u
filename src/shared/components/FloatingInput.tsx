import React from "react";

type FloatingInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    required?: boolean;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
};

export default function FloatingInput({
    label,
    required,
    error,
    className,
    id,
    leftIcon,
    rightIcon,
    onRightIconClick,
    ...props
}: FloatingInputProps) {
    const inputId = id || React.useId();

    return (
        <div className="relative w-full">
            <input
                id={inputId}
                placeholder=" "
                aria-invalid={!!error}
                className={`
                    peer w-full rounded-lg border-2
                    border-gray-300
                    bg-background
                    h-14
                    ${leftIcon ? "pl-12" : "pl-4"}
                    ${rightIcon ? "pr-12" : "pr-4"}
                    text-foreground
                    transition-all
                    focus:outline-none
                    focus:border-primary
                    disabled:opacity-50
                    ${error ? "border-red-500 focus:border-red-500" : ""}
                    ${className ?? ""}
                    `}
                {...props}
            />

            {leftIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    {leftIcon}
                </div>
            )}

            <label
                htmlFor={inputId}
                className={`
                    absolute
                    ${leftIcon ? "left-12" : "left-4"}
                    top-1/2
                    -translate-y-1/2
                    bg-background px-1
                    text-gray-500
                    transition-all
                    pointer-events-none
                    
                    peer-focus:-top-2
                    peer-focus:translate-y-0
                    peer-focus:text-xs
                    peer-focus:text-primary

                    peer-not-placeholder-shown:-top-2
                    peer-not-placeholder-shown:translate-y-0
                    peer-not-placeholder-shown:text-xs
                    `}
            >
                {label}
                {required && <span className="text-red-600 ml-1">*</span>}
            </label>

            {rightIcon && (
                <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={onRightIconClick}
                >
                    {rightIcon}
                </div>
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}