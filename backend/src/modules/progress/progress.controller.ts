import { Request, Response } from "express";
import { getParam } from "../../utils/params";
import { upsertProgress, getHistory, getStats, getStreak, getProgress, deleteProgress } from "./progress.service";
import { prisma } from "../../config/prisma";

export async function updateProgress(req: Request, res: Response) {
  const userId = (req as any).userId;
  const { ayahId, surahId, ayahNumber, completedSurahId } = req.body;

  try {
    if (completedSurahId) {
      const surahIdNum = Number(completedSurahId);
      const ayahs = await prisma.quranAyah.findMany({
        where: { surahId: surahIdNum },
        orderBy: { number: "asc" }
      });
      
      if (ayahs.length > 0) {
        const lastAyah = ayahs[ayahs.length - 1];
        await upsertProgress(userId, lastAyah.id);

        const historyRecords = ayahs.map(a => ({
          userId,
          ayahId: a.id
        }));
        
        await prisma.readingHistory.createMany({
          data: historyRecords,
          skipDuplicates: true
        });
        
        const updatedProgress = await getProgress(userId);
        return res.json(updatedProgress);
      }
      return res.status(404).json({ message: "No ayahs found for this surah" });
    }

    let targetAyahId = ayahId;
    if (!targetAyahId && surahId && ayahNumber) {
      const ayah = await prisma.quranAyah.findFirst({
        where: {
          surahId: Number(surahId),
          number: Number(ayahNumber)
        }
      });
      if (ayah) {
        targetAyahId = ayah.id;
      }
    }

    if (!targetAyahId) {
      return res.status(400).json({ message: "ayahId, completedSurahId, or (surahId and ayahNumber) required" });
    }

    const data = await upsertProgress(userId, targetAyahId);
    res.json(data);
  } catch (err: any) {
    console.error("Error updating progress:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
}

export async function fetchProgress(
  req: Request,
  res: Response
) {
  const userId = (req as any).userId;
  const progress = await getProgress(userId);
  if (!progress) return res.json(null);
  res.json(progress);
}

export async function fetchHistory(
  req: Request,
  res: Response
) {
  const userId = (req as any).userId;

  const history = await getHistory(
    userId
  );

  res.json(
    history.map((item) => ({
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
    }))
  );
}

export async function fetchStats(
  req: Request,
  res: Response
) {
  const userId = (req as any).userId;

  const stats = await getStats(
    userId
  );

  res.json(stats);
}

export async function fetchStreak(
  req: Request,
  res: Response
) {
  const userId = (req as any).userId;

  const streak =
    await getStreak(userId);

  res.json(streak);
}

export async function clearProgress(req: Request, res: Response) {
  const userId = (req as any).userId;

  const deleted = await deleteProgress(userId);

  if (!deleted) {
    return res.status(404).json({
      message: "No saved progress found",
    });
  }

  res.json({
    message: "Progress cleared successfully",
  });
}