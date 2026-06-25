// import { DrugDTO } from "@/shared/type";
// import { Search } from "lucide-react";
// import { useEffect, useState } from "react";
// import { searchDrugs } from "../drugService";
// import FloatingInput from "@/shared/components/FloatingInput";

// type Props = {
//     disabled?: boolean;

//     selectedDrugId?: number | null;
//     selectedDrugName?: string;

//     onSelect: (drug: DrugDTO) => void;
// };

// export default function DrugAutocomplete({
//     disabled,
//     selectedDrugName,
//     onSelect,
// }: Props) {
//     const [keyword, setKeyword] = useState(selectedDrugName ?? "");
//     const [results, setResults] = useState<DrugDTO[]>([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         setKeyword(selectedDrugName ?? "");
//     }, [selectedDrugName]);

//     useEffect(() => {
//         const timer = setTimeout(async () => {
//             if (!keyword || keyword.trim().length < 2) {
//                 setResults([]);
//                 return;
//             }

//             try {
//                 setLoading(true);

//                 const data = await searchDrugs(keyword);

//                 setResults(data);
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         }, 300);

//         return () => clearTimeout(timer);
//     }, [keyword]);

//     return (
//         <div className="relative">
//             <FloatingInput
//                 label="Tìm thuốc"
//                 value={keyword}
//                 disabled={disabled}
//                 leftIcon={<Search className="h-4 w-4" />}
//                 className="rounded-2xl border-slate-200/80 bg-white/90 shadow-sm backdrop-blur transition focus:bg-white focus:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] disabled:bg-slate-50/80"
//                 onChange={(e) => setKeyword(e.target.value)}
//             />

//             {!disabled && results.length > 0 && (
//                 <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-white/70 bg-white/95 p-1.5 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl">
//                     {results.map((drug) => (
//                         <button
//                             key={drug.id}
//                             type="button"
//                             className="group w-full rounded-xl px-3.5 py-3 text-left transition hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
//                             onClick={() => {
//                                 onSelect(drug);

//                                 setKeyword(drug.name);

//                                 setResults([]);
//                             }}
//                         >
//                             <div className="text-sm font-semibold text-slate-800 transition group-hover:text-primary">
//                                 {drug.name}
//                             </div>

//                             {drug.category && (
//                                 <div className="mt-1 text-xs font-medium text-slate-500">
//                                     {drug.category}
//                                 </div>
//                             )}
//                         </button>
//                     ))}
//                 </div>
//             )}

//             {loading && (
//                 <div className="mt-2 inline-flex rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-500 shadow-sm backdrop-blur">
//                     Đang tìm thuốc...
//                 </div>
//             )}
//         </div>
//     );
// }

import { DrugDTO } from "@/shared/type";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { searchDrugs } from "../drugService";
import FloatingInput from "@/shared/components/FloatingInput";

type Props = {
    disabled?: boolean;
    selectedDrugId?: number | null;
    selectedDrugName?: string;
    onSelect: (drug: DrugDTO) => void;
};

export default function DrugAutocomplete({
    disabled,
    selectedDrugName,
    onSelect,
}: Props) {
    const [inputValue, setInputValue] = useState(selectedDrugName ?? "");
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<DrugDTO[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setInputValue(selectedDrugName ?? "");
    }, [selectedDrugName]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchQuery || searchQuery.trim().length < 2) {
                setResults([]);
                return;
            }
            try {
                setLoading(true);
                const data = await searchDrugs(searchQuery);
                setResults(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setSearchQuery(value);
    };

    const handleSelect = (drug: DrugDTO) => {
        onSelect(drug);
        setInputValue(drug.name);
        setSearchQuery("");
        setResults([]);
    };

    return (
        <div className="relative">
            <FloatingInput
                label="Tìm thuốc"
                value={inputValue}
                disabled={disabled}
                leftIcon={<Search className="h-4 w-4" />}
                className="rounded-2xl border-slate-200/80 bg-white/90 shadow-sm backdrop-blur transition focus:bg-white focus:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] disabled:bg-slate-50/80"
                onChange={handleInputChange}
            />

            {!disabled && results.length > 0 && (
                <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-white/70 bg-white/95 p-1.5 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                    {results.map((drug) => (
                        <button
                            key={drug.id}
                            type="button"
                            className="group w-full rounded-xl px-3.5 py-3 text-left transition hover:bg-primary/5 focus:bg-primary/5 focus:outline-none"
                            onClick={() => handleSelect(drug)}
                        >
                            <div className="text-sm font-semibold text-slate-800 transition group-hover:text-primary">
                                {drug.name}
                            </div>
                            {drug.category && (
                                <div className="mt-1 text-xs font-medium text-slate-500">
                                    {drug.category}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {loading && (
                <div className="mt-2 inline-flex rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-500 shadow-sm backdrop-blur">
                    Đang tìm thuốc...
                </div>
            )}
        </div>
    );
}