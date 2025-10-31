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
import { FILE_URL } from "@/lib/urls";
import { AppRUDSelection } from "@/components/shared/AppRUDSelection";
import { UpdateAnnouncement } from "./UpdateAnnouncement";
import { DeleteAnnouncement } from "./DeleteAnnouncement";

export function Announcements({ claims, className }: {
    claims: Claim
    className?: string
}) {
    const [reload, setReload] = useState(false);

    const { data: announcements, loading, error } = useFetchData<Announcement>(AnnouncementService.getAllAnnouncements, [reload]) 
    const { open, setOpen, toUpdate, setUpdate, toDelete, setDelete } = useCrudState<Announcement>();

    if (loading) return <CvSULoading className={ className }  />
    return (
        <ScrollArea className={`h-screen ${className}`}>
            <AppHeader 
                label="Recent Announcements" 
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
                {announcements.map((item, i) => (
                    <div className="flex flex-col gap-2 bg-slate-50 rounded-md shadow-sm border-slate-300 my-2 p-4" key={i}>
                        <div className="flex">
                            <div className="flex-center-y gap-2">
                                <AppAvatar fallback={ `${item.user!.first_name[0]}${item.user!.last_name[0]}` } />
                                <div className="font-semibold">{ item.user!.first_name } { item.user!.last_name }</div>
                            </div>
                      
                                
                                <AnnouncementBadge 
                                    label={ item.label }
                                    className="ms-auto mr-4"
                                />
                                <AppRUDSelection 
                                    item={ item }
                                    className="hover:rounded-full hover:bg-slate-200"
                                    setUpdate={ setUpdate }
                                    setDelete={ setDelete }
                                />
                        
                        </div>
                        <div className="text-sm">{ item.content }</div>

                        {item.files && item.files.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {item.files.map((file, idx: number) => {
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

            {open && (
                <CreateAnnouncement
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateAnnouncement
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeleteAnnouncement
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}
        </ScrollArea>
    )
}