"use client"

import { AppAvatar } from "@/components/shared/AppAvatar";
import { CvSULoading } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { formatCustomDate } from "@/lib/helper";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user";
import { GraduationCap, Mail, Phone, SquarePen, UserRoundCheck } from "lucide-react";
import { useParams } from "next/navigation";

export function AccountPage() {
    const { id } = useParams();
    const { claims, loading: authLoading } = useAuth();
    const { data: user, loading } = useFetchOne<User>(
        UserService.getUserById,
        [id ?? claims.id],
        [id ?? claims.id]
    )

    if (authLoading || loading) return <CvSULoading />
    return (
        <section className="mx-auto max-w-[1024px] stack-md reveal">

            {/* ✅ HEADER / COVER */}
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

                {/* ✅ AVATAR OVERLAY */}
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-50">
                    <AppAvatar
                        className="w-28 h-28 border-4 border-white shadow-lg"
                        fallbackClassName="bg-green-900 text-3xl text-slate-50"
                    />
                </div>
            </div>

            <div className="relative bg-white rounded-xl shadow-md p-6 text-center space-y-1 -mt-2">
                <SquarePen
                    className="absolute w-5 h-5 right-4 top-4 cursor-pointer" 
                />
                <div className="text-xl font-bold uppercase tracking-wide mt-8">
                    {`${user?.first_name} ${user?.middle_name ? user?.middle_name + "." : null} ${user?.last_name}`}
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
                            { formatCustomDate(user!.created_at!)  }
                        </span>
                    </div>
                    <Separator className="h-2 bg-slate-200 mt-2" />
                </div>
            </div>
        </section>
    );
}
