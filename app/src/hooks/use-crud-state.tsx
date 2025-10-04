import { useState } from "react";

export function useCrudState<T>() {
    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<T | undefined>();
    const [toDelete, setDelete] = useState<T | undefined>();

    return {
        open,
        setOpen,
        toUpdate,
        setUpdate,
        toDelete,
        setDelete,
    };
}
