import { router } from "expo-router";
import {
    login as loginRequest,
    register as registerRequest,
    getMe,
} from "@/src/services/auth.service";
import {
    saveToken,
    getToken,
    removeToken,
} from "@/src/lib/secure-store";
import { useAuthStore } from "@/src/store/auth.store";

export function useAuth() {
    const setAuth =
        useAuthStore(
            (state) => state.setAuth
        );

    const logoutStore =
        useAuthStore(
            (state) => state.logout
        );

    async function login(
        email: string,
        password: string
    ) {
        const result =
            await loginRequest({
                email,
                password,
            });

        await saveToken(
            result.token
        );

        setAuth(
            result.user,
            result.token
        );

        router.replace(
            "/(protected)"
        );
    }

    async function register(
        email: string,
        password: string
    ) {
        const result =
            await registerRequest({
                email,
                password,
            });

        await saveToken(
            result.token
        );

        setAuth(
            result.user,
            result.token
        );

        router.replace(
            "/(protected)"
        );
    }

    async function logout() {
        await removeToken();

        logoutStore();

        router.replace(
            "/(auth)/login"
        );
    }

    async function restoreSession() {
        const token =
            await getToken();

        if (!token) {
            return false;
        }

        return true;
    }

    return {
        login,
        register,
        logout,
        restoreSession,
    };
}