import { prisma } from "../../config/prisma";

export async function search(query: string) {
    const [quran, hadith, duas] =
        await Promise.all([
            prisma.quranAyah.findMany({
                where: {
                    text: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                include: {
                    surah: true,
                },
                take: 20,
            }),

            prisma.hadith.findMany({
                where: {
                    englishText: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                include: {
                    book: true,
                },
                take: 20,
            }),

            prisma.dua.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                        {
                            englishText: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
                include: {
                    category: true,
                },
                take: 20,
            }),
        ]);

    return {
        quran,
        hadith,
        duas,
    };
}