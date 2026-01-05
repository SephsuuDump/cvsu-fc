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

export function ViewAccomplishmentReport({ toView, setView }: {
    toView: AccomplishmentReport
    setView: Dispatch<SetStateAction<AccomplishmentReport | undefined>>
}) {
    const [onProcess, setProcess] = useState(false);
    const [report, setReport] = useState(toView)

    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setView(undefined)} }>
            <DialogContent className="max-h-10/11 overflow-auto">
                <ModalTitle label="Edit Accomplishment Report" /> 
                <div className="space-y-2">
                    <AppInput 
                        label="Report Title"
                        value={ report.title }
                        onChange={ e => updateField(setReport, 'title', e.target.value) }
                        readonly
                    />
                    <AppTextarea 
                        label="I. Introduction"
                        value={ report.introduction }
                        onChange={ e => updateField(setReport, 'introduction', e.target.value) }
                        readonly
                        
                    />
                    <AppTextarea 
                        label="II. Objectives"
                        value={ report.objectives }
                        onChange={ e => updateField(setReport, 'objectives', e.target.value) }
                        readonly
                    />
                    <AppTextarea 
                        label="III. Accomplishment"
                        value={ report.accomplishments }
                        onChange={ e => updateField(setReport, 'accomplishments', e.target.value) }
                        readonly
                    />
                </div>
                <div
                    className="flex justify-end gap-4"
                >   
                    <DialogClose className="mt-4">Close</DialogClose>
                    {/* <AddButton
                        type="submit"
                        label="Creat User"
                        loadingLabel="Creating User"
                        onProcess={ onProcess }
                    /> */}
                </div>
            </DialogContent>
        </Dialog>
    )
}