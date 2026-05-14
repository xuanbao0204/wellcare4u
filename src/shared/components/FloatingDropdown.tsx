"use client";

import {
    useEffect,
    useRef,
    useState,
    ReactNode,
    useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";

type Props = {
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
};

export default function FloatingDropdown({
    trigger,
    children,
    className,
}: Props) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });

    const triggerRef = useRef<HTMLDivElement>(null);

    const toggle = () => setOpen((prev) => !prev);
    const close = () => setOpen(false);

    useLayoutEffect(() => {
        if (open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();

            setPosition({
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
            });
        }
    }, [open]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!triggerRef.current?.contains(e.target as Node)) {
                close();
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    return (
        <>
            <div ref={triggerRef} onClick={toggle} className="w-full">
                {trigger}
            </div>

            {open &&
                createPortal(
                    <div
                        className="fixed z-9999"
                        style={{
                            top: position.top,
                            left: position.left,
                            width: position.width,
                        }}
                    >
                        <div
                            className={`rounded-2xl border border-white/30 bg-white/90 backdrop-blur-xl shadow-2xl p-2 animate-fadeIn ${className}`}
                        >
                            {children}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}