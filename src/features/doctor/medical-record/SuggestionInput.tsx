import FloatingInput from "@/shared/components/FloatingInput";
import { useMemo, useState } from "react";

type Props = {
    value?: string;

    suggestions: string[];

    disabled?: boolean;

    label: string;

    onChange: (value: string) => void;
};

export default function SuggestionInput({
    value = "",
    suggestions,
    disabled,
    label,
    onChange,
}: Props) {

    const [focused, setFocused] =
        useState(false);

    const filtered = useMemo(() => {

        if (!value.trim()) {
            return suggestions;
        }

        return suggestions.filter((item) =>
            item
                .toLowerCase()
                .includes(
                    value.toLowerCase()
                )
        );

    }, [value, suggestions]);

    return (
        <div className="relative">

            <FloatingInput
                label={label}
                value={value}
                disabled={disabled}
                onFocus={() =>
                    setFocused(true)
                }
                onBlur={() =>
                    setTimeout(
                        () => setFocused(false),
                        150
                    )
                }
                onChange={(e) =>
                    onChange(e.target.value)
                }
            />

            {focused &&
                filtered.length > 0 && (
                    <div
                        className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-white/70 bg-white/95 p-1.5 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl"
                    >
                        {filtered.map((item) => (
                            <button
                                key={item}
                                type="button"
                                className="group w-full rounded-xl px-3.5 py-3 text-left transition hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
                                onClick={() => {
                                    onChange(item);
                                    setFocused(false);
                                }}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}

        </div>
    );
}