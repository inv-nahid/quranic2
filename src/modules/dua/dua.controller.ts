import { Request, Response } from "express";
import { getParam } from "../../utils/params";

import {
    getCategories,
    getDuas,
    getCategoryDuas,
    getDua,
    searchDuas,
} from "./dua.service";

export async function fetchCategories(
    req: Request,
    res: Response
) {
    const categories = await getCategories();

    res.json(
        categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
        }))
    );
}

export async function fetchDuas(
    req: Request,
    res: Response
) {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const duas = await getDuas(
        page,
        limit
    );

    res.json(duas);
}

export async function fetchCategoryDuas(
    req: Request,
    res: Response
) {
    const categoryId = getParam(
        req,
        "id"
    );

    const duas = await getCategoryDuas(
        categoryId
    );

    res.json(duas);
}

export async function fetchDua(
    req: Request,
    res: Response
) {
    const duaId = getParam(
        req,
        "id"
    );

    const dua = await getDua(duaId);

    if (!dua) {
        return res.status(404).json({
            message: "Dua not found",
        });
    }

    res.json({
        id: dua.id,
        title: dua.title,
        arabicText: dua.arabicText,
        transliteration:
            dua.transliteration,
        englishText: dua.englishText,
        repeat: dua.repeat,
        audioUrl: dua.audioUrl,
        category: {
            id: dua.category.id,
            name: dua.category.name,
            slug: dua.category.slug,
        },
    });
}

export async function searchDua(
    req: Request,
    res: Response
) {
    const query = String(
        req.query.q ?? ""
    ).trim();

    if (!query) {
        return res.status(400).json({
            message:
                "Search query required",
        });
    }

    const results = await searchDuas(
        query
    );

    res.json(
        (results as any[]).map((dua) => ({
            id: dua.id,
            title: dua.title,
            category: dua.categoryName,
            excerpt:
                dua.englishText.slice(
                    0,
                    200
                ),
        }))
    );
}