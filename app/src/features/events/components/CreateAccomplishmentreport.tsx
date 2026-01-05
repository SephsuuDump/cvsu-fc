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

export function CreateAccomplishmentReport({ eventId, setOpen, setReload }: {
    eventId: number
    setOpen: Dispatch<SetStateAction<boolean>>
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const [onProcess, setProcess] = useState(false);
    const [report, setReport] = useState({
        title: '',
        introduction: '',
        objectives: '',
        accomplishments: '',
        event_id: eventId
    })

    async function handleSubmit() {
        try {
            setProcess(true)
            const data = await EventService.editAccomplishmentReport(report);
            if (data) {
                toast.success('Accomplishment report edited successfully.')
                setReload(prev => !prev)
                setOpen(false)
            }
        } catch (error) {
            toast.error(String(error))
        } finally { setProcess(false) }
    }
    return (
        <Dialog open onOpenChange={ setOpen }>
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
                        label="Create Report"
                        loadingLabel="Creating Report"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}