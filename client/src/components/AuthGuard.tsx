import { Redirect } from "expo-router";

import { useAuthStore } from "@/src/store/auth.store";

type Props = {
    children: React.ReactNode;
};

export default function AuthGuard({
    children,
}: Props) {
    const isAuthenticated =
        useAuthStore(
            (state) =>
                state.isAuthenticated
        );

    if (!isAuthenticated) {
        return (
            <Redirect
                href="/login"
            />
        );
    }

    return children;
}