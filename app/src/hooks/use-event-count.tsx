"use client";

/**
 * Hook: returns the number of events per day for a given month & year.
 * Supports multi-day events and cross-month boundaries.
 */
export function useEventCounts(
    events: FCEvent[],
    currentMonth: number,
    currentYear: number
): Record<number, number> {
    const eventCounts: Record<number, number> = {};

    if (!events?.length) return eventCounts;

    for (const event of events) {
        const start = new Date(event.eventStart);
        const end = new Date(event.eventEnd);

        const startDate = new Date(
            Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
        );
        const endDate = new Date(
            Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())
        );

        for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
            if (d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear) {
                const day = d.getUTCDate();
                eventCounts[day] = (eventCounts[day] || 0) + 1;
            }
        }
    }

    return eventCounts;
}
