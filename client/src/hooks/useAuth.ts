import { router } from "expo-router";
import { login as loginRequest, register as registerRequest, getMe } from "@/src/services/auth.service";
import { saveToken, getToken, removeToken } from "@/src/lib/secure-store";
import { useAuthStore } from "@/src/store/auth.store";

export function useAuth() {

    const setAuth = useAuthStore((state) => state.setAuth);
    const logoutStore = useAuthStore((state) => state.logout);

    async function login(email: string, password: string) {
        const result = await loginRequest({ email, password });
        await saveToken(result.token);
        setAuth(result.user, result.token);
        router.replace("/home");
    }

    async function register(email: string, password: string) {
        const result = await registerRequest({ email, password });
        await saveToken(result.token);
        setAuth(result.user, result.token);
        router.replace("/home");
    }

    async function logout() {
        await removeToken();
        logoutStore();
        router.replace("/login");
    }

    async function restoreSession() {
        try {
            const token =
                await getToken();

            if (!token) {
                return false;
            }

            const user =
                await getMe();

            setAuth(user, token);

            return true;
        } catch {
            await removeToken();

            logoutStore();

            return false;
        }
    }

    return { login, register, logout, restoreSession };
}