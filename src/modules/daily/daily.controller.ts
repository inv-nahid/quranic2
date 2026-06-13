import { Request, Response } from "express";

import { getDailyAyah } from "./daily.service";

export async function fetchDailyAyah(
    req: Request,
    res: Response
) {
    const ayah =
        await getDailyAyah();

    if (!ayah) {
        return res.status(404).json({
            message:
                "Daily ayah not found",
        });
    }

    res.json(ayah);
}