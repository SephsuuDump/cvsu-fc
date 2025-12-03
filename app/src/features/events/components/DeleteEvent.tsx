import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader } from "@/components/ui/loader";
import { EventService } from "@/services/event.service";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function DeleteEvent({ toDelete, setDelete, setReload }: {
    toDelete: FCEvent,
    setDelete: Dispatch<SetStateAction<FCEvent | undefined>>
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const [onProcess, setProcess] = useState(false);

    async function handleDelete() {
        try {
            setProcess(true);
            const data = await EventService.deleteEvent(toDelete.id);
            if (data) {
                toast.success('Event deleted successfully!')
                setReload(prev => !prev)
                setDelete(undefined)
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally { setProcess(false) }
    }
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setDelete(undefined) } }>
            <DialogContent className="reveal">
                <DialogTitle><AppHeader label="Are you sure to delete event?" /></DialogTitle>
                <div className="flex justify-end gap-4">
                    <DialogClose>Cancel</DialogClose>
                    <Button 
                        onClick={ handleDelete }
                        className="!bg-darkred hover:opacity-90"
                    >
                        <FormLoader 
                            onProcess={ onProcess }
                            label="Delete Event"
                            loadingLabel="Deleting Event"
                        />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}