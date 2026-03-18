"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { Calendar } from "./components/Calendar";
import { RecentEvents } from "./components/RecentEvents";
import { useState } from "react";

export function EventsPage() {
    const [calendarEvents, setCalendarEvents] = useState<FCEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);

    return (
        <section className="stack-md reveal max-md:mt-15 max-md:overflow-hidden">
            <AppHeader label="Events of CvSU" />
            
            <div className="grid grid-cols-3 gap-2 items-stretch h-[700px]">
                <Calendar 
                    className="col-span-2 h-full" 
                    onEventsChange={setCalendarEvents}
                    onLoadingChange={setEventsLoading}
                />
                <RecentEvents
                    className="h-full overflow-y-auto"
                    events={calendarEvents}
                    loading={eventsLoading}
                />
            </div>

            
        </section>
    )
}
