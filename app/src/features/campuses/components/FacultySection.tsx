import { Input } from "@/components/ui/input";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { formatCustomDate } from "@/lib/helper";
import { AtSign, UserX } from "lucide-react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { User } from "@/types/user";
import { UserService } from "@/services/user.service";
import { SectionLoading } from "@/components/ui/loader";
import { Fragment, useEffect, useState } from "react";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useCrudState } from "@/hooks/use-crud-state";
import { useRouter } from "next/navigation";


export function FacultySection({ campusId }: {
    campusId: number;
}) {
    const { claims, loading: authLoading } = useAuth();
    const [selectedCollege, setSelectedCollege] = useState(0);

    const { data: faculties, loading } = useFetchData<User>(
        UserService.getUsersByCampus, 
        [campusId],
        [campusId]
    );

    const { setSearch, filteredItems } = useSearchFilter<Partial<User>>(
        faculties,
        ["first_name", "last_name"]
    );

    const { toView, setView } = useCrudState<User>();

    const collegeMap = Array.from(
        new Map(
            filteredItems
                .filter(u => u.college)
                .map(u => [
                    u.college!.id,
                    {
                        id: u.college!.id,
                        name: u.college!.name,
                        abbreviations: u.college!.abbreviations,
                    }
                ])
        ).values()
    );

    const finalFilteredUsers = filteredItems.filter(u => {
        if (selectedCollege !== 0) return u.college?.id === selectedCollege;
        return true;
    });

    if (loading) return <SectionLoading />
    return (
        <section className="stack-md reveal">
            <div className="flex-center-y justify-between">
                <Input
                    placeholder="Search for a member"
                    className="w-100"
                    onChange={ e => setSearch(e.target.value) }
                />
                {collegeMap.length > 0 && (
                    <Select onValueChange={(value) => setSelectedCollege(Number(value))}>
                        <SelectTrigger className="rounded-full w-40 truncate">
                            <SelectValue placeholder="Select College" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Colleges</SelectLabel>
                                <SelectItem value="0">All Colleges</SelectItem>
                                {collegeMap.map((col) => (
                                    <SelectItem key={col.id} value={String(col.id)}>
                                        {col.abbreviations}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            </div>
            {finalFilteredUsers.length === 0 && (
                <div className="col-span-3 py-10 flex flex-col items-center text-slate-500">
                    <UserX className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">No faculty members found.</p>
                </div>
            )}
            <div className="grid grid-cols-3 gap-2">
                {finalFilteredUsers.map((item, i) => {
                    const loggedUser = claims.id;
                    return (
                        <Fragment key={i}>
                            {loggedUser !== item.id && (
                                <div className="bg-slate-50 p-4 shadow-sm stack-md">
                                    <div className="flex-center-y gap-2">
                                        <AppAvatar fallback={`${item.first_name![0]}${item.last_name![0]}`}/>
                                        <div className="truncate">
                                            <div className="font-semibold">
                                                {`${item.last_name}, ${item.first_name}`} { item.middle_name && item.middle_name[0] + '.' }
                                            </div>
                                            <div className="text-xs text-gray truncate">{ item.role }</div>
                                        </div>
                                    </div>
                                    <div className="rounded-md  border-1 border-gray-300 px-4 py-2 bg-white">
                                        <div className="text-xs uppercase">{ item.college ? item.college!.name : "All Colleges" }</div>
                                        <div className="text-[10px] text-darkgreen font-semibold">COLLEGE</div>
                                        <Separator className="bg-slate-300 my-2" />
                                        <div className="text-sm"><AtSign className="w-4 h-4 inline-block" />{ item.email }</div>
                                        <div className="text-[10px] text-darkgreen font-semibold">EMAIL ADDRESS</div>
                                    </div>
                                    <div className="flex-center-y justify-between px-2 mt-auto">
                                        <div className="text-xs text-gray">
                                            Member Since: { formatCustomDate(item.created_at!).replace(/\s+at\s+.*$/, "") }
                                        </div>
                                        <Link
                                            href={`/users/${item.id}`}
                                            className="text-xs text-darkgreen font-semibold opacity-80 hover:text-black hover:opacity-100"
                                        >
                                            View More
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    )
                })}
            </div>
        </section>
    )
}