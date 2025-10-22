"use client"

import { usePathname } from "next/navigation";
import React from "react";

export function AppCanvas({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();
    if (pathName !== '/auth') { return (
            <main className="w-full p-4">
                {children}
            </main>
        )
    } else return <main>{children}</main>
}