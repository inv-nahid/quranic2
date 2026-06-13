import { Request, Response } from "express";
import { getParam } from "../../utils/params";
import { getAllSurahs, getSurahById, getAyahsBySurahId, getAyahById, searchQuran } from "./quran.service";

export async function allSurahs(req: Request, res: Response) {
  const data = await getAllSurahs();
  res.json(data);
}

export async function surahById(req: Request, res: Response) {
  const id = Number(getParam(req, "id"));
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid surah id" });
  const data = await getSurahById(id);
  res.json(data);
}

export async function ayahsBySurah(req: Request, res: Response) {
  const surahId = Number(getParam(req, "id"));
  if (Number.isNaN(surahId)) return res.status(400).json({ message: "Invalid surah id" });
  const data = await getAyahsBySurahId(surahId);
  res.json(data);
}

export async function ayahById(req: Request, res: Response) {
  const id = getParam(req, "id");
  const data = await getAyahById(id);
  res.json(data);
}

export async function search(req: Request, res: Response) {
  console.log("QUERY:", req.query);
  const q = String(req.query.q || "").trim();
  if (!q) return res.status(400).json({ message: "Query required" });
  const data = await searchQuran(q);
  res.json(data);
}
