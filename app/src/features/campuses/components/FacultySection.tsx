import { Input } from "@/components/ui/input";
import { usersMock } from "../../../../public/mock/user";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { formatCustomDate } from "@/lib/helper";
import { AtSign } from "lucide-react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { User } from "@/types/user";
import { UserService } from "@/services/user.service";
import { CvSULoading, SectionLoading } from "@/components/ui/loader";

export function FacultySection() {
    const { data: faculties, loading } = useFetchData<User>(UserService.getAllUsers);

    if (loading) return <SectionLoading />
    return (
        <section className="stack-md reveal">
            <Input
                placeholder="Search for a member"
            />
            <div className="grid grid-cols-3 gap-2">
                {faculties.map((item, i) => (
                    <div className="bg-slate-50 p-4 shadow-sm stack-md" key={i}>
                        <div className="flex-center-y gap-2">
                            <AppAvatar fallback={`${item.first_name[0]}${item.last_name[0]}`}/>
                            <div className="truncate">
                                <div className="font-semibold">
                                    {`${item.last_name}, ${item.first_name}`} { item.middle_name && item.middle_name[0] + '.' }
                                </div>
                                <div className="text-xs text-gray truncate">{ item.role }</div>
                            </div>
                        </div>
                        <div className="rounded-md  border-1 border-gray-300 px-4 py-2 bg-white">
                            <div className="text-xs uppercase">{ item.college.name }</div>
                            <div className="text-[10px] text-darkgreen font-semibold">COLLEGE</div>
                            <Separator className="bg-slate-300 my-2" />
                            <div className="text-sm"><AtSign className="w-4 h-4 inline-block" />{ item.email }</div>
                            <div className="text-[10px] text-darkgreen font-semibold">EMAIL ADDRESS</div>
                        </div>
                        <div className="flex-center-y justify-between px-2 mt-auto">
                            <div className="text-xs text-gray">
                                Member Since: { formatCustomDate(item.created_at).replace(/\s+at\s+.*$/, "") }
                            </div>
                            <Link
                                href={``}
                                className="text-xs text-darkgreen font-semibold opacity-80 hover:text-black hover:opacity-100"
                            >
                                View More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}