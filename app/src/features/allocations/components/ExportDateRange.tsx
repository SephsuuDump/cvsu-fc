"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { toast } from "sonner";
import { ContributionService } from "@/services/contribution.service";
import { BASE_URL } from "@/lib/urls";
import { PositionService } from "@/services/officer.service";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Position } from "@/types/officer";
import { ModalLoader } from "@/components/ui/loader";
import { CollegeService } from "@/services/college.service";
import { CampusService } from "@/services/campus.service";
import { Campus } from "@/types/campus";
import { AppSelect } from "@/components/shared/AppSelect";
import { useState } from "react";

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export function AllocationExportMonthRange({ claims, setOpen, defaultCampus, defaultCollege }: {
    claims: Claim
    setOpen: (i:boolean) => void
    defaultCampus: null | number
    defaultCollege: null | number
}) {
    const [selectedCampus, setSelectedCampus] = useState(defaultCampus && defaultCampus !== 0 ? defaultCampus :claims.role !== "ADMIN" ? claims.campus.id : "0");
    const [selectedCollege, setSelectedCollege] = useState(defaultCollege ?? "0");
    const [startMonth, setStartMonth] = React.useState("January");
    const [endMonth, setEndMonth] = React.useState("December");
    const [year, setYear] = React.useState(String(CURRENT_YEAR));

    const { data: campuses, loading: campusesLoading } = useFetchData<Campus>(
        CampusService.getAllCampus
    )
    
    const { data: colleges, loading: collegesLoading } = useFetchData<College>(
        CollegeService.getAllColleges
    )

    function monthIndex(month: string) {
        return MONTHS.indexOf(month);
    }

    async function handleExport() {
        if (monthIndex(startMonth) > monthIndex(endMonth)) {
            toast.error("Start month must not be after end month");
            return;
        }

        const url = `${BASE_URL}/allocations/export` +
            `?start_date=${startMonth.toLowerCase()}` +
            `&end_date=${endMonth.toLowerCase()}` +
            `&year=${year}` +
            `&college_id=${selectedCollege}` +
            `&campus_id=${selectedCampus}`;

        window.open(url, "_blank"); 

        setOpen(false);
    }

    if (campusesLoading || collegesLoading) return <ModalLoader />
    return (
        <Dialog open onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <ModalTitle label="Export Allocation" />
                </DialogHeader>

                <div className="space-y-2 mt-2">
                    <AppSelect 
                        label="Campus"
                        groupLabel="CvSU Campuses"
                        items={ [
                            { label: "All Campus", value: "0" },
                            ...campuses.map((item) => ({
                                label: item.name.match(/University\s*-\s*(.+)/i)?.[1] ?? item.name,
                                value: String(item.id)
                            }))
                        ] }
                        placeholder="Select campus"
                        value={ String(selectedCampus) }
                        onChange={ (value) => setSelectedCampus(value) }
                        disabled={ claims.role !== "ADMIN" }
                        searchPlaceholder="Search for a campus"
                    />
                    <AppSelect 
                        label="College"
                        groupLabel="CvSU Colleges"
                        items={ [
                            { label: "All Colleges", value: "0" },
                            ...colleges.map((item) => ({
                                label: item.abbreviations,
                                value: String(item.id)
                            }))
                        ] }
                        placeholder="Select campus"
                        value={ String(selectedCollege) }
                        onChange={ (value) => setSelectedCollege(value) }
                        disabled={ claims.role !== "ADMIN" }
                        searchPlaceholder="Search for a campus"
                    />
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Start Month
                        </label>
                        <Select
                            value={startMonth}
                            onValueChange={setStartMonth}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MONTHS.map((m) => (
                                    <SelectItem
                                        key={m}
                                        value={m}
                                    >
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            End Month
                        </label>
                        <Select
                            value={endMonth}
                            onValueChange={setEndMonth}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MONTHS.map((m) => (
                                    <SelectItem
                                        key={m}
                                        value={m}
                                    >
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Year
                        </label>
                        <Select
                            value={year}
                            onValueChange={setYear}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {YEARS.map((y) => (
                                    <SelectItem
                                        key={y}
                                        value={String(y)}
                                    >
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
