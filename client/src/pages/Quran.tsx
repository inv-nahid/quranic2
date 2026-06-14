import React, { useState, useEffect, useMemo } from "react";
import { Search, X, List, Clock, ChevronLeft, Settings, Star, BookOpen } from "lucide-react";
import { SurahListItem } from "../components/SurahListItem";
import { VerseCard } from "../components/VerseCard";
import { useSurahsQuery, useSurahQuery, useSurahAyahsQuery, useQuranSearchQuery } from "../queries/quran.queries";
import { updateProgress } from "../services/progress.service";

interface QuranProps {
    selectedSurahId: number | null;
    setSelectedSurahId: (id: number | null) => void;
    setActiveTab: (tab: string) => void;
    favoritesList: any[];
    onToggleFavorite: (refId: string, type: "QURAN" | "HADITH" | "DUA") => void;
    notesList: any[];
    onSaveNote: (ayahId: string, text: string) => void;
    onDeleteNote: (ayahId: string) => void;
}

export default function Quran({
    selectedSurahId,
    setSelectedSurahId,
    setActiveTab,
    favoritesList,
    onToggleFavorite,
    notesList,
    onSaveNote,
    onDeleteNote
}: QuranProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"number" | "name" | "verses">("number");
    const [visibleVersesCount, setVisibleVersesCount] = useState<number>(4);
    const [playingAyahId, setPlayingAyahId] = useState<string | null>(null);
    const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Queries
    const { data: surahsList, isLoading: surahsLoading, refetch: refetchSurahs } = useSurahsQuery();
    const { data: selectedSurahDetails } = useSurahQuery(selectedSurahId);
    const { data: surahAyahs, isLoading: ayahsLoading, refetch: refetchAyahs } = useSurahAyahsQuery(selectedSurahId);
    const { data: searchResults, isLoading: searchLoading } = useQuranSearchQuery(searchQuery);

    // Reset pagination & audio instance when selected Surah changes
    useEffect(() => {
        setVisibleVersesCount(4);
        if (audioInstance) {
            audioInstance.pause();
            setPlayingAyahId(null);
        }
    }, [selectedSurahId]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioInstance) {
                audioInstance.pause();
            }
        };
    }, [audioInstance]);

    // Handle pull to refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                refetchSurahs(),
                selectedSurahId ? refetchAyahs() : Promise.resolve()
            ]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Filtered and sorted surahs
    const sortedSurahs = useMemo(() => {
        if (!surahsList) return [];
        let list = [...surahsList];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(s =>
                (s.englishName && s.englishName.toLowerCase().includes(q)) ||
                (s.name && s.name.includes(q)) ||
                (s.id && s.id.toString() === q)
            );
        }
        if (sortBy === "name") {
            list.sort((a, b) => (a.englishName || "").localeCompare(b.englishName || ""));
        } else if (sortBy === "verses") {
            list.sort((a, b) => (b.versesCount ?? b.verses_count ?? 0) - (a.versesCount ?? a.verses_count ?? 0));
        } else {
            list.sort((a, b) => (a.id || 0) - (b.id || 0));
        }
        return list;
    }, [surahsList, sortBy, searchQuery]);

    // Save reading progress to backend
    const handleSaveProgress = async (surahId: number, ayahNumber: number, percentage: number) => {
        try {
            await updateProgress(surahId, ayahNumber, percentage);
        } catch (e) {
            console.warn("Failed saving progress:", e);
        }
    };

    // Recitation Audio controls using Mishary Alafasy audio stream CDN
    const handlePlayRecitation = (ay: any) => {
        if (playingAyahId === ay.id) {
            if (audioInstance) {
                audioInstance.pause();
            }
            setPlayingAyahId(null);
            return;
        }

        if (audioInstance) {
            audioInstance.pause();
        }

        // Format: pad surah number and ayah number to 3 digits (e.g. Surah 1, Ayah 1 -> 001001.mp3)
        const sIdPad = String(selectedSurahId).padStart(3, '0');
        const aNumPad = String(ay.number).padStart(3, '0');
        const recAudioUrl = `https://verses.quran.com/Alafasy/mp3/${sIdPad}${aNumPad}.mp3`;
        
        const audio = new Audio(recAudioUrl);
        setAudioInstance(audio);
        setPlayingAyahId(ay.id);

        audio.play().catch((err) => {
            console.warn("Audio recitation playback failed:", err);
            // simulated fallback playback timer
            setTimeout(() => {
                setPlayingAyahId((curr) => curr === ay.id ? null : curr);
            }, 5000);
        });

        audio.onended = () => {
            setPlayingAyahId(null);
        };
    };

    return (
        <div className="space-y-4 animate-fadeIn text-left">
            {!selectedSurahId ? (
                /* SURAH LISTING VIEW */
                <div className="space-y-5">
                    {/* Search bar */}
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search Surah, Juz, or Verse..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-10 py-3.5 text-[14px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#0A6C51] focus:ring-1 focus:ring-[#0A6C51] shadow-xs transition-all duration-200"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                                title="Clear Search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Search Outcomes */}
                    {searchQuery.trim() ? (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="flex items-center justify-between">
                                <h4 className="text-slate-400 text-xs font-black uppercase tracking-wider">
                                    Search Results
                                </h4>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="text-xs font-bold text-[#0A6C51] hover:underline cursor-pointer"
                                >
                                    Reset Search
                                </button>
                            </div>

                            {sortedSurahs.length > 0 && (
                                <div className="space-y-2.5">
                                    <span className="text-[11px] font-bold text-slate-400 block tracking-widest uppercase">Matching Surahs ({sortedSurahs.length})</span>
                                    <div className="space-y-2">
                                        {sortedSurahs.slice(0, 4).map((surah: any) => (
                                            <SurahListItem
                                                key={surah.id}
                                                id={surah.id}
                                                name={surah.name}
                                                englishName={surah.englishName}
                                                englishNameTranslation={surah.englishNameTranslation || surah.revelationType || "Chapter"}
                                                versesCount={surah.versesCount || surah.verses_count || 114}
                                                progress={0}
                                                onClick={() => setSelectedSurahId(surah.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2.5 pt-1">
                                <span className="text-[11px] font-bold text-slate-400 block tracking-widest uppercase">Matching Verses</span>
                                {searchLoading ? (
                                    <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A6C51]" />
                                        <p className="text-xs text-slate-400">Searching verses...</p>
                                    </div>
                                ) : searchResults && searchResults.length > 0 ? (
                                    <div className="space-y-3">
                                        {searchResults.slice(0, 10).map((item: any, idx: number) => (
                                            <div
                                                key={item.id || idx}
                                                onClick={() => {
                                                    if (item.surahId) setSelectedSurahId(item.surahId);
                                                    else if (item.surah?.id) setSelectedSurahId(item.surah.id);
                                                }}
                                                className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs hover:border-emerald-200 cursor-pointer transition space-y-2.5"
                                            >
                                                <div className="flex justify-between items-center text-[10px] font-bold text-[#0A6C51]">
                                                    <span>SURAH {item.surah?.englishName || `No. ${item.surahId || idx}`}</span>
                                                    <span className="bg-emerald-50 px-2 py-0.5 rounded">VERSE {item.number}</span>
                                                </div>
                                                <p className="font-serif text-xl text-slate-900 leading-normal text-right">{item.text}</p>
                                                {item.english && <p className="text-xs text-slate-500 italic font-sans leading-relaxed">"{item.english}"</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white border border-slate-100 rounded-2xl p-7 text-center space-y-2 flex flex-col items-center">
                                        <h4 className="font-bold text-slate-700 text-sm">No Verse Results Matching "{searchQuery}"</h4>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* NORMAL SURAH CATALOG VIEW */
                        <div className="space-y-5">
                            {/* Continue Reading Green Hero Box */}
                            <div className="bg-gradient-to-br from-[#00392F] to-[#0A6C51] text-white rounded-3xl p-6 relative overflow-hidden shadow-xl flex items-center justify-between">
                                <div className="space-y-4 z-10 flex-1 pr-4">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#56E3C6]">CONTINUE READING</span>
                                        <h3 className="text-2xl font-black font-sans leading-tight">Al-Kahf</h3>
                                    </div>
                                    <p className="text-xs text-white/80 font-medium">Ayah 45 • Page 298</p>
                                    <button
                                        onClick={() => setSelectedSurahId(18)}
                                        className="bg-white text-[#0A6C51] px-6 py-2.5 rounded-full font-bold text-xs shadow-md hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                                    >
                                        Resume
                                    </button>
                                </div>
                                <div className="absolute right-[-10px] bottom-[-15px] opacity-15 pointer-events-none transform rotate-12">
                                    <BookOpen size={145} className="text-white" />
                                </div>
                            </div>

                            {/* Challenge Card */}
                            <div className="bg-white border-l-[4px] border-[#E2B832] border-y border-r border-[#FFF8E8]/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
                                <div className="flex items-center gap-1.5 text-[#E2B832]">
                                    <Star size={16} className="fill-[#E2B832]" />
                                    <span className="text-[10px] font-black tracking-widest uppercase">DAILY CHALLENGE</span>
                                </div>
                                <h4 className="text-xl font-extrabold text-slate-800 leading-tight">Memorize 3 Ayahs</h4>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                                    <div className="bg-[#E2B832] h-full rounded-full w-[66%]" />
                                </div>
                                <span className="text-xs text-slate-400 font-medium block">2 of 3 completed today</span>
                            </div>

                            {/* Sort Actions */}
                            <div className="flex items-center justify-between pt-2">
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Surah List</h3>
                                <button
                                    onClick={() => {
                                        const nextSort = sortBy === "number" ? "name" : sortBy === "name" ? "verses" : "number";
                                        setSortBy(nextSort);
                                    }}
                                    className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0A6C51] transition cursor-pointer"
                                >
                                    <List size={14} />
                                    <span>Sort</span>
                                </button>
                            </div>

                            {/* Refresh Button */}
                            <div className="flex justify-center -my-1.5">
                                <button
                                    onClick={handleRefresh}
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-[#0A6C51] bg-[#0A6C51]/8 hover:bg-[#0A6C51]/15 px-3.5 py-1.5 rounded-full transition active:scale-95 cursor-pointer"
                                >
                                    <Clock size={12} className={isRefreshing ? "animate-spin" : ""} />
                                    <span>{isRefreshing ? "Refreshing..." : "Pull to Refresh"}</span>
                                </button>
                            </div>

                            {/* Surah List */}
                            {surahsLoading || isRefreshing ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((n) => (
                                        <div key={n} className="bg-white border border-slate-150 rounded-2xl p-4 flex items-center justify-between animate-pulse h-20" />
                                    ))}
                                </div>
                            ) : sortedSurahs.length === 0 ? (
                                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center">
                                    <p className="text-sm font-semibold text-slate-800">No Surahs available</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sortedSurahs.map((surah: any) => (
                                        <SurahListItem
                                            key={surah.id}
                                            id={surah.id}
                                            name={surah.name}
                                            englishName={surah.englishName}
                                            englishNameTranslation={surah.englishNameTranslation || surah.revelationType || "Chapter"}
                                            versesCount={surah.versesCount || surah.verses_count || 114}
                                            progress={surah.id === 1 ? 100 : surah.id === 2 ? 15 : surah.id === 18 ? 60 : 0}
                                            onClick={() => setSelectedSurahId(surah.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* RECITATION / AYAH READER VIEW */
                <div className="space-y-4 animate-fadeIn">
                    {/* Reader Header */}
                    <div className="sticky top-0 bg-[#F9FAF9] py-3.5 flex items-center justify-between border-b border-slate-100 z-35 -mx-5 px-5">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedSurahId(null)}
                                className="text-slate-700 hover:text-[#0A6C51] p-1.5 hover:bg-slate-100 rounded-full transition active:scale-95 cursor-pointer"
                                title="Back to Surah list"
                            >
                                <ChevronLeft size={22} className="text-[#0A6C51]" />
                            </button>
                            <div className="text-left">
                                <h2 className="text-[17px] font-black text-slate-800 tracking-tight leading-tight">
                                    {selectedSurahDetails?.englishName || "Surah"}
                                </h2>
                                <p className="text-[11px] text-slate-400 mt-0.5 font-bold">
                                    {selectedSurahDetails?.englishNameTranslation || "Chapter"} • {selectedSurahDetails?.versesCount || 0} Ayahs
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <button
                                className="text-slate-500 hover:text-[#0A6C51] p-1.5 hover:bg-slate-100 rounded-full transition cursor-pointer"
                                onClick={() => alert("Reciter voice: Sheikh Mishary Alafasy. Translation: Saheeh International.")}
                            >
                                <Settings size={20} className="text-slate-400 hover:text-[#0A6C51]" />
                            </button>
                        </div>
                    </div>

                    {/* Bismillah Calligraphy block */}
                    {selectedSurahId !== 9 && (
                        <div className="flex flex-col items-center justify-center text-center py-6 select-none bg-[#F9FAF9] border-b border-slate-100 mb-2">
                            <p className="font-serif text-3xl text-slate-805 leading-normal tracking-wide mb-3">
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </p>
                            <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 font-extrabold tracking-[0.14em] uppercase leading-relaxed text-center px-4">
                                In the name of Allah, the Entirely Merciful, the Especially Merciful
                            </p>
                        </div>
                    )}

                    {/* Ayahs List */}
                    {ayahsLoading ? (
                        <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A6C51]" />
                            <p className="text-xs text-slate-400 font-semibold">Loading spiritual verses...</p>
                        </div>
                    ) : surahAyahs && surahAyahs.length > 0 ? (
                        <div className="space-y-4 pt-1 pb-16">
                            {surahAyahs.slice(0, visibleVersesCount).map((ay: any) => {
                                const isFav = favoritesList && Array.isArray(favoritesList)
                                    ? favoritesList.some(f => f.refId === ay.id && (!f.type || f.type === "QURAN"))
                                    : false;
                                const activeNote = notesList.find(n => n.ayahId === ay.id || n.id === ay.id);

                                return (
                                    <VerseCard
                                        key={ay.id}
                                        id={ay.id}
                                        surahId={selectedSurahId}
                                        number={ay.number}
                                        text={ay.text}
                                        english={ay.english || ay.translation || ""}
                                        isFavorite={isFav}
                                        noteText={activeNote ? activeNote.text : null}
                                        highlighted={ay.number === 4}
                                        onToggleFavorite={() => onToggleFavorite(ay.id, "QURAN")}
                                        onSaveNote={(text) => onSaveNote(ay.id, text)}
                                        onDeleteNote={() => onDeleteNote(ay.id)}
                                        onPlay={() => handlePlayRecitation(ay)}
                                        isPlaying={playingAyahId === ay.id}
                                    />
                                );
                            })}

                            {/* Infinite scroll pagination button */}
                            {visibleVersesCount < surahAyahs.length ? (
                                <div className="pt-4 pb-8 flex flex-col items-center justify-center gap-2">
                                    <button
                                        onClick={() => {
                                            const nextCount = Math.min(surahAyahs.length, visibleVersesCount + 4);
                                            setVisibleVersesCount(nextCount);
                                            const completionPercentage = Math.round((nextCount / surahAyahs.length) * 100);
                                            handleSaveProgress(selectedSurahId, nextCount, completionPercentage);
                                        }}
                                        className="bg-[#004D40] text-white px-8 py-3.5 rounded-full font-sans font-bold text-[13px] tracking-wide shadow-md hover:bg-emerald-950 hover:shadow-lg transition-transform active:scale-95 duration-200 flex items-center justify-center min-w-[240px] cursor-pointer"
                                    >
                                        Continue to Verse {visibleVersesCount + 1}
                                    </button>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                        Scroll or Tap to reveal more verses
                                    </p>
                                </div>
                            ) : (
                                <div className="py-8 text-center bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                                    <span className="bg-[#E2F5EC] text-[#0A6C51] text-[10px] font-black tracking-widest px-3.5 py-2 rounded-full uppercase inline-block">
                                        🎉 Surah Completed
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center">
                            <p className="text-sm font-semibold text-slate-800">Verses not found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
