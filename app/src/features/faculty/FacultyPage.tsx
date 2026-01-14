"use client"

import { AppAvatar } from "@/components/shared/AppAvatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCrudState } from "@/hooks/use-crud-state";
import { FileUp, Plus, SlidersHorizontal, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useAuth } from "@/hooks/use-auth";
import { CvSULoading } from "@/components/ui/loader";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user";
import { CreateUser } from "../users/components/CreateUser";
import { Input } from "@/components/ui/input";
import { useSearchFilter } from "@/hooks/use-search-filter";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel
} from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import { AppPagination } from "@/components/shared/AppPagination";

const tabs = ['COORDINATOR', 'MEMBER', 'JOBORDER'];

export function FacultyPage() {
    const { claims, loading: authLoading } = useAuth();
    const [rwload, setReload] = useState(false);
    const [tab, setTab] = useState<string | undefined>();
    const [selectedCollege, setSelectedCollege] = useState(0);

    const { data: faculties, loading } = useFetchData<User>(
        UserService.getUserByCampusCollege,
        [claims.campus.id, claims?.college?.id],
        [claims.campus.id, claims?.college?.id ?? 0]
    );

    const { setSearch, filteredItems } = useSearchFilter<Partial<User>>(
        faculties,
        ["first_name", "last_name"]
    );

    const { open, setOpen } = useCrudState();

    useEffect(() => {
        if (claims.role === "ADMIN") return 
        setTab(claims.role)
    }, [claims])

    const collegeMap = Array.from(
        new Map(
            filteredItems
                .filter(u => u.college)
                .map(u => [
                    u.college!.id,
                    {
                        id: u.college!.id,
                        name: u.college!.name,
                        abbreviations: u.college!.abbreviations
                    }
                ])
        ).values()
    );

    const finalFilteredFaculties = filteredItems.filter((u) => {
        const matchesCollege =
            selectedCollege !== 0
                ? u.college?.id === selectedCollege
                : true;

        const matchesRole =
            tab === "Members"
                ? true
                : u.role === tab;

        return matchesCollege && matchesRole;
    });

    const { page, setPage, size, setSize, paginated } = usePagination(finalFilteredFaculties, 10); 

    if (authLoading || loading) return <CvSULoading />;

    return (
        <section className="stack-md reveal">
            <AppHeader label="Faculty Members" />

            <div className="flex">
                <div className="bg-slate-50 w-fit rounded-t-lg shadow-sx border-slate-200">
                    {tabs.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setTab(item)}
                            className={`w-40 text-[14px] p-2.5 rounded-t-lg ${item === tab && 'bg-green-200 font-semibold'}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="ms-auto flex-center-y gap-1.5">

                    <button
                        onClick={() => setOpen(!open)}
                        className="rounded-full p-2 bg-darkgreen shadow-sm"
                    >
                        <Plus className="w-4 h-4 text-slate-50" />
                    </button>

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

                    <button className="rounded-full p-2 bg-slate-50 shadow-sm">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    <Button
                        className="rounded-full bg-slate-50 shadow-sm text-black"
                        size="sm"
                    >
                        <FileUp /> Export
                    </Button>
                </div>
            </div>

            <div className="bg-slate-50 -mt-2">
                <div className="px-4 pt-2">
                    <Input
                        placeholder="Search for a user"
                        onChange={e => setSearch(e.target.value)}
                        className="w-100"
                    />
                </div>

                <div className="thead grid grid-cols-4">
                    <div className="th">Member Name</div>
                    <div className="th">Email Address</div>
                    <div className="th">Contact Number</div>
                    <div className="th">College</div>
                </div>

                {paginated.length === 0 && (
                    <div className="py-10 flex flex-col items-center justify-center text-slate-500">
                        <Users className="h-10 w-10 mb-2 opacity-60" />
                        <p className="text-sm">No faculty members found.</p>
                        <p className="text-xs text-slate-400 mt-1">
                            Try adjusting your search, college filter, or role tab.
                        </p>
                    </div>
                )}

                <Separator className="h-3 bg-slate-300" />

                {paginated.map((item, i) => (
                    <div className="tdata grid grid-cols-4" key={i}>
                        <div className="td flex-center-y gap-2">
                            <Tooltip>
                                <TooltipTrigger className="p-0 m-0">
                                    <AppAvatar 
                                        className="inline-block"
                                        fallbackClassName={` text-white ${ item.role === "JOBORDER" ? "!bg-[#58804D] text-white" : item.role === "COORDINATOR" ? "bg-white text-darkgreen font-bold border-1" : "bg-darkgreen" }`}
                                        fallback={ `${item.first_name![0]}${item.last_name![0]}` } 
                                    /> 
                                </TooltipTrigger>
                                <TooltipContent>{ item.role }</TooltipContent>
                            </Tooltip>
                            { item.last_name }, { item.first_name }
                        </div>
                        <div>
                            <Tooltip>
                                <TooltipTrigger className="td h-full flex-center-y">
                                    {item.email}
                                </TooltipTrigger>
                                <TooltipContent>{item.email}</TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="td">{item.contact}</div>
                        <div className="th">{item.college?.name}</div>
                    </div>
                ))}
            </div>

            <AppPagination 
                totalItems={ finalFilteredFaculties.length }
                itemsPerPage={ 10 }
                currentPage={ page }
                onPageChange={ setPage }
            />

            {open && (
                <CreateUser 
                    setOpen={setOpen}
                    setReload={setReload}
                    campusId={claims.campus.id}
                />
            )}
        </section>
    );
}
