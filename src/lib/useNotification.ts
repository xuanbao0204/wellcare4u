"use client";

import { useEffect, useState } from "react";
import { connectWS, disconnectWS, } from "@/lib/websocket";
import { getNotifications, } from "@/features/notification/notificationService";
import { NotificationDTO } from "@/shared/type";
import { showNotification } from "./toast";
import { playNotificationSound } from "./notiSoundHelper";

export const useNotifications = (active: boolean) => {

    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
    const [latestNoti, setLatestNoti] = useState<NotificationDTO | null>(null);
    useEffect(() => {

        if (!latestNoti) return;

        showNotification(
            latestNoti.title,
            latestNoti.content
        );

        playNotificationSound();

    }, [latestNoti]);
    useEffect(() => {

        if (!active) return;

        let mounted = true;

        const loadNotifications = async () => {
            try {
                const res =
                    await getNotifications();
                if (mounted) {
                    setNotifications(
                        res.data
                    );
                }
            } catch (err) {
                console.error(
                    "[Notifications] fetch failed",
                    err
                );
            }
        };

        loadNotifications();

        connectWS((noti) => {
            const incoming =
                noti as NotificationDTO;

            setNotifications(
                (prev) => {
                    const exists =
                        prev.some(
                            (n) =>
                                n.id ===
                                incoming.id
                        );
                    if (exists) {
                        return prev;
                    }
                    setLatestNoti(incoming);
                    return [
                        incoming,
                        ...prev
                    ];
                }
            );
        });
        const handleLogout =
            () => {
                disconnectWS();
                setNotifications([]);
            };
        window.addEventListener(
            "auth:logout",
            handleLogout
        );
        return () => {
            mounted = false;
            disconnectWS();
            window.removeEventListener(
                "auth:logout",
                handleLogout
            );
        };
    }, [active]);

    return {
        notifications,
        setNotifications
    };
};