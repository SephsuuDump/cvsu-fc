"use client"

import { AppAvatar } from "@/components/shared/AppAvatar";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCrudState } from "@/hooks/use-crud-state";
import { FileUp, Plus, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { CreateFacultyMember } from "./CreateFacultyMember";

const tabs = ['Members', 'Job Offer'];

export function FacultyPage() {
    const [rwload, setReload] = useState(false);
    const [tab, setTab] = useState('Members');
    const { open, setOpen } = useCrudState();
    return (
        <section className="stack-md reveal">
            <AppHeader label="Faculty Members" />
            <div className="flex">
                <div className="bg-slate-50 w-fit rounded-t-lg shadow-sx border-slate-200">
                    {tabs.map((item, i) => (
                        <button
                            key={i}
                            onClick={ () => setTab(item) }
                            className={`w-30 text-[14px] p-2.5 rounded-t-lg ${item === tab && 'bg-green-200'}`}
                        >
                            { item }
                        </button>
                    ))}
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
                <div className="thead grid grid-cols-4">
                    <div className="th">Member Name</div>
                    <div className="th">Email Address</div>
                    <div className="th">Contact Number</div>
                    <div className="th">Member Since</div>
                </div>
                <Separator className="h-3 bg-slate-300" />
                {[1,2,3,4,5].map((item, i) => (
                    <div className="tdata grid grid-cols-4" key={i}>
                        <div className="td flex-center-y gap-2">
                            <AppAvatar className="inline-block" /> Joseph Emanuel O. Bataller
                        </div>
                        <Tooltip>
                            <TooltipTrigger className="td">main.josephemanuel.bataller@cvsu.edu.ph</TooltipTrigger>
                            <TooltipContent>main.josephemanuel.bataller@cvsu.edu.ph</TooltipContent>
                        </Tooltip>
                        <div className="th">Contact Number</div>
                        <div className="th">Member Since</div>
                    </div>
                ))}
            </div>

            {open && (
                <CreateFacultyMember 
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}