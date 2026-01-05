import { DeleteButton } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
} from "@/components/ui/dialog";
import { OfficerService, PositionService } from "@/services/officer.service";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { Position } from "@/types/officer";

export function DeletePosition({
    toDelete,
    setDelete,
    setReload,
}: {
    toDelete: Position;
    setDelete: Dispatch<SetStateAction<Position | undefined>>;
    setReload: Dispatch<SetStateAction<boolean>>;
}) {
    const [onProcess, setProcess] = useState(false);

    async function handleDeactivate() {
        try {
            setProcess(true);

            const data = await PositionService.deletePosition(
                toDelete.id
            );

            if (data) {
                toast.success("Position deleted successfully!");
                setReload((prev) => !prev);
                setDelete(undefined);
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setProcess(false);
        }
    }

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) setDelete(undefined);
            }}
        >
            <DialogContent className="reveal">
                <ModalTitle 
                    label={`Delete position `} 
                    spanLabel={`${toDelete.position}?`}
                    spanLabelClassName="text-darkred"
                />
                <form
                    onSubmit={ e => {
                        e.preventDefault();
                        handleDeactivate();
                    }}
                    className="flex justify-end gap-4"
                >   
                    <DialogClose>Cancel</DialogClose>
                    <DeleteButton
                        type="submit"
                        label="Delete Position"
                        loadingLabel="Delete Position"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
