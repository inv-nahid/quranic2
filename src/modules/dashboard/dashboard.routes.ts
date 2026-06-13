import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
    fetchDashboard,
} from "./dashboard.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", fetchDashboard);

export default router;