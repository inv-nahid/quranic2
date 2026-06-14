import React, { useState, useMemo } from "react";
import { Search, Plus, X, Sparkles, BookOpen } from "lucide-react";
import { NoteCard } from "../components/NoteCard";
import { NoteEditor } from "../components/NoteEditor";
import { useNotesQuery } from "../queries/notes.queries";
import { addNote, editNote, deleteNote } from "../services/notes.service";

interface ReflectProps {
    favoritesList: any[];
    onToggleFavorite: (refId: string, type: "QURAN" | "HADITH" | "DUA") => void;
}

export default function Reflect({ favoritesList, onToggleFavorite }: ReflectProps) {
    const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
    const [selectedEditNote, setSelectedEditNote] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTagFilter, setActiveTagFilter] = useState("All Notes");

    // Query notes from server
    const { data: serverNotes, isLoading, refetch } = useNotesQuery();

    interface ReflectionNote {
        id: string | number;
        title: string;
        text: string;
        createdAt: string;
        tags: string[];
        imageUrl?: string;
        isFavorite?: boolean;
    }

    // Standalone notes fallback/preseeded
    const initialLocalNotes: ReflectionNote[] = [
        {
            id: "sn_1",
            title: "The Depth of Patience in Surah Al-Kahf",
            text: "Reflecting on the story of Prophet Musa (AS) and Al-Khidr. The importance of patience, trust in Allah's decree, and understanding that what seems unfavorable may have a hidden blessing in it. We must trust the process and Allah's wisdom when we encounter difficulties along the way.",
            createdAt: "2026-06-14T10:00:00.000Z",
            tags: ["SURAH AL-KAHF", "REFLECTION"],
            isFavorite: true
        },
        {
            id: "sn_2",
            title: "Ayatul Kursi - Daily Protection",
            text: "Noted the linguistic beauty of 'Al-Hayyu Al-Qayyum'. It gives a sense of security and absolute confidence. A profound verse that reminds us of Allah's eternal life and self-sustaining nature.",
            createdAt: "2026-06-12T15:30:00.000Z",
            tags: ["MEMORIZATION", "TAFSIR"]
        }
    ];

    const mergedNotes = useMemo(() => {
        const list = [...initialLocalNotes];
        if (serverNotes && Array.isArray(serverNotes)) {
            serverNotes.forEach((sn: any) => {
                const exists = list.some(ln => ln.id === sn.id || ln.title === sn.title);
                if (!exists) {
                    list.push({
                        id: sn.id,
                        title: sn.title || `Surah ${sn.surahId} Note`,
                        text: sn.text || sn.content || "",
                        createdAt: sn.createdAt || new Date().toISOString(),
                        tags: sn.tags || ["REFLECTIONS"],
                        imageUrl: sn.imageUrl || undefined,
                        isFavorite: favoritesList.some(f => f.refId === String(sn.id) && f.type === "QURAN")
                    });
                }
            });
        }
        return list;
    }, [serverNotes, favoritesList]);

    // Save notes
    const handleSaveNote = async (noteData: { id?: string | number; title: string; text: string; tags: string[]; imageUrl?: string }) => {
        try {
            if (noteData.id) {
                // Update
                await editNote(noteData.id, {
                    title: noteData.title,
                    text: noteData.text,
                    tags: noteData.tags,
                    imageUrl: noteData.imageUrl
                });
            } else {
                // Add
                await addNote({
                    title: noteData.title,
                    text: noteData.text,
                    tags: noteData.tags,
                    imageUrl: noteData.imageUrl
                });
            }
            refetch();
        } catch (err) {
            console.error("Save note API error, updating local:", err);
        }
        setIsNoteEditorOpen(false);
    };

    // Delete notes
    const handleDeleteNote = async (id: string | number) => {
        try {
            await deleteNote(id);
            refetch();
        } catch (err) {
            console.error("Delete note API error:", err);
        }
        setIsNoteEditorOpen(false);
    };

    // Filtered Notes list
    const filteredNotes = useMemo(() => {
        let list = [...mergedNotes];

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(n =>
                n.title.toLowerCase().includes(q) ||
                n.text.toLowerCase().includes(q) ||
                n.tags.some((t: string) => t.toLowerCase().includes(q))
            );
        }

        // Tag filter
        if (activeTagFilter === "Favorites") {
            list = list.filter(n => n.isFavorite);
        } else if (activeTagFilter !== "All Notes") {
            list = list.filter(n => n.tags.some((t: string) => t.toUpperCase() === activeTagFilter.toUpperCase()));
        }

        return list;
    }, [mergedNotes, searchQuery, activeTagFilter]);

    // Unique tags
    const availableTags = useMemo(() => {
        const tagsSet = new Set<string>(["All Notes", "Favorites"]);
        mergedNotes.forEach(n => {
            if (n.tags && Array.isArray(n.tags)) {
                n.tags.forEach(t => tagsSet.add(t));
            }
        });
        return Array.from(tagsSet);
    }, [mergedNotes]);

    return (
        <div className="space-y-5 animate-fadeIn text-left relative min-h-[500px]">
            {/* Header section */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Reflections</h2>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        Document your spiritual journey & learnings
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSelectedEditNote(null);
                        setIsNoteEditorOpen(true);
                    }}
                    className="bg-[#0A6C51] hover:bg-[#075640] text-white p-2.5 rounded-full shadow-md active:scale-95 transition cursor-pointer"
                    title="Add new reflection"
                >
                    <Plus size={18} strokeWidth={2.5} />
                </button>
            </div>

            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search journal reflections, tags..."
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

            {/* Tag filters list */}
            <div className="flex items-center gap-2 overflow-x-auto py-1.5 -mx-5 px-5 scrollbar-none select-none">
                {availableTags.map((tag) => {
                    const isSelected = activeTagFilter === tag;
                    return (
                        <button
                            key={tag}
                            onClick={() => setActiveTagFilter(tag)}
                            className={`px-4 py-2 rounded-full text-[11px] font-extrabold transition-all border whitespace-nowrap cursor-pointer ${
                                isSelected
                                    ? "bg-[#0A6C51] text-white border-[#0A6C51] shadow-xs"
                                    : "bg-white text-slate-600 border-slate-100 hover:border-slate-300"
                            }`}
                        >
                            {tag}
                        </button>
                    );
                })}
            </div>

            {/* Reflections listing */}
            {isLoading ? (
                <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-[#0A6C51] border-b-2" />
                    <p className="text-xs text-slate-400 font-semibold">Loading reflections...</p>
                </div>
            ) : filteredNotes.length > 0 ? (
                <div className="space-y-4 pb-20">
                    {filteredNotes.map((note) => (
                        <NoteCard
                            key={note.id}
                            id={note.id}
                            title={note.title}
                            text={note.text}
                            createdAt={note.createdAt}
                            tags={note.tags}
                            imageUrl={note.imageUrl}
                            isFavorite={note.isFavorite}
                            onEdit={() => {
                                setSelectedEditNote(note);
                                setIsNoteEditorOpen(true);
                            }}
                            onDelete={() => handleDeleteNote(note.id)}
                            onToggleFavorite={() => onToggleFavorite(String(note.id), "QURAN")}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-3.5 flex flex-col items-center select-none">
                    <BookOpen size={24} className="text-slate-350" />
                    <h4 className="font-bold text-slate-700 text-sm">No Reflections Found</h4>
                    <p className="text-xs text-slate-400 max-w-[200px]">Create your first reflection note by clicking the "+" button above.</p>
                </div>
            )}

            {/* Note Editor Modal */}
            {isNoteEditorOpen && (
                <NoteEditor
                    isOpen={isNoteEditorOpen}
                    note={selectedEditNote}
                    onSave={handleSaveNote}
                    onDelete={handleDeleteNote}
                    onClose={() => setIsNoteEditorOpen(false)}
                />
            )}
        </div>
    );
}
