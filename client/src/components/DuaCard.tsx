import React, { useState } from "react";
import {
    Star,
    Share2,
    Copy,
    Volume2,
    Play,
    Pause,
    Info,
    Check,
    Bookmark,
    Eye
} from "lucide-react";

interface DuaCardProps {
    key?: React.Key;
    id: string;
    number: number;
    title: string;
    reference: string;
    arabic: string;
    transliteration?: string;
    translation: string;
    info?: string;
    recitationLimit: number;
    reads?: string;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    recitedCount?: number;
    onRecite?: () => void;
}

export function DuaCard({
    id,
    number,
    title,
    reference,
    arabic,
    transliteration,
    translation,
    info,
    recitationLimit,
    reads = "1.2k reads",
    isFavorite,
    onToggleFavorite,
    recitedCount,
    onRecite
}: DuaCardProps) {
    const [localRecitedCount, setLocalRecitedCount] = useState(0);
    const activeCount = recitedCount !== undefined ? recitedCount : localRecitedCount;
    const [isPlaying, setIsPlaying] = useState(false);
    const [copied, setCopied] = useState(false);

    // Audio Playback handler (simulated or text-to-speech)
    const handlePlaySound = () => {
        if (isPlaying) {
            setIsPlaying(false);
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        } else {
            setIsPlaying(true);
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                // Speak the Arabic or translation based on user availability
                const utterance = new SpeechSynthesisUtterance(translation);
                utterance.rate = 0.9;
                utterance.onend = () => setIsPlaying(false);
                utterance.onerror = () => setIsPlaying(false);
                window.speechSynthesis.speak(utterance);
            } else {
                // Fallback simulated duration
                setTimeout(() => {
                    setIsPlaying(false);
                }, 3000);
            }
        }
    };

    // Copy handler
    const handleCopyText = () => {
        const textToCopy = `${title}\n${arabic}\n\nTranslation:\n"${translation}"\n\nReference: ${reference}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Repetition counter handler
    const handleRecitedClick = () => {
        if (onRecite) {
            onRecite();
        } else {
            if (localRecitedCount < recitationLimit) {
                setLocalRecitedCount(prev => prev + 1);
            } else {
                setLocalRecitedCount(0);
            }
        }
    };

    // Share handler
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this beautiful Dua: "${title}" - ${translation}`,
                url: window.location.href
            }).catch(err => console.log(err));
        } else {
            alert(`Copied Dua link to clipboard:\n"${title}"`);
            handleCopyText();
        }
    };

    return (
        <div
            id={`dua-card-${id}`}
            className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-4xs space-y-4 font-sans hover:shadow-3xs transition-shadow duration-300"
        >
            {/* 1. Header with number, title, sub-title, and star */}
            <div className="flex items-start justify-between select-none">
                <div className="flex items-start gap-3.5">
                    {/* Number badge */}
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-500 shrink-0">
                        {number}
                    </div>
                    <div>
                        <h4 className="text-[14px] sm:text-[15px] font-black text-slate-800 tracking-tight leading-tight">
                            {title}
                        </h4>
                        <span className="text-[10px] sm:text-[11px] text-slate-450 font-bold tracking-wide mt-1 block uppercase">
                            {reference}
                        </span>
                    </div>
                </div>

                {/* Favorite Star action button */}
                <button
                    onClick={onToggleFavorite}
                    className={`p-1.5 rounded-full hover:bg-slate-50 transition ${isFavorite ? "text-amber-500 scale-110" : "text-slate-300"}`}
                    title={isFavorite ? "Remove from bookmarks" : "Save bookmark"}
                >
                    <Star size={18} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
                </button>
            </div>

            {/* 2. Beautiful Arabic Script Box */}
            <div className="py-2">
                <p className="font-serif text-[21px] sm:text-[23px] text-right text-slate-900 leading-[1.8] tracking-wide" dir="rtl">
                    {arabic}
                </p>
            </div>

            {/* 3. Transliteration Section if it exists */}
            {transliteration && (
                <div className="space-y-1.5 border-t border-dashed border-slate-100 pt-3">
                    <span className="text-[9px] font-black tracking-widest text-[#0A6C51] uppercase leading-none block">
                        Transliteration
                    </span>
                    <p className="text-[12px] text-slate-550 leading-relaxed italic font-medium">
                        {transliteration}
                    </p>
                </div>
            )}

            {/* 4. Prophetic Commentary Info Alert Block */}
            {info && (
                <div className="bg-[#FAFBF9] border border-[#ECF2EA] rounded-2xl p-4 flex gap-3 text-left">
                    <Info size={16} className="text-[#025a42] shrink-0 mt-0.5" />
                    <p className="text-[11px] sm:text-[12px] text-[#025a42] font-semibold leading-relaxed">
                        {info}
                    </p>
                </div>
            )}

            {/* 5. Translation Box */}
            <div className="space-y-1 pt-0.5">
                {transliteration && (
                    <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase leading-none block">
                        Translation
                    </span>
                )}
                <p className="text-[12px] sm:text-[13px] text-slate-650 leading-relaxed font-sans font-semibold">
                    {translation}
                </p>
            </div>

            {/* 6. Footer Layout containing actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 select-none">

                {/* Play/Recite trigger buttons on Left */}
                <div className="flex items-center gap-3">

                    {/* Main Action Play Circle Button */}
                    <button
                        onClick={handlePlaySound}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-5xs active:scale-95 ${isPlaying
                                ? "bg-rose-500 text-white"
                                : "bg-[#0A6C51] text-white hover:bg-[#085a43]"
                            }`}
                        title={isPlaying ? "Mute audio recitation" : "Listen to Dua"}
                    >
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} className="ml-0.5" fill="currentColor" />}
                    </button>

                    {/* Share button */}
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2.5 bg-white border border-slate-150 text-slate-600 hover:text-slate-900 text-[11px] font-extrabold px-3.5 py-2.5 rounded-full shadow-5xs active:scale-98 transition duration-200"
                        title="Share this Dua"
                    >
                        <Share2 size={13} />
                        <span>Share</span>
                    </button>

                    {/* Reads statistic indicator if not reciting multiple times */}
                    {recitationLimit === 1 && (
                        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 font-bold ml-1">
                            <Eye size={12} />
                            <span>{reads}</span>
                        </div>
                    )}
                </div>

                {/* Counter Badge or Secondary copying triggers */}
                <div className="flex items-center gap-3">
                    {recitationLimit > 1 ? (
                        /* Interactive counting badge matching Image 2 Card 2 */
                        <button
                            onClick={handleRecitedClick}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-black text-xs transition duration-200 shadow-5xs ${activeCount >= recitationLimit
                                    ? "bg-emerald-50 text-[#0a6c51] border border-emerald-150"
                                    : "bg-[#0A6C51] text-white hover:bg-[#075640]"
                                }`}
                        >
                            <span>+1</span>
                            <span className="font-sans font-bold text-[10px] opacity-90">
                                {activeCount} / {recitationLimit}
                            </span>
                            {activeCount >= recitationLimit && <Check size={12} strokeWidth={3} />}
                        </button>
                    ) : (
                        /* Single bookmark save trigger indicator */
                        <button
                            onClick={onToggleFavorite}
                            className={`flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-110 text-slate-600 px-3.5 py-2 rounded-full font-extrabold text-[11px] active:scale-95 transition ${isFavorite ? "text-[#0A6C51]" : ""}`}
                        >
                            <Bookmark size={12} fill={isFavorite ? "currentColor" : "none"} />
                            <span>{isFavorite ? "Saved" : "Save"}</span>
                        </button>
                    )}

                    {/* Fast copy action */}
                    <button
                        onClick={handleCopyText}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-100 rounded-full transition relative shrink-0"
                        title="Copy Dua text"
                    >
                        {copied ? <Check size={14} className="text-emerald-600 font-extrabold" /> : <Copy size={14} />}
                    </button>
                </div>

            </div>
        </div>
    );
}
