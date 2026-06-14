import { useQuery } from "@tanstack/react-query";
import { getProgress, getStats, getStreak, getHistory } from "@/src/services/progress.service";

export function useProgressQuery() {
    return useQuery({
        queryKey: ["progress"],
        queryFn: getProgress,
    });
}

export function useStatsQuery() {
    return useQuery({
        queryKey: ["progressStats"],
        queryFn: getStats,
    });
}

export function useStreakQuery() {
    return useQuery({
        queryKey: ["progressStreak"],
        queryFn: getStreak,
    });
}

export function useHistoryQuery() {
    return useQuery({
        queryKey: ["progressHistory"],
        queryFn: getHistory,
    });
}
