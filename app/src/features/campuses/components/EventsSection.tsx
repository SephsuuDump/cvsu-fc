import { CalendarDays, CalendarOff, Ellipsis, Touchpad } from "lucide-react";
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

export function EventsSection({ campusId }: {
    campusId: number;
}) {
    const [reload, setReload] = useState(false);
    const { data: events, loading } = useFetchData<FCEvent>(    
        EventService.getEventsByCampus,
        [campusId, reload],
        [campusId, '', '']
    );
    const { toUpdate, setUpdate, toDelete, setDelete } = useCrudState<FCEvent>()

    if (loading) return <SectionLoading />
    return (
        <section className="stack-md reveal">
            {events.length === 0 && (
                <div className="col-span-3 py-10 flex flex-col items-center text-slate-500">
                    <CalendarOff className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">No events found.</p>
                </div>
            )}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {events.map((item, i) => (
                    <div className="break-inside-avoid flex flex-col gap-2 bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-200" key={i}>
                        <div className="flex-center-y gap-1 mb-2">
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