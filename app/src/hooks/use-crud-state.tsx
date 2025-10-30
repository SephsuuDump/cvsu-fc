import { useState } from "react";

export function useCrudState<T>() {
    const [open, setOpen] = useState(false);
    const [toView, setView] = useState<T | undefined>();
    const [toUpdate, setUpdate] = useState<T | undefined>();
    const [toDelete, setDelete] = useState<T | undefined>();

    return {
        open,
        setOpen,
        toView,
        setView,
        toUpdate,
        setUpdate,
        toDelete,
        setDelete,
    };
}
