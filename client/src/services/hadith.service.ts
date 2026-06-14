import { api } from "./api";

export async function getHadithBooks() {
    const response = await api.get("/hadith/books");
    return response.data;
}

export async function getHadithBook(id: string | number) {
    const response = await api.get(`/hadith/book/${id}`);
    return response.data;
}

export async function getHadithBookHadiths(id: string | number) {
    const response = await api.get(`/hadith/book/${id}/hadiths`);
    return response.data;
}

export async function getRandomHadith() {
    const response = await api.get("/hadith/random");
    return response.data;
}

export async function getHadith(id: string | number) {
    const response = await api.get(`/hadith/${id}`);
    return response.data;
}

export async function searchHadith(query: string) {
    const response = await api.get(`/hadith/search?q=${encodeURIComponent(query)}`);
    return response.data;
}
