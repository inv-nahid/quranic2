import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { updateProgress, fetchProgress, clearProgress } from "./progress.controller";

const router = Router();

router.use(authMiddleware);
router.post("/", updateProgress);
router.get("/", fetchProgress);
router.delete("/", clearProgress);

export default router;
