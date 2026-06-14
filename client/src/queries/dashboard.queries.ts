import { useQuery } from "@tanstack/react-query";
import { getDashboard, getDailyAyah, getRandomHadith } from "@/src/services/dashboard.service";

export function useDashboardQuery() {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboard,
    });
}

export function useDailyAyahQuery() {
    return useQuery({
        queryKey: ["dailyAyah"],
        queryFn: getDailyAyah,
    });
}

export function useRandomHadithQuery() {
    return useQuery({
        queryKey: ["randomHadith"],
        queryFn: getRandomHadith,
    });
}
