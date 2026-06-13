import { Request, Response } from "express";

import { getDashboard } from "./dashboard.service";

export async function fetchDashboard(
    req: Request,
    res: Response
) {
    const userId = (req as any).userId;

    const dashboard =
        await getDashboard(userId);

    res.json(dashboard);
}