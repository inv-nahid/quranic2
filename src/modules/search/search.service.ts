import { prisma } from "../../config/prisma";
import { searchQuran } from "../quran/quran.service";
import { searchHadiths } from "../hadith/hadith.service";
import { searchDuas } from "../dua/dua.service";

export async function search(
    query: string
) {
    const [
        quran,
        hadith,
        duas,
    ] = await Promise.all([
        searchQuran(query),
        searchHadiths(query),
        searchDuas(query),
    ]);

    return {
        quran,
        hadith,
        duas,
    };
}