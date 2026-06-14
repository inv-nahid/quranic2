import { useQuery } from "@tanstack/react-query";
import { getDuaCategories, getDuasByCategory, getDua, searchDua } from "@/src/services/dua.service";

export function useDuaCategoriesQuery(enabled = true) {
    return useQuery({
        queryKey: ["duaCategories"],
        queryFn: getDuaCategories,
        enabled,
    });
}

export function useDuasByCategoryQuery(id: string | number | null) {
    return useQuery({
        queryKey: ["duaList", id],
        queryFn: () => getDuasByCategory(id!),
        enabled: id !== null && id !== undefined,
    });
}

export function useDuaQuery(id: string | number | null) {
    return useQuery({
        queryKey: ["dua", id],
        queryFn: () => getDua(id!),
        enabled: id !== null && id !== undefined,
    });
}

export function useDuaSearchQuery(query: string) {
    return useQuery({
        queryKey: ["duaSearch", query],
        queryFn: () => searchDua(query),
        enabled: query.trim().length > 0,
    });
}
