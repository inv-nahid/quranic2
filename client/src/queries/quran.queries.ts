import { useQuery } from "@tanstack/react-query";
import { getSurahs, getSurah, getSurahAyahs, getAyah, searchQuran } from "@/src/services/quran.service";

export function useSurahsQuery() {
    return useQuery({
        queryKey: ["quranSurahs"],
        queryFn: getSurahs,
    });
}

export function useSurahQuery(id: string | number | null) {
    return useQuery({
        queryKey: ["quranSurah", id],
        queryFn: () => getSurah(id!),
        enabled: id !== null && id !== undefined,
    });
}

export function useSurahAyahsQuery(id: string | number | null) {
    return useQuery({
        queryKey: ["quranSurahAyahs", id],
        queryFn: () => getSurahAyahs(id!),
        enabled: id !== null && id !== undefined,
    });
}

export function useAyahQuery(id: string | number | null) {
    return useQuery({
        queryKey: ["quranAyah", id],
        queryFn: () => getAyah(id!),
        enabled: id !== null && id !== undefined,
    });
}

export function useQuranSearchQuery(query: string) {
    return useQuery({
        queryKey: ["quranSearch", query],
        queryFn: () => searchQuran(query),
        enabled: query.trim().length > 0,
    });
}

export function useArabicSurahQuery(id: string | number | null) {
    return useQuery({
        queryKey: ["quranArabicSurah", id],
        queryFn: async () => {
            if (!id) return null;
            
            // Try Alquran Cloud first
            try {
                const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.data?.ayahs) {
                        return data.data;
                    }
                }
            } catch (err) {
                console.warn("Alquran Cloud failed, attempting CDN fallback...", err);
            }

            // Fallback 1: Fawaz Ahmed CDN (very fast, simple Arabic)
            try {
                const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quransimple/${id}.json`);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.verses) {
                        return {
                            ayahs: data.verses.map((v: any) => ({ text: v.text }))
                        };
                    }
                }
            } catch (err) {
                console.warn("CDN fallback failed, attempting Quran.com...", err);
            }

            // Fallback 2: Quran.com API
            try {
                const res = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.verses) {
                        return {
                            ayahs: data.verses.map((v: any) => ({ text: v.text_uthmani }))
                        };
                    }
                }
            } catch (err) {
                console.error("All Arabic fetch options failed:", err);
            }

            return null;
        },
        enabled: id !== null && id !== undefined,
    });
}
