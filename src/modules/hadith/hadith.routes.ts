import { Router } from "express";

import {
    fetchBooks,
    fetchBook,
    fetchBookHadiths,
    fetchHadith,
    searchHadith,
    fetchRandomHadith,
} from "./hadith.controller";

const router = Router();

router.get("/books", fetchBooks);

router.get("/search", searchHadith);

router.get("/book/:id", fetchBook);

router.get(
    "/book/:id/hadiths",
    fetchBookHadiths
);

router.get("/random", fetchRandomHadith);

router.get("/:id", fetchHadith);

export default router;