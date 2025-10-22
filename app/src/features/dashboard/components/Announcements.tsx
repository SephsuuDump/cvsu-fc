import { AnnouncementBadge } from "@/components/ui/badge";
import { announcementsMock } from "../../../../public/mock/announcements";
import { formatCustomDate } from "@/lib/helper";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { useCrudState } from "@/hooks/use-crud-state";
import { CreateAnnouncement } from "./CreateAnnouncement";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { useState } from "react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Announcement } from "@/types/announcement";
import { AnnouncementService } from "@/services/announcement.service";
import { CvSULoading } from "@/components/ui/loader";

export function Announcements() {
    const [reload, setReload] = useState(false);

    const { data: announcements, loading, error } = useFetchData<Announcement>(AnnouncementService.getAllAnnouncements, [reload]) 
    const { open, setOpen } = useCrudState();

    if (loading) return <CvSULoading />
    return (
        <ScrollArea className="h-screen">
            <AppHeader 
                label="Welcome back, User!" 
                className="mb-2"
            />
            <div className="flex-center-y gap-2 bg-white py-3 px-4 rounded-md shadow-sm">
                <AppAvatar />
                <Button 
                    onClick={ () => setOpen(true) }
                    className="justify-start flex-1 !bg-slate-50 h-8 text-gray shadow-sm rounded-full"
                >
                    Announce something to CvSU Main
                </Button>
            </div>
            <div>
                {announcementsMock.map((item, i) => (
                    <div className="flex flex-col gap-2 bg-slate-50 rounded-md shadow-sm border-slate-300 my-2 p-4" key={i}>
                        <div className="flex justify-between">
                            <div className="flex-center-y gap-2">
                                <AppAvatar fallback={ `${item.user.firstName[0]}${item.user.lastName[0]}` } />
                                <div className="font-semibold">{ item.user.firstName } { item.user.lastName }</div>
                            </div>
                            <AnnouncementBadge label={ item.label } />
                        </div>
                        <div className="text-sm">{ item.content }</div>
                        <Separator />
                        <div className="flex justify-between">
                            <div className="text-xs text-gray-500">{ formatCustomDate(item.createdAt) }</div>
                            <Link
                                href={``}
                                className="text-xs text-darkgreen font-semibold opacity-80 hover:text-black hover:opacity-100"
                            >
                                View More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {open && (
                <CreateAnnouncement
                    setOpen={ setOpen }
                />
            )}
        </ScrollArea>
    )
}