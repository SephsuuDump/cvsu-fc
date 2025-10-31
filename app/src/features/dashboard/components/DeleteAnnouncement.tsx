import { ModalTitle } from "@/components/shared/ModalTitle";
import { DeleteButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { AnnouncementService } from "@/services/announcement.service";
import { Announcement } from "@/types/announcement";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function DeleteAnnouncement({ toDelete, setDelete, setReload }: {
    toDelete: Partial<Announcement>
    setDelete: Dispatch<SetStateAction<Announcement | undefined>>
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const [onProcess, setProcess] = useState(false);

    async function handleSubmit() {
        try {
            setProcess(true)
            const data = await AnnouncementService.deleteAnnouncement(toDelete.id!);
            if (data) {
                toast.success('Announcement deleted successfully.')
                setReload(prev => !prev)
                setDelete(undefined)
            }
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    }


    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setDelete(undefined) }}>
            <DialogContent>
                <ModalTitle 
                    label="Are you sure to delete this post?" 
                />
                <form
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex justify-end gap-4"
                >   
                    <DialogClose>Cancel</DialogClose>
                    <DeleteButton
                        type="submit"
                        label="Delete Post"
                        loadingLabel="Deleting Post"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}