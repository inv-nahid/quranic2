import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
    createFavorite,
    fetchFavorites,
    deleteFavorite,
} from "./favorites.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createFavorite);
router.get("/", fetchFavorites);
router.delete("/:id", deleteFavorite);

export default router;