import React from "react";
import { BookOpen, ArrowRight, Star, AlertCircle } from "lucide-react";

interface BookCardProps {
    key?: React.Key;
    id: string;
    name: string;
    arabicName: string;
    tag?: string;
    count: string | number;
    description?: string;
    color?: string; // e.g. bg-[#004D40] for Bukhari
    variant?: "grid" | "list";
    onClick: () => void;
    loading?: boolean;
    error?: boolean;
}

export function BookCard({
    id,
    name,
    arabicName,
    tag,
    count,
    description,
    color,
    variant = "list",
    onClick,
    loading = false,
    error = false,
}: BookCardProps) {
    if (loading) {
        return (
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center justify-between animate-pulse h-28 w-full">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                    <div className="space-y-2.5 flex-1">
                        <div className="h-4 bg-slate-100 rounded w-1/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-5 flex flex-col justify-center items-center text-center space-y-2 w-full">
                <AlertCircle className="text-rose-500" size={24} />
                <h4 className="text-xs font-bold text-rose-800">Could not retrieve book</h4>
                <p className="text-[10px] text-rose-600">Please try refreshing again later.</p>
            </div>
        );
    }

    if (variant === "grid") {
        // Elegant tall display style matching Screen 1 "Collections" layout
        const isDark = color && color.includes("bg-[");
        const containerBg = color || "bg-[#004D40]";

        return (
            <div
                id={`hadith-book-grid-${id}`}
                onClick={onClick}
                className="cursor-pointer group flex flex-col space-y-3.5 transition-transform duration-200 active:scale-95 w-full"
            >
                <div className={`${containerBg} ${isDark ? "text-white" : "text-slate-800"} h-44 rounded-[24px] p-5.5 relative overflow-hidden shadow-sm flex flex-col justify-between group-hover:shadow-md transition-shadow`}>
                    {/* Subtle geometric pattern overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/10 mix-blend-overlay pointer-events-none" />

                    <div className="flex items-center justify-between z-10">
                        <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl">
                            <BookOpen size={20} className={isDark ? "text-white" : "text-slate-705"} />
                        </div>
                        {tag && (
                            <span className="text-[8px] font-black tracking-widest uppercase bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-xs">
                                {tag}
                            </span>
                        )}
                    </div>

                    <div className="z-10 mt-4">
                        <span className="text-[9px] font-black tracking-widest uppercase text-white/60 block leading-none">
                            SAHIH
                        </span>
                        <h3 className="text-[16px] font-extrabold font-sans mt-1 uppercase tracking-tight leading-tight line-clamp-2">
                            {name.replace("Sahih al-", "").replace("Sahih ", "").replace("Sunan ", "")}
                        </h3>
                    </div>

                    {/* Large faint logo in background */}
                    <div className="absolute right-[-10px] bottom-[-15px] opacity-10 pointer-events-none transform rotate-12 transition-transform duration-300 group-hover:scale-110">
                        <BookOpen size={100} />
                    </div>
                </div>

                {/* Labels below matching Screen 1 exactly! */}
                <div className="px-1">
                    <h4 className="text-xs font-bold font-sans text-slate-800 line-clamp-1 leading-tight">
                        {name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        {count} Hadiths
                    </p>
                </div>
            </div>
        );
    }

    // List View matching Screen 2 "Hadith Collections"
    return (
        <div
            id={`hadith-book-list-${id}`}
            onClick={onClick}
            className="bg-white border border-slate-100 rounded-3xl p-5.5 shadow-xs flex items-center justify-between hover:border-emerald-100 cursor-pointer transition-all duration-300 active:scale-98 group hover:shadow-sm"
        >
            <div className="flex items-start gap-4 flex-1">
                {/* Book graphic with visual identity */}
                <div className="w-13 h-13 rounded-2xl bg-[#E2F5EC] flex flex-col items-center justify-center text-[#0A6C51] relative overflow-hidden select-none shrink-0 border border-emerald-50">
                    <BookOpen size={21} />
                </div>

                <div className="space-y-1 my-auto">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {tag && (
                            <span className="bg-[#E2F5EC] text-[#0A6C51] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">
                                {tag}
                            </span>
                        )}
                        <span className="text-[11px] font-bold text-slate-400 font-serif">
                            {arabicName}
                        </span>
                    </div>

                    <h3 className="text-[16px] font-black text-slate-800 tracking-tight leading-tight group-hover:text-[#0A6C51] transition-colors">
                        {name}
                    </h3>

                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        {count} Total Hadiths
                    </p>
                </div>
            </div>

            {/* Circle Icon Button */}
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0A6C51] group-hover:text-white transition duration-200">
                <ArrowRight size={18} />
            </div>
        </div>
    );
}
