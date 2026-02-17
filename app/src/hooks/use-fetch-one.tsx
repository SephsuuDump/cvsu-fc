import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useFetchOne<T>(
  fetchFn: (...args: any[]) => Promise<T>,
  deps: any[] = [],
  args?: any[]
) {
    const [item, setItem] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        if (!args || args.length === 0 || args.some(a => a == null)) {
            setLoading(false);
            return;
        }

        const safeArgs = args; 

        async function fetchData() {
        try {
            setLoading(true);
            const result = await fetchFn(...safeArgs); 
            if (isMounted) setItem(result);
        } catch (err: any) {
            const message = err?.message || "Failed to fetch data";
            setError(message);
            toast.error(message);
        } finally {
            if (isMounted) setLoading(false);
        }
        }

        fetchData();
            return () => {
            isMounted = false;
        };
    }, deps);

    return { data: item, loading, error };
}