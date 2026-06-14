import React, { useState } from "react";
import { Play, Pause, FileText, Star, Share2, Copy, Trash2, Check, MessageSquare, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VerseCardProps {
    id: string | number;
    surahId: number;
    number: number;
    text: string;
    english: string;
    isFavorite: boolean;
    noteText: string | null;
    highlighted?: boolean;
    onToggleFavorite: () => Promise<void> | void;
    onSaveNote: (text: string) => Promise<void> | void;
    onDeleteNote: () => Promise<void> | void;
    onPlay: () => void;
    isPlaying: boolean;
}

export const VerseCard: React.FC<VerseCardProps> = ({
    id,
    surahId,
    number,
    text,
    english,
    isFavorite,
    noteText,
    highlighted = false,
    onToggleFavorite,
    onSaveNote,
    onDeleteNote,
    onPlay,
    isPlaying,
}) => {
    const [showNoteEditor, setShowNoteEditor] = useState(false);
    const [noteValue, setNoteValue] = useState(noteText || "");
    const [coping, setCoping] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleCopy = async () => {
        try {
            const shareString = `${text}\n\n"${english}"\n(Surah ${surahId}, Verse ${number})`;
            await navigator.clipboard.writeText(shareString);
            setCoping(true);
            setTimeout(() => setCoping(false), 2000);
        } catch (e) {
            console.warn("Clipboard access failed, fallback paste");
        }
    };

    const handleShare = async () => {
        const shareString = `${text}\n\n"${english}"\n(Surah ${surahId}, Verse ${number})`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Quran Verse - Surah ${surahId}:${number}`,
                    text: shareString,
                });
            } catch (e) {
                handleCopy();
            }
        } else {
            handleCopy();
        }
    };

    const handleSubmitNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteValue.trim()) return;
        setIsSaving(true);
        try {
            await onSaveNote(noteValue.trim());
            setShowNoteEditor(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteNoteClick = async () => {
        setIsSaving(true);
        try {
            await onDeleteNote();
            setNoteValue("");
            setShowNoteEditor(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    // Check if it's the 4th verse as a match for "MOST SHARED" in the attached screenshot
    const isMostShared = number === 4;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-white border rounded-3xl p-5 shadow-xs transition duration-300 relative overflow-hidden ${highlighted || isMostShared
                    ? "border-l-[4px] border-l-[#E2B832] border-y-slate-100 border-r-slate-100"
                    : "border-slate-100 hover:border-emerald-150"
                }`}
        >
            {/* Background radial glow for active recording */}
            {isPlaying && (
                <div className="absolute inset-0 bg-emerald-50/15 pointer-events-none animate-pulse" />
            )}

            {/* Top row containing verse number & badges */}
            <div className="flex items-center justify-between mb-4.5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-[12px] flex items-center justify-center">
                        {number}
                    </div>
                    {isMostShared && (
                        <span className="bg-[#FFF0EB] text-[#F97316] text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase">
                            MOST SHARED
                        </span>
                    )}
                    {noteText && (
                        <span className="bg-emerald-50 text-[#0A6C51] text-[10px] font-black tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                            <MessageSquare size={10} className="fill-[#0A6C51]/20" /> Reflected
                        </span>
                    )}
                </div>

                {/* Favorite marker */}
                <button
                    onClick={onToggleFavorite}
                    className={`p-1.5 rounded-full transition ${isFavorite ? "text-[#E2B832] hover:scale-105" : "text-slate-300 hover:text-amber-500"
                        }`}
                    title="Save to favorites"
                >
                    <Star size={18} className={isFavorite ? "fill-[#E2B832]" : ""} />
                </button>
            </div>

            {/* Arabic text block (Gorgeously aligned and formatted) */}
            <div className="mb-4 text-right">
                <p className="font-serif text-2xl sm:text-3xl font-medium text-slate-900 leading-[1.8] tracking-wide select-all pr-1 select-none">
                    {text}
                </p>
            </div>

            {/* Translation text */}
            <div className="mb-4">
                <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed font-normal antialiased">
                    {english}
                </p>
            </div>

            {/* Thin elegant horizontal line */}
            <hr className="border-slate-100 my-3.5" />

            {/* Actions footer row */}
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <div className="flex items-center gap-4.5">
                    {/* Play/Pause control */}
                    <button
                        onClick={onPlay}
                        className={`flex items-center gap-1.5 font-bold hover:text-[#0A6C51] transition active:scale-95 ${isPlaying ? "text-[#0A6C51]" : "text-slate-500"
                            }`}
                        title="Read verse"
                    >
                        {isPlaying ? (
                            <>
                                <Pause size={14} className="fill-[#0A6C51] text-[#0A6C51]" />
                                <span>Playing</span>
                            </>
                        ) : (
                            <>
                                <Play size={14} className="fill-slate-500 text-slate-500 hover:fill-[#0A6C51] hover:text-[#0A6C51]" />
                                <span>Play</span>
                            </>
                        )}
                    </button>

                    {/* Notes popup trigger */}
                    <button
                        onClick={() => {
                            setNoteValue(noteText || "");
                            setShowNoteEditor(!showNoteEditor);
                        }}
                        className={`flex items-center gap-1.5 font-bold hover:text-[#0A6C51] transition active:scale-95 ${noteText ? "text-[#0A6C51]" : "text-slate-500"
                            }`}
                    >
                        <FileText size={14} />
                        <span>Notes</span>
                    </button>
                </div>

                {/* Share and copy controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCopy}
                        className="p-1 px-1.5 hover:text-[#0A6C51] transition"
                        title="Copy Text"
                    >
                        {coping ? (
                            <Check size={14} className="text-emerald-600" />
                        ) : (
                            <Copy size={14} className="text-slate-400" />
                        )}
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-1 hover:text-[#0A6C51] transition"
                        title="Share Verse"
                    >
                        <Share2 size={14} className="text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Note Edit popdown section */}
            <AnimatePresence>
                {showNoteEditor && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4.5 pt-4 border-t border-slate-100 overflow-hidden"
                    >
                        <form onSubmit={handleSubmitNote} className="space-y-3">
                            <label className="text-[11px] font-black text-slate-500 tracking-wider uppercase block">
                                Reflection Note for Verse {number}
                            </label>
                            <textarea
                                value={noteValue}
                                onChange={(e) => setNoteValue(e.target.value)}
                                placeholder="Write your spiritual reflection, note, or lesson here..."
                                rows={3}
                                className="w-full text-xs font-sans p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A6C51] text-slate-700 placeholder-slate-400 resize-none leading-relaxed"
                                required
                            />
                            <div className="flex items-center justify-between gap-2 pt-1">
                                {noteText ? (
                                    <button
                                        type="button"
                                        onClick={handleDeleteNoteClick}
                                        disabled={isSaving}
                                        className="text-rose-600 hover:text-rose-800 text-[11px] font-black flex items-center gap-1 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition"
                                    >
                                        <Trash2 size={13} />
                                        <span>Delete</span>
                                    </button>
                                ) : (
                                    <div />
                                )}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowNoteEditor(false)}
                                        className="text-slate-500 hover:text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving || !noteValue.trim()}
                                        className="bg-[#0A6C51] hover:bg-emerald-950 text-white min-w-[70px] text-[11px] font-black px-4.5 py-1.5 rounded-lg shadow-sm transition active:scale-95 disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save Note"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
