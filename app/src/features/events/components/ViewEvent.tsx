"use client";

import { CvSULoading, SectionLoading } from "@/components/ui/loader";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { EventService } from "@/services/event.service";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Download,
    FileText,
    CalendarDays,
    MapPin,
    User,
    Flag
} from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { BASE_URL, FILE_URL } from "@/lib/urls";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useCrudState } from "@/hooks/use-crud-state";
import { CreateAccomplishmentReport } from "./CreateAccomplishmentreport";
import { UpdateAccomplishmentReport } from "./UpdateAccomplishmentReport";
import { ViewAccomplishmentReport } from "./ViewAccomplishmentReport";
import { useAuth } from "@/hooks/use-auth";

export function ViewEventPage() {
    const { id } = useParams();
    const { claims, loading: authLoading } = useAuth();
    const router = useRouter();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [reload, setReload] = useState(false)

    const { data, loading } = useFetchOne<FCEvent>(
        EventService.getEventById,
        [id, reload],
        [id]
    );

    const { open, setOpen, toView, setView, toUpdate, setUpdate } = useCrudState<AccomplishmentReport>();

    if (loading || authLoading) return <CvSULoading />;

    const startDate = new Date(data!.event_start)
    const endDate = new Date(data!.event_end)

    const formattedDate = startDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const formattedStartTime = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    })

    const formattedEndTime = endDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    })


    if (!data) return null;

    const formattedStart = new Date(data.event_start).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
    );

    const formattedEnd = new Date(data.event_end).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
    );

    const imageFiles = data.files.filter((f) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(f.file_name)
    );

    const documentFiles = data.files.filter((f) =>
        /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i.test(f.file_name)
    );

    async function exportReport() {
        try {
            if (!data?.accomplishment_report) {
                return toast.error("This event has no accomplishment report.")
            }
            const url = `${BASE_URL}/events/accomplishment-reports/export/${data!.accomplishment_report.id}`

            window.open(url, "_blank");
        } catch (error) {
            toast.error(String(error))
        }
    }

    return (
        <section className="max-w-3xl mx-auto px-4 py-6 space-y-6">

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {data.title}
            </h1>

            <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                        {formattedDate} • {formattedStartTime} – {formattedEndTime}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{data.campus?.name ?? "All Campuses"}</span>
                </div>

                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>
                        {data.user!.first_name}{" "}
                        {data.user!.last_name}
                    </span>
                </div>
            </div>

            <Separator />

            <div className="whitespace-pre-line text-gray-700">
                {data.description}
            </div>

            {imageFiles.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-2">
                        <h2 className="font-semibold text-gray-700">
                            Attached Images
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {imageFiles.map((file) => (
                                <Dialog key={file.id}>
                                    <DialogTrigger asChild>
                                        <div
                                            className="relative w-full h-32 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition"
                                            onClick={() =>
                                                setPreviewImage(file.file_path)
                                            }
                                        >
                                            <Image
                                                src={`${FILE_URL}/${file.file_path}`}
                                                alt={file.file_name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </DialogTrigger>

                                    <DialogContent className="max-w-3xl p-0">
                                        <Image
                                            src={`${FILE_URL}/${file.file_path}`}
                                            alt={file.file_name}
                                            width={1200}
                                            height={800}
                                            className="w-full h-auto"
                                        />
                                    </DialogContent>
                                </Dialog>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {documentFiles.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-3">
                        <h2 className="font-semibold text-gray-700">
                            Attached Documents
                        </h2>

                        <div className="space-y-2">
                            {documentFiles.map((file) => (
                                <a
                                    key={file.id}
                                    href={`${FILE_URL}/${file.file_path}`}
                                    download
                                    target="_blank"
                                    className="flex items-center justify-between px-3 py-2 border rounded-md hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-medium">
                                            {file.file_name}
                                        </span>
                                    </div>
                                    <Download className="w-4 h-4 text-gray-700" />
                                </a>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <div className="flex-center-y">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className={ `` }>
                        <Button className="!bg-darkgreen hover:opacity-90">
                            <Flag className="w-4 h-4" /> Accomplishment Report
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 border-1 border-darkgreen bg-white">
                        <DropdownMenuItem onClick={ () => setView(data.accomplishment_report) }>View Report</DropdownMenuItem>
                        {claims.id === data.user?.id || claims.role === "ADMIN" && (
                            <DropdownMenuItem 
                                onClick={() => setOpen(true)}
                                disabled={ data.accomplishment_report !== null }
                            >
                                Create Report
                            </DropdownMenuItem>
                        )}
                        {claims.id === data.user?.id || claims.role === "ADMIN" && (
                            <DropdownMenuItem 
                                onClick={() => setUpdate(data.accomplishment_report)}
                                disabled={ data.accomplishment_report === null }
                            >
                                Update Report
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={exportReport}>Export Report</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Separator className="h-2 bg-gray" />

            <Button
                onClick={() => history.back()}
                className="w-20 !bg-gray-700 hover:opacity-90"
            >
                Back
            </Button>

            {open && (
                <CreateAccomplishmentReport 
                    eventId={ data!.id }
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toView && (
                <ViewAccomplishmentReport 
                    toView={ toView }
                    setView={ setView }
                />
            )}

            {toUpdate && (
                <UpdateAccomplishmentReport 
                    toUpdate={ data.accomplishment_report }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}
        </section>
    );
}

