import React, { useState } from "react";
import { User, Mail, BookOpen, Star, LogOut, Check, Edit3, Bookmark, TrendingUp } from "lucide-react";
import { useDashboardQuery } from "../queries/dashboard.queries";

interface ProfileProps {
    userSession: any;
    onLogout: () => void;
    onSwitchToFavorites: () => void;
    onUpdateSessionName: (name: string, bio: string) => void;
}

export default function Profile({ userSession, onLogout, onSwitchToFavorites, onUpdateSessionName }: ProfileProps) {
    const { data: dashboardData } = useDashboardQuery();

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(userSession?.name || "Reader");
    const [editBio, setEditBio] = useState(userSession?.bio || "STUDENT OF KNOWLEDGE");

    const stats = dashboardData?.stats || {
        totalReads: 0,
        uniqueAyahsRead: 0,
        totalAyahs: 6236,
        completionPercentage: 0,
        surahsVisited: 0,
        favoriteCount: 0,
        noteCount: 0,
        currentStreak: 0
    };

    const handleSave = () => {
        onUpdateSessionName(editName, editBio);
        setIsEditing(false);
    };

    const avatarUrl = userSession?.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150";

    return (
        <div className="space-y-5.5 animate-fadeIn text-left">
            {/* User Info Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-5xs relative overflow-hidden flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-600 shrink-0">
                    <img src={avatarUrl} alt="user profile avatar" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                    {isEditing ? (
                        <div className="space-y-2 text-left">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#0A6C51]"
                            />
                            <input
                                type="text"
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#0A6C51]"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="bg-[#0A6C51] text-white px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                    <Check size={10} /> Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-left">
                            <div className="flex items-center gap-1.5">
                                <h3 className="font-sans font-black text-slate-800 text-lg leading-tight truncate">
                                    {userSession?.name || "Ahmad"}
                                </h3>
                                <button
                                    onClick={() => {
                                        setEditName(userSession?.name || "");
                                        setEditBio(userSession?.bio || "STUDENT OF KNOWLEDGE");
                                        setIsEditing(true);
                                    }}
                                    className="text-slate-400 hover:text-[#0A6C51] transition p-1"
                                    title="Edit Profile Details"
                                >
                                    <Edit3 size={13} />
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mt-1 select-none">
                                {userSession?.bio || "STUDENT OF KNOWLEDGE"}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mt-3">
                                <Mail size={12} className="text-slate-400" />
                                <span className="truncate">{userSession?.email || "ahmad@example.com"}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reading analytics summary */}
            <div className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest block pl-1 select-none">
                    Reading Analytics
                </h4>

                <div className="grid grid-cols-2 gap-4">
                    {/* Stat Items */}
                    {[
                        { title: "Current Streak", val: `${stats.currentStreak || 0} Days`, color: "border-l-amber-500", desc: "Consecutive days read" },
                        { title: "Total Chapters", val: `${stats.surahsVisited || 0} Surahs`, color: "border-l-emerald-600", desc: "Unique chapters opened" },
                        { title: "Verses Completed", val: `${stats.uniqueAyahsRead || 0} Ayahs`, color: "border-l-sky-500", desc: "Unique Quran verses read" },
                        { title: "Saved Bookmarks", val: `${stats.favoriteCount || 0} Favorites`, color: "border-l-[#C5221F]", desc: "Ayahs, Hadiths, and Duas" }
                    ].map((st, i) => (
                        <div key={i} className={`bg-white border border-slate-100 border-l-[4px] ${st.color} rounded-2xl p-4.5 shadow-5xs text-left`}>
                            <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-wider select-none">{st.title}</span>
                            <span className="text-xl font-black text-slate-800 mt-1 block tracking-tight leading-none">{st.val}</span>
                            <span className="text-[9px] text-slate-400 font-medium block mt-1.5 select-none">{st.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Completion metrics indicator card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-5xs space-y-4">
                <div className="flex justify-between items-center select-none">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-[#0A6C51]" />
                        <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Completion Progress</span>
                    </div>
                    <span className="text-[11px] font-black text-[#0A6C51] bg-[#E2F5EC] px-2.5 py-1 rounded-full">{stats.completionPercentage || 0}% Completed</span>
                </div>

                <div className="space-y-1.5 text-left select-none">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#0A6C51] h-full rounded-full w-[1%]" style={{ width: `${stats.completionPercentage || 0}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-extrabold uppercase tracking-widest pt-1 px-0.5">
                        <span>{stats.uniqueAyahsRead || 0} Read</span>
                        <span>{stats.totalAyahs || 6236} Total Ayahs</span>
                    </div>
                </div>
            </div>

            {/* Quick Navigation Settings */}
            <div className="space-y-2 select-none">
                <button
                    onClick={onSwitchToFavorites}
                    className="w-full flex items-center justify-between bg-white border border-slate-50 hover:border-slate-200 rounded-2xl p-4 shadow-5xs transition text-xs font-semibold text-slate-700 cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <Bookmark size={15} className="text-slate-450" />
                        <span>Manage Saved Bookmarks</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#0A6C51] bg-[#E2F5EC] px-2 py-0.5 rounded">View List</span>
                </button>
            </div>

            {/* Logout button */}
            <div className="pt-2 select-none pb-20">
                <button
                    onClick={onLogout}
                    className="w-full bg-slate-100 hover:bg-rose-50 border border-slate-200/50 hover:border-rose-100 hover:text-rose-600 text-slate-600 font-sans font-extrabold tracking-wider text-xs py-4 rounded-2xl flex items-center justify-center gap-2 transition duration-200 active:scale-95 shadow-5xs cursor-pointer"
                >
                    <LogOut size={14} />
                    SIGN OUT OF QURANIC
                </button>
            </div>
        </div>
    );
}
