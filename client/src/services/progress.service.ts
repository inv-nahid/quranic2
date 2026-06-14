import { api } from "./api";

export async function getProgress() {
    const response = await api.get("/progress");
    return response.data;
}

export async function updateProgress(surahId: number, ayahNumber: number, percentage: number) {
    const response = await api.post("/progress", {
        surahId,
        ayahNumber,
        percentage,
        completedSurahId: percentage === 100 ? surahId : undefined,
    });
    return response.data;
}

export async function getStats() {
    const response = await api.get("/progress/stats");
    return response.data;
}

export async function getStreak() {
    const response = await api.get("/progress/streak");
    return response.data;
}

export async function getHistory() {
    const response = await api.get("/progress/history");
    return response.data;
}

export async function clearProgress() {
    const response = await api.delete("/progress");
    return response.data;
}
