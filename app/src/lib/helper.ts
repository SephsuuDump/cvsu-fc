export function updateField<T>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    key: keyof T,
    value: T[keyof T]
) {
    setState((prev) => ({
        ...prev,
        [key]: value,
    }));
}

export function hasEmptyField(obj: Record<string, any>): boolean {
    return Object.values(obj).some((value) => {
        if (value === 0) return true;                 // number zero
        if (value === "") return true;                // empty string
        if (Array.isArray(value) && value.length === 0) return true; // empty array
        if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            Object.keys(value).length === 0
        ) return true;                                // empty object

        return false;
    });
}

export function formatCustomDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    // Helper: format time as 3:00 PM
    const formatTime = (d: Date) =>
        d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    // Strip time for comparisons
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (target.getTime() === today.getTime()) {
        return `Today at ${formatTime(date)}`;
    }

    if (target.getTime() === yesterday.getTime()) {
        return `Yesterday at ${formatTime(date)}`;
    }

    if (target >= weekAgo) {
        // within the last 7 days
        return `${date.toLocaleDateString("en-US", { weekday: "short" })} at ${formatTime(date)}`;
    }

    // Fallback: Full date (September 28, 2025 at 3:00 PM)
    return `${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })} at ${formatTime(date)}`;
}

export const fromatMessageDateTime = (messageDateTime: string): string => {
    const now = new Date();
    let date: Date;

    // Try to parse messageDateTime if it contains "Today" or exact time only
    // Otherwise, parse it as a Date object if possible
    if (messageDateTime.startsWith("Today")) {
        // Format: "Today 2:30 PM" => show time only
        const parts = messageDateTime.split(" ");
        return parts.slice(1, 3).join(" ");
    } else if (/^\d{1,2}:\d{2} (AM|PM)$/.test(messageDateTime)) {
        // Already a time string, return as is
        return messageDateTime;
    } else if (/^[A-Za-z]{3} \d{1,2}$/.test(messageDateTime)) {
        // Date string "Jul 10" - already date format, return as is
        return messageDateTime;
    } else if (/^[A-Za-z]{3}$/.test(messageDateTime)) {
        // Just day name, return as is
        return messageDateTime;
    } else {
        // Try parsing date strings like "Jul 10", "Mon 3:20 PM", or "Yesterday"
        if (messageDateTime.startsWith("Yesterday")) {
        date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toLocaleDateString("en-US", { weekday: "short" }); // e.g. "Tue"
        } else if (/^[A-Za-z]{3} \d{1,2} \d{1,2}:\d{2} (AM|PM)$/.test(messageDateTime)) {
        // "Jul 10 5:00 PM"
        const [monthDay] = messageDateTime.split(" ");
        return monthDay; // Just date only "Jul 10"
        } else if (/^[A-Za-z]{3} \d{1,2}$/.test(messageDateTime)) {
        return messageDateTime; // already date only
        } else if (/^[A-Za-z]{3} \d{1,2} \d{4}$/.test(messageDateTime)) {
        // "Jul 10 2023" - just return "Jul 10"
        return messageDateTime.split(" ").slice(0, 2).join(" ");
        } else if (/^[A-Za-z]{3}$/.test(messageDateTime)) {
        return messageDateTime; // day name
        }
    }

    // If original messageDateTime is a valid date string:
    date = new Date(messageDateTime);
    if (isNaN(date.getTime())) {
        // If date is invalid, just return original string
        return messageDateTime;
    }

    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // difference in days

    if (diffDays === 0) {
        // Today - show time like "2:30 PM"
        return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } else if (diffDays === 1) {
        // Yesterday - show day name, e.g. "Tue"
        return date.toLocaleDateString("en-US", { weekday: "short" });
    } else if (diffDays > 7) {
        // More than 1 week old - show date "Jul 10"
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
        // Between 2 and 7 days old - show day name e.g. "Mon"
        return date.toLocaleDateString("en-US", { weekday: "short" });
    }
};

export function formatEventRange(eventStart: string, eventEnd: string): string {
    const start = new Date(eventStart);
    const end = new Date(eventEnd);

    const sameDay =
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDate() === end.getDate();

    const sameMonth =
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth();

    const formatTime = (date: Date) =>
        `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const startMonth = monthNames[start.getMonth()];
    const endMonth = monthNames[end.getMonth()];

    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = start.getFullYear(); // assumes same year (can be extended)

    if (sameDay) {
        // 🟩 Same day
        return `${startMonth} ${startDay}, ${year} ${formatTime(start)} - ${formatTime(end)}`;
    } else if (sameMonth) {
        // 🟨 Same month
        return `${startMonth} ${startDay} ${formatTime(start)} - ${endMonth} ${endDay} ${formatTime(end)}, ${year}`;
    } else {
        // 🟥 Different months
        return `${startMonth} ${startDay} ${formatTime(start)} - ${endMonth} ${endDay} ${formatTime(end)}, ${year}`;
    }
}
