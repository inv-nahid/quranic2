import React, { useState, useEffect, useMemo } from "react";
import { Search as SearchIcon, X, Sparkles, BookOpen, Clock, ArrowRight } from "lucide-react";
import { useUnifiedSearchQuery } from "../queries/search.queries";

interface SearchProps {
    onSelectSurah: (id: number) => void;
    setActiveTab: (tab: string) => void;
}

export default function Search({ onSelectSurah, setActiveTab }: SearchProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"All" | "Quran" | "Hadith" | "Duas">("All");
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem("recent_global_searches");
            return saved ? JSON.parse(saved) : ["Patience in hardship", "Surah Al-Mulk", "Morning Duas"];
        } catch {
            return ["Patience in hardship", "Surah Al-Mulk", "Morning Duas"];
        }
    });

    const { data: searchResults, isLoading, error } = useUnifiedSearchQuery(searchQuery);

    const handleSearchSubmit = (text: string) => {
        if (!text.trim()) return;
        setSearchQuery(text.trim());
        setRecentSearches(prev => {
            const list = [text.trim(), ...prev.filter(t => t !== text.trim())].slice(0, 5);
            localStorage.setItem("recent_global_searches", JSON.stringify(list));
            return list;
        });
    };

    const handleClearRecents = () => {
        setRecentSearches([]);
        localStorage.removeItem("recent_global_searches");
    };

    // Filter results locally based on filter tabs
    const filteredResults = useMemo(() => {
        if (!searchResults) return null;
        
        let quranList = searchResults.quran || [];
        let hadithList = searchResults.hadiths || searchResults.hadith || [];
        let duaList = searchResults.duas || searchResults.dua || [];

        if (activeFilter === "Quran") {
            return { quran: quranList, hadith: [], dua: [] };
        }
        if (activeFilter === "Hadith") {
            return { quran: [], hadith: hadithList, dua: [] };
        }
        if (activeFilter === "Duas") {
            return { quran: [], hadith: [], dua: duaList };
        }

        return {
            quran: quranList,
            hadith: hadithList,
            dua: duaList
        };
    }, [searchResults, activeFilter]);

    const hasResults = useMemo(() => {
        if (!filteredResults) return false;
        return (
            filteredResults.quran.length > 0 ||
            filteredResults.hadith.length > 0 ||
            filteredResults.dua.length > 0
        );
    }, [filteredResults]);

    return (
        <div className="space-y-5 animate-fadeIn text-left">
            <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 select-none">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Global Search</h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Query references across Quran, Hadith, and Duas
                </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(searchQuery)}
                    placeholder="Search terms (e.g. mercy, patience, prayer)..."
                    className="w-full bg-white border border-slate-150 pl-11 pr-10 py-3.5 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A6C51] shadow-3xs transition"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* If search query is empty, show recent searches */}
            {!searchQuery.trim() ? (
                <div className="space-y-5.5 animate-fadeIn select-none">
                    {recentSearches.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-0.5">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                    Recent Searches
                                </h4>
                                <button
                                    onClick={handleClearRecents}
                                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="space-y-1.5">
                                {recentSearches.map((text, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSearchSubmit(text)}
                                        className="w-full flex items-center justify-between bg-white border border-slate-50 rounded-2xl p-3.5 hover:border-slate-200 transition text-xs font-semibold text-slate-600 text-left cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Clock size={14} className="text-slate-400" />
                                            <span>{text}</span>
                                        </div>
                                        <ArrowRight size={12} className="text-slate-400" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Suggestions */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                            Popular Suggestions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {["Forgiveness", "Streaks", "Gratitude", "Charity", "Ayaat of Mercy"].map((suggest) => (
                                <button
                                    key={suggest}
                                    onClick={() => handleSearchSubmit(suggest)}
                                    className="bg-white border border-slate-100 hover:border-emerald-250 text-slate-700 text-[11px] font-extrabold px-3.5 py-2.5 rounded-full shadow-5xs transition cursor-pointer"
                                >
                                    {suggest}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Search Results View */
                <div className="space-y-4 animate-fadeIn">
                    {/* Category Tabs */}
                    <div className="bg-slate-100/90 p-1 rounded-2xl flex w-full space-x-1 select-none font-sans font-bold text-xs shadow-7xs">
                        {(["All", "Quran", "Hadith", "Duas"] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`flex-1 py-2 rounded-xl text-center font-bold tracking-wide transition cursor-pointer ${
                                    activeFilter === filter ? "bg-white text-[#0A6C51] shadow-md font-extrabold" : "text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Results Loading/Indicator */}
                    {isLoading ? (
                        <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-[#0A6C51] border-b-2" />
                            <p className="text-xs text-slate-400 font-semibold">Searching the databases...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4.5 text-center text-xs text-rose-700 font-medium leading-normal">
                            Failed to complete search. Please verify backend server status.
                        </div>
                    ) : hasResults ? (
                        <div className="space-y-5 pb-20">
                            {/* Quran Results */}
                            {filteredResults && filteredResults.quran.length > 0 && (
                                <div className="space-y-3 text-left">
                                    <span className="text-[10px] font-black tracking-widest text-[#0A6C51] uppercase pl-1">Quranic Verses ({filteredResults.quran.length})</span>
                                    {filteredResults.quran.map((item: any, idx: number) => (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                if (item.surahId) onSelectSurah(item.surahId);
                                                setActiveTab("Quran");
                                            }}
                                            className="bg-white border border-slate-100 hover:border-emerald-100 rounded-2xl p-4 shadow-5xs cursor-pointer transition space-y-2"
                                        >
                                            <div className="flex justify-between items-center text-[9px] font-bold text-[#0A6C51] uppercase">
                                                <span>Surah {item.surahName || item.surah?.englishName}</span>
                                                <span>Verse {item.number}</span>
                                            </div>
                                            <p className="font-serif text-lg text-slate-800 text-right leading-relaxed">{item.text}</p>
                                            <p className="text-xs text-slate-500 italic">"{item.translation || item.english}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Hadith Results */}
                            {filteredResults && filteredResults.hadith.length > 0 && (
                                <div className="space-y-3 text-left">
                                    <span className="text-[10px] font-black tracking-widest text-[#B8860B] uppercase pl-1">Prophetic Hadiths ({filteredResults.hadith.length})</span>
                                    {filteredResults.hadith.map((item: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-5xs space-y-2"
                                        >
                                            <div className="flex justify-between items-center text-[9px] font-bold text-[#B8860B] uppercase">
                                                <span>{item.bookRef || item.reference}</span>
                                                <span>{item.narrator || "Narrator"}</span>
                                            </div>
                                            {item.arabic && <p className="font-serif text-lg text-slate-800 text-right leading-relaxed">{item.arabic}</p>}
                                            <p className="text-xs text-slate-500 italic">"{item.english || item.translation}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Dua Results */}
                            {filteredResults && filteredResults.dua.length > 0 && (
                                <div className="space-y-3 text-left">
                                    <span className="text-[10px] font-black tracking-widest text-sky-700 uppercase pl-1">Supplications ({filteredResults.dua.length})</span>
                                    {filteredResults.dua.map((item: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-5xs space-y-2"
                                        >
                                            <div className="text-[9px] font-bold text-sky-700 uppercase">
                                                {item.title || "Dua"}
                                            </div>
                                            {item.arabic && <p className="font-serif text-lg text-slate-800 text-right leading-relaxed">{item.arabic}</p>}
                                            <p className="text-xs text-slate-500 italic">"{item.translation}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-2 flex flex-col items-center">
                            <h4 className="font-bold text-slate-700 text-sm">No Results Found</h4>
                            <p className="text-xs text-slate-400 max-w-[200px]">We couldn't find matches for "{searchQuery}". Try other search keywords.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
