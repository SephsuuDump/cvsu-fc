import { AppDateSelect } from "@/components/shared/AppDateSelect";
import { AppInput } from "@/components/shared/AppInput";
import { AppTextarea } from "@/components/shared/AppTextare";
import { AppTimeSelect } from "@/components/shared/AppTimeSelect";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ModalLoader } from "@/components/ui/loader";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useFetchData } from "@/hooks/use-fetch-data";
import { hasEmptyField, updateField } from "@/lib/helper";
import { CampusService } from "@/services/campus.service";
import { EventService } from "@/services/event.service";
import { Plus, Upload, X } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Preview {
    url: string;
    name: string;
    size: number;
    type: string;
}

export function CreateEvent({ setOpen, selectedDay, setReload }: {
    setOpen: Dispatch<SetStateAction<boolean>>
    setReload: Dispatch<SetStateAction<boolean>>
    selectedDay: string
}) {
    const date = new Date(selectedDay); 

    const { claims, loading: authLoading } = useAuth();
    const { data: campuses, loading: campusLoading } = useFetchData(CampusService.getAllCampus);

    const visibilities = ['ALL', 'COORDINATOR', 'MEMBER', 'JOB OFFER'];

    const [onProcess, setProcess] = useState(false)
    const [event, setEvent] = useState<Partial<FCEvent>>({
        title: '',
        description: '',
        visibility: visibilities[0],
        event_start: undefined,
        event_end: undefined,
        campus_id: claims.role === "ADMIN" ? 0 : claims.campus.id
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<Preview[]>([]);

    const [startDate, setStartDate] = useState<Date | undefined>(date)
    const [endDate, setEndDate] = useState<Date | undefined>(date)
    const [startTime, setStartTime] = useState<string>("06:00:00")
    const [endTime, setEndTime] = useState<string>("17:00:00")

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        handleStartChange(startDate, startTime);
        handleEndChange(endDate, endTime);
    }, [selectedDay])

    const handleStartChange = (date?: Date, time?: string) => {
        if (!date && !time) return
        const t = time ?? startTime
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(t)) return
        const finalDate = new Date(date ?? startDate ?? new Date())
        const [hours, minutes, seconds] = t.split(":").map(Number)
        finalDate.setHours(hours, minutes, seconds || 0, 0)
        setStartDate(finalDate)
        setEvent(prev => ({ ...prev, event_start: finalDate.toISOString() }))
    }
    
    const handleEndChange = (date?: Date, time?: string) => {
        if (!date && !time) return
        const t = time ?? endTime
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(t)) return
        const finalDate = new Date(date ?? endDate ?? new Date())
        const [hours, minutes, seconds] = t.split(":").map(Number)
        finalDate.setHours(hours, minutes, seconds || 0, 0)
        setEndDate(finalDate)
        setEvent(prev => ({ ...prev, event_end: finalDate.toISOString() }))
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);

        const validFiles: File[] = files.filter(file => {
            const isValidSize = file.size <= 10 * 1024 * 1024; // still enforce size

            if (!isValidSize) {
                toast.error(`${file.name} is too large (max 10MB)`);
                return false;
            }

            return true;
        });

        if (validFiles.length === 0) return;

        setSelectedFiles(prev => [...prev, ...validFiles]);

        const newPreviewUrls: Preview[] = validFiles.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
        }));

        setPreviews(prev => [...prev, ...newPreviewUrls]);

        e.target.value = "";
    };

    function removeFile(index: number) {
        URL.revokeObjectURL(previews[index].url);
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        return () => {
            previews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, [previews]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    function handleButtonClick() {
        fileInputRef.current?.click();
    };

    async function handleSubmit() {
        try {
            setProcess(true);
            if (hasEmptyField(event, ["description", "campus_id"])) return toast.warning('Please fill up all the fields.');

            const data = await EventService.createEvent(claims.id, event, selectedFiles);
            if (data) {
                toast.success('Event created successfully.');
                setReload(prev => !prev)
                setOpen(prev => !prev);
            }
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    }

    useEffect(() => {
        console.log(event);
        
    }, [event])

    if (authLoading || campusLoading) return <ModalLoader />
    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent className="overflow-y-auto h-9/10 reveal">
                <ModalTitle label="Publish an Event" />
                <AppInput
                    label="Event Title"
                    value={ event.title }
                    onChange={ e => updateField(setEvent, 'title', e.target.value) }
                />
                <AppTextarea
                    label="Event Description"
                    value={ event.description }
                    onChange={ e => updateField(setEvent, 'description', e.target.value) }
                    height={30}
                />
                <div className="grid grid-cols-2 gap-2">
                    <div className="stack-sm">
                        <Label>Visibility</Label>
                        <Select
                            value={ event.visibility }
                            onValueChange={ (value) => setEvent(prev => ({
                                ...prev,
                                visibility: value
                            }))}
                        >
                            <SelectTrigger className="w-full text-black">
                                <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                {visibilities.map((item, i) => (
                                    <SelectItem value={ item } key={i}>{ item }</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="stack-sm">
                        <Label>Campus</Label>
                        <Select
                            value={ event.campus_id ? String(event.campus_id) : "0" }
                            onValueChange={ (value) => setEvent(prev => ({
                                ...prev,
                                campus_id: Number(value)
                            }))}
                            disabled={ claims.role === "COORDINATOR" }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select campus" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">All Campuses</SelectItem>
                                {campuses.map((item, i) => (
                                    <SelectItem value={String(item.id)} key={i}>{ item.name.match(/-\s*(.*?)\s*Campus/i)?.[1] }</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="stack-md">
                        <AppDateSelect
                            label="Event Start Date"
                            value={startDate}
                            onChange={(date) => handleStartChange(date, startTime)}
                        />
                        <AppTimeSelect
                            value={startTime}
                            onChange={(time) => {
                                setStartTime(time)
                                handleStartChange(startDate, time)
                            }}
                            noLabel
                        />
                    </div>
                    <div className="stack-md">
                        <AppDateSelect
                            label="Event End Date"
                            value={endDate}
                            onChange={(date) => handleEndChange(date, endTime)}
                        />
                        <AppTimeSelect
                            value={endTime}
                            onChange={(time) => {
                                setEndTime(time)
                                handleEndChange(endDate, time)
                            }}
                            noLabel
                        />
                    </div>
                </div>

                {previews.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Selected Files ({previews.length})
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                previews.forEach(preview => URL.revokeObjectURL(preview.url));
                                setSelectedFiles([]);
                                setPreviews([]);
                                }}
                                className="text-xs text-darkred hover:text-red-700"
                            >
                                Remove All
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {previews.map((preview, idx) => (
                                <div key={idx} className="relative group">
                                    {preview.type.startsWith("image/") ? (
                                        <img
                                            src={preview.url}
                                            alt={preview.name}
                                            className="w-full h-24 object-cover rounded-md border border-gray-200"
                                        />
                                    ) : (
                                        // 📄 Non-image preview
                                        <div className="flex flex-col items-center justify-center w-full h-24 bg-gray-100 rounded-md border border-gray-200 text-gray-500 text-xs">
                                            <Upload className="w-6 h-6 mb-1" />
                                            <span className="truncate max-w-full px-2">{preview.name}</span>
                                        </div>
                                    )}

                                    {/* ❌ Remove button */}
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="absolute -top-2 -right-2 bg-darkred text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-darkred"
                                        >
                                        <X className="h-3 w-3" />
                                    </button>

                                    {/* 📎 Info overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-b-md">
                                        <div className="truncate">{preview.name}</div>
                                        <div className="text-gray-300">{formatFileSize(preview.size)}</div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={ handleButtonClick }
                                className="flex-center w-full h-24 object-cover rounded-md border border-gray-200"
                            >
                                <Plus className="w-8 h-8 text-darkgreen" />
                            </button>
                        </div>
                    </div>
                )}

                {previews.length === 0 && (
                    <button 
                        onClick={ handleButtonClick }
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                    >
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-1">No images selected</p>
                        <p className="text-xs text-gray-400">
                        Click &quot;Add Images&quot; to upload multiple images (max 10MB each)
                        </p>
                    </button>
                )}
                <input
                    type="file"
                    multiple
                    accept="*/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <form   
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex-center-y justify-end gap-4"
                >
                    <DialogClose>Cancel</DialogClose>
                    <AddButton
                        type="submit"
                        onProcess={ onProcess }
                        label="Add Event"
                        loadingLabel="Adding Event"
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}