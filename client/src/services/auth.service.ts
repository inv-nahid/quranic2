import { api } from "./api";

import {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
} from "@/src/types/auth.types";

export async function login(
    payload: LoginPayload
) {
    const response =
        await api.post<AuthResponse>(
            "/auth/login",
            payload
        );

    return response.data;
}

export async function register(
    payload: RegisterPayload
) {
    const response =
        await api.post<AuthResponse>(
            "/auth/register",
            payload
        );

    return response.data;
}

export async function getMe() {
    const response =
        await api.get("/auth/me");

    return response.data;
}