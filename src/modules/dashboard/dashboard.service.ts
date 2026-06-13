import { prisma } from "../../config/prisma";
import { getProgress, getStats } from "../progress/progress.service";

export async function getDashboard(
    userId: string
) {
    const [
        resume,
        stats,
        recentHistory,
    ] = await Promise.all([
        getProgress(userId),

        getStats(userId),

        prisma.readingHistory.findMany({
            where: {
                userId,
            },
            include: {
                ayah: {
                    include: {
                        surah: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        }),
    ]);

    return {
        resume,

        stats,

        recentHistory: recentHistory.map(
            (item) => ({
                readAt: item.createdAt,

                surah: {
                    id: item.ayah.surah.id,
                    name: item.ayah.surah.name,
                    englishName:
                        item.ayah.surah.englishName,
                },

                ayah: {
                    id: item.ayah.id,
                    number: item.ayah.number,
                },
            })
        ),
    };
}