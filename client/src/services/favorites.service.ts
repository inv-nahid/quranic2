import { api } from "./api";

export async function getFavorites() {
    const response = await api.get("/favorites");
    return response.data;
}

export async function addFavorite(type: "QURAN" | "HADITH" | "DUA", refId: string) {
    const response = await api.post("/favorites", { type, refId });
    return response.data;
}

export async function deleteFavorite(id: string | number) {
    const response = await api.delete(`/favorites/${id}`);
    return response.data;
}
