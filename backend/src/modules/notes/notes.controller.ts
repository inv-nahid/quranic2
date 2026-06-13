import { Request, Response } from "express";
import { getParam } from "../../utils/params";

import {
    createNote,
    getNotes,
    getAyahNotes,
    updateNote,
    deleteNote,
} from "./notes.service";

export async function addNote(
    req: Request,
    res: Response
) {
    const userId = (req as any).userId;

    const { content, ayahId } = req.body;

    if (!content?.trim()) {
        return res.status(400).json({
            message: "content is required",
        });
    }

    await createNote(
        userId,
        content.trim(),
        ayahId
    );

    res.status(201).json({
        message: "Note created",
    });
}

export async function fetchNotes(
    req: Request,
    res: Response
) {
    const userId = (req as any).userId;

    const notes = await getNotes(userId);

    res.json(notes);
}

export async function fetchAyahNotes(
    req: Request,
    res: Response
) {
    const userId = (req as any).userId;

    const ayahId = getParam(req, "ayahId");

    const notes = await getAyahNotes(
        userId,
        ayahId
    );

    res.json(notes);
}

export async function editNote(
    req: Request,
    res: Response
) {
    const userId = (req as any).userId;

    const noteId = getParam(req, "id");

    const { content } = req.body;

    if (!content?.trim()) {
        return res.status(400).json({
            message: "content is required",
        });
    }

    const note = await updateNote(
        noteId,
        userId,
        content.trim()
    );

    if (!note) {
        return res.status(404).json({
            message: "Note not found",
        });
    }

    res.json({
        message: "Note updated",
    });
}

export async function removeNote(
    req: Request,
    res: Response
) {
    const userId = (req as any).userId;

    const noteId = getParam(req, "id");

    const deleted = await deleteNote(
        noteId,
        userId
    );

    if (!deleted) {
        return res.status(404).json({
            message: "Note not found",
        });
    }

    res.json({
        message: "Note deleted",
    });
}