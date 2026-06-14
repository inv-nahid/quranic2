import {
    View,
    Text,
    Button,
} from "react-native";

import { useAuth } from "@/src/hooks/useAuth";
import { useAuthStore } from "@/src/store/auth.store";

import { getMe } from "@/src/services/auth.service";

export default function Home() {
    const { logout } = useAuth();

    const user = useAuthStore(
        (state) => state.user
    );

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

            <Text>{user?.email}</Text>

            <Button
                title="Get Me"
                onPress={async () => {
                    const me = await getMe();
                    console.log(me);
                }}
            />

            <Button
                title="Logout"
                onPress={logout}
            />
        </View>
    );
}