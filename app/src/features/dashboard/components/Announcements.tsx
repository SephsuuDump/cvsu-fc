import { AnnouncementBadge } from "@/components/ui/badge";
import { announcementsMock } from "../../../../public/mock/announcements";
import { formatCustomDate } from "@/lib/helper";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";

export function Announcements() {
    return (
        <ScrollArea className="h-screen">
            <AppHeader 
                label="Welcome back, User!" 
                className="mb-2"
            />
            <div className="flex-center-y gap-2 bg-white py-3 px-4 rounded-md shadow-sm">
                <div className="flex-center rounded-full h-8 w-8 text-white bg-darkgreen">JB</div>
                <Button className="justify-start flex-1 !bg-slate-50 h-8 text-gray shadow-sm rounded-full">Announce something to CvSU Main</Button>
            </div>
            <div>
                {announcementsMock.map((item, i) => (
                    <div className="flex flex-col gap-2 bg-white rounded-md shadow-sm border-slate-300 my-2 p-4" key={i}>
                        <div className="flex justify-between">
                            <div className="flex-center-y gap-2">
                                <div className="flex-center rounded-full h-8 w-8 text-white bg-darkgreen">{ item.user.firstName[0] }{ item.user.lastName[0] }</div>
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
        </ScrollArea>
    )
}