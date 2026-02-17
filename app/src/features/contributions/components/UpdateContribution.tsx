import { ModalTitle } from "@/components/shared/ModalTitle";
import { UpdateButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { ContributionService } from "@/services/contribution.service";
import { Contribution } from "@/types/contribution";
import { ArrowBigRight } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function UpdateContribution({ toUpdate, setUpdate, setReload }: {
    toUpdate: {
        first_name: string;
        last_name: string;
        id: number,
        month: string,
        year: string;
        contributed: number;
    }
    setUpdate: Dispatch<SetStateAction<{
        first_name: string;
        last_name: string;
        id: number,
        month: string,
        year: string;
        contributed: number;
    } | undefined>>
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    console.log('to update', toUpdate);
    
    const isPaid = toUpdate.contributed === 1;
    const [onProcess, setProcess] = useState(false);

    async function handleSubmit() {
        try {
            setProcess(true);
            const data = await ContributionService.updateContribution(toUpdate.id, isPaid ? 0 : 1);
            if (data) {
                setReload(prev => !prev)
                setUpdate(undefined)
            }
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    }
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setUpdate(undefined) }}>
            <DialogContent>
                <ModalTitle label="Update Contribution" />
                <div className="text-lg text-center font-bold">
                    Update Contributions of { `${toUpdate.first_name} ${toUpdate.last_name}.` }
                </div>
                <div className="flex-center gap-4">
                    <div
                        className={`text-white text-center py-1 w-25 font-semibold tracking-wider ${isPaid ? "bg-darkgreen" : "bg-darkred"}`}
                    >
                        { isPaid ? "PAID" : "UNPAID"}
                    </div>
                    <ArrowBigRight className="scale-x-120 w-5 h-5" fill="#000" />
                    <div
                        className={`text-white text-center py-1 w-25 font-semibold tracking-wider ${!isPaid ? "bg-darkgreen" : "bg-darkred"}`}
                    >
                        { !isPaid ? "PAID" : "UNPAID"}
                    </div>
                </div>
                <form   
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex-center-y justify-end gap-4 mt-4"
                >
                    <DialogClose>Close</DialogClose>
                    <UpdateButton
                        type="submit"
                        onProcess={ onProcess }
                        label="Update Contribution"
                        loadingLabel="Updating Contribution"
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}