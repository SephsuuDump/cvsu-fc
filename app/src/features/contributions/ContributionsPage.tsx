"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCrudState } from "@/hooks/use-crud-state";
import { PopoverContent } from "@radix-ui/react-popover";
import { ChevronDownIcon, FileUp, Plus, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function ContributionPage() {
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toLocaleString("default", { month: "long" })
    );

    const { open, setOpen } = useCrudState();
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <section className="stack-md reveal">
            <AppHeader label="Monthly Contributions" />
            <div className="text-lg font-bold">Contributions for month of <span className="text-darkgreen">{ selectedMonth.toUpperCase() }</span></div>
            <div className="flex-center-y justify-between">
                <Select
                    value={ selectedMonth }
                    onValueChange={ (value) => setSelectedMonth(value) }
                >
                    <SelectTrigger className="w-35 font-semibold rounded-b-none text-[15px] rounded-t-lg p-4">
                        <SelectValue placeholder='Select Month' />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((item, i) => (
                            <SelectItem value={item} key={i}>{ item }</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
                    <div className="th">Status</div>
                    <div className="th col-span-2">Previous 7 Days</div>
                </div>
            </div>
        </section>
    )
}