import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Sparkles, ChevronLeft, Settings } from "lucide-react";
import { DuaCategoryCard } from "../components/DuaCategoryCard";
import { DuaCard } from "../components/DuaCard";
import { useDuaCategoriesQuery, useDuasByCategoryQuery } from "../queries/dua.queries";
import { fallbackDuaCategories, fallbackDuas, fallbackDuaOfDay } from "../data/duaData";

interface DuasProps {
    favoritesList: any[];
    onToggleFavorite: (refId: string, type: "QURAN" | "HADITH" | "DUA") => void;
}

export default function Duas({ favoritesList, onToggleFavorite }: DuasProps) {
    const [duaSubView, setDuaSubView] = useState<"categories" | "reader">("categories");
    const [selectedDuaCategoryId, setSelectedDuaCategoryId] = useState<string | null>(null);
    const [duaSearchQuery, setDuaSearchQuery] = useState("");
    const [duaRecitedCounts, setDuaRecitedCounts] = useState<Record<string, number>>(() => {
        try {
            const saved = localStorage.getItem("dua_recited_counts");
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    // Queries
    const { data: serverDuaCategories, isLoading: categoriesLoading } = useDuaCategoriesQuery(duaSubView === "categories");
    const { data: serverDuaList, isLoading: duaListLoading } = useDuasByCategoryQuery(selectedDuaCategoryId);

    // Persist recited counts
    const handleReciteIncrement = (id: string) => {
        setDuaRecitedCounts(prev => {
            const updated = { ...prev, [id]: (prev[id] || 0) + 1 };
            localStorage.setItem("dua_recited_counts", JSON.stringify(updated));
            return updated;
        });
    };

    const displayedDuaCategories = useMemo(() => {
        if (serverDuaCategories && Array.isArray(serverDuaCategories) && serverDuaCategories.length > 0) {
            return serverDuaCategories;
        }
        return fallbackDuaCategories;
    }, [serverDuaCategories]);

    const displayedDuas = useMemo(() => {
        const rawList = (() => {
            if (serverDuaList && Array.isArray(serverDuaList) && serverDuaList.length > 0) {
                return serverDuaList;
            }
            return fallbackDuas.filter(d => d.categoryId === selectedDuaCategoryId);
        })();

        if (!duaSearchQuery.trim()) return rawList;
        const q = duaSearchQuery.toLowerCase();
        return rawList.filter(d =>
            d.title.toLowerCase().includes(q) ||
            d.translation.toLowerCase().includes(q) ||
            (d.arabic && d.arabic.includes(duaSearchQuery))
        );
    }, [serverDuaList, selectedDuaCategoryId, duaSearchQuery]);

    // Handle search filtered duas globally if search active on home
    const searchedDuas = useMemo(() => {
        if (!duaSearchQuery.trim() || selectedDuaCategoryId) return [];
        const q = duaSearchQuery.toLowerCase();
        return fallbackDuas.filter(d =>
            d.title.toLowerCase().includes(q) ||
            d.translation.toLowerCase().includes(q) ||
            (d.arabic && d.arabic.includes(duaSearchQuery))
        );
    }, [duaSearchQuery, selectedDuaCategoryId]);

    return (
        <div className="space-y-5.5 animate-fadeIn font-sans text-left">
            {duaSubView === "categories" ? (
                /* Main Supplications Dashboard Layout (Image 1) */
                <div className="space-y-6">
                    <div className="space-y-1 select-none">
                        <h2 className="text-[32px] font-black text-slate-905 tracking-tight leading-none">
                            Supplications
                        </h2>
                        <p className="text-sm text-slate-500 font-semibold leading-normal">
                            Find peace in every moment with curated Duas from the Sunnah.
                        </p>
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={duaSearchQuery}
                            onChange={(e) => setDuaSearchQuery(e.target.value)}
                            placeholder="Search supplications, topics..."
                            className="w-full bg-white border border-slate-150 pl-11 pr-10 py-3.5 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A6C51] shadow-3xs transition"
                        />
                        {duaSearchQuery && (
                            <button
                                onClick={() => setDuaSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* IF SEARCH IS ACTIVE globally */}
                    {duaSearchQuery.trim() ? (
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest block">
                                Search Results ({searchedDuas.length})
                            </h4>
                            {searchedDuas.length > 0 ? (
                                <div className="space-y-3 animate-fadeIn">
                                    {searchedDuas.map((dua, index) => {
                                        const isFav = favoritesList && Array.isArray(favoritesList)
                                            ? favoritesList.some(f => f.refId === dua.id && f.type === "DUA")
                                            : false;
                                        const d = dua as any;
                                        return (
                                            <DuaCard
                                                key={dua.id}
                                                id={dua.id}
                                                number={index + 1}
                                                title={dua.title}
                                                reference={dua.reference || "Duas"}
                                                arabic={d.arabic || d.arabicText || ""}
                                                translation={d.translation || d.englishText || ""}
                                                transliteration={dua.transliteration}
                                                recitationLimit={d.recitationLimit || d.repeat || 1}
                                                isFavorite={isFav}
                                                onToggleFavorite={() => onToggleFavorite(dua.id, "DUA")}
                                                recitedCount={duaRecitedCounts[dua.id] || 0}
                                                onRecite={() => handleReciteIncrement(dua.id)}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-2 flex flex-col items-center">
                                    <h4 className="font-bold text-slate-700 text-sm">No Supplications Found</h4>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* NORMAL HOME VIEW */
                        <div className="space-y-5 animate-fadeIn">
                            {/* Dua of the Day Card */}
                            <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFF9ED] border border-amber-100 rounded-[28px] p-6 shadow-5xs relative overflow-hidden space-y-4">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/10 rounded-full blur-2xl" />
                                <div className="flex justify-between items-center z-10 select-none">
                                    <div className="flex items-center gap-1.5">
                                        <Sparkles size={16} className="text-[#B8860B]" />
                                        <span className="text-[10px] font-black tracking-widest text-[#B8860B] uppercase">
                                            Supplication of the Day
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-black text-amber-850 bg-amber-100/60 px-2 py-0.5 rounded-md uppercase">
                                        Prophetic Dua
                                    </span>
                                </div>

                                <div className="space-y-3.5 text-right z-10">
                                    <p className="font-serif text-[21px] text-slate-850 leading-relaxed font-semibold">
                                        {fallbackDuaOfDay.arabic}
                                    </p>
                                    <p className="text-[13px] text-slate-600 leading-relaxed font-sans font-medium italic text-left">
                                        "{fallbackDuaOfDay.translation}"
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-3 select-none text-[9px] font-bold text-slate-400 border-t border-amber-100/50">
                                    <span>{fallbackDuaOfDay.reference}</span>
                                    <button
                                        onClick={() => {
                                            setSelectedDuaCategoryId("dua_cat_morning");
                                            setDuaSubView("reader");
                                        }}
                                        className="text-[#0A6C51] font-extrabold hover:underline"
                                    >
                                        Morning Duas
                                    </button>
                                </div>
                            </div>

                            {/* Dua Categories Section */}
                            <div className="space-y-3">
                                <h3 className="text-xl font-black text-slate-850 tracking-tight select-none">
                                    Categories
                                </h3>

                                {categoriesLoading ? (
                                    <div className="py-8 text-center animate-pulse">
                                        <div className="h-20 bg-slate-100 rounded-3xl" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        {displayedDuaCategories.map((cat) => {
                                            const catDetails = fallbackDuaCategories.find(c => c.id === cat.id) || 
                                                               fallbackDuaCategories.find(c => c.name.toLowerCase() === (cat.name || cat.title || "").toLowerCase()) ||
                                                               {
                                                                   iconType: "prayer" as const,
                                                                   layout: "vertical" as const,
                                                                   count: 0,
                                                                   colorBg: "bg-white border-slate-100",
                                                                   iconBg: "bg-[#E2F5EC]",
                                                                   iconColor: "text-[#0A6C51]"
                                                               };
                                            return (
                                                <DuaCategoryCard
                                                    key={cat.id}
                                                    id={cat.id}
                                                    name={cat.name || cat.title || ""}
                                                    count={cat.count || cat.duas_count || catDetails.count || 0}
                                                    iconType={cat.iconType || catDetails.iconType}
                                                    layout={cat.layout || catDetails.layout}
                                                    colorBg={cat.colorBg || catDetails.colorBg}
                                                    iconBg={cat.iconBg || catDetails.iconBg}
                                                    iconColor={cat.iconColor || catDetails.iconColor}
                                                    onClick={() => {
                                                        setSelectedDuaCategoryId(cat.id);
                                                        setDuaSubView("reader");
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Category Reader Supplication View (Image 2) */
                <div className="space-y-4 animate-fadeIn">
                    {/* Header bar */}
                    <div className="sticky top-0 bg-[#F9FAF9] py-3.5 flex items-center justify-between border-b border-slate-100 z-35 -mx-5 px-5 select-none">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setSelectedDuaCategoryId(null);
                                    setDuaSubView("categories");
                                }}
                                className="text-[#0A6C51] p-1.5 hover:bg-slate-100 rounded-full transition cursor-pointer"
                                title="Back to categories list"
                            >
                                <ChevronLeft size={22} />
                            </button>
                            <div className="text-left">
                                <h2 className="text-[17px] font-black text-slate-800 tracking-tight leading-tight">
                                    {displayedDuaCategories.find(c => c.id === selectedDuaCategoryId)?.title || "Duas"}
                                </h2>
                                <p className="text-[11px] text-slate-400 mt-0.5 font-bold">
                                    Category • {displayedDuas.length} Duas
                                </p>
                            </div>
                        </div>
                        <button
                            className="text-slate-400 hover:text-[#0A6C51] p-1.5 rounded-full cursor-pointer"
                            onClick={() => alert("Font and layout are optimized.")}
                        >
                            <Settings size={20} />
                        </button>
                    </div>

                    {/* Search bar in reader */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={duaSearchQuery}
                            onChange={(e) => setDuaSearchQuery(e.target.value)}
                            placeholder="Filter within this category..."
                            className="w-full bg-white border border-slate-150 pl-11 pr-10 py-3.5 rounded-2xl text-xs font-semibold text-slate-855 placeholder-slate-450 focus:outline-none focus:border-[#0A6C51] shadow-3xs transition"
                        />
                        {duaSearchQuery && (
                            <button
                                onClick={() => setDuaSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Duas list loader */}
                    {duaListLoading ? (
                        <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-[#0A6C51] border-b-2" />
                            <p className="text-xs text-slate-400 font-semibold">Loading supplications...</p>
                        </div>
                    ) : displayedDuas.length > 0 ? (
                        <div className="space-y-4 pt-1 pb-16">
                            {displayedDuas.map((dua, index) => {
                                const isFav = favoritesList && Array.isArray(favoritesList)
                                    ? favoritesList.some(f => f.refId === dua.id && f.type === "DUA")
                                    : false;
                                return (
                                    <DuaCard
                                        key={dua.id}
                                        id={dua.id}
                                        number={index + 1}
                                        title={dua.title}
                                        reference={dua.reference || "Duas"}
                                        arabic={dua.arabic || dua.arabicText || ""}
                                        translation={dua.translation || dua.englishText || ""}
                                        transliteration={dua.transliteration}
                                        recitationLimit={dua.recitationLimit || dua.repeat || 1}
                                        isFavorite={isFav}
                                        onToggleFavorite={() => onToggleFavorite(dua.id, "DUA")}
                                        recitedCount={duaRecitedCounts[dua.id] || 0}
                                        onRecite={() => handleReciteIncrement(dua.id)}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center">
                            <p className="text-sm font-semibold text-slate-800">No duas found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
