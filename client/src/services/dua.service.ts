import { api } from "./api";

export async function getDuaCategories() {
    const response = await api.get("/duas/categories");
    return response.data;
}

export async function getDuasByCategory(categoryId: string | number) {
    const response = await api.get(`/duas/category/${categoryId}`);
    return response.data;
}

export async function getDua(id: string | number) {
    const response = await api.get(`/duas/${id}`);
    return response.data;
}

export async function searchDua(query: string) {
    const response = await api.get(`/duas/search?q=${encodeURIComponent(query)}`);
    return response.data;
}
