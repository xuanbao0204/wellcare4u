"use client";

import { ConfirmProvider } from "@/shared/ConfirmDialogContext";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { ReactNode, useState } from "react";

export default function Providers({
    children,
}: {
    children: ReactNode;
}) {

    const [queryClient] = useState(
        () => new QueryClient()
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ConfirmProvider>
                {children}
            </ConfirmProvider>
        </QueryClientProvider>
    );
}