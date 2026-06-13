import { prisma } from "../../config/prisma";

export async function getAllSurahs() {
  return prisma.quranSurah.findMany({
    orderBy: { id: "asc" },
  });
}

export async function getSurahById(id: number) {
  return prisma.quranSurah.findUnique({
    where: { id },
  });
}

export async function getAyahsBySurahId(surahId: number) {
  return prisma.quranAyah.findMany({
    where: { surahId },
    orderBy: { number: "asc" },
  });
}

export async function getAyahById(id: string) {
  return prisma.quranAyah.findUnique({
    where: { id },
  });
}

export async function searchQuran(
  query: string
): Promise<any[]> {
  return prisma.$queryRaw<any[]>`
    SELECT
      qa.id,
      qa.number,
      qa.text,
      qa."surahId",
      qs.name,
      qs."englishName",

      ts_rank(
        to_tsvector('simple', qa.text),
        plainto_tsquery('simple', ${query})
      ) AS rank

    FROM "QuranAyah" qa

    JOIN "QuranSurah" qs
      ON qs.id = qa."surahId"

    WHERE
      to_tsvector('simple', qa.text)
      @@
      plainto_tsquery('simple', ${query})

    ORDER BY rank DESC

    LIMIT 50
  `;
}