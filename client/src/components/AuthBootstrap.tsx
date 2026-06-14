import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/src/hooks/useAuth";

export default function AuthBootstrap() {
    const { restoreSession } = useAuth();

    useEffect(() => {
        async function init() {
            const restored =
                await restoreSession();

            if (restored) {
                router.replace("/home");
            } else {
                router.replace("/login");
            }
        }

        init();
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ActivityIndicator />
        </View>
    );
}