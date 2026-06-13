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

/**
 * Basic search (MVP)
 * Uses ILIKE for Postgres
 */
export async function searchQuran(query: string) {
  return prisma.quranAyah.findMany({
    where: {
      text: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 50,
  });
}
