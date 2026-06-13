import { Router } from "express";
import {
  allSurahs,
  surahById,
  ayahsBySurah,
  ayahById,
  search,
} from "./quran.controller";

const router = Router();

router.get("/surahs", allSurahs);
router.get("/surah/:id", surahById);
router.get("/surah/:id/ayahs", ayahsBySurah);
router.get("/ayah/:id", ayahById);
router.get("/search", search);

export default router;
