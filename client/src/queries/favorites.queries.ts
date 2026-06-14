import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "@/src/services/favorites.service";

export function useFavoritesQuery(enabled = true) {
    return useQuery({
        queryKey: ["quranFavorites"],
        queryFn: getFavorites,
        enabled,
    });
}
