import React from "react";
import {
    Sun,
    Moon,
    Shield,
    Plane,
    Sparkles,
    CloudRain,
    Bed,
    Compass,
    ChevronRight
} from "lucide-react";

interface DuaCategoryCardProps {
    key?: React.Key;
    id: string;
    name: string;
    count: number;
    iconType: "sun" | "moon" | "shield" | "airplane" | "prayer" | "hardship" | "sleep";
    layout: "horizontal" | "vertical";
    colorBg?: string;
    iconBg?: string;
    iconColor?: string;
    onClick: () => void;
}

export function DuaCategoryCard({
    id,
    name,
    count,
    iconType,
    layout,
    colorBg = "bg-white border-slate-100",
    iconBg = "bg-[#E2F5EC]",
    iconColor = "text-[#0A6C51]",
    onClick
}: DuaCategoryCardProps) {

    // Choose the right icon
    const getIcon = () => {
        const size = 22;
        switch (iconType) {
            case "sun":
                return <Sun size={size} className={iconColor} />;
            case "moon":
                return <Moon size={size} className={iconColor} />;
            case "shield":
                return <Shield size={size} className={iconColor} />;
            case "airplane":
                return <Plane size={size} className={iconColor} />;
            case "prayer":
                return <Compass size={size} className={iconColor} />; // Compass is standard in Quranic navigation
            case "hardship":
                return <CloudRain size={size} className={iconColor} />;
            case "sleep":
                return <Bed size={size} className={iconColor} />;
            default:
                return <Sparkles size={size} className={iconColor} />;
        }
    };

    if (layout === "horizontal") {
        // Beautiful wide banner style card mimicking Morning/Travel/Sleep
        return (
            <div
                id={`dua-cat-horizontal-${id}`}
                onClick={onClick}
                className={`cursor-pointer group flex items-center justify-between p-5 rounded-[24px] border border-transparent shadow-3xs transition-all duration-300 hover:scale-[0.99] active:scale-95 ${colorBg}`}
            >
                <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-[#00392F] tracking-tight group-hover:opacity-80 transition-opacity">
                        {name}
                    </h3>
                    <p className="text-[12px] font-bold text-slate-400">
                        {count} Supplications
                    </p>
                </div>

                {/* Circular icon shell on the right with shadow-sm and hover scaling */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 ${iconBg || "bg-white"}`}>
                    {getIcon()}
                </div>
            </div>
        );
    }

    // Vertical card layout for symmetric two-column grid items (Evening, Protection, Prayer, Hardship)
    return (
        <div
            id={`dua-cat-vertical-${id}`}
            onClick={onClick}
            className={`cursor-pointer group flex flex-col justify-between p-5 rounded-[24px] border border-slate-100 shadow-5xs bg-white h-[142px] transition-all duration-300 hover:border-emerald-100 hover:shadow-4xs active:scale-95`}
        >
            {/* Icon frame at correct proportion */}
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-5xs transition-transform duration-300 group-hover:scale-105 ${iconBg}`}>
                {getIcon()}
            </div>

            <div className="mt-4">
                <h3 className="text-[15px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-[#0A6C51] transition-colors">
                    {name}
                </h3>
                <p className="text-[10px] font-extrabold text-slate-400 mt-0.5 uppercase tracking-wider">
                    {count} Supplications
                </p>
            </div>
        </div>
    );
}
