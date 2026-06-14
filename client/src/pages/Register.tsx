import React, { useState } from "react";
import { User, Mail, Lock, ChevronRight, X, Check, BookOpen } from "lucide-react";
import { register as apiRegister } from "../services/auth.service";
import { saveToken } from "../lib/secure-store";

interface RegisterProps {
    onAuthSuccess: (user: any, token: string) => void;
    onGuestLogin: () => void;
    onSwitchToLogin: () => void;
}

export default function Register({ onAuthSuccess, onGuestLogin, onSwitchToLogin }: RegisterProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    
    // Preset high fidelity avatars
    const presetAvatars = [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150",
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150"
    ];
    const [selectedAvatar, setSelectedAvatar] = useState(presetAvatars[1]);
    
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("Please fill in all registration fields.");
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!agreed) {
            setError("You must agree to the spiritual and ethics settings.");
            return;
        }

        setIsLoading(true);
        try {
            // Backend registration
            const result = await apiRegister({
                email: email.trim(),
                password: password
            });

            if (result && result.token) {
                // Save token and extend user model with local profile choices
                const registeredUser = {
                    ...result.user,
                    name: name.trim(),
                    bio: "STUDENT OF KNOWLEDGE",
                    avatarUrl: selectedAvatar
                };
                
                await saveToken(result.token);
                localStorage.setItem("quranic_session", JSON.stringify(registeredUser));
                setSuccessMsg("Account registered successfully! Redirecting...");
                
                setTimeout(() => {
                    onAuthSuccess(registeredUser, result.token);
                }, 1200);
            } else {
                setError("Registration succeeded but auth token was missing. Please try signing in.");
            }
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.response?.data?.message || err.message || "Could not register account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col justify-between bg-[#FDFEFC] p-6 relative overflow-y-auto selection:bg-emerald-100 animate-fadeIn text-slate-800">
            {/* Top decorative curve in background */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-emerald-50/70 to-transparent pointer-events-none" />

            <div className="z-10 mt-2">
                {/* Header */}
                <div className="flex items-center justify-between select-none mb-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#0A6C51] text-white p-1.5 rounded-xl">
                            <BookOpen size={16} />
                        </div>
                        <span className="font-sans font-extrabold text-[#044c3c] tracking-tight text-lg">Quranic</span>
                    </div>
                    <button
                        onClick={onGuestLogin}
                        className="text-[11px] font-sans font-bold bg-[#E2F5EC] text-[#0A6C51] border border-emerald-100 px-3 py-1.5 rounded-full hover:bg-emerald-100/70 transition active:scale-95 cursor-pointer"
                    >
                        Continue as Guest
                    </button>
                </div>

                {/* Title */}
                <div className="mb-6 select-none">
                    <h2 className="text-2xl font-black font-sans text-slate-900 tracking-tight text-left">
                        Join Quranic
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1 text-left">
                        Create an account to track stats, bookmarks & reflective streaks.
                    </p>
                </div>

                {/* Switcher Tab */}
                <div className="bg-slate-100/90 p-1 rounded-2xl flex w-full space-x-1 select-none font-sans font-bold text-xs shadow-7xs mb-6">
                    <button
                        onClick={onSwitchToLogin}
                        className="flex-1 py-3 rounded-xl text-center font-bold tracking-wide transition duration-155 text-slate-505 hover:text-slate-800 cursor-pointer"
                    >
                        Sign In
                    </button>
                    <button
                        className="flex-1 py-3 rounded-xl text-center font-bold tracking-wide transition duration-155 bg-white text-[#0A6C51] shadow-md font-extrabold"
                    >
                        Register
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5 text-xs text-rose-700 font-medium select-none text-left animate-slideUp">
                        <div className="bg-rose-100 text-rose-700 p-1.5 rounded-lg mt-0.5">
                            <X size={12} strokeWidth={3} />
                        </div>
                        <div>
                            <span className="font-extrabold uppercase text-[10px] tracking-wide block mb-0.5">Authentication Issue</span>
                            <p className="leading-normal">{error}</p>
                        </div>
                    </div>
                )}

                {successMsg && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5 text-xs text-emerald-800 font-medium select-none text-left animate-slideUp">
                        <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg mt-0.5">
                            <Check size={12} strokeWidth={3} />
                        </div>
                        <div>
                            <span className="font-extrabold uppercase text-[10px] tracking-wide block mb-0.5">Successful Action</span>
                            <p className="leading-normal">{successMsg}</p>
                        </div>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-left animate-fadeIn">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">Your Name</label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3.5 text-slate-400">
                                <User size={16} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Ahmad Ibn Abbas"
                                className="w-full bg-[#F5F6F4] border border-slate-200/80 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0A6C51] transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">Email Address</label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3.5 text-slate-400">
                                <Mail size={16} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. name@domain.com"
                                className="w-full bg-[#F5F6F4] border border-slate-200/80 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0A6C51] transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">Password</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 text-slate-400 text-xs">
                                    <Lock size={14} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="6+ chars"
                                    className="w-full bg-[#F5F6F4] border border-slate-200/80 rounded-2xl py-3.5 pl-9 pr-2 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0A6C51] transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">Verify Code</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 text-slate-400 text-xs">
                                    <Lock size={14} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-type"
                                    className="w-full bg-[#F5F6F4] border border-slate-200/80 rounded-2xl py-3.5 pl-10 pr-2 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0A6C51] transition"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end -mt-1">
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[9px] font-bold text-[#0A6C51]/80 hover:text-[#0A6C51] cursor-pointer"
                        >
                            {showPassword ? "Hide password strings" : "Reveal input keys"}
                        </button>
                    </div>

                    {/* Choose an Avatar Selection Grid */}
                    <div className="space-y-1.5 pt-1 select-none">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">Select Profile Avatar</label>
                        <div className="flex items-center gap-4 justify-between bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
                            {presetAvatars.map((url, i) => {
                                const isSelected = selectedAvatar === url;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setSelectedAvatar(url)}
                                        className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition active:scale-90 ${isSelected ? "border-[#004D40] scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={url} alt="preset avatar choice" className="w-full h-full object-cover" />
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-[#0A6C51]/20 flex items-center justify-center">
                                                <div className="bg-[#004D40] text-white p-0.5 rounded-full">
                                                    <Check size={8} strokeWidth={5} />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Agree checkbox */}
                    <label className="flex items-start gap-2.5 pt-2 select-none cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-[#0A6C51] focus:ring-[#0A6C51] mt-0.5"
                            required
                        />
                        <span className="text-[10px] font-bold text-slate-500 leading-normal">
                            Accept Quranic's core spiritual terms, ethics, and offline database mirroring settings.
                        </span>
                    </label>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0A6C51] hover:bg-[#075640] disabled:opacity-50 text-white font-sans font-extrabold tracking-wider text-xs py-4 rounded-2xl flex items-center justify-center gap-2 transition duration-200 active:scale-95 shadow-md mt-6 cursor-pointer"
                    >
                        {isLoading ? "CREATING..." : "CREATE MY ACCOUNT"}
                        <ChevronRight size={14} strokeWidth={3} />
                    </button>
                </form>
            </div>
        </div>
    );
}
