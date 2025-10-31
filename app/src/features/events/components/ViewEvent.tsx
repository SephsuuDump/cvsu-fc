"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EventService } from "@/services/event.service";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { FILE_URL } from "@/lib/urls";
import { formatEventRange } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { CvSULoading } from "@/components/ui/loader";

export default function ViewEventPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [event, setEvent] = useState<FCEvent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvent() {
        try {
            const data = await EventService.getEventById(Number(params.id));
            setEvent(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        }

        loadEvent();
    }, [params.id]);

    if (loading) return <CvSULoading />;
    if (!event) return <div className="p-6">Event not found.</div>;

    const eventRangeText = formatEventRange(event.event_start, event.event_end);
    const campusName = event.user?.campus?.name ?? "Unknown Campus";
    const userName = `${event.user?.first_name} ${event.user?.last_name}`;

return (
        <div className="max-w-3xl mx-auto py-6 px-4">
        {/* Back Button */}
        <Button variant="outline" className="mb-4" onClick={() => router.back()}>
            ← Back
        </Button>

        {/* Header */}
        <div className="flex items-center gap-3">
            <AppAvatar fallback={userName[0]} />
            <div>
            <div className="font-semibold text-lg">{userName}</div>
            <div className="text-sm text-gray-500">{campusName}</div>
            </div>
        </div>

        {/* Title + Description */}
        <h1 className="text-2xl font-bold mt-4">{event.title}</h1>
        <p className="text-gray-700 mt-2">{event.description}</p>

        {/* Date Range */}
        <div className="flex items-center gap-2 mt-4 text-darkgreen font-medium">
            <CalendarDays className="w-4 h-4" />
            {eventRangeText}
        </div>

        {/* Files Preview */}
        {event.files && event.files.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
            {event.files.map((file) => {
                const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.file_path);

                return isImage ? (
                <img
                    key={file.id}
                    src={`${FILE_URL}/${file.file_path}`}
                    alt={file.file_name}
                    className="w-40 h-40 object-cover rounded-md border border-slate-200"
                />
                ) : (
                <a
                    key={file.id}
                    href={`${FILE_URL}/${file.file_path}`}
                    download
                    target="_blank"
                    className="text-sm text-darkgreen underline hover:text-black flex items-center gap-1"
                >
                    📄 {file.file_name}
                </a>
                );
            })}
            </div>
        )}
        </div>
    );
}
