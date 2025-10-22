import { AppDateSelect } from "@/components/shared/AppDateSelect";
import { AppInput } from "@/components/shared/AppInput";
import { AppTextarea } from "@/components/shared/AppTextare";
import { AppTimeSelect } from "@/components/shared/AppTimeSelect";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { updateField } from "@/lib/helper";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function CreateEvent({ setOpen }: {
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    const [onProcess, setProcess] = useState(false)
    const [event, setEvent] = useState<Partial<FCEvent>>({
        title: '',
        description: '',
        eventStart: undefined,
        eventEnd: undefined,
    });

    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()
    const [startTime, setStartTime] = useState<string>("00:00:00")
    const [endTime, setEndTime] = useState<string>("12:00:00")

    const handleStartChange = (date?: Date, time?: string) => {
        if (!date && !time) return
        const t = time ?? startTime
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(t)) return
        const finalDate = new Date(date ?? startDate ?? new Date())
        const [hours, minutes, seconds] = t.split(":").map(Number)
        finalDate.setHours(hours, minutes, seconds || 0, 0)
        setStartDate(finalDate)
        setEvent(prev => ({ ...prev, eventStart: finalDate.toISOString() }))
    }
    
    const handleEndChange = (date?: Date, time?: string) => {
        if (!date && !time) return
        const t = time ?? endTime
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(t)) return
        const finalDate = new Date(date ?? endDate ?? new Date())
        const [hours, minutes, seconds] = t.split(":").map(Number)
        finalDate.setHours(hours, minutes, seconds || 0, 0)
        setEndDate(finalDate)
        setEvent(prev => ({ ...prev, eventEnd: finalDate.toISOString() }))
    }

    async function handleSubmit() {

    }

    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent className="reveal">
                <ModalTitle label="Publish an Event" />
                <AppInput
                    label="Event Title"
                    value={ event.title }
                    onChange={ e => updateField(setEvent, 'title', e.target.value) }
                />
                <AppTextarea
                    label="Event Description"
                    value={ event.description }
                    onChange={ e => updateField(setEvent, 'description', e.target.value) }
                    height={30}
                />
                <div className="grid grid-cols-2 gap-2">
                    <div className="stack-md">
                        <AppDateSelect
                            label="Event Start Date"
                            value={startDate}
                            onChange={(date) => handleStartChange(date, startTime)}
                        />
                        <AppTimeSelect
                            value={startTime}
                            onChange={(time) => {
                                setStartTime(time)
                                handleStartChange(startDate, time)
                            }}
                            noLabel
                        />
                    </div>

                    <div className="stack-md">
                        <AppDateSelect
                            label="Event End Date"
                            value={endDate}
                            onChange={(date) => handleEndChange(date, endTime)}
                        />
                        <AppTimeSelect
                            value={endTime}
                            onChange={(time) => {
                                setEndTime(time)
                                handleEndChange(endDate, time)
                            }}
                            noLabel
                        />
                    </div>
                </div>
                <form   
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex-center-y justify-end gap-4"
                >
                    <DialogClose>Cancel</DialogClose>
                    <AddButton
                        type="submit"
                        onProcess={ onProcess }
                        label="Add Event"
                        loadingLabel="Adding Event"
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}