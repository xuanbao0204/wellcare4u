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

    // useEffect(() => {
    //     const initAuth = async () => {
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
    // }, []);

    useEffect(() => {
        const initAuth = async () => {

            const publicRoutes = [
                "/login",
                "/register",
                "/forgot-password"
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
