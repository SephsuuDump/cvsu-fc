import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { ModalLoader } from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useFetchData } from "@/hooks/use-fetch-data";
import { updateField } from "@/lib/helper";
import { AnnouncementService } from "@/services/announcement.service";
import { CampusService } from "@/services/campus.service";
import { Announcement, announcementInit } from "@/types/announcement";
import { Campus } from "@/types/campus";
import { Plus, Upload, X } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Preview {
    url: string;
    name: string;
    size: number;
    type: string;
}


export function CreateAnnouncement({ setOpen, setReload }: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    setReload: Dispatch<SetStateAction<boolean>>;
}) {
    const { claims, loading: authLoading } = useAuth();
    const [announcement, setAnnouncement] = useState<Partial<Announcement>>(
        claims.role == "ADMIN" 
            ? announcementInit 
            : {...announcementInit, campus_id: claims.campus.id}
        );
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [onProcess, setProcess] = useState(false);    

    const { data: campuses, loading } = useFetchData<Campus>(CampusService.getAllCampus);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    function resetForm() {
        setAnnouncement({
            content: "",
            files: [],
            user_id: 0,
            created_at: new Date().toISOString().slice(0, -1),
        });
        setSelectedFiles([]);
        setPreviews([]);
    };

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
    useEffect(() => {
        console.log(announcement);
        
    }, [announcement])

    async function handleSubmit() {
        setProcess(true);
        if (!announcement.content?.trim()) {
            toast.info("Please enter announcement content");
            setProcess(false);
            return;
        }
        try {
            const data = await AnnouncementService.createAnnouncement(claims.id, announcement, selectedFiles);
            if (data) {
                toast.success("Successfully created a post!");
                resetForm();
                setReload(prev => !prev);
                setOpen(false);
            }
        } catch (error) { toast.error(`${error}`) } 
        finally { setProcess(false); }
    }

    console.log(announcement);
    

    if (authLoading || loading) return <ModalLoader />
    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent className="overflow-y-auto h-9/10">
                <ModalTitle label="Create an announcement" />
                <div className="flex-center-y text-sm gap-2">
                    <div>Announcement Label:</div>
                    <Select
                        value={ announcement.label }
                        onValueChange={ (value) => setAnnouncement(prev => ({
                            ...prev,
                            label: value
                        }))}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select Label" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="GENERAL">GENERAL</SelectItem>
                            <SelectItem value="URGENT">URGENT</SelectItem>
                        </SelectContent>
                    </Select> 
                    {claims.role === "ADMIN" && (
                        <Select
                            value={ announcement.campus_id ? String(announcement.campus_id) : "0" }
                            onValueChange={ (value) => setAnnouncement(prev => ({
                                ...prev,
                                campus_id: Number(value)
                            }))}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select campus" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">All Campuses</SelectItem>
                                {campuses.map((item, i) => (
                                    <SelectItem value={String(item.id)} key={i}>{ item.name.match(/-\s*(.*?)\s*Campus/i)?.[1] }</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className="-mt-2">
                    <Textarea
                        name="content"
                        placeholder="Type your announcement here"
                        className="h-40"
                        onChange={ e => updateField(setAnnouncement, 'content', e.target.value) }
                        value={announcement.content}
                        required
                    />
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
                        Click "Add Images" to upload multiple images (max 10MB each)
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
                        label="Upload"
                        loadingLabel="Uploading"
                    />
                </form>
            </DialogContent>
        </Dialog>

    )
}