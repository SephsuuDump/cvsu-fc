"use client";

import { CvSULoading } from "@/components/ui/loader";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { AnnouncementService } from "@/services/announcement.service";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, CalendarDays, MapPin, User } from "lucide-react";
import Image from "next/image";
import { Announcement } from "@/types/announcement";

export function ViewAnnouncementPage() {
    const { id } = useParams();

    const { data, loading } = useFetchOne<Announcement>(
        AnnouncementService.getAnnouncementById,
        [id],
        [id]
    );

    if (loading) return <CvSULoading />;
    const formattedDate = new Date(data!.created_at).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
    );

    if (loading) return <CvSULoading />
    return (
        <section className="px-4 py-6 max-w-3xl mx-auto space-y-6">
            
            {/* TITLE */}
            <h1 className="text-2xl md:text-3xl font-bold leading-tight text-darkgreen">
                {data!.label}
            </h1>

            {/* META INFORMATION */}
            <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{data!.campus?.name}</span>
                </div>

                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>
                        {data!.user!.first_name}{" "}
                        {data!.user!.last_name}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>Posted on {formattedDate}</span>
                </div>
            </div>

            <Separator />

            {/* CONTENT SECTION */}
            <article className="prose prose-sm md:prose-base max-w-none text-gray-800">
                {data!.content}
            </article>

            {/* FILE ATTACHMENTS */}
            {data!.files!.length > 0 && (
                <div className="space-y-3 mt-6">
                    <h2 className="text-lg font-semibold text-darkgreen">
                        Attachments
                    </h2>

                    <div className="space-y-2">
                        {data!.files!.map((file: any, index: number) => (
                            <a
                                key={index}
                                href={`${process.env.NEXT_PUBLIC_API_URL}/${file.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition p-3 rounded-md border text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-darkgreen" />
                                    <span>{file.file_name}</span>
                                </div>
                                <Download className="w-4 h-4 text-darkgreen" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
