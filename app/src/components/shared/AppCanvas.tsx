"use client"

import { usePathname } from "next/navigation";
import React from "react";

export function AppCanvas({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();
    const isAuthPage = pathName.startsWith("/auth");
    const isMessagesPage = pathName.startsWith("/messages");

    const className = isMessagesPage
        ? "w-full md:h-svh md:overflow-hidden"
        : isAuthPage
            ? "w-full"
            : "w-full p-4";

    return (
        <main className={className}>
            {children}
        </main>
    );
}
