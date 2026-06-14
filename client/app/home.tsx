import {
    View,
    Text,
    Button,
} from "react-native";

import { useAuth } from "@/src/hooks/useAuth";
import { useAuthStore } from "@/src/store/auth.store";
import { useMeQuery } from "@/src/queries/auth.queries";

export default function Home() {
    const { logout } = useAuth();

    const user = useAuthStore(
        (state) => state.user
    );

    const {
        data,
        isLoading,
        error,
    } = useMeQuery();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
            }}
        >
            <Text>Welcome</Text>

            <Text>
                Zustand:
                {" "}
                {user?.email}
            </Text>

            <Text>
                Query:
                {" "}
                {isLoading
                    ? "Loading..."
                    : data?.email}
            </Text>

            <Button
                title="Logout"
                onPress={logout}
            />
        </View>
    );
}