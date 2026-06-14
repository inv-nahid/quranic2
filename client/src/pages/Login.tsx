import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ChevronRight, X, Check, BookOpen } from "lucide-react";
import { login as apiLogin } from "../services/auth.service";
import { saveToken } from "../lib/secure-store";

interface LoginProps {
    onAuthSuccess: (user: any, token: string) => void;
    onGuestLogin: () => void;
    onSwitchToRegister: () => void;
    showResetDialog: () => void;
}

export default function Login({ onAuthSuccess, onGuestLogin, onSwitchToRegister, showResetDialog }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (!email.trim() || !password.trim()) {
            setError("Please fill in both email and password.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await apiLogin({
                email: email.trim(),
                password: password
            });

            if (result && result.token) {
                await saveToken(result.token);
                localStorage.setItem("quranic_session", JSON.stringify(result.user));
                setSuccessMsg("Assalamu Alaikum! Signing you in...");
                
                setTimeout(() => {
                    onAuthSuccess(result.user, result.token);
                }, 1000);
            } else {
                setError("Invalid server response. Please try again.");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || err.message || "Failed to sign in. Please check your credentials.");
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
                        Assalamu Alaikum
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1 text-left">
                        Welcome back. Reconnect with the Divine revelations.
                    </p>
                </div>

                {/* Switcher Tab */}
                <div className="bg-slate-100/90 p-1 rounded-2xl flex w-full space-x-1 select-none font-sans font-bold text-xs shadow-7xs mb-6">
                    <button
                        className="flex-1 py-3 rounded-xl text-center font-bold tracking-wide transition duration-155 bg-white text-[#0A6C51] shadow-md font-extrabold"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={onSwitchToRegister}
                        className="flex-1 py-3 rounded-xl text-center font-bold tracking-wide transition duration-155 text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                        Register
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5 text-xs text-rose-700 font-medium select-none text-left animate-slideUp animate-duration-150">
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

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4 text-left animate-fadeIn">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 block">Email Coordinates</label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3.5 text-slate-400">
                                <Mail size={16} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. ahmad@example.com"
                                className="w-full bg-[#F5F6F4] border border-slate-200/80 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0A6C51] transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-sans">Secure Password</label>
                            <button
                                type="button"
                                onClick={showResetDialog}
                                className="text-[10px] font-bold text-[#0A6C51] hover:underline cursor-pointer"
                            >
                                Forgot?
                            </button>
                        </div>
                        <div className="relative flex items-center">
                            <div className="absolute left-3.5 text-slate-400">
                                <Lock size={16} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#F5F6F4] border border-slate-200/80 rounded-2xl py-3.5 pl-11 pr-11 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#0A6C51] transition"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between pt-1 select-none">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-[#0A6C51] focus:ring-[#0A6C51]"
                            />
                            <span className="text-[11px] font-bold text-slate-500">Remember session state</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0A6C51] hover:bg-[#075640] disabled:opacity-50 text-white font-sans font-extrabold tracking-wider text-xs py-4 rounded-2xl flex items-center justify-center gap-2 transition duration-200 active:scale-95 shadow-md mt-6 cursor-pointer"
                    >
                        {isLoading ? "SIGNING IN..." : "SIGN IN TO ACCOUNT"}
                        <ChevronRight size={14} strokeWidth={3} />
                    </button>
                </form>
            </div>

            <div className="text-[10px] text-slate-400 font-bold font-mono tracking-wider mt-8 text-center select-none uppercase">
                Quranic App Version 2.4.0
            </div>
        </div>
    );
}
