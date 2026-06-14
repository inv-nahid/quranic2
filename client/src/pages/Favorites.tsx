import React, { useState, useMemo } from "react";
import { Search, X, Heart, BookOpen } from "lucide-react";
import { FavoriteItem } from "../components/FavoriteItem";
import { useFavoritesQuery } from "../queries/favorites.queries";
import { deleteFavorite } from "../services/favorites.service";
import { fallbackHadiths } from "../data/hadithData";
import { fallbackDuas, fallbackDuaOfDay } from "../data/duaData";

interface FavoritesProps {
    favoritesList: any[];
    onSelectSurah: (id: number) => void;
    setActiveTab: (tab: string) => void;
    onRemoveFavorite: (id: string | number) => void;
}

export default function Favorites({ favoritesList, onSelectSurah, setActiveTab, onRemoveFavorite }: FavoritesProps) {
    const [activeSubTab, setActiveSubTab] = useState<"QURAN" | "HADITH" | "DUA">("QURAN");
    const [searchQuery, setSearchQuery] = useState("");

    // Queries
    const { refetch } = useFavoritesQuery();

    // Resolvers for bookmarks
    const resolvedQuranFavorites = useMemo(() => {
        return favoritesList
            .filter(f => !f.type || f.type === "QURAN")
            .map(f => {
                const localLookups = [
                    {
                        id: "ayah_2_255",
                        surahId: 2,
                        surahName: "Al-Baqarah",
                        number: 255,
                        arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
                        translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence..."
                    },
                    {
                        id: "ayah_55_13",
                        surahId: 55,
                        surahName: "Ar-Rahman",
                        number: 13,
                        arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
                        translation: "So which of the favors of your Lord would you deny?"
                    },
                    {
                        id: "ayah_94_6",
                        surahId: 94,
                        surahName: "Ash-Sharh",
                        number: 6,
                        arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
                        translation: "Indeed, with hardship [will be] ease."
                    }
                ];

                const match = localLookups.find(v => v.id === f.refId || `q_${v.surahId}_${v.number}` === f.refId || `ayah_${v.surahId}_${v.number}` === f.refId);
                if (match) return { ...match, rawId: f.id };

                // Parse patterns: ayah_id_number or similar
                if (typeof f.refId === "string" && f.refId.startsWith("ayah_")) {
                    const parts = f.refId.split("_");
                    const sId = parseInt(parts[1]) || 2;
                    const vNum = parseInt(parts[2]) || 255;
                    return {
                        id: f.refId,
                        surahId: sId,
                        surahName: sId === 2 ? "Al-Baqarah" : "Quranic",
                        number: vNum,
                        arabic: sId === 2 && vNum === 255 ? "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ" : "الْقُرْآنُ الْكَرِيمُ",
                        translation: sId === 2 && vNum === 255 ? "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence..." : "Spiritual verse bookmark.",
                        rawId: f.id
                    };
                }

                // General fallback
                return {
                    id: f.refId,
                    surahId: 1,
                    surahName: "Al-Fatihah",
                    number: 1,
                    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
                    translation: "[All] praise is [due] to Allah, Lord of the worlds -",
                    rawId: f.id
                };
            });
    }, [favoritesList]);

    const resolvedHadithFavorites = useMemo(() => {
        return favoritesList
            .filter(f => f.type === "HADITH")
            .map(f => {
                const fh = fallbackHadiths.find(h => h.id === f.refId);
                if (fh) return { ...fh, rawId: f.id };

                return {
                    id: f.refId,
                    bookId: "bukhari",
                    number: 1,
                    narrator: "Prophetic tradition companion",
                    bookRef: "Sahih al-Bukhari",
                    arabic: "الْأَعْمَالُ بِالنِّيَّاتِ",
                    english: "Actions are judged by intentions.",
                    rawId: f.id
                };
            });
    }, [favoritesList]);

    const resolvedDuaFavorites = useMemo(() => {
        return favoritesList
            .filter(f => f.type === "DUA")
            .map(f => {
                const fd = fallbackDuas.find(d => d.id === f.refId);
                if (fd) return { ...fd, rawId: f.id };

                if (fallbackDuaOfDay && fallbackDuaOfDay.id === f.refId) {
                    return { ...fallbackDuaOfDay, rawId: f.id };
                }

                return {
                    id: f.refId,
                    title: "Supplication of Prophet",
                    reference: "Prophetic Duas",
                    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
                    translation: "Our Lord, give us in this world [that which is] good.",
                    rawId: f.id
                };
            });
    }, [favoritesList]);

    const currentTabFavorites = useMemo(() => {
        if (activeSubTab === "QURAN") return resolvedQuranFavorites;
        if (activeSubTab === "HADITH") return resolvedHadithFavorites;
        return resolvedDuaFavorites;
    }, [activeSubTab, resolvedQuranFavorites, resolvedHadithFavorites, resolvedDuaFavorites]);

    // Search filter
    const filteredFavorites = useMemo(() => {
        if (!searchQuery.trim()) return currentTabFavorites;
        const q = searchQuery.toLowerCase();
        
        return currentTabFavorites.filter((fav: any) => {
            const titleMatch = (fav.surahName || fav.title || "").toLowerCase().includes(q);
            const textMatch = (fav.translation || fav.english || "").toLowerCase().includes(q);
            const arabicMatch = (fav.arabic || "").includes(searchQuery);
            return titleMatch || textMatch || arabicMatch;
        });
    }, [currentTabFavorites, searchQuery]);

    const handleRemove = async (rawId: string | number) => {
        try {
            await deleteFavorite(rawId);
            onRemoveFavorite(rawId);
            refetch();
        } catch (err) {
            console.error("Failed to delete favorite:", err);
            onRemoveFavorite(rawId); // local state cleanup fallback
        }
    };

    return (
        <div className="space-y-5 animate-fadeIn text-left">
            <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 select-none">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Favorites</h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Browse your bookmarked spiritual references
                </p>
            </div>

            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search inside bookmarked favorites..."
                    className="w-full bg-white border border-slate-150 pl-11 pr-10 py-3.5 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A6C51] shadow-3xs transition"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Segmented Sub-Tab Switcher */}
            <div className="bg-slate-100/90 p-1 rounded-2xl flex w-full space-x-1 select-none font-sans font-bold text-xs shadow-7xs">
                <button
                    onClick={() => setActiveSubTab("QURAN")}
                    className={`flex-1 py-3 rounded-xl text-center font-bold tracking-wide transition cursor-pointer ${
                        activeSubTab === "QURAN" ? "bg-white text-[#0A6C51] shadow-md font-extrabold" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                    Quran
                </button>
                <button
                    onClick={() => setActiveSubTab("HADITH")}
                    className={`flex-1 py-3 rounded-xl text-center font-bold tracking-wide transition cursor-pointer ${
                        activeSubTab === "HADITH" ? "bg-white text-[#0A6C51] shadow-md font-extrabold" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                    Hadith
                </button>
                <button
                    onClick={() => setActiveSubTab("DUA")}
                    className={`flex-1 py-3 rounded-xl text-center font-bold tracking-wide transition cursor-pointer ${
                        activeSubTab === "DUA" ? "bg-white text-[#0A6C51] shadow-md font-extrabold" : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                    Duas
                </button>
            </div>

            {/* Bookmarks List */}
            {filteredFavorites.length > 0 ? (
                <div className="space-y-4 pb-20">
                    {filteredFavorites.map((fav: any, idx: number) => {
                        let titleText = "";
                        let subtitleText = "";
                        let arabicText = fav.arabic;
                        let translationText = fav.translation || fav.english || "";

                        if (activeSubTab === "QURAN") {
                            titleText = `Surah ${fav.surahName} • ${fav.number}`;
                            subtitleText = "Quran Reading";
                        } else if (activeSubTab === "HADITH") {
                            titleText = fav.bookRef || "Hadith Book";
                            subtitleText = fav.narrator || "Prophetic Tradition";
                        } else {
                            titleText = fav.title || "Dua Supplication";
                            subtitleText = fav.reference || "Duas";
                        }

                        return (
                            <FavoriteItem
                                key={fav.id || idx}
                                type={activeSubTab}
                                id={fav.id}
                                title={titleText}
                                subtitle={subtitleText}
                                arabic={arabicText}
                                translation={translationText}
                                onRemove={() => handleRemove(fav.rawId)}
                                onViewContext={
                                    activeSubTab === "QURAN"
                                        ? () => {
                                              onSelectSurah(fav.surahId);
                                              setActiveTab("Quran");
                                          }
                                        : undefined
                                }
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-3.5 flex flex-col items-center select-none">
                    <Heart size={24} className="text-slate-350" />
                    <h4 className="font-bold text-slate-700 text-sm">No Bookmarks Found</h4>
                    <p className="text-xs text-slate-400 max-w-[200px]">Your saved favorites will show up here.</p>
                </div>
            )}
        </div>
    );
}
