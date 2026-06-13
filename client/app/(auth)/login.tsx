import {
    View,
    Button,
} from "react-native";

import { useAuth } from "@/src/hooks/useAuth";

export default function Login() {
    const { login } =
        useAuth();

    async function handleLogin() {
        try {
            await login(
                "test@example.com",
                "password123"
            );
        } catch (error: any) {
            console.log(
                "STATUS:",
                error?.response?.status
            );

            console.log(
                "DATA:",
                error?.response?.data
            );

            console.log(error);
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent:
                    "center",
            }}
        >
            <Button
                title="Login"
                onPress={
                    handleLogin
                }
            />
        </View>
    );
}