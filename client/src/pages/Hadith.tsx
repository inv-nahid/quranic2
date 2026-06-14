import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Sparkles, BookOpen, ChevronLeft, ChevronRight, Settings, CheckCircle2 } from "lucide-react";
import { BookCard } from "../components/BookCard";
import { HadithCard } from "../components/HadithCard";
import { useHadithBooksQuery, useHadithBookHadithsQuery, useHadithSearchQuery } from "../queries/hadith.queries";
import { useRandomHadithQuery } from "../queries/dashboard.queries";
import { fallbackBooks, fallbackHadiths } from "../data/hadithData";

interface HadithProps {
    favoritesList: any[];
    onToggleFavorite: (refId: string, type: "QURAN" | "HADITH" | "DUA") => void;
}

export default function Hadith({ favoritesList, onToggleFavorite }: HadithProps) {
    const [hadithSubView, setHadithSubView] = useState<"home" | "books" | "reader">("home");
    const [selectedHadithBookId, setSelectedHadithBookId] = useState<string | null>(null);
    const [hadithSearchQuery, setHadithSearchQuery] = useState("");
    const [localHadithNotes, setLocalHadithNotes] = useState<any[]>(() => {
        try {
            const saved = localStorage.getItem("hadith_notes");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Queries
    const { data: serverHadithBooks, isLoading: booksLoading } = useHadithBooksQuery(hadithSubView === "books" || hadithSubView === "home");
    const { data: serverHadithList, isLoading: hadithsLoading } = useHadithBookHadithsQuery(selectedHadithBookId);
    const { data: randomHadithData } = useRandomHadithQuery();

    const displayedBooks = useMemo(() => {
        if (serverHadithBooks && Array.isArray(serverHadithBooks) && serverHadithBooks.length > 0) {
            return serverHadithBooks.map((sb: any) => {
                const fb = fallbackBooks.find(b => b.id === sb.id || b.name.toLowerCase() === sb.name?.toLowerCase());
                return {
                    id: sb.id || fb?.id || String(sb.number || 1),
                    name: sb.name || fb?.name || "Hadith Book",
                    arabicName: sb.arabicName || sb.arabic_name || fb?.arabicName || "الحديث",
                    tag: sb.tag || fb?.tag,
                    count: sb.count || sb.hadithCount || sb.hadiths_count || fb?.count || "4,000",
                    description: sb.description || fb?.description || "Authentic compilation",
                    color: fb?.color || "bg-white text-slate-800"
                };
            });
        }
        return fallbackBooks;
    }, [serverHadithBooks]);

    const displayedHadiths = useMemo(() => {
        if (serverHadithList && Array.isArray(serverHadithList) && serverHadithList.length > 0) {
            return serverHadithList.map((sh: any, index: number) => ({
                id: sh.id || `${selectedHadithBookId}_${sh.number || index}`,
                bookId: selectedHadithBookId || "bukhari",
                number: sh.number || index + 1,
                narrator: sh.narrator || sh.by || "Narrated by Companion",
                bookRef: sh.bookRef || sh.reference || `Hadith ${sh.number || index + 1}`,
                arabic: sh.arabic || sh.textArabic || sh.text_arabic || "الْأَعْمَالُ بِالنِّيَّاتِ",
                english: sh.english || sh.translation || sh.text_english || sh.text || "Deeds are judged by intentions."
            }));
        }
        return fallbackHadiths.filter(h => h.bookId === selectedHadithBookId);
    }, [serverHadithList, selectedHadithBookId]);

    const searchedHadiths = useMemo(() => {
        if (!hadithSearchQuery.trim()) return [];
        const q = hadithSearchQuery.toLowerCase();
        
        const sourceHadiths = selectedHadithBookId ? displayedHadiths : fallbackHadiths;
        
        return sourceHadiths.filter(h =>
            h.english.toLowerCase().includes(q) ||
            (h.arabic && h.arabic.includes(q)) ||
            (h.narrator && h.narrator.toLowerCase().includes(q)) ||
            (h.bookRef && h.bookRef.toLowerCase().includes(q))
        );
    }, [hadithSearchQuery, selectedHadithBookId, displayedHadiths]);

    // Save/delete notes handlers
    const handleSaveHadithNote = (hadithId: string, text: string) => {
        const updated = [
            ...localHadithNotes.filter(n => n.hadithId !== hadithId),
            {
                id: `hn_${hadithId}`,
                hadithId,
                text,
                createdAt: new Date().toISOString()
            }
        ];
        setLocalHadithNotes(updated);
        localStorage.setItem("hadith_notes", JSON.stringify(updated));
    };

    const handleDeleteHadithNote = (hadithId: string) => {
        const updated = localHadithNotes.filter(n => n.hadithId !== hadithId);
        setLocalHadithNotes(updated);
        localStorage.setItem("hadith_notes", JSON.stringify(updated));
    };

    const hRad = randomHadithData || {
        englishText: "The best among you are those who learn the Quran and teach it.",
        arabicText: "‏خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ‏",
        book: { name: "Sahih al-Bukhari" }
    };

    return (
        <div className="space-y-5 animate-fadeIn text-left">
            {/* A. HADITH HOME SUBVIEW */}
            {hadithSubView === "home" && (
                <div className="space-y-5">
                    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Explore the Sunnah</h2>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mt-1 select-none">
                            Discover wisdom from the life of Prophet Muhammad (ﷺ)
                        </p>
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={hadithSearchQuery}
                            onChange={(e) => setHadithSearchQuery(e.target.value)}
                            placeholder="Search hadiths, topics, or keywords..."
                            className="w-full bg-white border border-slate-150 pl-11 pr-10 py-3.5 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A6C51] shadow-3xs transition"
                        />
                        {hadithSearchQuery && (
                            <button
                                onClick={() => setHadithSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Search active results */}
                    {hadithSearchQuery.trim() ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-1 select-none">
                                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
                                    Search Results ({searchedHadiths.length})
                                </h4>
                                <button
                                    onClick={() => setHadithSearchQuery("")}
                                    className="text-xs font-bold text-[#0A6C51] cursor-pointer"
                                >
                                    Reset Search
                                </button>
                            </div>

                            {searchedHadiths.length > 0 ? (
                                <div className="space-y-4 animate-fadeIn">
                                    {searchedHadiths.map((h: any) => {
                                        const isFav = favoritesList && Array.isArray(favoritesList)
                                            ? favoritesList.some(f => f.refId === h.id && f.type === "HADITH")
                                            : false;
                                        const note = localHadithNotes.find(n => n.hadithId === h.id);
                                        return (
                                            <HadithCard
                                                key={h.id}
                                                id={h.id}
                                                number={h.number}
                                                narrator={h.narrator}
                                                bookRef={h.bookRef}
                                                arabic={h.arabic}
                                                english={h.english}
                                                isFavorite={isFav}
                                                noteText={note ? note.text : null}
                                                onToggleFavorite={() => onToggleFavorite(h.id, "HADITH")}
                                                onSaveNote={(text) => handleSaveHadithNote(h.id, text)}
                                                onDeleteNote={() => handleDeleteHadithNote(h.id)}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-2 flex flex-col items-center">
                                    <span className="text-slate-400 block"><Search size={22} /></span>
                                    <h4 className="font-bold text-slate-700 text-sm">No Hadiths Found Matching "{hadithSearchQuery}"</h4>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* NORMAL HOME VIEW */
                        <div className="space-y-5.5 animate-fadeIn">
                            {/* Wisdom of the Day Card */}
                            <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-xs space-y-4.5">
                                <div className="flex justify-between items-center border-b border-slate-50 pb-3 select-none">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-[#0A6C51]" />
                                        <span className="text-[10px] font-black tracking-widest text-[#0A6C51] uppercase">
                                            Wisdom of the Day
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-extrabold text-[#00392F] bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                                        Daily Reflection
                                    </span>
                                </div>

                                <div className="space-y-3.5 text-right">
                                    <p className="font-serif text-[21px] text-slate-900 leading-[1.8] text-right">
                                        {hRad.arabicText || "‏خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ‏"}
                                    </p>
                                    <p className="text-[13px] text-slate-600 leading-relaxed font-sans font-medium italic text-left">
                                        "{hRad.englishText}"
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-3.5 border-t border-slate-50 text-[10px] uppercase font-bold text-slate-400 select-none">
                                    <span>{hRad.book?.name || "Hadith Reference"}</span>
                                    <button
                                        onClick={() => setHadithSearchQuery("knowledge")}
                                        className="text-[#0A6C51] hover:underline flex items-center gap-1 font-extrabold text-[10px] cursor-pointer"
                                    >
                                        Reflection Guide
                                    </button>
                                </div>
                            </div>

                            {/* Topics */}
                            <div className="space-y-2.5">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest block select-none">
                                    Topics for Reflection
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {["Patience", "Gratitude", "Character", "Kindness", "Honesty", "Forgiveness"].map((topic) => (
                                        <button
                                            key={topic}
                                            onClick={() => setHadithSearchQuery(topic)}
                                            className="bg-white border border-slate-100 hover:border-emerald-250 text-slate-700 text-[11px] font-extrabold px-3.5 py-2.5 rounded-full shadow-5xs transition-transform active:scale-95 duration-200 cursor-pointer"
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Collections List */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center select-none">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                                        Collections
                                    </h4>
                                    <button
                                        onClick={() => setHadithSubView("books")}
                                        className="text-xs font-black text-[#0A6C51] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>View All</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {displayedBooks.slice(0, 3).map((book) => (
                                        <BookCard
                                            key={book.id}
                                            id={book.id}
                                            name={book.name}
                                            arabicName={book.arabicName}
                                            tag={book.tag}
                                            count={book.count}
                                            color={book.color}
                                            variant="grid"
                                            onClick={() => {
                                                setSelectedHadithBookId(book.id);
                                                setHadithSubView("reader");
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Practices */}
                            <div className="bg-[#FAFBF9] border border-slate-100 rounded-3xl p-5 shadow-5xs space-y-3.5">
                                <div className="flex items-center gap-2 select-none">
                                    <CheckCircle2 size={16} className="text-[#0A6C51]" />
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                                        Sunnah Practices
                                    </h4>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    Establish your daily connection through authentic morning and evening prophetic manners:
                                </p>
                                <div className="space-y-2">
                                    {[
                                        { label: "Eating Habits", desc: "Saying Bismillah, eating with right hand" },
                                        { label: "Sleep Sunnahs", desc: "Sleeping on your right side, reciting last three Surahs" },
                                        { label: "Character", desc: "Greeting others with a cheerful smile" }
                                    ].map((practice, index) => (
                                        <div key={index} className="flex justify-between items-center bg-white border border-slate-55 rounded-2xl p-3.5 shadow-5xs font-sans">
                                            <div>
                                                <span className="text-xs font-extrabold text-slate-800 block leading-tight">{practice.label}</span>
                                                <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">{practice.desc}</span>
                                            </div>
                                            <span className="bg-[#E2F5EC] text-[#0A6C51] font-black w-6 h-6 rounded-lg flex items-center justify-center text-[10px] select-none">
                                                ✓
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* B. HADITH BOOKS CATALOG */}
            {hadithSubView === "books" && (
                <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                        <button
                            onClick={() => setHadithSubView("home")}
                            className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-full transition cursor-pointer"
                            title="Back to sunnah study dashboard"
                        >
                            <ChevronLeft size={22} className="text-[#0A6C51]" />
                        </button>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Hadith Collections</h2>
                            <p className="text-[11px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">
                                Explore prophetic traditions
                            </p>
                        </div>
                    </div>

                    {booksLoading ? (
                        <div className="space-y-3 py-6 animate-pulse">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="bg-white rounded-3xl h-24" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {displayedBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    id={book.id}
                                    name={book.name}
                                    arabicName={book.arabicName}
                                    tag={book.tag}
                                    count={book.count}
                                    color={book.color}
                                    variant="list"
                                    onClick={() => {
                                        setSelectedHadithBookId(book.id);
                                        setHadithSubView("reader");
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* C. HADITH READER VIEW */}
            {hadithSubView === "reader" && selectedHadithBookId && (
                <div className="space-y-4 animate-fadeIn">
                    {/* Reader Subview Header */}
                    <div className="sticky top-0 bg-[#F9FAF9] py-3.5 flex items-center justify-between border-b border-slate-100 z-35 -mx-5 px-5 select-none">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setHadithSubView("books")}
                                className="text-[#0A6C51] p-1.5 hover:bg-slate-100 rounded-full transition cursor-pointer"
                                title="Back to collections"
                            >
                                <ChevronLeft size={22} />
                            </button>
                            <div className="text-left">
                                <h2 className="text-[17px] font-black text-slate-800 tracking-tight leading-tight">
                                    {displayedBooks.find(b => b.id === selectedHadithBookId)?.name || "Hadith Book"}
                                </h2>
                                <p className="text-[11px] text-slate-400 mt-0.5 font-bold">
                                    Book 1 • {displayedBooks.find(b => b.id === selectedHadithBookId)?.count || "4,000"} Hadiths
                                </p>
                            </div>
                        </div>
                        <button
                            className="text-slate-400 hover:text-[#0A6C51] p-1.5 rounded-full cursor-pointer"
                            onClick={() => alert("Hadith view font size is optimized.")}
                        >
                            <Settings size={20} />
                        </button>
                    </div>

                    {/* Book Header Box */}
                    <div className="bg-gradient-to-r from-[#00392F] to-[#2E5B53] text-white rounded-3xl p-5.5 shadow-md relative overflow-hidden flex items-center justify-between select-none">
                        <div className="z-10 space-y-1.5 text-left">
                            <span className="text-[9px] font-black text-[#56E3C6] tracking-widest uppercase">
                                BOOK 1
                            </span>
                            <h3 className="text-[17px] font-extrabold font-sans leading-tight">
                                How Divine Revelation began
                            </h3>
                            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                                Prophetic Traditions & Authenticity
                            </p>
                        </div>
                        <div className="opacity-15 pointer-events-none transform rotate-6 z-0 shrink-0">
                            <BookOpen size={64} className="text-white" />
                        </div>
                    </div>

                    {/* Hadith cards list */}
                    {hadithsLoading ? (
                        <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-[#0A6C51] border-b-2" />
                            <p className="text-xs text-slate-400 font-semibold">Loading prophetic teachings...</p>
                        </div>
                    ) : displayedHadiths.length > 0 ? (
                        <div className="space-y-4">
                            {displayedHadiths.map((h: any) => {
                                const isFav = favoritesList && Array.isArray(favoritesList)
                                    ? favoritesList.some(f => f.refId === h.id && f.type === "HADITH")
                                    : false;
                                const note = localHadithNotes.find(n => n.hadithId === h.id);
                                return (
                                    <HadithCard
                                        key={h.id}
                                        id={h.id}
                                        number={h.number}
                                        narrator={h.narrator}
                                        bookRef={h.bookRef}
                                        arabic={h.arabic}
                                        english={h.english}
                                        isFavorite={isFav}
                                        noteText={note ? note.text : null}
                                        onToggleFavorite={() => onToggleFavorite(h.id, "HADITH")}
                                        onSaveNote={(text) => handleSaveHadithNote(h.id, text)}
                                        onDeleteNote={() => handleDeleteHadithNote(h.id)}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center">
                            <p className="text-xs font-semibold text-slate-800">No content available for this collection yet</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
