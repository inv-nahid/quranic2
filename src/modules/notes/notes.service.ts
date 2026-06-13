import { prisma } from "../../config/prisma";

export async function createNote(
    userId: string,
    content: string,
    ayahId?: string
) {
    return prisma.note.create({
        data: {
            userId,
            content,
            ayahId,
        },
    });
}

export async function getNotes(userId: string) {
    const notes = await prisma.note.findMany({
        where: { userId },
        orderBy: {
            updatedAt: "desc",
        },
        include: {
            ayah: {
                include: {
                    surah: true,
                },
            },
        },
    });

    return notes.map((note) => ({
        id: note.id,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        ayah: note.ayah
            ? {
                id: note.ayah.id,
                number: note.ayah.number,
            }
            : null,
        surah: note.ayah
            ? {
                id: note.ayah.surah.id,
                name: note.ayah.surah.name,
                englishName: note.ayah.surah.englishName,
            }
            : null,
    }));
}

export async function getAyahNotes(
    userId: string,
    ayahId: string
) {
    return prisma.note.findMany({
        where: {
            userId,
            ayahId,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
}

export async function updateNote(
    noteId: string,
    userId: string,
    content: string
) {
    const note = await prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
        },
    });

    if (!note) {
        return null;
    }

    return prisma.note.update({
        where: {
            id: noteId,
        },
        data: {
            content,
        },
    });
}

export async function deleteNote(
    noteId: string,
    userId: string
) {
    const note = await prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
        },
    });

    if (!note) {
        return false;
    }

    await prisma.note.delete({
        where: {
            id: noteId,
        },
    });

    return true;
}