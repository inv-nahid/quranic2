import { api } from "./api";

export async function getSurahs() {
    const response = await api.get("/quran/surahs");
    return response.data;
}

export async function getSurah(id: string | number) {
    const response = await api.get(`/quran/surah/${id}`);
    return response.data;
}

export async function getSurahAyahs(id: string | number) {
    const response = await api.get(`/quran/surah/${id}/ayahs`);
    return response.data;
}

export async function getAyah(id: string | number) {
    const response = await api.get(`/quran/ayah/${id}`);
    return response.data;
}

export async function searchQuran(query: string) {
    const response = await api.get(`/quran/search?q=${encodeURIComponent(query)}`);
    return response.data;
}
