"use client";

import { useEffect, useState, useRef } from "react";
import { connectWS, disconnectWS } from "@/lib/websocket";
import { getNotifications } from "@/features/notification/notificationService";
import { NotificationDTO } from "@/shared/type";

export const useNotifications = (active: boolean) => {
    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
    // Guard against double-fetch in StrictMode / multiple renders
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!active || fetchedRef.current) return;
        fetchedRef.current = true;

        getNotifications()
            .then((res) => setNotifications(res.data))
            .catch((err) => console.error("[Notifications] Failed to fetch", err));

        connectWS((noti) => {
            setNotifications((prev) => [noti as NotificationDTO, ...prev]);
        });

        // Disconnect when user logs out or component unmounts
        const handleLogout = () => {
            disconnectWS();
            setNotifications([]);
            fetchedRef.current = false;
        };

        window.addEventListener("auth:logout", handleLogout);

        return () => {
            disconnectWS();
            window.removeEventListener("auth:logout", handleLogout);
        };
    }, [active]);

    return { notifications };
};