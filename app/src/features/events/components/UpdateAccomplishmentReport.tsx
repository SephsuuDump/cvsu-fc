import { AppInput } from "@/components/shared/AppInput";
import { AppTextarea } from "@/components/shared/AppTextare";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { updateField } from "@/lib/helper";
import { EventService } from "@/services/event.service";
import { Plus, Upload, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Preview {
    id?: number;
    url: string;
    name: string;
    size: number;
    type: "existing" | "new";
    file?: File;
}

export function UpdateAccomplishmentReport({
    toUpdate,
    setUpdate,
    setReload,
}: {
    toUpdate: AccomplishmentReport;
    setUpdate: Dispatch<SetStateAction<AccomplishmentReport | undefined>>;
    setReload: Dispatch<SetStateAction<boolean>>;
}) {
    const [onProcess, setProcess] = useState(false);
    const [report, setReport] = useState(toUpdate);

    const [existingImages, setExistingImages] = useState(toUpdate.images || []);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<Preview[]>([]);
    const removedImageIdsRef = useRef<FormData>(new FormData());
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /* ===================== BUILD PREVIEWS ===================== */
    useEffect(() => {
        const list: Preview[] = [
            ...existingImages.map(img => ({
                id: img.id,
                url: `/storage/${img.image_path}`,
                name: img.image_path.split("/").pop() || "image",
                size: 0,
                type: "existing" as const, // ✅ FIX
            })),
            ...newFiles.map(file => ({
                url: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
                type: "new" as const, // ✅ FIX
                file,
            })),
        ];

        setPreviews(list);
    }, [existingImages, newFiles]);


    /* ===================== FILE HANDLERS ===================== */
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;

        setNewFiles(prev => [...prev, ...Array.from(files)]);
        e.target.value = "";
    }

    function removeImage(index: number) {
        const preview = previews[index];

        if (preview.type === "existing") {
            removedImageIdsRef.current.append(
                "remove_image_ids[]",
                String(preview.id)
            );
            setExistingImages(prev => prev.filter(img => img.id !== preview.id));
        } else {
            setNewFiles(prev => prev.filter(f => f.name !== preview.name));
            URL.revokeObjectURL(preview.url);
        }

        setPreviews(prev => prev.filter((_, i) => i !== index));
    }

    const formatFileSize = (bytes: number) => {
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    /* ===================== SUBMIT ===================== */
    async function handleSubmit() {
        try {
            setProcess(true);

            const formData = new FormData();
            formData.append("id", String(report.id));
            formData.append("title", report.title);
            formData.append("introduction", report.introduction);
            formData.append("objectives", report.objectives);
            formData.append("accomplishments", report.accomplishments);

            newFiles.forEach(file => {
                formData.append("images[]", file);
            });

            removedImageIdsRef.current.forEach((v, k) => {
                formData.append(k, v);
            });

            const data = await EventService.updateAccomplishmentReport(
                report.id,
                formData
            );

            if (data) {
                toast.success("Accomplishment report updated successfully.");
                setReload(prev => !prev);
                setUpdate(undefined);
            }
        } catch (err) {
            toast.error(String(err));
        } finally {
            setProcess(false);
        }
    }

    /* ===================== UI ===================== */
    return (
        <Dialog open onOpenChange={(open) => !open && setUpdate(undefined)}>
            <DialogContent className="max-h-10/11 overflow-auto">
                <ModalTitle label="Edit Accomplishment Report" />

                <div className="space-y-2">
                    <AppInput
                        label="Report Title"
                        value={report.title}
                        onChange={e => updateField(setReport, "title", e.target.value)}
                    />
                    <AppTextarea
                        label="I. Introduction"
                        value={report.introduction}
                        onChange={e => updateField(setReport, "introduction", e.target.value)}
                    />
                    <AppTextarea
                        label="II. Objectives"
                        value={report.objectives}
                        onChange={e => updateField(setReport, "objectives", e.target.value)}
                    />
                    <AppTextarea
                        label="III. Accomplishment"
                        value={report.accomplishments}
                        onChange={e => updateField(setReport, "accomplishments", e.target.value)}
                    />
                </div>

                {/* IMAGE PREVIEW */}
                {previews.length > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">
                                Images ({previews.length})
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    existingImages.forEach(img =>
                                        removedImageIdsRef.current.append(
                                            "remove_image_ids[]",
                                            String(img.id)
                                        )
                                    );
                                    previews.forEach(p => {
                                        if (p.type === "new") URL.revokeObjectURL(p.url);
                                    });
                                    setExistingImages([]);
                                    setNewFiles([]);
                                    setPreviews([]);
                                }}
                                className="text-xs text-darkred"
                            >
                                Remove All
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {previews.map((preview, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={preview.url}
                                        alt={preview.name}
                                        className="w-full h-24 object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute -top-2 -right-2 bg-darkred text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1">
                                        <div className="truncate">{preview.name}</div>
                                        <div className="text-gray-300">
                                            {preview.type === "new"
                                                ? formatFileSize(preview.size)
                                                : "Existing"}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-center h-24 border border-dashed rounded-md"
                            >
                                <Plus className="w-8 h-8 text-darkgreen" />
                            </button>
                        </div>
                    </div>
                )}

                {previews.length === 0 && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 border-2 border-dashed rounded-lg p-6 text-center"
                    >
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Add images (optional)</p>
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
                    onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex justify-end gap-4 mt-4"
                >
                    <DialogClose>Cancel</DialogClose>
                    <AddButton
                        type="submit"
                        label="Update Report"
                        loadingLabel="Updating Report"
                        onProcess={onProcess}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
