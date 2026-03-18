import { AppSelect } from "@/components/shared/AppSelect";
import { CalendarDays, CalendarOff, Ellipsis } from "lucide-react";
import { formatEventRange } from "@/lib/helper";
import { useFetchData } from "@/hooks/use-fetch-data";
import { EventService } from "@/services/event.service";
import { SectionLoading } from "@/components/ui/loader";
import Link from "next/link";
import { AppRUDSelection } from "@/components/shared/AppRUDSelection";
import { useCrudState } from "@/hooks/use-crud-state";
import { useState } from "react";
import { UpdateEvent } from "@/features/events/components/UpdateEvent";
import { DeleteEvent } from "@/features/events/components/DeleteEvent";

const months = [
    { label: "January", value: "january" },
    { label: "February", value: "february" },
    { label: "March", value: "march" },
    { label: "April", value: "april" },
    { label: "May", value: "may" },
    { label: "June", value: "june" },
    { label: "July", value: "july" },
    { label: "August", value: "august" },
    { label: "September", value: "september" },
    { label: "October", value: "october" },
    { label: "November", value: "november" },
    { label: "December", value: "december" },
];

const currentYear = new Date().getFullYear();
const years = [
    ...Array.from({ length: 5 }, (_, index) => ({
        label: String(currentYear - index),
        value: String(currentYear - index),
    })),
];

const visibilities = [
    { label: "All Members", value: "ALL" },
    { label: "Coordinator", value: "COORDINATOR" },
    { label: "Member", value: "MEMBER" },
    { label: "Job Offer", value: "JOB OFFER" },
];

function getCampusLabel(name?: string) {
    if (!name) return "All Campuses";
    return name.match(/University\s*-\s*(.+)/i)?.[1] ?? name;
}

export function EventsSection({ campusId }: {
    campusId: number;
}) {
    const [reload, setReload] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toLocaleString("default", { month: "long" }).toLowerCase()
    );
    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [selectedVisibility, setSelectedVisibility] = useState("ALL");

    const { data: events, loading } = useFetchData<FCEvent>(    
        EventService.getEventsByCampus,
        [campusId, reload, selectedMonth, selectedYear, selectedVisibility],
        [campusId, selectedMonth, selectedYear, selectedVisibility]
    );
    const { toUpdate, setUpdate, toDelete, setDelete } = useCrudState<FCEvent>()

    return (
        <section className="stack-md reveal">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <AppSelect
                    label="Month"
                    groupLabel="Filter by month"
                    items={months}
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                />
                <AppSelect
                    label="Year"
                    groupLabel="Filter by year"
                    items={years}
                    value={selectedYear}
                    onChange={setSelectedYear}
                />
                <AppSelect
                    label="Visibility"
                    groupLabel="Filter by visibility"
                    items={visibilities}
                    value={selectedVisibility}
                    onChange={setSelectedVisibility}
                />
            </div>

            {loading ? (
                <SectionLoading />
            ) : events.length === 0 ? (
                <div className="col-span-3 py-10 flex flex-col items-center text-slate-500">
                    <CalendarOff className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">No events found.</p>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {events.map((item, i) => (
                        <div className="break-inside-avoid flex flex-col gap-2 bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-200" key={i}>
                            <div className="flex-center-y gap-1">
                                <CalendarDays className="w-4 h-4 text-darkgreen" />
                                <div className="text-sm text-gray-700 font-semibold">{ formatEventRange(item.event_start, item.event_end) }</div>
                                <AppRUDSelection 
                                    className="ms-auto"
                                    item={ item }
                                    icon={ Ellipsis }
                                    setUpdate={ setUpdate }
                                    setDelete={ setDelete }
                                />
                            </div>
                            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-linear-to-r from-emerald-50 to-white px-2.5 py-1 text-[10px] font-semibold text-darkgreen shadow-sm">
                                <span className="truncate text-[9px] font-bold text-emerald-800/80 uppercase">
                                    {getCampusLabel(item.campus?.name)}
                                </span>
                            </div>
                            <div className="font-semibold">{ item.title }</div>
                            <div className="text-sm text-gray">{ item.description }</div>
                            <Link
                                href={``}
                                className="text-xs ms-auto text-darkgreen font-semibold opacity-80 hover:text-black hover:opacity-100"
                            >
                                View More
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {toUpdate && (
                <UpdateEvent
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeleteEvent
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}
