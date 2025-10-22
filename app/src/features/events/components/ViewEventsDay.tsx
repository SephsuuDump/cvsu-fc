import { AppAvatar } from "@/components/shared/AppAvatar";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { formatCustomDate, formatDateToWord, formatEventRange } from "@/lib/helper";
import { CalendarDays, CalendarOff, CalendarX2, Ellipsis } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { CreateEvent } from "./CreateEvent";

export function ViewEventsDay({ today, setSelectedDay, events, setOpen }: {
    today: string
    setSelectedDay: Dispatch<SetStateAction<string | undefined>>
    events: FCEvent[]
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setSelectedDay(undefined) }}>
            <DialogContent className="reveal">
                <ModalTitle label={ `Events on ${formatDateToWord(today)}` } />
                <div className="-mt-2 flex-center-y gap-2 bg-white py-3 px-4 rounded-md shadow-sm">
                    <AppAvatar />
                    <Button 
                        onClick={ () => {
                            setOpen(true) 
                            setSelectedDay(undefined)
                        }}
                        className="justify-start flex-1 !bg-slate-50 h-8 text-gray shadow-sm rounded-full"
                    >
                        Publish an event to CvSU Main
                    </Button>
                </div>
                {events && events.length > 0 ?
                    <div className="h-[60vh] overflow-y-auto">
                        {events.map((item, i) => (
                            <div className="flex flex-col gap-2 bg-slate-100 rounded-md shadow-sm border-slate-300 my-2 p-4" key={i}>
                                <div className="flex-center-y gap-1 mb-2">
                                    <CalendarDays className="w-4 h-4 text-darkgreen" />
                                    <div className="text-sm text-gray-700 font-semibold">{ formatEventRange(item.eventStart, item.eventEnd) }</div>
                                    <button
                                        className="ms-auto p-0.5 hover:rounded-full hover:bg-slate-200"
                                    >
                                        <Ellipsis className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="font-semibold">{ item.title }</div>
                                <div className="text-sm text-gray">{ item.description }</div>
                            </div>
                        ))}
                    </div>
                    :
                    <div className="flex-center flex-col mt-4 mb-8">
                        <CalendarX2 className="w-40 h-40 text-slate-300" />
                        <div className="text-sm text-gray">There are no events on { formatDateToWord(today) }</div>
                    </div>
                }
            </DialogContent>
        </Dialog>

    )
}