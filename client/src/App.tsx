import React, { useState, useEffect, useMemo } from "react";
import { Menu, Search, BookOpen, Sparkles, Bookmark, User, Flame, X } from "lucide-react";
import { useFavoritesQuery } from "./queries/favorites.queries";
import { useNotesQuery } from "./queries/notes.queries";
import { addFavorite, deleteFavorite } from "./services/favorites.service";
import { addNote, editNote, deleteNote } from "./services/notes.service";

// Modular Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quran from "./pages/Quran";
import Hadith from "./pages/Hadith";
import Duas from "./pages/Duas";
import Reflect from "./pages/Reflect";
import Favorites from "./pages/Favorites";
import SearchPage from "./pages/Search";
import Profile from "./pages/Profile";

export default function App() {
    const [activeTab, setActiveTab] = useState("Quran"); // Default to Quran
    const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
    const [showSplash, setShowSplash] = useState<boolean>(true);
    const [authFormTab, setAuthFormTab] = useState<"login" | "register">("login");
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [resetEmailInput, setResetEmailInput] = useState("");

    // Authentication states backed by localStorage session
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem("quranic_session") !== null;
    });
    const [userSession, setUserSession] = useState<any>(() => {
        try {
            const saved = localStorage.getItem("quranic_session");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // React Queries for synchronized user data
    const { data: favoritesData, refetch: refetchFavorites } = useFavoritesQuery(isAuthenticated);
    const { data: notesData, refetch: refetchNotes } = useNotesQuery(isAuthenticated);

    const favoritesList = useMemo(() => favoritesData || [], [favoritesData]);
    const notesList = useMemo(() => notesData || [], [notesData]);

    // Splash countdown
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Favorites handlers
    const handleToggleFavorite = async (refId: string, type: "QURAN" | "HADITH" | "DUA") => {
        try {
            const existingFav = favoritesList.find(
                (f: any) => f.refId === refId && (f.type === type || (!f.type && type === "QURAN"))
            );
            if (existingFav) {
                await deleteFavorite(existingFav.id);
            } else {
                await addFavorite(type, refId);
            }
            refetchFavorites();
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    };

    // Notes handlers
    const handleSaveNote = async (ayahId: string, text: string) => {
        try {
            const existingNote = notesList.find((n: any) => n.ayahId === ayahId);
            if (existingNote) {
                await editNote(existingNote.id, { text });
            } else {
                await addNote({
                    surahId: selectedSurahId || undefined,
                    ayahId,
                    text
                });
            }
            refetchNotes();
        } catch (err) {
            console.error("Error saving note:", err);
        }
    };

    const handleDeleteNote = async (ayahId: string) => {
        try {
            const existingNote = notesList.find((n: any) => n.ayahId === ayahId);
            if (existingNote) {
                await deleteNote(existingNote.id);
                refetchNotes();
            }
        } catch (err) {
            console.error("Error deleting note:", err);
        }
    };

    const handleAuthSuccess = (user: any, token: string) => {
        setUserSession(user);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("quranic_session");
        localStorage.removeItem("jwt_token");
        setUserSession(null);
        setIsAuthenticated(false);
        setActiveTab("Quran");
        setSelectedSurahId(null);
    };

    const handleGuestLogin = () => {
        const guestUser = {
            email: "guest@example.com",
            name: "Guest Explorer",
            bio: "STUDENT OF KNOWLEDGE",
            avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150"
        };
        localStorage.setItem("quranic_session", JSON.stringify(guestUser));
        setUserSession(guestUser);
        setIsAuthenticated(true);
    };

    const handleResetPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Reset link sent successfully to: ${resetEmailInput}.`);
        setShowResetDialog(false);
        setResetEmailInput("");
    };

    const handleUpdateProfile = (name: string, bio: string) => {
        const updated = { ...userSession, name, bio };
        localStorage.setItem("quranic_session", JSON.stringify(updated));
        setUserSession(updated);
    };

    const handleRemoveFavoriteLocal = (rawId: string | number) => {
        // Optimistic delete helper
        refetchFavorites();
    };

    // Render active tab body
    const renderActivePage = () => {
        switch (activeTab) {
            case "Home":
                return (
                    <Dashboard
                        userSession={userSession}
                        setActiveTab={setActiveTab}
                        onSelectSurah={setSelectedSurahId}
                    />
                );
            case "Quran":
                return (
                    <Quran
                        selectedSurahId={selectedSurahId}
                        setSelectedSurahId={setSelectedSurahId}
                        setActiveTab={setActiveTab}
                        favoritesList={favoritesList}
                        onToggleFavorite={handleToggleFavorite}
                        notesList={notesList}
                        onSaveNote={handleSaveNote}
                        onDeleteNote={handleDeleteNote}
                    />
                );
            case "Hadith":
                return (
                    <Hadith
                        favoritesList={favoritesList}
                        onToggleFavorite={handleToggleFavorite}
                    />
                );
            case "Duas":
                return (
                    <Duas
                        favoritesList={favoritesList}
                        onToggleFavorite={handleToggleFavorite}
                    />
                );
            case "Reflect":
                return (
                    <Reflect
                        favoritesList={favoritesList}
                        onToggleFavorite={handleToggleFavorite}
                    />
                );
            case "Favorites":
                return (
                    <Favorites
                        favoritesList={favoritesList}
                        onSelectSurah={setSelectedSurahId}
                        setActiveTab={setActiveTab}
                        onRemoveFavorite={handleRemoveFavoriteLocal}
                    />
                );
            case "Search":
                return (
                    <SearchPage
                        onSelectSurah={setSelectedSurahId}
                        setActiveTab={setActiveTab}
                    />
                );
            case "Profile":
                return (
                    <Profile
                        userSession={userSession}
                        onLogout={handleLogout}
                        onSwitchToFavorites={() => setActiveTab("Favorites")}
                        onUpdateSessionName={handleUpdateProfile}
                    />
                );
            default:
                return <Quran selectedSurahId={selectedSurahId} setSelectedSurahId={setSelectedSurahId} setActiveTab={setActiveTab} favoritesList={favoritesList} onToggleFavorite={handleToggleFavorite} notesList={notesList} onSaveNote={handleSaveNote} onDeleteNote={handleDeleteNote} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 md:p-8">
            {/* Smartphone Device Frame Mockup */}
            <div className="w-full max-w-[420px] h-full sm:h-[880px] bg-[#F9FAF9] border-0 sm:border-8 sm:border-slate-800 rounded-none sm:rounded-[36px] overflow-hidden flex flex-col shadow-2xl relative">

                {/* Device Top Speaker Notch */}
                <div className="hidden sm:flex absolute top-0 left-1/2 transform -translate-x-1/2 h-5 w-32 bg-slate-800 rounded-b-xl z-55 justify-center items-center">
                    <div className="h-1 w-12 bg-slate-700 rounded-full" />
                </div>

                {showSplash ? (
                    /* SPLASH SCREEN */
                    <div className="flex-1 flex flex-col justify-between items-center bg-[#063e31] p-8 text-white relative select-none animate-fadeIn overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,184,50,0.12)_0%,transparent_70%)] pointer-events-none" />
                        <div className="absolute top-0 opacity-10 font-serif text-[180px] leading-none text-[#E2B832] select-none pointer-events-none transform -translate-y-12">
                            ﷽
                        </div>

                        <div className="w-full flex justify-between items-center pt-8 border-b border-white/10 pb-4 z-10">
                            <span className="text-[10px] font-mono tracking-widest text-[#E2B832]/80 font-semibold">QURANIC APP</span>
                            <span className="text-[9px] font-mono tracking-widest text-[#E2B832]/60 uppercase font-bold">AL-MUSTAFA</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center text-center z-10 px-4">
                            <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,rgba(226,184,50,0.25)_0%,transparent_70%)] mb-8">
                                <div className="absolute inset-0 border-2 border-amber-300/40 rounded-full scale-95" style={{ transform: 'rotate(45deg)' }} />
                                <div className="w-20 h-20 bg-gradient-to-br from-[#0A6C51] to-[#044c3c] rounded-full border-2 border-[#E2B832] flex items-center justify-center shadow-lg transform transition duration-300 hover:scale-110">
                                    <BookOpen size={36} className="text-[#E2B832] drop-shadow-md" strokeWidth={1.8} />
                                </div>
                            </div>

                            <h1 className="font-sans text-4xl font-extrabold tracking-widest text-white drop-shadow-md">
                                Quranic
                            </h1>
                            <div className="h-0.5 w-16 bg-[#E2B832] my-4 rounded-full" />
                            <p className="font-serif italic text-base text-amber-100/90 leading-relaxed max-w-[280px]">
                                "Recite, Reflect, & Connect"
                            </p>
                        </div>

                        <div className="w-full space-y-6 pb-6 z-10 flex flex-col items-center">
                            <button
                                onClick={() => setShowSplash(false)}
                                className="w-full bg-[#E2B832] hover:bg-[#F2C944] text-[#063e31] font-sans font-extrabold tracking-wider text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2.5 transition duration-200 active:scale-95 shadow-md cursor-pointer select-none"
                            >
                                GET STARTED
                            </button>
                        </div>
                    </div>
                ) : !isAuthenticated ? (
                    /* AUTHENTICATION VIEW */
                    <>
                        {authFormTab === "login" ? (
                            <Login
                                onAuthSuccess={handleAuthSuccess}
                                onGuestLogin={handleGuestLogin}
                                onSwitchToRegister={() => setAuthFormTab("register")}
                                showResetDialog={() => setShowResetDialog(true)}
                            />
                        ) : (
                            <Register
                                onAuthSuccess={handleAuthSuccess}
                                onGuestLogin={handleGuestLogin}
                                onSwitchToLogin={() => setAuthFormTab("login")}
                            />
                        )}

                        {/* Reset password dialog modal */}
                        {showResetDialog && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-5 z-55">
                                <div className="bg-white rounded-[24px] p-6 w-full max-w-[320px] shadow-2xl relative text-slate-800 animate-slideUp">
                                    <button
                                        onClick={() => setShowResetDialog(false)}
                                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 transition p-1 rounded-full bg-slate-50 cursor-pointer"
                                    >
                                        <X size={16} />
                                    </button>

                                    <div className="text-center mb-5 select-none">
                                        <div className="bg-amber-50 text-amber-600 p-3.5 rounded-full inline-flex items-center justify-center mb-3 border border-amber-100">
                                            <Sparkles size={20} />
                                        </div>
                                        <span className="text-xs font-black font-sans uppercase tracking-wider text-slate-800 block">Password Restoration</span>
                                        <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 font-medium">
                                            Input your registered coordinates to trigger reset guidelines.
                                        </p>
                                    </div>

                                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                                        <input
                                            type="email"
                                            value={resetEmailInput}
                                            onChange={(e) => setResetEmailInput(e.target.value)}
                                            placeholder="Enter registered email"
                                            className="w-full bg-[#F5F6F4] border border-slate-200 rounded-2xl py-3 px-4 text-xs font-semibold focus:outline-none focus:border-[#0A6C51]"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="w-full bg-[#0A6C51] text-white font-sans font-black text-[10px] tracking-widest py-3.5 rounded-xl transition duration-150 uppercase cursor-pointer"
                                        >
                                            Trigger Restoration Link
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* MAIN APPLICATION SCREEN */
                    <>
                        <div className="flex-1 overflow-y-auto pb-20 pt-4 sm:pt-6 bg-[#F9FAF9] relative selection:bg-emerald-100">
                            {/* Sticky Header Action Row */}
                            <header className="sticky top-0 bg-[#F9FAF9] px-5 py-4 flex items-center justify-between z-35 select-none">
                                <button
                                    onClick={() => setActiveTab("Home")}
                                    className="text-emerald-950 hover:text-emerald-800 transition"
                                    title="Menu/Home"
                                >
                                    <Menu size={22} className="text-[#0A6C51]" />
                                </button>
                                <h1 className="font-sans text-2xl font-bold tracking-tight text-[#044c3c] text-center">
                                    Quranic
                                </h1>
                                <button
                                    onClick={() => {
                                        setSelectedSurahId(null);
                                        setActiveTab("Search");
                                    }}
                                    className="text-[#0A6C51] hover:text-[#075640] transition p-1.5 focus:outline-none cursor-pointer"
                                    title="Search"
                                >
                                    <Search size={22} strokeWidth={2.2} />
                                </button>
                            </header>

                            <main className="px-5 py-3 space-y-5">
                                {renderActivePage()}
                            </main>
                        </div>

                        {/* Bottom Tab Navigation Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex justify-around items-center z-40 px-2 select-none shadow-sm">
                            {[
                                { id: "Home", icon: Flame, label: "Home" },
                                { id: "Quran", icon: BookOpen, label: "Quran" },
                                { id: "Hadith", icon: Sparkles, label: "Hadith" },
                                { id: "Duas", icon: Bookmark, label: "Duas" },
                                { id: "Profile", icon: User, label: "Profile" }
                            ].map((tab) => {
                                const isSelected = activeTab === tab.id;
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            if (tab.id !== "Quran") {
                                                setSelectedSurahId(null);
                                            }
                                            setActiveTab(tab.id);
                                        }}
                                        className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
                                            isSelected ? "text-[#0A6C51] font-boldScale" : "text-slate-400 hover:text-slate-600"
                                        }`}
                                    >
                                        <Icon size={20} className={isSelected ? "stroke-[2.5px]" : "stroke-[1.8px]"} />
                                        <span className="text-[9px] font-sans font-extrabold uppercase tracking-wider">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
