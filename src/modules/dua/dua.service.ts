import { prisma } from "../../config/prisma";

export async function getCategories() {
    return prisma.duaCategory.findMany({
        orderBy: {
            name: "asc",
        },
    });
}

export async function getDuas(
    page: number,
    limit: number
) {
    const skip = (page - 1) * limit;

    const [total, duas] = await Promise.all([
        prisma.dua.count(),

        prisma.dua.findMany({
            include: {
                category: true,
            },
            orderBy: {
                sourceId: "asc",
            },
            skip,
            take: limit,
        }),
    ]);

    return {
        page,
        limit,
        total,
        items: duas,
    };
}

export async function getCategoryDuas(
    categoryId: string
) {
    return prisma.dua.findMany({
        where: {
            categoryId,
        },
        include: {
            category: true,
        },
        orderBy: {
            sourceId: "asc",
        },
    });
}

export async function getDua(
    duaId: string
) {
    return prisma.dua.findUnique({
        where: {
            id: duaId,
        },
        include: {
            category: true,
        },
    });
}

export async function searchDuas(
    query: string
) {
    return prisma.dua.findMany({
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
                {
                    transliteration: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            ],
        },
        include: {
            category: true,
        },
        take: 50,
    });
}