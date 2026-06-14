import React, { useState } from "react";
import { Star, Share2, Clipboard, MessageSquare, Trash2, Check, PenTool } from "lucide-react";

interface HadithCardProps {
    key?: React.Key;
    id: string;
    number: number | string;
    narrator: string;
    bookRef: string;
    arabic: string;
    english: string;
    isFavorite: boolean;
    noteText?: string | null;
    onToggleFavorite: () => void;
    onSaveNote?: (text: string) => void;
    onDeleteNote?: () => void;
}

export function HadithCard({
    id,
    number,
    narrator,
    bookRef,
    arabic,
    english,
    isFavorite,
    noteText,
    onToggleFavorite,
    onSaveNote,
    onDeleteNote,
}: HadithCardProps) {
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [noteInput, setNoteInput] = useState(noteText || "");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const fullText = `${narrator}\n\n${arabic}\n\n"${english}"\n\n— ${bookRef}`;
        navigator.clipboard.writeText(fullText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: bookRef,
                text: `${narrator}: "${english}"`,
            }).catch(err => console.log(err));
        } else {
            handleCopy();
            alert(`Copied to clipboard!\nShare: "${narrator}: ${english.slice(0, 50)}..."`);
        }
    };

    const handleSubmitNote = () => {
        if (onSaveNote) {
            onSaveNote(noteInput);
            setIsNotesOpen(false);
        }
    };

    return (
        <div
            id={`hadith-card-${id}`}
            className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-xs space-y-4 hover:border-emerald-100 transition-all duration-300 relative group animate-fadeIn"
        >
            {/* Upper info row */}
            <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                    <span className="bg-[#E2F5EC] text-[#0A6C51] font-black w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-xs select-none">
                        {number}
                    </span>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 tracking-tight text-xs">
                            {narrator}
                        </span>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">
                            {bookRef}
                        </span>
                    </div>
                </div>

                {/* Favorite Star at the top corner */}
                <button
                    onClick={onToggleFavorite}
                    className={`p-2 rounded-xl transition ${isFavorite
                            ? "text-[#E2B832] bg-amber-50"
                            : "text-slate-350 hover:text-amber-500 hover:bg-slate-50"
                        }`}
                    title="Toggle Favorite"
                >
                    <Star size={18} className={isFavorite ? "fill-[#E2B832]" : ""} />
                </button>
            </div>

            {/* Elegant Arabic Text */}
            <p className="font-serif text-[21px] text-slate-900 leading-[1.8] text-right select-all pl-1 rtl">
                {arabic}
            </p>

            {/* English Translation */}
            <p className="text-slate-650 font-sans text-[13px] leading-relaxed pt-2 select-all border-t border-slate-50">
                "{english}"
            </p>

            {/* Display Persistent Note if Exist */}
            {noteText && (
                <div className="bg-[#FFFCE8] border-l-4 border-amber-400 p-4 rounded-r-2xl rounded-l-md text-slate-750 text-xs space-y-2.5 shadow-5xs relative mt-3 animate-slideDown">
                    <span className="text-[9px] font-black tracking-widest text-amber-600 uppercase block">
                        My Reflection
                    </span>
                    <p className="font-sans leading-relaxed italic">{noteText}</p>
                    <div className="flex gap-2.5 justify-end pt-1">
                        <button
                            onClick={() => {
                                setNoteInput(noteText);
                                setIsNotesOpen(true);
                            }}
                            className="text-slate-400 hover:text-amber-600 font-bold text-[10px] uppercase tracking-wider transition"
                        >
                            Edit
                        </button>
                        {onDeleteNote && (
                            <button
                                onClick={onDeleteNote}
                                className="text-slate-400 hover:text-red-600 font-bold text-[10px] uppercase tracking-wider transition flex items-center gap-1"
                            >
                                <Trash2 size={11} /> Delete
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Inline Reflection Editor Form block */}
            {isNotesOpen && (
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-3 mt-3 animate-slideDown">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        Add Daily Reflection Note
                    </label>
                    <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Write your spiritual reflection, learning, or action plan from this Hadith..."
                        className="w-full min-h-[90px] bg-white border border-slate-250 p-3 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-450 focus:outline-none focus:border-[#0A6C51]"
                    />
                    <div className="flex justify-end gap-2.5">
                        <button
                            onClick={() => setIsNotesOpen(false)}
                            className="px-3.5 py-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitNote}
                            className="bg-[#0A6C51] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-9BE transition shadow-2xs"
                        >
                            Save Note
                        </button>
                    </div>
                </div>
            )}

            {/* Lower Actions layout bar matching attachment exactly */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[11px] text-slate-400 font-black uppercase tracking-wider select-none">

                {/* Toggle Favourite Button */}
                <button
                    onClick={onToggleFavorite}
                    className={`flex items-center gap-1.5 p-1 px-2.5 rounded-lg transition ${isFavorite ? "text-[#E2B832] font-extrabold" : "hover:text-amber-500 hover:bg-amber-50/30"
                        }`}
                >
                    <Star size={15} className={isFavorite ? "fill-[#E2B832]" : ""} />
                    <span>{isFavorite ? "Favorited" : "Favorite"}</span>
                </button>

                {/* Share Button */}
                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 p-1 px-2.5 rounded-lg hover:text-[#0A6C51] hover:bg-emerald-50/30 transition-all cursor-pointer"
                >
                    {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
                    <span>{copied ? "Copied" : "Share"}</span>
                </button>

                {/* Add Reflection Note button */}
                <button
                    onClick={() => setIsNotesOpen(!isNotesOpen)}
                    className={`flex items-center gap-1.5 p-1 px-2.5 rounded-lg transition ${isNotesOpen || noteText
                            ? "text-[#0A6C51] font-extrabold"
                            : "hover:text-[#0A6C51] hover:bg-emerald-50/30"
                        }`}
                >
                    <MessageSquare size={15} />
                    <span>{noteText ? "Note Added" : "Add Note"}</span>
                </button>

            </div>
        </div>
    );
}
