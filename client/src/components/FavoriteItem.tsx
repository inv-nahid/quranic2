import React from "react";
import { Heart, ChevronRight } from "lucide-react";

export interface FavoriteItemProps {
    type: "QURAN" | "HADITH" | "DUA";
    id: string | number;
    title: string;          // Surah Al-Baqarah • 255 for Quran, Sahih al-Bukhari • 42 for Hadith, Morning Supplications for Dua
    subtitle?: string;       // narrator for Hadith, reference or category for Dua
    arabic?: string;        // arabic text (usually for Quran and Duas)
    translation: string;    // english text
    onRemove: () => void;
    onViewContext?: () => void;
}

export const FavoriteItem: React.FC<FavoriteItemProps> = ({
    type,
    id,
    title,
    subtitle,
    arabic,
    translation,
    onRemove,
    onViewContext,
}) => {
    return (
        <div className={`bg-white rounded-3xl p-5.5 space-y-3.5 shadow-5xs hover:shadow-2xs transition border border-slate-100 flex flex-col justify-between ${type === "QURAN" ? "border-l-[4px] border-l-[#E2B832]" : type === "HADITH" ? "border-l-[4px] border-l-[#0A6C51]" : "border-l-[4px] border-l-[#32A0E2]"
            }`}>
            {/* Detail header line */}
            <div className="flex justify-between items-center select-none">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${type === "QURAN" ? "bg-amber-50 text-[#9E7A1E]" : type === "HADITH" ? "bg-emerald-50 text-[#095E47]" : "bg-sky-50 text-[#1E769D]"
                    }`}>
                    {title}
                </span>
                <button
                    onClick={onRemove}
                    className="text-red-500 hover:scale-110 active:scale-90 transition duration-150 p-1"
                    title="Remove from favorites"
                >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>
            </div>

            {/* Narrative Subtitle if present */}
            {subtitle && (
                <span className="text-[10px] font-extrabold text-slate-400 block -mt-1 uppercase tracking-wider select-none">
                    {subtitle}
                </span>
            )}

            {/* Styled Arabic text if provided */}
            {arabic && (
                <p className="font-serif text-lg text-slate-800 text-right leading-loose word-spacing-wide font-medium select-all">
                    {arabic}
                </p>
            )}

            {/* Styled English Translation text */}
            <p className="text-xs text-slate-650 leading-relaxed font-sans italic">
                "{translation}"
            </p>

            {/* View Context actions if provided */}
            {onViewContext && (
                <div className="flex justify-end pt-1">
                    <button
                        onClick={onViewContext}
                        className="text-[#0A6C51] hover:text-[#075640] font-black text-2xs uppercase tracking-widest flex items-center gap-1 select-none focus:outline-none"
                    >
                        <span>View Context</span>
                        <ChevronRight size={10} strokeWidth={2.5} />
                    </button>
                </div>
            )}
        </div>
    );
};
