"use client";

import { CvSULoading } from "@/components/ui/loader";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { AnnouncementService } from "@/services/announcement.service";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Download,
    FileText,
    CalendarDays,
    MapPin,
    User
} from "lucide-react";
import Image from "next/image";
import { Announcement } from "@/types/announcement";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { FILE_URL } from "@/lib/urls";

export function ViewAnnouncementPage() {
    const { id } = useParams();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

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

    // 🔍 Detect file types
    const imageFiles = data!.files!.filter((f) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(f.file_name)
    );

    const documentFiles = data!.files!.filter((f) =>
        /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i.test(f.file_name)
    );

    return (
        <section className="max-w-3xl mx-auto px-4 py-6 space-y-6">

            {/* Announcement Title */}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {data?.content ?? "Announcement"}
            </h1>

            {/* Meta info */}
            <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>Posted on {formattedDate}</span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{data?.campus?.name}</span>
                </div>

                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>
                        {data?.user?.first_name} {data?.user?.middle_name}. {data?.user?.last_name}
                    </span>
                </div>
            </div>

            <Separator />

            {/* Image Preview Section */}
            {imageFiles.length > 0 && (
                <div className="space-y-2">
                    <h2 className="font-semibold text-gray-700">Attached Images</h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {imageFiles.map((file, idx) => (
                            <Dialog key={idx}>
                                <DialogTrigger asChild>
                                    <div
                                        className="relative w-full h-32 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition"
                                        onClick={() => setPreviewImage(file.file_path)}
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
            )}

            {/* Document Files Section */}
            {documentFiles.length > 0 && (
                <div className="space-y-3">
                    <h2 className="font-semibold text-gray-700">Attached Documents</h2>

                    <div className="space-y-2">
                        {documentFiles.map((file, idx) => (
                            <a
                                key={idx}
                                href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${file.file_path}`}
                                download
                                target="_blank"
                                className="flex items-center justify-between px-3 py-2 border rounded-md hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-medium">{file.file_name}</span>
                                </div>
                                <Download className="w-4 h-4 text-gray-700" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <Separator />

            {/* Back Button */}
            <Button
                onClick={() => history.back()}
                className="w-20 !bg-darkgreen hover:opacity-90"
            >
                Back
            </Button>
        </section>

    );
}
