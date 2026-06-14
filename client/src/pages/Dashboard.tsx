import React from "react";
import { Flame, BookOpen, Sparkles, User, Search, Star } from "lucide-react";
import { useDashboardQuery, useDailyAyahQuery, useRandomHadithQuery } from "../queries/dashboard.queries";

interface DashboardProps {
    userSession: any;
    setActiveTab: (tab: string) => void;
    onSelectSurah: (id: number) => void;
}

export default function Dashboard({ userSession, setActiveTab, onSelectSurah }: DashboardProps) {
    const { data: dashboardData, isLoading: dashboardLoading } = useDashboardQuery();
    const { data: dailyAyahData, isLoading: dailyAyahLoading } = useDailyAyahQuery();
    const { data: randomHadithData, isLoading: randomHadithLoading } = useRandomHadithQuery();

    const displayName = userSession?.name || userSession?.email?.split("@")[0] || "Reader";
    const currentStreak = dashboardData?.stats?.currentStreak ?? 0;

    const resumeInfo = dashboardData?.resume || {
        surah: { id: 18, name: "الكهف", englishName: "Al-Kahf" },
        ayah: { number: 1, text: "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ" },
        percentage: 0
    };

    const dailyAyah = dailyAyahData?.ayah || {
        text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        number: 5,
        surah: { id: 94, englishName: "Al-Inshirah" }
    };
    
    const dailySurah = dailyAyahData?.surah || {
        id: 94,
        englishName: "Al-Inshirah"
    };

    const randomHadith = randomHadithData || {
        englishText: "The best among you are those who learn the Quran and teach it.",
        book: { name: "Sahih al-Bukhari" }
    };

    const isLoading = dashboardLoading || dailyAyahLoading || randomHadithLoading;

    if (isLoading) {
        return (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A6C51]" />
                <p className="text-xs text-slate-400 font-semibold">Connecting to Quranic servers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-5 animate-fadeIn">
            {/* Greeting / Profile Segment */}
            <div className="flex items-center justify-between gap-2">
                <div className="text-left">
                    <p className="text-xs font-semibold text-[#0A6C51] tracking-wide uppercase">Welcome Back</p>
                    <h2 className="text-2xl font-bold font-sans text-slate-800 mt-0.5">Assalamu Alaikum, {displayName}</h2>
                </div>
                {/* Streak Card */}
                <div className="bg-white border-l-[3px] border-[#E2B832] border-y border-r border-slate-200 rounded-xl px-3 py-2 flex flex-col items-center justify-center shadow-xs">
                    <Flame className="text-[#E2B832] fill-[#E2B832]" size={16} />
                    <span className="text-[10px] font-black text-slate-700 mt-1 uppercase whitespace-nowrap">{currentStreak} Days</span>
                </div>
            </div>

            {/* Continue Reading Metric Box */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-300">
                <div className="flex items-center justify-between mb-3.5">
                    <span className="bg-[#E2F5EC] text-[#0A6C51] text-[11px] font-bold px-3 py-1.5 rounded-full">
                        Continue Reading
                    </span>
                    {/* Ring Progress Marker */}
                    <div className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#0A6C51]">
                        <span className="text-[10px] font-black text-[#0A6C51]">
                            {resumeInfo.percentage ?? 0}%
                        </span>
                    </div>
                </div>

                <div className="mb-4 text-left">
                    <h3 className="text-xl font-extrabold text-slate-900">
                        Surah {resumeInfo.surah?.englishName || "Al-Kahf"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Verse {resumeInfo.ayahNumber || resumeInfo.ayah?.number || 1}
                    </p>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-[#0A6C51] h-full rounded-full transition-all duration-1000"
                        style={{ width: `${resumeInfo.percentage ?? 0}%` }}
                    />
                </div>
            </div>

            {/* Quick Actions grid (Tab selectors) */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setActiveTab("Quran")}
                    className="bg-white border border-slate-100 rounded-xl p-4 flex items-center hover:scale-95 transition text-left cursor-pointer"
                >
                    <div className="bg-emerald-50 text-[#0A6C51] p-2 rounded-lg mr-3">
                        <BookOpen size={20} />
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">Quran</span>
                </button>

                <button
                    onClick={() => setActiveTab("Hadith")}
                    className="bg-white border border-slate-100 rounded-xl p-4 flex items-center hover:scale-95 transition text-left cursor-pointer"
                >
                    <div className="bg-amber-50 text-amber-600 p-2 rounded-lg mr-3 flex items-center justify-center w-9 h-9">
                        <span className="font-bold text-sm">99</span>
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">Hadith</span>
                </button>

                <button
                    onClick={() => setActiveTab("Duas")}
                    className="bg-white border border-slate-100 rounded-xl p-4 flex items-center hover:scale-95 transition text-left cursor-pointer"
                >
                    <div className="bg-red-50 text-red-500 p-2 rounded-lg mr-3">
                        <Sparkles size={20} />
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">Duas</span>
                </button>

                <button
                    onClick={() => setActiveTab("Profile")}
                    className="bg-white border border-slate-100 rounded-xl p-4 flex items-center hover:scale-95 transition text-left cursor-pointer"
                >
                    <div className="bg-slate-100 text-slate-600 p-2 rounded-lg mr-3">
                        <User size={20} />
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">Profile</span>
                </button>
            </div>

            {/* Daily Ayah Section */}
            <div className="space-y-3">
                <h3 className="font-sans font-bold text-slate-800 text-md text-left">Daily Ayah</h3>
                <div className="border border-[#E2B832] rounded-2xl bg-white relative overflow-hidden flex flex-col shadow-xs">

                    {/* Centered Absolute Verse Tag */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-[#E2B832] text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-md uppercase whitespace-nowrap">
                        VERSE OF THE DAY
                    </div>

                    <div className="p-5 pt-8 flex flex-col items-center select-none text-center">
                        <p className="font-serif text-2xl text-slate-900 leading-relaxed mb-4 text-center tracking-wide font-medium">
                            {dailyAyah.text}
                        </p>

                        <p className="text-sm font-sans tracking-tight text-slate-600 italic leading-relaxed mb-4">
                            "{dailyAyah.english || dailyAyah.translation || "Indeed, with hardship [will be] ease."}"
                        </p>

                        <span className="text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full mb-5 inline-block">
                            🔖 Surah {dailySurah.englishName || "Ash-Sharh"}, Verse {dailyAyah.number || 6}
                        </span>

                        <button
                            onClick={() => {
                                if (dailySurah.id) {
                                    onSelectSurah(Number(dailySurah.id));
                                }
                                setActiveTab("Quran");
                            }}
                            className="bg-[#0A6C51] hover:bg-[#075640] text-white font-bold text-sm tracking-wide py-3 px-6 rounded-lg w-full transition cursor-pointer"
                        >
                            Read More
                        </button>
                    </div>
                </div>
            </div>

            {/* Random Hadith block */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-xs flex flex-col relative select-none text-left">
                <span className="text-4xl text-[#0A6C51] font-serif leading-none h-6 mt-1 flex align-top">“</span>
                <p className="text-slate-700 italic text-sm leading-relaxed mb-3">
                    {randomHadith.englishText}
                </p>
                <p className="text-xs font-semibold text-[#0A6C51] text-right self-end mt-1">
                    — {randomHadith.book?.name || "Hadith Book"}
                </p>
            </div>
        </div>
    );
}
