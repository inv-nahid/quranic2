import { Router } from "express";
import { unifiedSearch } from "./search.controller";

const router = Router();

router.get("/", unifiedSearch);

export default router;