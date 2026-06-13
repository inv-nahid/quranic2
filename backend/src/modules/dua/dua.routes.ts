import { Router } from "express";

import {
    fetchCategories,
    fetchDuas,
    fetchCategoryDuas,
    fetchDua,
    searchDua,
} from "./dua.controller";

const router = Router();

router.get(
    "/categories",
    fetchCategories
);

router.get(
    "/search",
    searchDua
);

router.get("/", fetchDuas);

router.get(
    "/category/:id",
    fetchCategoryDuas
);

router.get("/:id", fetchDua);

export default router;