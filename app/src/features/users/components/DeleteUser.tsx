import { ModalTitle } from "@/components/shared/ModalTitle";
import { DeleteButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { hasEmptyField } from "@/lib/helper";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function DeleteUser({ toDelete, setDelete, setReload }: {
    toDelete: Partial<User>
    setDelete: Dispatch<SetStateAction<Partial<User> | undefined>>
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const [onProcess, setProcess] = useState(false);

    async function handleSubmit() {
        try {
            setProcess(true)
            const data = await UserService.deleteUser(toDelete.id!);
            if (data) {
                toast.success('User deleted successfully.')
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
                    label="Delete" 
                    spanLabel={ `${toDelete.first_name}?` }
                    spanLabelClassName="text-darkred"
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
                        label="Delete User"
                        loadingLabel="Deleting User"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}