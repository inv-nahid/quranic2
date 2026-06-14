import { api } from "./api";

export async function unifiedSearch(query: string) {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
}
