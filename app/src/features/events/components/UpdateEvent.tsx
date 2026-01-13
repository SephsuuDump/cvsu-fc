import { AppDateSelect } from "@/components/shared/AppDateSelect";
import { AppInput } from "@/components/shared/AppInput";
import { AppTextarea } from "@/components/shared/AppTextare";
import { AppTimeSelect } from "@/components/shared/AppTimeSelect";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton, UpdateButton } from "@/components/ui/button";
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
    id?: number;
    url: string;
    name: string;
    size: number;
    type: string;
}

const visibilities = ['ALL', 'COORDINATOR', 'MEMBER', 'JOB OFFER'];

export function UpdateEvent({ toUpdate, setUpdate, setReload }: {
    toUpdate: FCEvent
    setUpdate: Dispatch<SetStateAction<FCEvent | undefined>>
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    console.log(toUpdate);
    
    const { claims, loading: authLoading } = useAuth();
    const { data: campuses, loading: campusLoading } = useFetchData(CampusService.getAllCampus);

    const [datePartStart, timePartStart] = toUpdate.event_start.split(" ");
    const [datePartEnd, timePartEnd] = toUpdate.event_end.split(" ");
    const [onProcess, setProcess] = useState(false)
    const [event, setEvent] = useState<FCEvent>({...toUpdate, campus_id: toUpdate.campus!.id});
    const [existingFiles, setExistingFiles] = useState(toUpdate.files || []);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<Preview[]>([]);

    const removedFileDataRef = useRef<FormData>(new FormData());


    const [startDate, setStartDate] = useState<Date | undefined>()
    const [endDate, setEndDate] = useState<Date | undefined>()
    const [startTime, setStartTime] = useState<string>("00:00:00")
    const [endTime, setEndTime] = useState<string>("12:00:00")

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setStartDate(new Date(datePartStart));
        setEndDate(new Date(datePartEnd));
        setStartTime(timePartStart);
        setEndTime(timePartEnd);
    }, [datePartStart, datePartEnd, timePartStart, timePartEnd])

    useEffect(() => {
        const previews = [
            ...existingFiles.map(file => ({
                id: file.id,
                url: `/storage/${file.file_path}`,
                name: file.file_name,
                size: 0,
                type: "existing" as const
            })),
            ...newFiles.map(file => ({
                url: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
                type: "new" as const,
                file 
            }))
        ];

        setPreviews(previews);
    }, [existingFiles, newFiles]);

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

        setNewFiles(prev => [...prev, ...files]);
        e.target.value = "";
    }

    function removeFile(index: number) {
        const preview = previews[index];

        if (preview.type === "existing") {
            removedFileDataRef.current.append("remove_file_ids[]", String(preview.id));
            setExistingFiles(prev => prev.filter(f => f.id !== preview.id));
        } else {
            setNewFiles(prev => prev.filter(f => f.name !== preview.name));
        }

        setPreviews(prev => prev.filter((_, i) => i !== index));
    }


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
            if (hasEmptyField(event, ["is_deleted", "campus_id", "files"])) return toast.warning('Please fill up all the fields.');

            const data = await EventService.updateEvent(claims, event, newFiles, removedFileDataRef.current);
            if (data) {
                toast.success('Event updated successfully.');
                setUpdate(undefined);
            }
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    }

    if (authLoading || campusLoading) return <ModalLoader />
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setUpdate(undefined) } }>
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
                                    existingFiles.forEach(f => {
                                        removedFileDataRef.current.append("remove_file_ids[]", String(f.id));
                                    });
                                    previews.forEach(preview => URL.revokeObjectURL(preview.url));
                                    setExistingFiles([]); 
                                    setNewFiles([]);      
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
                                        // 🖼️ Image preview
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
                    <UpdateButton
                        type="submit"
                        onProcess={ onProcess }
                        label="Update Event"
                        loadingLabel="Updating Event"
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}