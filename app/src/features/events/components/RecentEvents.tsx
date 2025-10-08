import { CalendarDays, CalendarSync, Ellipsis } from "lucide-react";
import { eventsMock } from "../../../../public/mock/events";
import { formatEventRange } from "@/lib/helper";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RecentEvents({ className }: {
    className?: string;
}) {
    return (
        <ScrollArea className={`${className}`}>
            <div className="flex-center-y gap-1 text-lg font-bold"><CalendarSync className="inline-block w-5 h-5 text-darkgreen"/>Recent Events</div>
            {eventsMock.map((item, i) => (
                <div className="flex flex-col gap-2 bg-slate-50 rounded-md shadow-sm border-slate-300 my-2 p-4" key={i}>
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
        </ScrollArea>
    )
}