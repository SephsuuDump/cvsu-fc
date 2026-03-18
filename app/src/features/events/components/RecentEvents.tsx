import { CalendarDays, CalendarOff } from "lucide-react";
import { formatEventRange } from "@/lib/helper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionLoading } from "@/components/ui/loader";

export function RecentEvents({ className, events = [], loading = false }: {
    className?: string;
    events?: FCEvent[];
    loading?: boolean;
}) {
    const sortedEvents = [...events].sort(
        (left, right) =>
            new Date(left.event_start).getTime() - new Date(right.event_start).getTime()
    );

    return (
        <ScrollArea className={`${className}`}>
            <div className="stack-md">
                <div className="flex-center-y gap-1 text-lg font-bold">Recent Events</div>

                {loading && <SectionLoading />}

                {!loading && sortedEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-10 text-center text-slate-500 shadow-sm">
                        <CalendarOff className="mb-2 h-10 w-10 opacity-50" />
                        <div className="text-sm">No events found for the current calendar view.</div>
                    </div>
                )}

                {!loading &&
                    sortedEvents.map((item) => (
                    <div
                        className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                        key={item.id}
                    >
                        <div className="flex-center-y gap-1">
                            <CalendarDays className="h-4 w-4 text-darkgreen" />
                            <div className="text-sm font-semibold text-gray-700">
                                {formatEventRange(item.event_start, item.event_end)}
                            </div>
                        </div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm text-gray">{item.description}</div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}
