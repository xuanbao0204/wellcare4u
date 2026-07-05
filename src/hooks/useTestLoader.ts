// hooks/useTestSocket.ts
import { useEffect, useRef } from "react";
import { subscribeWS } from "@/lib/websocket";
import { MedicalTest } from "@/shared/type";

type TestEventType = "TEST_COMPLETED" | "NEW_TEST_ORDERED";
type Handlers = Partial<Record<TestEventType, (payload: Partial<MedicalTest>) => void>>;

export const useTestSocket = (handlers: Handlers) => {

    const ref = useRef(handlers);
    useEffect(() => { ref.current = handlers; });

    useEffect(() => {
        const u1 = subscribeWS("/user/queue/lab/new-test", (data) => {
            ref.current.NEW_TEST_ORDERED?.(data as Partial<MedicalTest>);
        });

        const u2 = subscribeWS("/user/queue/lab/test-completed", (data) => {
            ref.current.TEST_COMPLETED?.(data as Partial<MedicalTest>);
        });

        return () => { u1(); u2(); };
    }, []);
};