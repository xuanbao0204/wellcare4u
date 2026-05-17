"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { useRouter } from "next/navigation";
import api, { markAuthReady } from "@/lib/axios";
import type { UserDTO } from "@/features/auth/type";
import Loader from "./ui/Loader";
import { useRedirectByRole } from "@/features/auth/redirectByRole";

type AuthContextType = {
    user: UserDTO | null;
    setUser: React.Dispatch<React.SetStateAction<UserDTO | null>>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
    authReady: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [authReady, setAuthReady] = useState(false);
    const router = useRouter();
    const redirectByRole = useRedirectByRole();

    useEffect(() => {
        const initAuth = async () => {

            const publicRoutes = [
                "/login",
                "/register",
                "/forgot-password",
                "/verify-otp",
                "/active-account"
            ];

            const pathname = window.location.pathname;

            if (publicRoutes.includes(pathname)) {
                setAuthReady(true);
                setLoading(false);
                markAuthReady();
                return;
            }

            try {
                const res = await api.get("/auth/me");
                setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setAuthReady(true);
                setLoading(false);
                markAuthReady();
            }
        };

        initAuth();
    }, []);

    useEffect(() => {

        if (!user) return;

        if (user.status === "ACTIVE") return;

        if (user.status === "INACTIVE") {

            sessionStorage.setItem(
                "otp_flow",
                JSON.stringify({
                    purpose: "ACTIVATE",
                    email: user.email,
                    redirectTo: "/login",
                    source: "/login"
                })
            );

            router.replace("/active-account");
            return;
        }

        if (user.status === "SUSPENDED") {
            router.replace("/suspended");
            return;
        }

        router.replace("/login");

    }, [user, router]);

    useEffect(() => {

        if (!user) return;

        if (user.status !== "ACTIVE") return;

        const pathname = window.location.pathname;

        if (pathname === "/login") {
            redirectByRole(user.role);
        }

    }, [user]);

    // useEffect(() => {
    //     const initAuth = async () => {

    //         const publicRoutes = [
    //             "/login",
    //             "/register",
    //             "/forgot-password",
    //             "/verify-otp",
    //             "/active-account"
    //         ];
    //         if (user && user.status !== "ACTIVE") {

    //             if (user.status === "INACTIVE") {
    //                 router.replace("/active-account");
    //                 sessionStorage.setItem(
    //                     "otp_flow",
    //                     JSON.stringify({
    //                         purpose: "ACTIVATE",
    //                         email: user.email,
    //                         redirectTo: "/login",
    //                         source: "/register"
    //                     })
    //                 );
    //                 return;
    //             }

    //             if (user.status === "SUSPENDED") {
    //                 router.replace("/active-account");
    //                 return;
    //             }

    //             router.replace("/login");
    //         }
    //         const pathname = window.location.pathname;

    //         if (publicRoutes.includes(pathname)) {
    //             setAuthReady(true);
    //             setLoading(false);
    //             markAuthReady();
    //             return;
    //         }

    //         try {
    //             const res = await api.get("/auth/me");
    //             setUser(res.data);
    //         } catch {
    //             setUser(null);
    //         } finally {
    //             setAuthReady(true);
    //             setLoading(false);
    //             markAuthReady();
    //         }
    //     };

    //     initAuth();
    // }, [user]);

    useEffect(() => {
        const handleForcedLogout = () => {
            setUser(null);
            router.replace("/login");
        };

        window.addEventListener("auth:logout", handleForcedLogout);
        return () => window.removeEventListener("auth:logout", handleForcedLogout);
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await api.post("/auth/logout");
        } catch {

        }

        setUser(null);
        window.dispatchEvent(new Event("auth:logout"));
        router.replace("/login");
    }, [router]);

    return (
        <AuthContext.Provider
            value={{ user, setUser, logout, isAuthenticated: !!user, loading, authReady }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};
