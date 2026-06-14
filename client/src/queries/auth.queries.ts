import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/src/services/auth.service";

export function useMeQuery() {
    return useQuery({
        queryKey: ["me"],
        queryFn: getMe,
    });
}