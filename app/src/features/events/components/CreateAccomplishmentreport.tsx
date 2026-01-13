import { AppInput } from "@/components/shared/AppInput";
import { AppTextarea } from "@/components/shared/AppTextare";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { ModalLoader } from "@/components/ui/loader";
import { updateField } from "@/lib/helper";
import { EventService } from "@/services/event.service";
import { Plus, Upload, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Preview {
    url: string;
    name: string;
    size: number;
    type: string;
}

export function CreateAccomplishmentReport({ eventId, setOpen, setReload }: {
    eventId: number
    setOpen: Dispatch<SetStateAction<boolean>>
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const [onProcess, setProcess] = useState(false);
    const [report, setReport] = useState({
        title: '',
        introduction: '',
        objectives: '',
        accomplishments: '',
        event_id: eventId
    })

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<Preview[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name} is too large (max 10MB)`);
                return false;
            }
            return true;
        });

        setSelectedFiles(prev => [...prev, ...validFiles]);

        const newPreviews = validFiles.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
        }));

        setPreviews(prev => [...prev, ...newPreviews]);
        e.target.value = "";
    }

    function removeFile(index: number) {
        URL.revokeObjectURL(previews[index].url);
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };


    useEffect(() => {
        return () => {
            previews.forEach(p => URL.revokeObjectURL(p.url));
        };
    }, [previews]);

    async function handleSubmit() {
        try {
            setProcess(true);

            const formData = new FormData();
            formData.append("title", report.title);
            formData.append("introduction", report.introduction);
            formData.append("objectives", report.objectives);
            formData.append("accomplishments", report.accomplishments);
            formData.append("event_id", String(report.event_id));

            selectedFiles.forEach(file => {
                formData.append("images[]", file);
            });

            console.log("📦 FormData contents:");
formData.forEach((value, key) => {
    if (value instanceof File) {
        console.log(`${key}:`, {
            name: value.name,
            size: value.size,
            type: value.type,
        });
    } else {
        console.log(`${key}:`, value);
    }
});


            const data = await EventService.editAccomplishmentReport(formData);

            if (data) {
                toast.success("Accomplishment report edited successfully.");
                setReload(prev => !prev);
                setOpen(false);
            }
        } catch (error) {
            toast.error(String(error));
        } finally {
            setProcess(false);
        }
    }


    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent className="max-h-10/11 overflow-auto">
                <ModalTitle label="Create Accomplishment Report" /> 
                <div className="space-y-2">
                    <AppInput 
                        label="Report Title"
                        value={ report.title }
                        onChange={ e => updateField(setReport, 'title', e.target.value) }
                    />
                    <AppTextarea 
                        label="I. Introduction"
                        value={ report.introduction }
                        onChange={ e => updateField(setReport, 'introduction', e.target.value) }
                    />
                    <AppTextarea 
                        label="II. Objectives"
                        value={ report.objectives }
                        onChange={ e => updateField(setReport, 'objectives', e.target.value) }
                    />
                    <AppTextarea 
                        label="III. Accomplishment"
                        value={ report.accomplishments }
                        onChange={ e => updateField(setReport, 'accomplishments', e.target.value) }
                    />
                </div>
                
                {previews.length > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Selected Images ({previews.length})
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    previews.forEach(p => URL.revokeObjectURL(p.url));
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
                                        <div className="flex flex-col items-center justify-center w-full h-24 bg-gray-100 rounded-md border border-gray-200 text-gray-500 text-xs">
                                            <Upload className="w-6 h-6 mb-1" />
                                            <span className="truncate px-2">{preview.name}</span>
                                        </div>
                                    )}

                                    {/* ❌ Remove single */}
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="absolute -top-2 -right-2 bg-darkred text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>

                                    {/* 📎 Info overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b-md">
                                        <div className="truncate">{preview.name}</div>
                                        <div className="text-gray-300">{formatFileSize(preview.size)}</div>
                                    </div>
                                </div>
                            ))}

                            {/* ➕ ADD MORE */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-center w-full h-24 rounded-md border border-dashed border-gray-300 hover:bg-gray-50"
                            >
                                <Plus className="w-8 h-8 text-darkgreen" />
                            </button>
                        </div>
                    </div>
                )}

                {/* EMPTY STATE */}
                {previews.length === 0 && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition"
                    >
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-1">No images selected</p>
                        <p className="text-xs text-gray-400">
                            Click to upload one or more images (max 10MB each)
                        </p>
                    </button>
                )}



                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <form
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex justify-end gap-4"
                >   
                    <DialogClose>Cancel</DialogClose>
                    <AddButton
                        type="submit"
                        label="Create Report"
                        loadingLabel="Creating Report"
                        onProcess={ onProcess }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}