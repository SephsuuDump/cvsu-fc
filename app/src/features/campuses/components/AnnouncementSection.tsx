import { formatCustomDate } from "@/lib/helper";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { Separator } from "@/components/ui/separator";
import { AnnouncementBadge } from "@/components/ui/badge";
import Link from "next/link";
import { useFetchData } from "@/hooks/use-fetch-data";
import { AnnouncementService } from "@/services/announcement.service";
import { SectionLoading } from "@/components/ui/loader";
import { Announcement } from "@/types/announcement";
import { useState } from "react";

export function AnnouncementsSection({ campusId }: {
    campusId: number
}) {
    const [reload, setReload] = useState(false);
    const { data: announcement, loading } = useFetchData<Announcement>(
        AnnouncementService.getAnnouncementsByCampus, 
        [campusId, reload], 
        [campusId]
    ); 
    
    if (loading) return <SectionLoading /> 
    return (
        <section className="stack-md reveal">
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {announcement.map((item, i) => (
                    <div className="break-inside-avoid flex flex-col gap-2 bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-200" key={i}>
                        <div className="flex justify-between">
                            <div className="flex-center-y gap-2">
                                <AppAvatar fallback={ `${item.user?.first_name[0]}${item.user?.last_name[0]}` } />
                                <div className="font-semibold">{ item.user?.first_name } { item.user?.last_name }</div>
                            </div>
                            <AnnouncementBadge label={ item.label } />
                        </div>
                        <div className="text-sm">{ item.content }</div>
                        <Separator />
                        <div className="flex justify-between">
                            <div className="text-xs text-gray-500">{ formatCustomDate(item.created_at) }</div>
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
        </section>
    )
}