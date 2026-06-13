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
): Promise<any[]> {
    return prisma.$queryRaw<any[]>`
    SELECT
      d.*,
      dc.name AS "categoryName",

      ts_rank(
        to_tsvector(
          'english',
          coalesce(d.title,'') || ' ' ||
          coalesce(d."englishText",'') || ' ' ||
          coalesce(d.transliteration,'')
        ),
        plainto_tsquery('english', ${query})
      ) AS rank

    FROM "Dua" d

    JOIN "DuaCategory" dc
      ON dc.id = d."categoryId"

    WHERE
      to_tsvector(
        'english',
        coalesce(d.title,'') || ' ' ||
        coalesce(d."englishText",'') || ' ' ||
        coalesce(d.transliteration,'')
      )
      @@
      plainto_tsquery('english', ${query})

    ORDER BY rank DESC

    LIMIT 50
  `;
}