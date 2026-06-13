import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { updateProgress, fetchHistory, fetchStats, fetchStreak, fetchProgress, clearProgress } from "./progress.controller";

const router = Router();

router.use(authMiddleware);
router.post("/", updateProgress);
router.get("/history", fetchHistory);
router.get("/", fetchProgress);
router.get("/stats", fetchStats);
router.get("/streak", fetchStreak);
router.delete("/", clearProgress);

export default router;
