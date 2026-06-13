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

export async function searchHadiths(
    query: string
): Promise<any[]> {
    return prisma.$queryRaw<any[]>`
    SELECT
      h.*,
      hb.name AS "bookName",
      hb.slug,

      ts_rank(
        to_tsvector(
          'english',
          coalesce(h."englishText",'') || ' ' ||
          coalesce(h.narrator,'') || ' ' ||
          coalesce(h.chapter,'')
        ),
        plainto_tsquery('english', ${query})
      ) AS rank

    FROM "Hadith" h

    JOIN "HadithBook" hb
      ON hb.id = h."bookId"

    WHERE
      to_tsvector(
        'english',
        coalesce(h."englishText",'') || ' ' ||
        coalesce(h.narrator,'') || ' ' ||
        coalesce(h.chapter,'')
      )
      @@
      plainto_tsquery('english', ${query})

    ORDER BY rank DESC

    LIMIT 50
  `;
}

export async function getRandomHadith() {
    const total =
        await prisma.hadith.count();

    const skip = Math.floor(
        Math.random() * total
    );

    return prisma.hadith.findFirst({
        skip,
        include: {
            book: true,
        },
    });
}