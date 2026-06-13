// import { Text, View } from "react-native";
// import { TEST } from "@/src/types/test";

// export default function Home() {
//     return (
//         <View
//             style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//             }}
//         >
//             <Text>Quranic</Text>
//         </View>
//     );
// }

import { View, Text, Button } from "react-native";

import {
    saveToken,
    getToken,
    removeToken,
} from "@/src/lib/secure-store";

export default function Home() {
    async function handleSave() {
        await saveToken("hello-jwt");
        console.log("saved");
    }

    async function handleRead() {
        const token = await getToken();
        console.log(token);
    }

    async function handleDelete() {
        await removeToken();
        console.log("deleted");
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                gap: 16,
            }}
        >
            <Button
                title="Save"
                onPress={handleSave}
            />

            <Button
                title="Read"
                onPress={handleRead}
            />

            <Button
                title="Delete"
                onPress={handleDelete}
            />
        </View>
    );
}