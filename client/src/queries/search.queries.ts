import { useQuery } from "@tanstack/react-query";
import { unifiedSearch } from "@/src/services/search.service";

export function useUnifiedSearchQuery(query: string, enabled = true) {
    return useQuery({
        queryKey: ["globalSearch", query],
        queryFn: () => unifiedSearch(query),
        enabled: enabled && query.trim().length > 0,
        retry: false,
    });
}
