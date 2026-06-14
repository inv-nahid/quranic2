import { api } from "./api";

export interface CreateNotePayload {
    surahId?: number;
    ayahId?: string;
    verseNumber?: number;
    title?: string;
    text: string;
    content?: string;
    tags?: string[];
    imageUrl?: string;
}

export async function getNotes() {
    const response = await api.get("/notes");
    return response.data;
}

export async function getAyahNotes(ayahId: string | number) {
    const response = await api.get(`/notes/ayah/${ayahId}`);
    return response.data;
}

export async function addNote(payload: CreateNotePayload) {
    const response = await api.post("/notes", payload);
    return response.data;
}

export async function editNote(id: string | number, payload: Partial<CreateNotePayload>) {
    const response = await api.patch(`/notes/${id}`, payload);
    return response.data;
}

export async function deleteNote(id: string | number) {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
}
