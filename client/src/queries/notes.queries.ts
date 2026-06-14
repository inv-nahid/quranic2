import { useQuery } from "@tanstack/react-query";
import { getNotes, getAyahNotes } from "@/src/services/notes.service";

export function useNotesQuery(enabled = true) {
    return useQuery({
        queryKey: ["quranNotes"],
        queryFn: getNotes,
        enabled,
    });
}

export function useAyahNotesQuery(ayahId: string | number | null) {
    return useQuery({
        queryKey: ["ayahNotes", ayahId],
        queryFn: () => getAyahNotes(ayahId!),
        enabled: ayahId !== null && ayahId !== undefined,
    });
}
