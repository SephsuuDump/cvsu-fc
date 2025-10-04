import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { updateField } from "@/lib/helper";
import { AnnouncementService } from "@/services/announcement.service";
import { Announcement, announcementInit } from "@/types/announcement";
import { Plus, Upload, X } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Preview {
    url: string;
    name: string;
    size: number;
}

export function CreateAnnouncement({ setOpen }: {
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const { claims, loading } = useAuth();
    const [announcement, setAnnouncement] = useState<Partial<Announcement>>(announcementInit);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [onProcess, setProcess] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);

        const validFiles: File[] = files.filter(file => {
            const isValidType = file.type.startsWith("image/");
            const isValidSize = file.size <= 10 * 1024 * 1024; 

            if (!isValidType) {
                toast.error(`${file.name} is not a valid image file`);
                return false;
            }

            if (!isValidSize) {
                toast.error(`${file.name} is too large (max 10MB)`);
                return false;
            }
            
            return true;
        });

        if (validFiles.length === 0) return;

        // Add to existing images instead of replacing
        setSelectedImages(prev => [...prev, ...validFiles]);

        // Create preview URLs for new files
        const newPreviewUrls: Preview[] = validFiles.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
        }));

        setPreviews(prev => [...prev, ...newPreviewUrls]);

        // Clear the input
        e.target.value = "";
    };

    function removeImage(index: number) {
        URL.revokeObjectURL(previews[index].url);
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
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
            announcementImages: [],
            userId: 0,
            createdAt: new Date().toISOString().slice(0, -1),
        });
        setSelectedImages([]);
        setPreviews([]);
    };

    async function handleSubmit() {
        setProcess(true);
        if (!announcement.content?.trim()) {
            toast.info("Please enter announcement content");
            setProcess(false);
            return;
        }

        try {
            const data = await AnnouncementService.createAnnouncement(1, announcement, selectedImages);
            if (data) {
                toast.success("Successfully created a post!");
                resetForm();
            }
        } catch (error) { toast.error("Failed to create announcement") } 
        finally { setProcess(false); }
    }

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

    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent>
                <ModalTitle label="Create an announcement" />
                <div>
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
                                Selected Images ({previews.length})
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                previews.forEach(preview => URL.revokeObjectURL(preview.url));
                                setSelectedImages([]);
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
                                <img
                                    src={preview.url}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-24 object-cover rounded-md border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-darkred text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-darkred"
                                >
                                    <X className="h-3 w-3" />
                                </button>
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
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
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