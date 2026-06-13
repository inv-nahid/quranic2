import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";

import {
    addNote,
    fetchNotes,
    fetchAyahNotes,
    editNote,
    removeNote,
} from "./notes.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", addNote);
router.get("/", fetchNotes);
router.get("/ayah/:ayahId", fetchAyahNotes);
router.patch("/:id", editNote);
router.delete("/:id", removeNote);

export default router;