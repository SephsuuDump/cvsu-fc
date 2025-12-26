"use client"

import { useAuth } from "@/hooks/use-auth";
import { CvSULoading } from "@/components/ui/loader";
import { Announcements } from "./components/Announcements";
import { Calendar } from "../events/components/Calendar";
import { AuthPage } from "../auth/AuthPage";

export function DashboardPage() {
    const { claims, loading } = useAuth();
    if (!claims) return <AuthPage />
    if (loading) return <CvSULoading />
    return (
        <section className="grid grid-cols-2 gap-4 reveal">
            <Announcements 
                claims={ claims }
                className="w-full"
            />
                
            <Calendar
                className="w-full"
            />
        </section>
    )
}