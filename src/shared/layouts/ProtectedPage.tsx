"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/AuthContext";

type ProtectedLayoutProps = {
    children: ReactNode;
    allowedRoles: string[];
};

export default function ProtectedLayout({
    children,
    allowedRoles,
}: ProtectedLayoutProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/login");
                return;
            }

            if (!allowedRoles.includes(user.role)) {
                router.replace("/403");
                return;
            }
        }
    }, [user, loading, router, allowedRoles]);

    if (loading || !user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}