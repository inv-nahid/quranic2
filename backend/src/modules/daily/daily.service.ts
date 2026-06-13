import { prisma } from "../../config/prisma";

export async function getDailyAyah() {
    const totalAyahs =
        await prisma.quranAyah.count();

    const now = new Date();

    const startOfYear = new Date(
        now.getFullYear(),
        0,
        0
    );

    const diff =
        now.getTime() -
        startOfYear.getTime();

    const dayOfYear = Math.floor(
        diff / (1000 * 60 * 60 * 24)
    );

    const skip =
        dayOfYear % totalAyahs;

    const ayah =
        await prisma.quranAyah.findFirst({
            skip,
            include: {
                surah: true,
            },
            orderBy: [
                {
                    surahId: "asc",
                },
                {
                    number: "asc",
                },
            ],
        });

    if (!ayah) {
        return null;
    }

    return {
        date: now
            .toISOString()
            .split("T")[0],

        surah: {
            id: ayah.surah.id,
            name: ayah.surah.name,
            englishName:
                ayah.surah.englishName,
        },

        ayah: {
            id: ayah.id,
            number: ayah.number,
            text: ayah.text,
        },
    };
}