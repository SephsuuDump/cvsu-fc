"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCrudState } from "@/hooks/use-crud-state";
import { Check, FileUp, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { contributionsMock } from "../../../public/mock/contributions";
import { useFetchData } from "@/hooks/use-fetch-data";
import { CollegeService } from "@/services/college.service";
import { CvSULoading } from "@/components/ui/loader";
import { Contribution } from "@/types/contribution";
import { ContributionService } from "@/services/contribution.service";
import { Campus } from "@/types/campus";
import { CampusService } from "@/services/campus.service";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();
const pastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

export function ContributionPage() {
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
        [], 
        [selectedCampus?.id ?? '', selectedCollege?.id ?? '']
    )
    const { open, setOpen } = useCrudState();

    if (collegesLoading || campusLoading || contributionsLoading) return <CvSULoading />
    return (
        <section className="stack-md reveal">
            <AppHeader label="Monthly Contributions" />
            <div className="text-lg font-bold">Contributions for month of <span className="text-darkgreen">{ selectedMonth.toUpperCase() }</span></div>
            <div className="flex-center-y justify-between">
                <div className="flex-center-y">
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
            <div className="bg-slate-50 -mt-2">
                <div className="thead grid grid-cols-4">
                    <div className="th">Member Name</div>
                    <div className="th">Status</div>
                    <div className="th col-span-2">Contribution for { selectedYear }</div>
                </div>
                <Separator className="h-3 bg-slate-300" />

                {contributionsMock.map((item, i) => {
                    const monthData = item.contributions.find(
                        (c) => c.month === selectedMonth.slice(0,3) && String(c.year) === selectedYear
                    );
                    const isContributed = monthData?.contributed;
                        
                    return (
                        <div className="tdata grid grid-cols-4" key={i}>
                            <div className="td">
                                <div>{ `${item.user?.lastName}, ${item.user?.firstName}` }</div>
                                <div className="text-gray text-xs">{ item.user?.collegeName }</div>
                            </div>
                            <div className="td">
                                <Button
                                    className={`bg-darkgreen font-semibold w-25 opacity-30 rounded-none ${isContributed && '!opacity-100'}`}
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
                                        <div key={ii}>
                                            <div className="text-xs text-gray-500">{subItem.month}</div>
                                            <div>
                                                {subItem.contributed ? (
                                                <Check className="w-4 h-4 text-darkgreen" />
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
        </section>
    )
}