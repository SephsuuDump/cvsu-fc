"use client";

import { useState, useMemo } from "react";

export function usePagination<T>(items: T[] = [], defaultSize: number = 20) {
    const [page, setPage] = useState(0); // 0-based index
    const [size, setSize] = useState(defaultSize); // items per page

    const paginated = useMemo(() => {
        if (!items) return [];
        const start = page * size;
        const end = start + size;
        return items.slice(start, end);
    }, [items, page, size]);

    const totalPages = Math.ceil(items.length / size);

    return {
        page,
        setPage,
        size,
        setSize,
        paginated,
        totalPages,
    };
}
