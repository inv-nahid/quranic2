import React, { useState } from "react";
import { MoreVertical, Trash2, Edit3, Star } from "lucide-react";

export interface NoteCardProps {
    key?: React.Key;
    id: string | number;
    title: string;
    text: string;
    createdAt: string;
    tags?: string[];
    imageUrl?: string;
    isFavorite?: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onToggleFavorite?: () => void;
}

export function NoteCard({
    id,
    title,
    text,
    createdAt,
    tags = [],
    imageUrl,
    isFavorite = false,
    onEdit,
    onDelete,
    onToggleFavorite
}: NoteCardProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    // Formats date to user-friendly format (e.g. "May 14, 2024")
    const formatDate = (dateStr: string) => {
        try {
            if (!isNaN(Date.parse(dateStr))) {
                const date = new Date(dateStr);
                return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                });
            }
            return dateStr;
        } catch {
            return dateStr;
        }
    };

    // Truncate text for preview
    const getPreview = (content: string) => {
        if (content.length > 120) {
            return content.substring(0, 115) + "...";
        }
        return content;
    };

    return (
        <div
            id={`note-card-${id}`}
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-5xs hover:shadow-2xs transition duration-300 flex flex-col relative group"
        >
            {/* Banner Image if available */}
            {imageUrl && (
                <div className="relative h-40 overflow-hidden select-none pointer-events-none">
                    <img
                        src={imageUrl}
                        alt="Note Cover"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
            )}

            {/* Content Container */}
            <div className="p-5.5 space-y-3.5 flex-1 flex flex-col">
                {/* Header Metadata */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5 select-none text-xs text-slate-400 font-medium font-sans">
                        {onToggleFavorite && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite();
                                }}
                                className={`transition-all duration-200 p-0.5 hover:scale-110 ${isFavorite ? "text-amber-500" : "text-slate-300 hover:text-slate-400"
                                    }`}
                                title={isFavorite ? "Unfavorite" : "Favorite"}
                            >
                                <Star size={14} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
                            </button>
                        )}
                        <span>{formatDate(createdAt)}</span>
                    </div>

                    {/* Action Dropdown Menu Container */}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDropdown(!showDropdown);
                            }}
                            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition active:scale-95"
                            title="Note Options"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {showDropdown && (
                            <>
                                {/* Backdrop overlay to close on click outside */}
                                <div
                                    className="fixed inset-0 z-45"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDropdown(false);
                                    }}
                                />

                                <div
                                    className="absolute right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-md p-1.5 z-50 min-w-[120px] animate-fadeIn text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            onEdit();
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg text-left transition font-semibold"
                                    >
                                        <Edit3 size={14} className="text-[#0A6C51]" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            onDelete();
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left transition font-semibold"
                                    >
                                        <Trash2 size={14} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Title and Body */}
                <div className="flex-1 space-y-1.5 cursor-pointer" onClick={onEdit}>
                    <h4 className="text-[17px] font-bold text-slate-800 tracking-tight leading-snug hover:text-[#0A6C51] transition">
                        {title || "Untitled Reflection"}
                    </h4>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed tracking-wide">
                        {getPreview(text)}
                    </p>
                </div>

                {/* Tags badge row */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 select-none">
                        {tags.map((tag, i) => (
                            <span
                                key={i}
                                className="bg-emerald-50/70 border border-emerald-100/50 text-[#0A6C51] text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full leading-none"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
