"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, FileUp, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { CollegeService } from "@/services/college.service";
import { CvSULoading, SectionLoading } from "@/components/ui/loader";
import { Contribution } from "@/types/contribution";
import { ContributionService } from "@/services/contribution.service";
import { Campus } from "@/types/campus";
import { CampusService } from "@/services/campus.service";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();
const pastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

export function ContributionPage() {
    const [filteredContributions, setFilteredContributions] = useState<Contribution[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toLocaleString("default", { month: "long" })
    );
    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [selectedCampus, setSelectedCampus] = useState<Campus | undefined>(undefined);
    const [selectedCollege, setSelectedCollege] = useState<College | undefined>(undefined);

    const { data: campuses, loading: campusLoading } = useFetchData<Campus>(CampusService.getAllCampus); 
    const { data: colleges, loading: collegesLoading } = useFetchData<College>(CollegeService.getAllColleges); 
    const { data: contributions, loading: contributionsLoading } = useFetchData<Contribution>(
        ContributionService.getByCampusCollege, 
        [selectedCampus?.id, selectedCollege?.id, selectedYear], 
        [selectedCampus?.id ?? '', selectedCollege?.id ?? '', currentYear]
    )
    
    useEffect(() => {
        if (!contributions) return;
        setFilteredContributions(
            contributions.filter(i => i.month === selectedMonth.toLowerCase() && i.year === selectedYear)
        )
    }, [contributions, selectedMonth, selectedYear])

    if (collegesLoading || campusLoading) return <CvSULoading />
    return (
        <section className="stack-md reveal">
            <AppHeader label="Monthly Contributions" />
            <div className="text-lg font-bold">Contributions for month of <span className="text-darkgreen">{ selectedMonth.toUpperCase() }</span></div>
            <div className="flex-center-y justify-between">
                <div className="flex-center-y bg-slate-50 w-fit rounded-t-lg shadow-sx border-slate-200 p-3">
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
                    <Select
                        value={ String(selectedYear) }
                        onValueChange={ (value) => setSelectedYear(value) }
                    >
                        <SelectTrigger className="w-35 font-semibold rounded-b-none text-[15px] rounded-t-lg p-4">
                            <SelectValue placeholder='Select Month' />
                        </SelectTrigger>
                        <SelectContent>
                            {pastFiveYears.map((item, i) => (
                                <SelectItem value={String(item)} key={i}>{ item }</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={ selectedCampus?.id ? String(selectedCampus.id) : "0" }
                        onValueChange={ (value) => { 
                            if (value === "0") return setSelectedCampus(undefined);
                            return setSelectedCampus(campuses.find(i => String(i.id) === value));
                        }}
                    >
                        <SelectTrigger className="font-semibold rounded-b-none text-[15px] rounded-t-lg p-4">
                            <SelectValue placeholder='All Campuses' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Campuses</SelectItem>
                            {campuses.map((item, i) => (
                                <SelectItem value={ String(item.id) } key={i}>{ item.name.match(/-\s*(.*?)\s*Campus/i)?.[1] }</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={ selectedCollege?.id ? String(selectedCollege.id) : "0" }
                        onValueChange={ (value) => { 
                            if (value === "0") return setSelectedCollege(undefined);
                            return setSelectedCollege(colleges.find(i => String(i.id) === value));
                        }}
                    >
                        <SelectTrigger className="font-semibold rounded-b-none text-[15px] rounded-t-lg p-4">
                            <SelectValue placeholder='Select Month' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Colleges</SelectItem>
                            {colleges.map((item, i) => (
                                <SelectItem value={ String(item.id) } key={i}>{ item.abbreviations }</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="ms-auto flex-center-y gap-1.5">
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
            {contributionsLoading ? (
                <SectionLoading />
            ) : (
                <div className="bg-slate-50 -mt-2 border-t-1 border-slate-300">
                    <div className="thead grid grid-cols-4">
                        <div className="th">Member Name</div>
                        <div className="th">Status</div>
                        <div className="th col-span-2">Contribution for { selectedYear }</div>
                    </div>
                    <Separator className="h-3 bg-slate-300" />

                    {contributions.map((item, i) => {
                        const monthData = item.contributions.find(
                            (c) => c.month.slice(0, 3).toUpperCase() === selectedMonth.slice(0,3).toUpperCase() && String(c.year) === selectedYear
                        );
                        const isContributed = monthData?.contributed === 1;
                        
                        return (
                            <div className="tdata grid grid-cols-4" key={i}>
                                <div className="td">
                                    <div>{ `${item.first_name}, ${item.last_name}` }</div>
                                    <div className="text-gray text-xs">{ item.college_name }</div>
                                </div>
                                <div className="td">
                                    <Button
                                        className={`bg-darkgreen font-semibold w-25 opacity-30 rounded-none ${isContributed && '!opacity-100'}`}
                                        disabled={isContributed}
                                    >
                                        PAID
                                    </Button>
                                    <Button
                                        className={`bg-darkred font-semibold w-25 opacity-30 rounded-none ${!isContributed && '!opacity-100'}`}
                                    >
                                        UNPAID
                                    </Button>
                                </div>
                                <div className="td flex gap-4 col-span-2">
                                    {item.contributions
                                        .filter((subItem) => String(subItem.year) === selectedYear)
                                        .map((subItem, ii) => (
                                            <div className="flex-center flex-col" key={ii}>
                                                <div className="text-xs text-gray-500">
                                                    {(subItem.month.charAt(0).toUpperCase() + subItem.month.slice(1)).slice(0, 3)}
                                                </div>
                                                <div>
                                                    {subItem.contributed ? (
                                                        <Check className="w-4 h-4 text-darkgreen" strokeWidth={4} />
                                                        ) : (
                                                        <X className="w-4 h-4 text-darkred" />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}