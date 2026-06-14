import { FavoriteType } from "@prisma/client";
import { prisma } from "../../config/prisma";

export async function addFavorite(
    userId: string,
    type: FavoriteType,
    refId: string
) {
    return prisma.favorite.create({
        data: {
            userId,
            type,
            refId,
        },
    });
}

export async function getFavorites(userId: string) {
    const favorites = await prisma.favorite.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        },
    });

    const quranIds = favorites
        .filter((f) => f.type === "QURAN")
        .map((f) => f.refId);

    const quranAyahs = await prisma.quranAyah.findMany({
        where: {
            id: {
                in: quranIds,
            },
        },
        include: {
            surah: true,
        },
    });

    const ayahMap = new Map(
        quranAyahs.map((ayah) => [ayah.id, ayah])
    );

    return favorites.map((favorite) => {
        if (favorite.type === "QURAN") {
            const ayah = ayahMap.get(favorite.refId);

            return {
                id: favorite.id,
                type: favorite.type,
                refId: favorite.refId,
                createdAt: favorite.createdAt,
                data: ayah
                    ? {
                        surah: {
                            id: ayah.surah.id,
                            name: ayah.surah.name,
                            englishName: ayah.surah.englishName,
                        },
                        ayah: {
                            id: ayah.id,
                            number: ayah.number,
                            text: ayah.text,
                        },
                    }
                    : null,
            };
        }

        return {
            id: favorite.id,
            type: favorite.type,
            refId: favorite.refId,
            createdAt: favorite.createdAt,
            data: null,
        };
    });
}

export async function removeFavorite(
    favoriteId: string,
    userId: string
) {
    const favorite = await prisma.favorite.findFirst({
        where: {
            id: favoriteId,
            userId,
        },
    });

    if (!favorite) {
        return false;
    }

    await prisma.favorite.delete({
        where: {
            id: favoriteId,
        },
    });

    return true;
}