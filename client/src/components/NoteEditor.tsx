import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, Trash2, Tag, Image, X } from "lucide-react";

export interface NoteEditorProps {
    isOpen: boolean;
    note: any | null; // null if creating, populated with note object if editing
    onClose: () => void;
    onSave: (noteData: {
        id?: string | number;
        title: string;
        text: string;
        tags: string[];
        imageUrl?: string;
    }) => void;
    onDelete?: (id: string | number) => void;
}

const PRESET_TAGS = ["REFLECTION", "TAFSIR", "MEMORIZATION", "GRATITUDE", "ARTS", "SURAH AL-KAHF", "SURAH AL-FURQAN", "DAILY LIFE"];

const PRESET_IMAGES = [
    { name: "No Cover", url: "" },
    { name: "Archway Geometry", url: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=600" },
    { name: "Quiet Sunset", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600" },
    { name: "Serene Nature", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600" }
];

export function NoteEditor({
    isOpen,
    note,
    onClose,
    onSave,
    onDelete
}: NoteEditorProps) {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [showTagPicker, setShowTagPicker] = useState(false);

    // Sync state when note changes
    useEffect(() => {
        if (note) {
            setTitle(note.title || "");
            setText(note.text || note.content || "");
            setSelectedTags(note.tags || []);
            setImageUrl(note.imageUrl || "");
        } else {
            setTitle("");
            setText("");
            setSelectedTags(["REFLECTION"]);
            setImageUrl("");
        }
        setShowImagePicker(false);
        setShowTagPicker(false);
    }, [note, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!title.trim() && !text.trim()) {
            onClose();
            return;
        }
        onSave({
            id: note?.id,
            title: title.trim() || "Untitled Reflection",
            text: text.trim(),
            tags: selectedTags,
            imageUrl: imageUrl || undefined
        });
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else {
            setSelectedTags(prev => [...prev, tag]);
        }
    };

    return (
        <div id="note-editor-overlay" className="fixed inset-0 bg-white z-55 flex flex-col animate-slideUp font-sans">
            {/* Editor Header Row with Actions */}
            <header className="px-5 py-4 border-b border-slate-50 flex items-center justify-between select-none">
                <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 text-slate-650 hover:text-slate-900 font-extrabold text-xs transition active:scale-95 bg-slate-50 px-3.5 py-2 rounded-full"
                    title="Go back without saving"
                >
                    <ArrowLeft size={15} strokeWidth={2.5} />
                    <span>Reflections</span>
                </button>

                <h3 className="text-sm font-black text-slate-800 tracking-wide uppercase">
                    {note ? "Edit Reflection" : "New Reflection"}
                </h3>

                <div className="flex items-center gap-2">
                    {note && onDelete && (
                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this reflection? This action cannot be undone.")) {
                                    onDelete(note.id);
                                }
                            }}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-full transition active:scale-95"
                            title="Delete Reflection"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={!title.trim() && !text.trim()}
                        className="flex items-center gap-1.5 bg-[#0A6C51] hover:bg-[#075640] text-white font-black text-xs px-4 py-2 rounded-full shadow-5xs transition duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        title="Save changes"
                    >
                        <Check size={14} strokeWidth={2.5} />
                        <span>Save</span>
                    </button>
                </div>
            </header>

            {/* Editor Body Area */}
            <div className="flex-1 overflow-y-auto p-5.5 space-y-5">
                {/* Selected Banner Cover Preview */}
                {imageUrl && (
                    <div className="relative h-44 rounded-2xl overflow-hidden shadow-5xs group">
                        <img
                            src={imageUrl}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <button
                            onClick={() => setImageUrl("")}
                            className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition"
                            title="Remove Cover Image"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* Text Form Controls: Distraction-free */}
                <div className="space-y-4">
                    <input
                        id="editor-note-title"
                        type="text"
                        placeholder="Title your reflection..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full font-sans font-black text-2xl text-slate-800 placeholder-slate-300 focus:outline-none border-b border-transparent focus:border-slate-100 py-1"
                    />

                    <textarea
                        id="editor-note-text"
                        placeholder="Start writing your reflection here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={10}
                        className="w-full font-sans text-[15px] font-medium leading-relaxed text-slate-700 placeholder-slate-400 focus:outline-none resize-none min-h-[250px] py-1"
                    />
                </div>

                {/* Toolbar Accessories at bottom */}
                <div className="border-t border-slate-105 pt-4.5 space-y-4 select-none">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setShowTagPicker(!showTagPicker);
                                setShowImagePicker(false);
                            }}
                            className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-2 rounded-full border transition active:scale-95 ${showTagPicker
                                    ? "bg-slate-100 border-slate-200 text-slate-800"
                                    : "bg-white border-slate-100 text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            <Tag size={13} />
                            <span>Tags ({selectedTags.length})</span>
                        </button>

                        <button
                            onClick={() => {
                                setShowImagePicker(!showImagePicker);
                                setShowTagPicker(false);
                            }}
                            className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-2 rounded-full border transition active:scale-95 ${showImagePicker
                                    ? "bg-slate-100 border-slate-200 text-slate-800"
                                    : "bg-white border-slate-100 text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            <Image size={13} />
                            <span>Cover Banner {imageUrl ? "✓" : ""}</span>
                        </button>
                    </div>

                    {/* Quick Tag Selector Panel */}
                    {showTagPicker && (
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5 animate-fadeIn">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select tag categories</span>
                            <div className="flex flex-wrap gap-1.5">
                                {PRESET_TAGS.map((tag) => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full transition active:scale-95 border ${isSelected
                                                    ? "bg-[#0A6C51] border-[#0A6C51] text-white"
                                                    : "bg-white border-slate-150 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Preset image banners lists */}
                    {showImagePicker && (
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 animate-fadeIn">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Cover Image</span>
                            <div className="grid grid-cols-2 gap-2.5">
                                {PRESET_IMAGES.map((img) => {
                                    const isSelected = imageUrl === img.url;
                                    return (
                                        <button
                                            key={img.name}
                                            onClick={() => {
                                                setImageUrl(img.url);
                                                setShowImagePicker(false);
                                            }}
                                            className={`relative h-18 rounded-xl overflow-hidden border-2 text-left flex flex-col justify-end p-2 transition duration-200 active:scale-95 ${isSelected ? "border-[#0A6C51] shadow-2xs" : "border-transparent opacity-80 hover:opacity-100"
                                                }`}
                                        >
                                            {img.url ? (
                                                <>
                                                    <img
                                                        src={img.url}
                                                        alt={img.name}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                    <div className="absolute inset-0 bg-black/45" />
                                                    <span className="relative text-[9px] font-extrabold text-white uppercase tracking-wider">{img.name}</span>
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 bg-white border border-slate-150 rounded-xl flex items-center justify-center">
                                                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">No Cover</span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
