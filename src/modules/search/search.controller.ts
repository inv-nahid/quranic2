import { Request, Response } from "express";
import { search } from "./search.service";

export async function unifiedSearch(
    req: Request,
    res: Response
) {
    const query = String(
        req.query.q ?? ""
    ).trim();

    if (!query) {
        return res.status(400).json({
            message: "Search query required",
        });
    }

    const results = await search(query);

    res.json(results);
}