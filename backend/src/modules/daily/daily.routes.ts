import { Router } from "express";

import {
    fetchDailyAyah,
} from "./daily.controller";

const router = Router();

router.get(
    "/ayah",
    fetchDailyAyah
);

export default router;