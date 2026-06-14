import axios from "axios";
import { getToken } from "@/src/lib/secure-store";

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token =
            await getToken();

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) =>
        Promise.reject(error)
);

