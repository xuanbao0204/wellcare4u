"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { UserDTO } from "@/features/auth/type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8600/api/v1";

type AuthContextType = {
    user: UserDTO | null;
    setUser: React.Dispatch<React.SetStateAction<UserDTO | null>>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    credentials: "include",
                });

                if (res.status === 401) {
                    const refreshRes = await fetch(
                        `${API_URL}/auth/refresh`,
                        {
                            method: "POST",
                            credentials: "include",
                        }
                    );

                    if (!refreshRes.ok) throw new Error();

                    const meAgain = await fetch(
                        `${API_URL}/auth/me`,
                        {
                            credentials: "include",
                        }
                    );

                    if (!meAgain.ok) throw new Error();

                    const data = await meAgain.json();
                    setUser(data);
                } else {
                    const data = await res.json();
                    setUser(data);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const logout = useCallback(async () => {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        setUser(null);
        router.replace("/login");
    }, [router]);

    const value = {
        user,
        setUser,
        logout,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};