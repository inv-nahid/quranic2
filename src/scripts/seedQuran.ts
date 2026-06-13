declare const process: any;
import axios from "axios";
import { prisma } from "../config/prisma";

const BASE_URL = "https://api.alquran.cloud/v1";

/**
 * API structure:
 * surahs -> array of 114
 * each surah has ayahs[]
 */

type ApiSurah = {
  number: number;
  name: string;
  englishName: string;
  ayahs: {
    number: number;
    text: string;
  }[];
};

async function fetchQuran() {
  const res = await axios.get(`${BASE_URL}/quran/en.asad`);
  return res.data.data.surahs as ApiSurah[];
}

/**
 * SAFETY: wipe existing data (dev only)
 */
async function clearExistingData() {
  await prisma.quranAyah.deleteMany();
  await prisma.quranSurah.deleteMany();
}

/**
 * Seed Surahs
 */
async function seedSurahs(surahs: ApiSurah[]) {
  for (const s of surahs) {
    await prisma.quranSurah.create({
      data: {
        id: s.number,
        name: s.name,
        englishName: s.englishName,
      },
    });
  }
}

/**
 * Seed Ayahs
 * IMPORTANT: we use surahId + incremental number
 */
async function seedAyahs(surahs: ApiSurah[]) {
  const allAyahs: {
    surahId: number;
    number: number;
    text: string;
    juz: number;
  }[] = [];

  for (const surah of surahs) {
    let ayahIndex = 1;

    for (const ayah of surah.ayahs) {
      allAyahs.push({
        surahId: surah.number,
        number: ayahIndex,
        text: ayah.text,
        juz: estimateJuz(surah.number, ayahIndex),
      });

      ayahIndex++;
    }
  }

  // CHUNK INSERT (important for Neon stability)
  const chunkSize = 500;

  for (let i = 0; i < allAyahs.length; i += chunkSize) {
    const chunk = allAyahs.slice(i, i + chunkSize);

    await prisma.quranAyah.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
}

/**
 * SIMPLE JUZ ESTIMATION (temporary fallback)
 * NOTE: exact mapping can be improved later
 */
function estimateJuz(surah: number, ayah: number): number {
  if (surah <= 2) return 1;
  if (surah <= 4) return 2;
  if (surah <= 7) return 3;
  if (surah <= 10) return 4;
  if (surah <= 12) return 5;
  if (surah <= 15) return 6;
  if (surah <= 18) return 7;
  if (surah <= 21) return 8;
  if (surah <= 23) return 9;
  if (surah <= 25) return 10;
  if (surah <= 27) return 11;
  if (surah <= 29) return 12;
  if (surah <= 32) return 13;
  if (surah <= 34) return 14;
  if (surah <= 36) return 15;
  if (surah <= 39) return 16;
  if (surah <= 41) return 17;
  if (surah <= 43) return 18;
  if (surah <= 46) return 19;
  if (surah <= 49) return 20;
  if (surah <= 52) return 21;
  if (surah <= 55) return 22;
  if (surah <= 58) return 23;
  if (surah <= 61) return 24;
  if (surah <= 64) return 25;
  if (surah <= 67) return 26;
  if (surah <= 70) return 27;
  if (surah <= 72) return 28;
  if (surah <= 75) return 29;
  return 30;
}

async function main() {
  try {
    console.log("Fetching Quran...");
    const surahs = await fetchQuran();

    console.log("Clearing old data...");
    await clearExistingData();

    console.log("Seeding Surahs...");
    await seedSurahs(surahs);

    console.log("Seeding Ayahs...");
    await seedAyahs(surahs);

    console.log("Done.");
  } catch (err) {
    console.error(err);
  } finally {
    // IMPORTANT FIX
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
