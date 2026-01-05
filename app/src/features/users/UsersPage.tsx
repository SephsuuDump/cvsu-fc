"use client"

import { AppAvatar } from "@/components/shared/AppAvatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCrudState } from "@/hooks/use-crud-state";
import { useFetchData } from "@/hooks/use-fetch-data";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user";
import { FileUp, Plus, Users } from "lucide-react";
import { CreateUser } from "./components/CreateUser";
import { Fragment, useEffect, useState } from "react";
import { CvSULoading } from "@/components/ui/loader";
import { AppRUDSelection } from "@/components/shared/AppRUDSelection";
import { UpdateUser } from "./components/UpdateUser";
import { DeleteUser } from "./components/DeleteUser";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel } from "@/components/ui/select";
import { CampusService } from "@/services/campus.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Campus } from "@/types/campus";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { useAuth } from "@/hooks/use-auth";
import { AccountPage } from "../account/AccountPage";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/shared/TablePagination";
import { AppPagination } from "@/components/shared/AppPagination";

export function UsersPage() {
    const router = useRouter();
    const { claims, loading: authLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const [selectedCampus, setSelectedCampus] = useState(0);
    const [selectedCollege, setSelectedCollege] = useState(0);
    const { data: users, loading } = useFetchData<User>(UserService.getAllUsers, [reload]);
    const { data: campusesOptions, loading: campusesLoading } = useFetchData<Campus>(CampusService.getAllCampus, []);
    const { search, setSearch, filteredItems } = useSearchFilter<Partial<User>>(users, ["first_name", "last_name"])

    const campuses = [{ id: 0, name: "All Campuses" }, ...campusesOptions];

    const filteredUsers = filteredItems.filter((u) => {
        if (selectedCampus !== 0) return u.campus?.id === selectedCampus;
        return true;
    });

    const collegeMap = Array.from(
        new Map(
            filteredUsers
                .filter(u => u.college)
                .map(u => [u.college!.id, {
                    id: u.college!.id,
                    name: u.college!.name,
                    abbreviations: u.college!.abbreviations
                }])
        ).values()
    );

    const finalFilteredUsers = filteredUsers.filter((u) => {
        if (selectedCollege !== 0) return u.college?.id === selectedCollege;
        return true;
    });

    const { page, setPage, size, setSize, paginated } = usePagination(finalFilteredUsers, 10); 
    
    const { open, setOpen, toView, setView, toUpdate, setUpdate, toDelete, setDelete } = useCrudState<Partial<User>>();

    useEffect(() => {
        if (!toView) return;
        router.push(`/users/${toView.id}`);
    }, [toView, router]);

    if (loading || authLoading) return <CvSULoading />
    return (
        <section className="stack-md reveal">
            <AppHeader label="CvSU FC Users" />
            <div className="flex">
                <div className="bg-slate-50 w-fit rounded-t-lg shadow-sx border-slate-200 p-2">
                    <Input
                        placeholder="Search for a user"
                        onChange={ e => setSearch(e.target.value) }
                        className="w-100"
                    />
                </div>
                <div className="ms-auto flex-center-y gap-1.5">
                    <button
                        onClick={ () => setOpen(!open) }
                        className="rounded-full p-2 bg-darkgreen shadow-sm"
                    >
                        <Plus className="w-4 h-4 text-slate-50" />
                    </button>
                    {campusesLoading ? (
                        <Skeleton className="w-10" />
                    ) : (
                        <Select onValueChange={(value) => setSelectedCampus(Number(value))}>
                            <SelectTrigger className="rounded-full w-40 truncate">
                                <SelectValue placeholder="Select Campus" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>CvSU Campuses</SelectLabel>
                                    {campuses.map((item) => (
                                        <SelectItem 
                                            key={ item.id }
                                            value={ String(item.id) }
                                        >
                                            { item.name.match(/University\s*-\s*(.+)/i)?.[1] ?? item.name }
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
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
                    {/* <Button
                        className="rounded-full bg-slate-50 shadow-sm text-black"
                        size="sm"
                    >
                        <FileUp /> Export
                    </Button> */}
                </div>
            </div>

            <div className="bg-slate-50 -mt-2">
                <div className="flex-center-y">
                    <div className="thead w-full grid grid-cols-4">
                        <div className="th">Member Name</div>
                        <div className="th">Email Address</div>
                        <div className="th">Campus</div>
                        <div className="th">College</div>
                    </div>
                    <div className="th w-10"></div>
                </div>
                <Separator className="h-3 bg-slate-300" />
                {paginated.length === 0 && (
                    <div className="py-10 flex flex-col items-center justify-center text-slate-500">
                        <Users className="h-10 w-10 mb-2 opacity-60" />
                        <p className="text-sm">No users found.</p>
                    </div>
                )}
                {paginated.map((item, i) => {
                    const loggedUser = claims.id;
                    return (
                        <Fragment key={i}>
                            {loggedUser !== item.id && (
                                <div className="tdata flex-center-y">
                                    <div className="w-full grid grid-cols-4">
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
                                        <Tooltip>
                                            <TooltipTrigger className="td text-start">
                                                { item.email }
                                            </TooltipTrigger>
                                            <TooltipContent>{ item.email }</TooltipContent>
                                        </Tooltip>
                                        <div className="td">
                                            { item.campus!.name.match(/University\s*-\s*(.+)/i)?.[1] ?? item.campus?.name }
                                        </div>
                                        <div className="td">
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    { item.college?.abbreviations ?? "ALL COLLEGES" }
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-darkgreen">
                                                    { item.college 
                                                        ? item.college.id 
                                                        : "ALL_COLLEGES" 
                                                    } 
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <AppRUDSelection
                                        className="w-10 flex-center"
                                        item={ item }
                                        setView={ setView }
                                        setUpdate={ setUpdate }
                                        setDelete={ setDelete }
                                    />
                                </div>
                            )}
                        </Fragment>
                    )
                })}
            </div>

            <AppPagination 
                totalItems={ users.length }
                itemsPerPage={ 10 }
                currentPage={ page }
                onPageChange={ setPage }
            />

            {open && (
                <CreateUser 
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateUser
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload } 
                />
            )}

            {toDelete && (
                <DeleteUser
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload } 
                />
            )}
        </section>
    )
}