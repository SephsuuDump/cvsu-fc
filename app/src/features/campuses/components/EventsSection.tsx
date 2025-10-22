import { CalendarDays, Ellipsis } from "lucide-react";
import { octoberEvents } from "../../../../public/mock/events";
import { formatEventRange } from "@/lib/helper";

export function EventsSection() {
    return (
        <section className="stack-md reveal">
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {octoberEvents.map((item, i) => (
                    <div className="break-inside-avoid flex flex-col gap-2 bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-200" key={i}>
                        <div className="flex-center-y gap-1 mb-2">
                            <CalendarDays className="w-4 h-4 text-darkgreen" />
                            <div className="text-sm text-gray-700 font-semibold">{ formatEventRange(item.eventStart, item.eventEnd) }</div>
                            <button
                                className="ms-auto p-0.5 hover:rounded-full hover:bg-slate-200"
                            >
                                <Ellipsis className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="font-semibold">{ item.title }</div>
                        <div className="text-sm text-gray">{ item.description }</div>
                    </div>
                ))}
            </div>
        </section>
    )
}