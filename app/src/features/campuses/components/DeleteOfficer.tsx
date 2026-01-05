import { AppHeader } from "@/components/shared/AppHeader";
import { Button, DeleteButton } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { FormLoader } from "@/components/ui/loader";
import { OfficerService } from "@/services/officer.service";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Officer } from "@/types/officer";
import { ModalTitle } from "@/components/shared/ModalTitle";

export function DeactivateOfficer({
    toDeactivate,
    setDeactivate,
    setReload,
}: {
    toDeactivate: {
        id: number;
        name: string;
        assigned_date: string;
    };
    setDeactivate: Dispatch<SetStateAction<{
        id: number;
        name: string;
        assigned_date: string;
    } | undefined>>;
    setReload: Dispatch<SetStateAction<boolean>>;
}) {
    const [onProcess, setProcess] = useState(false);

    async function handleDeactivate() {
        try {
            setProcess(true);

            const data = await OfficerService.deactivateOfficer(
                toDeactivate.id
            );

            if (data) {
                toast.success("Officer deactivated successfully!");
                setReload((prev) => !prev);
                setDeactivate(undefined);
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
                if (!open) setDeactivate(undefined);
            }}
        >
            <DialogContent className="reveal">
                <ModalTitle 
                    label={`Remove position assigned to`} 
                    spanLabel={`${toDeactivate.name}?`}
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
                        label="Remove Assignment"
                        loadingLabel="Removing Assignment"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
