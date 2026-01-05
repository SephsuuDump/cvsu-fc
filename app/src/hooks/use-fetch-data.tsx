"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useFetchData<T>(
    fetchFn: (...args: any[]) => Promise<T | { content: T[] }>,
    deps: any[] = [],
    args: any[] = [], 
    page = 1,
    size = 1000,
) {
    const [items, setItems] = useState<T | T[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                const result = await fetchFn(...args, page, size);

                if (!isMounted) return;

                if (result && typeof result === "object" && "content" in result) {
                    const res = result as { content: T[] };
                    setItems(res.content);
                } else {
                    setItems(result as T);
                }
            } catch (err: any) {
                const message = err?.message || "Failed to fetch data";
                setError(message);
                toast.error(message);
                console.log('Error:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [page, size, JSON.stringify(deps)]);

    const data = Array.isArray(items) ? items : [];
    return { data, loading, error };
}
