import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import FloatingInput from "@/shared/components/FloatingInput";
import { MEDICAL_TESTS, MedicalTestType } from "./medicalTest";

type Props = {
    value: string;

    onSelect: (test: MedicalTestType) => void;
};

export default function MedicalTestAutocomplete({
    value,
    onSelect,
}: Props) {
    const [keyword, setKeyword] = useState(value);

    useEffect(() => {
        setKeyword(value);
    }, [value]);

    const results = useMemo(() => {
        if (!keyword.trim()) return [];

        const lower = keyword.toLowerCase();

        return MEDICAL_TESTS.filter(
            (item) =>
                item.name.toLowerCase().includes(lower) ||
                item.code.toLowerCase().includes(lower)
        );
    }, [keyword]);

    const grouped = useMemo(() => {
        return results.reduce(
            (acc, item) => {
                if (!acc[item.categoryLabel]) {
                    acc[item.categoryLabel] = [];
                }

                acc[item.categoryLabel].push(item);

                return acc;
            },
            {} as Record<string, MedicalTestType[]>
        );
    }, [results]);

    return (
        <div className="relative">
            <FloatingInput
                label="Tên xét nghiệm"
                value={keyword}
                leftIcon={<Search className="h-4 w-4" />}
                onChange={(e) => setKeyword(e.target.value)}
            />

            {results.length > 0 && (
                <div className="absolute z-50 mt-2 max-h-96 w-full overflow-auto rounded-2xl border bg-white shadow-xl">
                    {Object.entries(grouped).map(([category, tests]) => (
                        <div key={category}>
                            <div className="sticky top-0 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase text-slate-500">
                                {category}
                            </div>

                            {tests.map((test) => (
                                <button
                                    key={test.code}
                                    type="button"
                                    className="w-full border-b px-4 py-3 text-left hover:bg-slate-50"
                                    onClick={() => {
                                        setKeyword(test.name);

                                        onSelect(test);
                                    }}
                                >
                                    <div className="font-medium">
                                        {test.name}
                                    </div>

                                    <div className="text-xs text-slate-500">
                                        {test.code}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}