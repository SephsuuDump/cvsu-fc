"use client"

import { AppAvatar } from "@/components/shared/AppAvatar";
import { CvSULoading } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useCrudState } from "@/hooks/use-crud-state";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { formatCustomDate, formatDateToWord } from "@/lib/helper";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user";
import { Camera, GraduationCap, Mail, Phone, SquarePen, UserRoundCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { UpdateUser } from "../users/components/UpdateUser";
import { toast } from "sonner";

export function AccountPage() {
    const { id } = useParams();
    console.log(id);
    
    const [reload, setReload] = useState(false);
    const { claims, loading: authLoading } = useAuth();
    

    const finalId = id ? Number(id) : claims?.id // use route param if present, else claims.id
    const canFetch = !authLoading && !!finalId

    const { data: user, loading } = useFetchOne<User>(
        UserService.getUserById,
        [finalId, reload],                
        canFetch ? [finalId] : undefined    
    )
    
    const { toUpdate, setUpdate } = useCrudState<Partial<User>>();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) return;

        setPreview(URL.createObjectURL(file));

        try {
            setUploading(true);
            const data = await UserService.updateProfileImage(user!.id, file);
            if (data) {
                toast.success('profile image updated.')
                setReload(prev => !prev)
            }

        } finally {
            setUploading(false);
        }
    };

    if (authLoading || loading || user?.id === 0) return <CvSULoading />;
    return (
        <section className="mx-auto max-w-[1024px] stack-md reveal">

            <div
                className="relative rounded-xl shadow-md"
                style={{
                    background:
                        "linear-gradient(90deg, hsla(117, 39%, 46%, 1) 0%, hsla(125, 74%, 29%, 1) 100%)",
                }}
            >
                <div className="h-36 flex items-center justify-center">
                    <h1 className="text-white text-3xl font-bold tracking-wide">
                        { user?.campus.name }
                    </h1>
                </div>

                <div
                    className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-50 cursor-pointer group"
                    onClick={handleAvatarClick}
                >
                    <AppAvatar
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${user?.image_url}`}
                        className="w-28 h-28 border-4 border-white shadow-lg object-cover"
                        fallbackClassName="bg-green-900 text-3xl text-slate-50"
                    />

                    <div 
                        className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                    >
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            <div className="relative bg-white rounded-xl shadow-md p-6 text-center space-y-1 -mt-2">
                {(claims.role === "ADMIN" || claims.id === user?.id) && (
                    <SquarePen
                        onClick={ () => setUpdate(user!) }
                        className="absolute w-5 h-5 right-4 top-4 cursor-pointer" 
                    />
                )}
                <div className="text-xl font-bold uppercase tracking-wide mt-8">
                    {`${user?.first_name} ${user?.middle_name ? user?.middle_name : null} ${user?.last_name}`}
                </div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    { user?.role }
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-green-700" />
                        <span className="font-medium text-gray-600">Contact</span>
                        <span className="ml-auto text-gray-900 font-semibold">
                            { user?.contact }
                        </span>
                    </div>
                    <Separator className="h-2 bg-slate-200 mt-2" />
                </div>

                <div>
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-green-700" />
                        <span className="font-medium text-gray-600">Email</span>
                        <span className="ml-auto text-gray-900 font-semibold truncate">
                            { user?.email }
                        </span>
                    </div>
                    <Separator className="h-2 bg-slate-200 mt-2" />
                </div>

                <div>
                    <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-green-700" />
                        <span className="font-medium text-gray-600">Education</span>
                        <span className="ml-auto text-gray-900 font-semibold">
                            { user?.highest_educational_attainment }
                        </span>
                    </div>
                    <Separator className="h-2 bg-slate-200 mt-2" />
                </div>

                <div>
                    <div className="flex items-center gap-2 text-sm">
                        <UserRoundCheck className="w-4 h-4 text-green-700" />
                        <span className="font-medium text-gray-600">Member Since</span>
                        <span className="ml-auto text-gray-900 font-semibold">
                            { user === null ? "No user found" : formatDateToWord(user!.created_at!)  }
                        </span>
                    </div>
                    <Separator className="h-2 bg-slate-200 mt-2" />
                </div>
            </div>

            {toUpdate && (
                <UpdateUser 
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}
        </section>
    );
}
