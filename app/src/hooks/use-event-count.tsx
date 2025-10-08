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

        // Normalize to midnight to avoid timezone issues
        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            const day = d.getDate();
            eventCounts[day] = (eventCounts[day] || 0) + 1;
        }
        }
    }

    return eventCounts;
}
