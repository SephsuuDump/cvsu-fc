"use client"

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { eventsMock, octoberEvents } from "../../../../public/mock/events";
import { useEventCounts } from "@/hooks/use-event-count";
import { ViewEventsDay } from "./ViewEventsDay";

export function Calendar({ className, setOpen }: {
    className?: string;
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState<string | undefined>();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handlePrev = () => {
        if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
        } else {
        setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNext = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const emptyDays = Array.from({ length: firstDay });

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const eventCounts = useEventCounts(octoberEvents, currentMonth, currentYear);

    return (
        <section className={`${className} bg-slate-50`}>
            <div className="flex justify-between items-center p-4">
                <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded">
                <ChevronLeft />
                </button>
                <h2 className="font-semibold text-lg">
                {monthNames[currentMonth]} {currentYear}
                </h2>
                <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded">
                <ChevronRight />
                </button>
            </div>

            <div className="grid grid-cols-7 text-center font-medium text-gray-600">
                {weekDays.map((day) => (
                <div key={day} className="py-1">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 text-center">
                    {emptyDays.map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {days.map((day, index) => {
                        const isToday =
                            day === today.getDate() &&
                            currentMonth === today.getMonth() &&
                            currentYear === today.getFullYear();

                        const dayOfWeek = (firstDay + day - 1) % 7;
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                        const eventCount = eventCounts[day] || 0;

                        return (
                            <button
                                key={day}
                                onClick={ () => setSelectedDay(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`) }
                                className={`text-start p-2 m-1 aspect-square bg-slate-100 shadow-sm border-slate-200 rounded-lg hover:bg-green-100
                                    ${isToday ? "!bg-green-100 font-bold" : ""}
                                    ${isWeekend ? "text-darkred" : "text-gray-600"}
                                    ${eventCount > 0 && "!text-green-600"}
                                `}
                            >
                                <div className="text-lg font-bold tracking-widest">{String(day).padStart(2, "0")}</div>
                                <div className="text-xs font-bold tracking-wider">{eventCount} {eventCount === 1 ? "EVENT" : "EVENTS"}</div>
                            </button>
                        );
                    })}
            </div>

            {selectedDay !== undefined && (
                <ViewEventsDay
                    today={ selectedDay }
                    setSelectedDay={ setSelectedDay }
                    events={
                        selectedDay
                        ? octoberEvents.filter(i =>
                            selectedDay <= i.eventEnd.split("T")[0] &&
                            selectedDay >= i.eventStart.split("T")[0]
                            )
                        : []
                    }
                    setOpen={ setOpen }
                />
            )}
        </section>
    )
}