"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { Calendar } from "./components/Calendar";
import { RecentEvents } from "./components/RecentEvents";
import { useEffect } from "react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { EventService } from "@/services/event.service";
import { CvSULoading } from "@/components/ui/loader";

export function EventsPage() {
    const { data: events, loading } = useFetchData(EventService.getAllEvents);

    if (loading) return <CvSULoading />
    return (
        <section className="stack-md reveal">
            <AppHeader label="Events of CvSU" />
            
            <div className="grid grid-cols-3 gap-2 items-stretch h-[700px]">
                
                <Calendar 
                    className="col-span-2 h-full" 
                />
                <RecentEvents className="overflow-y-auto h-full" />
            </div>

            
        </section>
    )
}