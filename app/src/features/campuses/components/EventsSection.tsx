import { CalendarDays, Ellipsis } from "lucide-react";
import { formatEventRange } from "@/lib/helper";
import { useFetchData } from "@/hooks/use-fetch-data";
import { EventService } from "@/services/event.service";
import { SectionLoading } from "@/components/ui/loader";
import Link from "next/link";

export function EventsSection() {
    const { data: events, loading } = useFetchData<FCEvent>(EventService.getAllEvents);

    if (loading) return <SectionLoading />
    return (
        <section className="stack-md reveal">
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {events.map((item, i) => (
                    <div className="break-inside-avoid flex flex-col gap-2 bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-200" key={i}>
                        <div className="flex-center-y gap-1 mb-2">
                            <CalendarDays className="w-4 h-4 text-darkgreen" />
                            <div className="text-sm text-gray-700 font-semibold">{ formatEventRange(item.event_start, item.event_end) }</div>
                            <button
                                className="ms-auto p-0.5 hover:rounded-full hover:bg-slate-200"
                            >
                                <Ellipsis className="w-4 h-4" />
                            </button>
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
        </section>
    )
}