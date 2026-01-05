import { AppInput } from "@/components/shared/AppInput";
import { AppTextarea } from "@/components/shared/AppTextare";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { ModalLoader } from "@/components/ui/loader";
import { updateField } from "@/lib/helper";
import { EventService } from "@/services/event.service";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function UpdateAccomplishmentReport({ toUpdate, setUpdate, setReload }: {
    toUpdate: AccomplishmentReport
    setUpdate: Dispatch<SetStateAction<AccomplishmentReport | undefined>>
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const [onProcess, setProcess] = useState(false);
    const [report, setReport] = useState(toUpdate)

    async function handleSubmit() {
        try {
            setProcess(true)
            const data = await EventService.updateAccomplishmentReport(report);
            if (data) {
                toast.success('Accomplishment report updated successfully.')
                setReload(prev => !prev)
                setUpdate(undefined)
            }
        } catch (error) {
            toast.error(String(error))
        } finally { setProcess(false) }
    }
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setUpdate(undefined)} }>
            <DialogContent className="max-h-10/11 overflow-auto">
                <ModalTitle label="Edit Accomplishment Report" /> 
                <div className="space-y-2">
                    <AppInput 
                        label="Report Title"
                        value={ report.title }
                        onChange={ e => updateField(setReport, 'title', e.target.value) }
                    />
                    <AppTextarea 
                        label="I. Introduction"
                        value={ report.introduction }
                        onChange={ e => updateField(setReport, 'introduction', e.target.value) }
                    />
                    <AppTextarea 
                        label="II. Objectives"
                        value={ report.objectives }
                        onChange={ e => updateField(setReport, 'objectives', e.target.value) }
                    />
                    <AppTextarea 
                        label="III. Accomplishment"
                        value={ report.accomplishments }
                        onChange={ e => updateField(setReport, 'accomplishments', e.target.value) }
                    />
                </div>
                <form
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex justify-end gap-4"
                >   
                    <DialogClose>Cancel</DialogClose>
                    <AddButton
                        type="submit"
                        label="Creat User"
                        loadingLabel="Creating User"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}