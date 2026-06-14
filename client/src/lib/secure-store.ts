import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "jwt_token";

// Safely determine if running in a web/browser environment rather than a native app context
const isWeb = typeof window !== "undefined" && typeof localStorage !== "undefined";

export async function saveToken(token: string) {
    if (isWeb) {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch (e) {
            console.error("localStorage error:", e);
        }
        return;
    }
    try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch (e) {
            console.error("Fallback localStorage error:", e);
        }
    }
}

export async function getToken() {
    if (isWeb) {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch (e) {
            console.error("localStorage error:", e);
            return null;
        }
    }
    try {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch (e) {
            console.error("Fallback localStorage error:", e);
            return null;
        }
    }
}

export async function removeToken() {
    if (isWeb) {
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch (e) {
            console.error("localStorage error:", e);
        }
        return;
    }
    try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch (e) {
            console.error("Fallback localStorage error:", e);
        }
    }
}