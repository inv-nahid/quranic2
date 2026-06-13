import { Request, Response } from "express";
import { getParam } from "../../utils/params";
import { upsertProgress, getHistory, getStats, getStreak, getProgress, deleteProgress } from "./progress.service";

export async function updateProgress(req: Request, res: Response) {
  const userId = (req as any).userId;
  const ayahId = req.body.ayahId;
  if (!ayahId) return res.status(400).json({ message: "ayahId required" });
  const data = await upsertProgress(userId, ayahId);
  res.json(data);
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