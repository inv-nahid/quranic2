import axios from "axios";
import { getToken } from "@/src/lib/secure-store";

const getBaseURL = () => {
    if (
        typeof process !== "undefined" &&
        process.env &&
        process.env.EXPO_PUBLIC_API_URL
    ) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    return "http://localhost:5000";
};

export const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await getToken();

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);