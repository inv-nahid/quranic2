import { Request, Response } from "express";
import { getParam } from "../../utils/params";
import { upsertProgress, getProgress, deleteProgress } from "./progress.service";

export async function updateProgress(req: Request, res: Response) {
  const userId = (req as any).userId;
  const ayahId = req.body.ayahId;
  if (!ayahId) return res.status(400).json({ message: "ayahId required" });
  const data = await upsertProgress(userId, ayahId);
  res.json(data);
}

export async function fetchProgress(req: Request, res: Response) {
  const userId = (req as any).userId;

  const progress = await getProgress(userId);

  if (!progress) {
    return res.json(null);
  }

  res.json({
    updatedAt: progress.updatedAt,
    surah: {
      id: progress.ayah.surah.id,
      name: progress.ayah.surah.name,
      englishName: progress.ayah.surah.englishName,
    },
    ayah: {
      id: progress.ayah.id,
      number: progress.ayah.number,
      text: progress.ayah.text,
    },
  });
}

export async function clearProgress(req: Request, res: Response) {
  const userId = (req as any).userId;
  const deleted = await deleteProgress(userId);
  if (!deleted) return res.status(404).json({ message: "No saved progress found" });
  res.json({ message: "Progress cleared successfully" });
}