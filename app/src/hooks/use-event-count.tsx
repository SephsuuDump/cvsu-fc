"use client";

/**
 * Hook: returns the number of events per day for a given month & year.
 * Normalizes dates to avoid timezone shifting issues.
 */
export function useEventCounts(
    events: FCEvent[],
    currentMonth: number,
    currentYear: number
): Record<number, number> {
    const eventCounts: Record<number, number> = {};

    if (!events?.length) return eventCounts;

    for (const event of events) {
        if (!event.event_start || !event.event_end) continue;

        const start = new Date(event.event_start);
        const end = new Date(event.event_end);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const current = new Date(start);
        while (current <= end) {
        if (
            current.getMonth() === currentMonth &&
            current.getFullYear() === currentYear
        ) {
            const day = current.getDate();
            eventCounts[day] = (eventCounts[day] || 0) + 1;
        }

        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
        }
    }

    return eventCounts;
}
