import { useQuery } from "@tanstack/react-query";
import { getHadithBooks, getHadithBook, getHadithBookHadiths, getHadith, searchHadith } from "@/src/services/hadith.service";

export function useHadithBooksQuery(enabled = true) {
    return useQuery({
        queryKey: ["hadithBooks"],
        queryFn: getHadithBooks,
        enabled,
    });
}

export function useHadithBookQuery(id: string | number | null) {
    return useQuery({
        queryKey: ["hadithBook", id],
        queryFn: () => getHadithBook(id!),
        enabled: id !== null && id !== undefined,
    });
}

export function useHadithBookHadithsQuery(id: string | number | null) {
    return useQuery({
        queryKey: ["hadithBookHadiths", id],
        queryFn: () => getHadithBookHadiths(id!),
        enabled: id !== null && id !== undefined,
    });
}

export function useHadithQuery(id: string | number | null) {
    return useQuery({
        queryKey: ["hadith", id],
        queryFn: () => getHadith(id!),
        enabled: id !== null && id !== undefined,
    });
}

export function useHadithSearchQuery(query: string) {
    return useQuery({
        queryKey: ["hadithSearch", query],
        queryFn: () => searchHadith(query),
        enabled: query.trim().length > 0,
    });
}
