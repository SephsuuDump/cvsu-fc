import { AnnouncementBadge } from "@/components/ui/badge";
import { formatCustomDate } from "@/lib/helper";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { useCrudState } from "@/hooks/use-crud-state";
import { CreateAnnouncement } from "./CreateAnnouncement";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Announcement } from "@/types/announcement";
import { AnnouncementService } from "@/services/announcement.service";
import { CvSULoading } from "@/components/ui/loader";
import { FILE_URL } from "@/lib/urls";
import { AppRUDSelection } from "@/components/shared/AppRUDSelection";
import { UpdateAnnouncement } from "./UpdateAnnouncement";
import { DeleteAnnouncement } from "./DeleteAnnouncement";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CalendarSearch, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/use-mobile";

export function Announcements({ claims, className }: {
    claims: Claim
    className?: string
}) {
    const isMobile = useIsMobile();
    const [reload, setReload] = useState(false);
    const [viewImage, setViewImage] = useState<string | undefined>();
    const [localLikes, setLocalLikes] = useState<Record<number, boolean>>({});
    const [localLikeCount, setLocalLikeCount] = useState<Record<number, number>>({});
    const [localLikeUsers, setLocalLikeUsers] = useState<Record<number, { id: number; name: string }[]>>({});
    const [range, setRange] = useState<DateRange | undefined>();

    const getAnnouncements = useCallback(() => {
        if (claims.role === "ADMIN") {
            return AnnouncementService.getAllAnnouncements();
        }

        if (["COORDINATOR", "JOB ORDER", "MEMBER"].includes(claims.role)) {
            return AnnouncementService.getAnnouncementsByCampus(claims?.campus?.id ?? 0);
        }

        return AnnouncementService.getAllAnnouncements();
    }, [claims.role, claims?.campus?.id]);

    const { data: announcements, loading } = useFetchData<Announcement>(
        getAnnouncements,
        [reload, claims?.campus?.id],
        [claims?.campus?.id ?? 0]
    );

    const { open, setOpen, toView, setView, toUpdate, setUpdate, toDelete, setDelete } = useCrudState<Announcement>();

    useEffect(() => {
        if (!toView) return;
        window.location.href = `/announcements/${toView.id}`;
    }, [toView]);

    function shallowEqualRecordNumber(a: Record<number, number>, b: Record<number, number>) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        for (const k of aKeys) {
            if (a[Number(k)] !== b[Number(k)]) return false;
        }
        return true;
    }

    function shallowEqualRecordBool(a: Record<number, boolean>, b: Record<number, boolean>) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        for (const k of aKeys) {
            if (a[Number(k)] !== b[Number(k)]) return false;
        }
        return true;
    }

    function shallowEqualUserList(
        a: { id: number; name: string }[],
        b: { id: number; name: string }[]
    ) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i].id !== b[i].id || a[i].name !== b[i].name) return false;
        }
        return true;
    }

    function shallowEqualRecordUsers(
        a: Record<number, { id: number; name: string }[]>,
        b: Record<number, { id: number; name: string }[]>
    ) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;

        for (const k of aKeys) {
            const key = Number(k);
            const aList = a[key] ?? [];
            const bList = b[key] ?? [];
            if (!shallowEqualUserList(aList, bList)) return false;
        }
        return true;
    }

    useEffect(() => {
        if (!announcements) return;

        const likes: Record<number, boolean> = {};
        const counts: Record<number, number> = {};
        const users: Record<number, { id: number; name: string }[]> = {};

        announcements.forEach((item) => {
            likes[item.id] = item.likes?.some((like) => like.id === claims.id) ?? false;
            counts[item.id] = item.likes_count ?? 0;
            users[item.id] = (item.likes ?? []).map((u) => ({
            id: u.id,
            name: `${u.name ?? ""} ${u.name ?? ""}`.trim() || u.name || "",
            }));
        });

        setLocalLikes((prev) => (shallowEqualRecordBool(prev, likes) ? prev : likes));
        setLocalLikeCount((prev) => (shallowEqualRecordNumber(prev, counts) ? prev : counts));
        setLocalLikeUsers((prev) => (shallowEqualRecordUsers(prev, users) ? prev : users));
    }, [announcements, claims.id]);

    const filteredAnnouncements = useMemo(() => {
        if (!announcements) return [];

        if (!range?.from && !range?.to) return announcements;

        return announcements.filter((item) => {
            const created = new Date(item.created_at);

            if (range.from && range.to) {
                const start = new Date(range.from);
                start.setHours(0, 0, 0, 0);

                const end = new Date(range.to);
                end.setHours(23, 59, 59, 999);

                return created >= start && created <= end;
            }

            if (range.from && !range.to) {
                const start = new Date(range.from);
                start.setHours(0, 0, 0, 0);
                return created >= start;
            }

            return true;
        });
    }, [announcements, range]);

    async function likeAnnouncement(id: number) {
        const wasLiked = localLikes[id] ?? false;
        const currentUserName = `${claims.firstName} ${claims.lastName}`;

        setLocalLikeCount((prev) => ({
            ...prev,
            [id]: (prev[id] ?? 0) + (wasLiked ? -1 : 1),
        }));

        setLocalLikes((prev) => ({
            ...prev,
            [id]: !wasLiked,
        }));

        setLocalLikeUsers((prev) => {
            const list = prev[id] ?? [];
            return wasLiked
                ? { ...prev, [id]: list.filter((u) => u.id !== claims.id) }
                : { ...prev, [id]: [...list, { id: claims.id, name: currentUserName }] };
        });

        try {
            await AnnouncementService.likeAnnouncement(id, localStorage.getItem("token") ?? "");
        } catch {
            toast.error("Error liking announcement");
            setReload((r) => !r);
        }
    }

    if (loading) return <CvSULoading className={ className }  />
    return (
        <section className={`${className} scrollbar-custom`}>
      
                {!isMobile && (
                    <AppHeader 
                        label="Recent Announcements" 
                        className="mb-2"
                    />
                )}
                <div className="w-full flex-center-y gap-2">
                    <div className="w-full flex-center-y gap-2 bg-white py-3 px-4 rounded-md shadow-sm max-sm:grid!">
                        {["ADMIN", "COORDINATOR", "MEMBER"].includes(claims.role) && (
                            <div className="w-full flex-center-y gap-2">
                                <AppAvatar />
                                <Button 
                                    onClick={ () => setOpen(true) }
                                    className="w-full justify-start flex-1 !bg-slate-50 h-8 text-gray shadow-sm rounded-full"
                                >
                                    Announce something to CvSU Main
                                </Button>
                            </div>                        
                        )}
                        <Popover>
                            <PopoverTrigger className="w-fit h-full !bg-slate-50 max-sm:w-full" asChild>
                                <Button
                                    variant="secondary"
                                    className={`rounded-full bg-white shadow-sm gap-2 ${
                                        range?.from ? "border border-darkgreen text-darkgreen" : ""
                                    }`}
                                >
                                    Filter <CalendarSearch className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-3" align="end">
                                <Calendar
                                    mode="range"
                                    selected={range}
                                    onSelect={setRange}
                                    numberOfMonths={2}
                                    defaultMonth={range?.from ?? new Date()}
                                    disabled={(date) => date > new Date()}
                                />

                                {range?.from && (
                                    <Button
                                        variant="ghost"
                                        className="mt-2 w-full text-sm text-red-600 hover:bg-red-50"
                                        onClick={() => setRange(undefined)}
                                    >
                                        Clear filter
                                    </Button>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                
                <div>
                    {filteredAnnouncements.map((item) => (
                        <div className="flex flex-col gap-2 bg-slate-50 rounded-md shadow-sm border-slate-300 my-2 p-4" key={item.id}>
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
                                    setView={ setView }
                                    setUpdate={ setUpdate  }
                                    setDelete={ setDelete }
                                    hideUpdate={ item.user?.id !== claims.id }
                                    hideDelete={ item.user?.id !== claims.id }
                                />
                            </div>
                            <div className="text-sm">{ item.content }</div>

                            {item.files && item.files.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {item.files.map((file) => {
                                        const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.file_path);

                                        return isImage ? (
                                            <img
                                                key={file.id}
                                                src={`${FILE_URL}/${file.file_path}`}
                                                alt={file.file_name}
                                                className="w-32 h-32 object-cover rounded-md border border-slate-200 cursor-pointer"
                                                onClick={ () => setViewImage(`${FILE_URL}/${file.file_path}`) }
                                            />
                                        ) : (
                                            <a
                                                key={file.id}
                                                href={`${FILE_URL}/${file.file_path}`}
                                                download
                                                className="flex items-center gap-1 text-sm text-darkgreen overflow-ellipsis hover:underline"
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
                                <div className="flex-center-y gap-2">
                                    {claims.role !== "ADMIN" ? (
                                        <ThumbsUp
                                            onClick={() => likeAnnouncement(item.id)}
                                            className="cursor-pointer transition-colors"
                                            fill={localLikes[item.id] ? "#016630" : "#fff"}
                                        />
                                    ) : (
                                        <ThumbsUp />
                                    )}
                                    <HoverCard openDelay={150}>
                                        <HoverCardTrigger asChild>
                                            <div className="font-semibold mt-1 cursor-default">
                                                {localLikeCount[item.id] ?? 0}
                                            </div>
                                        </HoverCardTrigger>

                                        <HoverCardContent className="w-64 p-3 shadoow shadow-darkgreen">
                                            <div className="text-sm font-semibold mb-2">
                                                Liked by
                                            </div>

                                            {((localLikeUsers[item.id] ?? []).length === 0) ? (
                                                <div className="text-xs text-gray-500">No likes yet</div>
                                            ) : (
                                                <ScrollArea className="max-h-48 pr-2">
                                                    <div className="flex flex-col gap-1">
                                                        {(localLikeUsers[item.id] ?? []).map((u) => (
                                                            <div key={u.id} className="text-sm">
                                                                {u.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            )}
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {viewImage && (
                    <ImagePreview 
                        url={ viewImage }
                        setOpen={ setViewImage }
                    />
                )}

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
       
        </section>
        
    )
}

function ImagePreview({
    url,
    setOpen,
}: {
    url: string;
    setOpen: Dispatch<SetStateAction<string | undefined>>;
}) {
    return (
        <Dialog open onOpenChange={(open) => { 
            if (!open) setOpen(undefined); 
        }}>
            <DialogContent className="p-0 max-w-3xl w-full">
                <DialogTitle className="sr-only">Image Preview</DialogTitle>

                <div className="relative w-full max-h-[90vh] flex items-center justify-center bg-black">
                    <img
                        src={url}
                        alt="Preview"
                        className="object-contain max-h-[90vh] w-full"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
