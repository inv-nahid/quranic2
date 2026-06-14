import {
    View,
    TextInput,
    Button,
} from "react-native";

import {
    useState,
} from "react";

import {
    Link,
} from "expo-router";

import {
    useAuth,
} from "@/src/hooks/useAuth";

export default function Register() {
    const { register } =
        useAuth();

    const [email, setEmail] =
        useState("");

    const [
        password,
        setPassword,
    ] = useState("");

    async function handleRegister() {
        await register(
            email,
            password
        );
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent:
                    "center",
                padding: 24,
                gap: 12,
            }}
        >
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={
                    setEmail
                }
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={
                    setPassword
                }
            />

            <Button
                title="Register"
                onPress={
                    handleRegister
                }
            />

            <Link
                href="/(auth)/login"
            >
                Login
            </Link>
        </View>
    );
}