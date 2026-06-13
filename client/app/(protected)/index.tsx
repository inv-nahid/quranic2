import {
    View,
    Text,
    Button,
} from "react-native";

import { useAuth } from "@/src/hooks/useAuth";

export default function Home() {
    const { logout } =
        useAuth();

    return (
        <View
            style={{
                flex: 1,
                justifyContent:
                    "center",
                alignItems:
                    "center",
            }}
        >
            <Text>
                Protected Home
            </Text>

            <Button
                title="Logout"
                onPress={logout}
            />
        </View>
    );
}