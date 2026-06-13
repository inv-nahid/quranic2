import { Request, Response } from "express";
import { getParam } from "../../utils/params";

import {
    getBooks,
    getBook,
    getBookHadiths,
    getHadith,
    searchHadiths,
    getRandomHadith
} from "./hadith.service";

export async function fetchBooks(
    req: Request,
    res: Response
) {
    const books = await getBooks();

    res.json(
        books.map((book) => ({
            id: book.id,
            slug: book.slug,
            name: book.name,
        }))
    );
}

export async function fetchBook(
    req: Request,
    res: Response
) {
    const bookId = getParam(req, "id");

    const book = await getBook(bookId);

    if (!book) {
        return res.status(404).json({
            message: "Book not found",
        });
    }

    res.json(book);
}

export async function fetchBookHadiths(
    req: Request,
    res: Response
) {
    const bookId = getParam(req, "id");

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const data = await getBookHadiths(
        bookId,
        page,
        limit
    );

    res.json(data);
}

export async function fetchHadith(
    req: Request,
    res: Response
) {
    const hadithId = getParam(req, "id");

    const hadith = await getHadith(hadithId);

    if (!hadith) {
        return res.status(404).json({
            message: "Hadith not found",
        });
    }

    res.json({
        id: hadith.id,
        hadithNumber: hadith.hadithNumber,
        chapter: hadith.chapter,
        narrator: hadith.narrator,
        arabicText: hadith.arabicText,
        englishText: hadith.englishText,
        book: {
            id: hadith.book.id,
            name: hadith.book.name,
            slug: hadith.book.slug,
        },
    });
}

export async function searchHadith(
    req: Request,
    res: Response
) {
    const query = String(req.query.q ?? "").trim();

    if (!query) {
        return res.status(400).json({
            message: "Search query required",
        });
    }

    const results = await searchHadiths(query);

    res.json(
        results.map((hadith) => ({
            id: hadith.id,
            hadithNumber: hadith.hadithNumber,
            chapter: hadith.chapter,
            narrator: hadith.narrator,
            book: hadith.book.name,
            excerpt: hadith.englishText.slice(0, 200),
        }))
    );
}

export async function fetchRandomHadith(
    req: Request,
    res: Response
) {
    const hadith =
        await getRandomHadith();

    if (!hadith) {
        return res.status(404).json({
            message:
                "Hadith not found",
        });
    }

    res.json({
        id: hadith.id,

        hadithNumber:
            hadith.hadithNumber,

        chapter: hadith.chapter,

        narrator:
            hadith.narrator,

        arabicText:
            hadith.arabicText,

        englishText:
            hadith.englishText,

        book: {
            id: hadith.book.id,
            name: hadith.book.name,
            slug: hadith.book.slug,
        },
    });
}