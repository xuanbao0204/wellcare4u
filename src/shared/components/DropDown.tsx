"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type DropdownProps = {
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
};

const Dropdown = ({ trigger, children, className }: DropdownProps) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggle = () => setOpen((prev) => !prev);
    const close = () => setOpen(false);

    // click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                close();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    return (
        <div ref={containerRef} className="relative inline-block text-left">
            <div
                onClick={toggle}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggle();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={open}
                aria-haspopup="menu"
                className="cursor-pointer focus:outline-none"
            >
                {trigger}
            </div>

            {open && (
                <div
                    role="menu"
                    className={`absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg animate-fadeIn ${className}`}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
