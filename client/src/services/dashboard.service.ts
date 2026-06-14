import { api } from "./api";

export async function getDashboard() {
    const response = await api.get("/dashboard");
    return response.data;
}

export async function getDailyAyah() {
    const response = await api.get("/daily/ayah");
    return response.data;
}

export async function getRandomHadith() {
    const response = await api.get("/hadith/random");
    return response.data;
}
