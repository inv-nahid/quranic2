import { prisma } from "../../config/prisma";

export async function getBooks() {
    return prisma.hadithBook.findMany({
        orderBy: {
            sourceId: "asc",
        },
    });
}

export async function getBook(bookId: string) {
    return prisma.hadithBook.findUnique({
        where: {
            id: bookId,
        },
    });
}

export async function getBookHadiths(
    bookId: string,
    page: number,
    limit: number
) {
    const skip = (page - 1) * limit;

    const [total, hadiths] = await Promise.all([
        prisma.hadith.count({
            where: {
                bookId,
            },
        }),

        prisma.hadith.findMany({
            where: {
                bookId,
            },
            orderBy: {
                hadithNumber: "asc",
            },
            skip,
            take: limit,
        }),
    ]);

    return {
        page,
        limit,
        total,
        items: hadiths,
    };
}

export async function getHadith(hadithId: string) {
    return prisma.hadith.findUnique({
        where: {
            id: hadithId,
        },
        include: {
            book: true,
        },
    });
}

export async function searchHadiths(query: string) {
    return prisma.hadith.findMany({
        where: {
            OR: [
                {
                    englishText: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    narrator: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    chapter: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            ],
        },
        include: {
            book: true,
        },
        take: 50,
    });
}