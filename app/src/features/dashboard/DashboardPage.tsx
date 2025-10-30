"use client"

import { useAuth } from "@/hooks/use-auth";
import { CvSULoading } from "@/components/ui/loader";
import { Announcements } from "./components/Announcements";
import { Calendar } from "../events/components/Calendar";
import { Events } from "./components/Events";

export function DashboardPage() {
    const { claims, loading } = useAuth();
    if (loading) return <CvSULoading />
    return (
        <section className="grid grid-cols-5 gap-4 reveal">
            <Announcements 
                claims={ claims }
                className="w-full col-span-2"
            />
                
            <Calendar
                className="w-full col-span-3"
            />
        </section>
    )
}