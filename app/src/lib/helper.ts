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
