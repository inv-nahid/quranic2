import React from "react";

interface SurahListItemProps {
    id: number;
    name: string;
    englishName: string;
    englishNameTranslation?: string;
    versesCount?: number;
    progress?: number; // 0 to 100
    onClick?: () => void;
    idAttribute?: string;
}

export const SurahListItem: React.FC<SurahListItemProps> = ({
    id,
    name,
    englishName,
    englishNameTranslation = "Chapter",
    versesCount = 7,
    progress = 0,
    onClick,
    idAttribute,
}) => {
    return (
        <div
            id={idAttribute || `surah-item-${id}`}
            onClick={onClick}
            className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 hover:border-emerald-200 hover:shadow-sm transition cursor-pointer active:scale-[0.99] group select-none"
        >
            <div className="flex items-center gap-4 flex-1">
                {/* Surah Number Icon block exactly like design */}
                <div className="w-12 h-12 rounded-2xl bg-[#F0F2F1] text-slate-600 font-extrabold text-[15px] flex items-center justify-center transition-colors group-hover:bg-[#E0F5EC] group-hover:text-[#0A6C51]">
                    {id}
                </div>

                {/* Surah Information */}
                <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-bold text-slate-800 text-[15px] tracking-tight truncate leading-tight group-hover:text-emerald-950">
                        {englishName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium truncate">
                        {englishNameTranslation} • {versesCount} Verses
                    </p>

                    {/* Reading Progress Indicator exactly matching design */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${progress >= 100 ? "bg-[#0A6C51]" : "bg-emerald-600"
                                }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Arabic text on the right side */}
            <div className="text-right pl-3">
                <span className="font-serif text-2xl font-semibold text-emerald-950 tracking-wide select-none">
                    {name}
                </span>
            </div>
        </div>
    );
};
