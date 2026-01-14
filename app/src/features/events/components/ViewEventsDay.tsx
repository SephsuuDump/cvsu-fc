import { AppAvatar } from "@/components/shared/AppAvatar";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatDateToWord, formatEventRange } from "@/lib/helper";
import { CalendarDays, CalendarX2, Ellipsis } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AppRUDSelection } from "@/components/shared/AppRUDSelection";
import { useCrudState } from "@/hooks/use-crud-state";
import { UpdateEvent } from "./UpdateEvent";
import { FILE_URL } from "@/lib/urls";
import { DeleteEvent } from "./DeleteEvent";
import { useAuth } from "@/hooks/use-auth";
import { ModalLoader } from "@/components/ui/loader";

export function ViewEventsDay({ today, setSelectedDay, events, setOpen }: {
    today: string
    setSelectedDay: Dispatch<SetStateAction<string | undefined>>
    events: FCEvent[]
    setOpen: Dispatch<SetStateAction<boolean>>
}) {    
    const { claims, loading: authLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const { toView, setView, toUpdate, setUpdate, toDelete, setDelete } = useCrudState<FCEvent>();

    useEffect(() => {
        if (!toView) return
        window.location.href = `/events/${toView.id}`
    }, [toView])

    if (toUpdate) return (
        <UpdateEvent
            toUpdate={ toUpdate }
            setUpdate={ setUpdate }
            setReload={ setReload }
        />
    )

    if (toDelete) return (
        <DeleteEvent
            toDelete={ toDelete }
            setDelete={ setDelete }
            setReload={ setReload }
        />
    )
    if (authLoading) return <ModalLoader />
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setSelectedDay(undefined) }}>
            <DialogContent className="reveal">
                <ModalTitle label={ `Events on ${formatDateToWord(today)}` } />
                {["ADMIN", "COORDINATOR", "MEMBER"].includes(claims.role) && (
                    <div className="-mt-2 flex-center-y gap-2 bg-white py-3 px-4 rounded-md shadow-sm">
                        <AppAvatar />
                        <Button 
                            onClick={ () => {
                                setOpen(true) 
                                setSelectedDay(undefined)
                            }}
                            className="justify-start flex-1 !bg-slate-50 h-8 text-gray shadow-sm rounded-full"
                        >
                            Publish event in { formatDateToWord(today) }
                        </Button>
                    </div>
                )}
                {events && events.length > 0 ?
                    <div className="h-[60vh] overflow-y-auto">
                        {events.map((item, i) => (
                            <div className="flex flex-col gap-2 bg-slate-100 rounded-md shadow-sm border-slate-300 my-2 p-4" key={i}>
                                <div className="flex-center-y gap-1 mb-2">
                                    <CalendarDays className="w-4 h-4 text-darkgreen" />
                                    <div className="text-sm text-gray-700 font-semibold">{ formatEventRange(item.event_start, item.event_end) }</div>
                                    <AppRUDSelection 
                                        className="ms-auto"
                                        item={ item }
                                        icon={ Ellipsis }
                                        setView={ setView }
                                        setUpdate={ setUpdate }
                                        setDelete={ setDelete }
                                        hideUpdate={ claims.id !== item.user?.id }
                                        hideDelete={ claims.id !== item.user?.id }
                                    />
                                </div>
                                <div className="font-semibold">{ item.title }</div>
                                <div className="text-sm text-gray">{ item.description }</div>
                                {item.files && item.files.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {item.files.map((file) => {
                                        const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.file_path);

                                        return isImage ? (
                                            <img
                                                key={file.id}
                                                src={`${FILE_URL}/${file.file_path}`}
                                                alt={file.file_name}
                                                className="w-32 h-32 object-cover rounded-md border border-slate-200"
                                            />
                                        ) : (
                                            <a
                                                key={file.id}
                                                href={`${FILE_URL}/${file.file_path}`}
                                                download
                                                className="flex items-center gap-1 text-sm text-darkgreen hover:underline"
                                                target="_blank"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-4 h-4"
                                                >
                                                    <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 16.5v-9m0 9l-3-3m3 3l3-3M4.5 19.5h15"
                                                    />
                                                </svg>
                                                {file.file_name}
                                            </a>
                                        );
                                        })}
                                    </div>
                                    )}
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