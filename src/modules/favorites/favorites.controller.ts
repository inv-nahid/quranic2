import { Request, Response } from "express";
import { FavoriteType } from "@prisma/client";
import { getParam } from "../../utils/params";
import {
    addFavorite,
    getFavorites,
    removeFavorite,
} from "./favorites.service";

export async function createFavorite(
    req: Request,
    res: Response
) {
    const userId = (req as any).userId;

    const { type, refId } = req.body;

    if (!type || !refId) {
        return res.status(400).json({
            message: "type and refId are required",
        });
    }

    await addFavorite(
        userId,
        type as FavoriteType,
        refId
    );

    res.status(201).json({
        message: "Favorite added",
    });
}

export async function fetchFavorites(
    req: Request,
    res: Response
) {
    const userId = (req as any).userId;

    const favorites = await getFavorites(userId);

    res.json(favorites);
}

export async function deleteFavorite(
    req: Request,
    res: Response
) {
    const userId = (req as any).userId;

    const favoriteId = getParam(req, "id");

    const deleted = await removeFavorite(
        favoriteId,
        userId
    );

    if (!deleted) {
        return res.status(404).json({
            message: "Favorite not found",
        });
    }

    res.json({
        message: "Favorite removed",
    });
}