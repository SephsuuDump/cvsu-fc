"use client"

import { AppAvatar } from "@/components/shared/AppAvatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCrudState } from "@/hooks/use-crud-state";
import { useFetchData } from "@/hooks/use-fetch-data";
import { formatDateToWord } from "@/lib/helper";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user";
import { FileUp, Plus, SlidersHorizontal } from "lucide-react";
import { CreateUser } from "./components/CreateUser";
import { useState } from "react";
import { CvSULoading } from "@/components/ui/loader";
import { AppRUDSelection } from "@/components/shared/AppRUDSelection";
import { UpdateUser } from "./components/UpdateUser";
import { DeleteUser } from "./components/DeleteUser";

export function UsersPage() {
    const [reload, setReload] = useState(false);
    const { data: users, loading } = useFetchData<Partial<User>>(UserService.getAllUsers, [reload]);
    
    const { open, setOpen, toView, setView, toUpdate, setUpdate, toDelete, setDelete } = useCrudState<Partial<User>>();

    if (loading) return <CvSULoading />
    return (
        <section className="stack-md reveal">
            <AppHeader label="CvSU FC Users" />
            <div className="flex">
                <div className="bg-slate-50 w-fit rounded-t-lg shadow-sx border-slate-200 p-2">
                    <Input
                        placeholder="Search for a user"
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
                    <button
                        className="rounded-full p-2 bg-slate-50 shadow-sm"
                    >
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
                <div className="flex-center-y">
                    <div className="thead w-full grid grid-cols-4">
                        <div className="th">Member Name</div>
                        <div className="th">Email Address</div>
                        <div className="th">College</div>
                        <div className="th">Member Since</div>
                    </div>
                    <div className="th w-10"></div>
                </div>
                <Separator className="h-3 bg-slate-300" />
                {users.map((item, i) => (
                    <div className="tdata flex-center-y" key={i}>
                        <div className="w-full grid grid-cols-4">
                            <div className="td flex-center-y gap-2">
                                <AppAvatar 
                                    className="inline-block"
                                    fallback={ `${item.first_name![0]}${item.last_name![0]}` } 
                                /> 
                                { item.last_name }, { item.first_name }
                            </div>
                            <Tooltip>
                                <TooltipTrigger className="td text-start">
                                    { item.email }
                                </TooltipTrigger>
                                <TooltipContent>{ item.email }</TooltipContent>
                            </Tooltip>
                            <div className="td">Contact Number</div>
                            <div className="td">{ formatDateToWord(item.created_at!) }</div>
                        </div>
                        <AppRUDSelection
                            className="w-10 flex-center"
                            item={ item }
                            setView={ setView }
                            setUpdate={ setUpdate }
                            setDelete={ setDelete }
                        />
                    </div>
                ))}
            </div>

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