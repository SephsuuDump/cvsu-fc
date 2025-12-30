"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, FileQuestion, FileUp, SlidersHorizontal, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { CollegeService } from "@/services/college.service";
import { CvSULoading, SectionLoading } from "@/components/ui/loader";
import { Contribution } from "@/types/contribution";
import { ContributionService } from "@/services/contribution.service";
import { Campus } from "@/types/campus";
import { CampusService } from "@/services/campus.service";
import { useCrudState } from "@/hooks/use-crud-state";
import { UpdateContribution } from "./components/UpdateContribution";
import { useAuth } from "@/hooks/use-auth";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();
const pastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

export function ContributionPage() {
    const { claims, loading: authLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toLocaleString("default", { month: "long" })
    );
    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [selectedCampus, setSelectedCampus] = useState<string>("0");
    const [selectedCollege, setSelectedCollege] = useState<string>("0");

    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [staticLoading, setStaticLoading] = useState(true);

    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [contributionsLoading, setContributionsLoading] = useState(false);

    const { toUpdate, setUpdate } = useCrudState<{
        first_name: string;
        last_name: string;
        id: number,
        month: string,
        year: string;
        contributed: number;
    }>();

    useEffect(() => {
        if (claims.role === "ADMIN") return
        setSelectedCampus(String(claims.campus.id))
        setSelectedCollege(String(claims.college.id))
    }, [claims])

    useEffect(() => {
        async function loadStaticData() {
            try {
                const [campusData, collegeData] = await Promise.all([
                    CampusService.getAllCampus(),
                    CollegeService.getAllColleges()
                ]);
                
                setCampuses(Array.isArray(campusData) ? campusData : campusData.content || []);
                setColleges(Array.isArray(collegeData) ? collegeData : collegeData.content || []);
            } catch (error) {
                console.error("Failed to load static data:", error);
            } finally {
                setStaticLoading(false);
            }
        }
        loadStaticData();
    }, []);

    useEffect(() => {
        async function loadContributions() {
            setContributionsLoading(true);
            try {
                const result = await ContributionService.getByCampusCollege(
                    Number(selectedCampus),
                    Number(selectedCollege),
                    selectedYear,
                );
                
                setContributions(Array.isArray(result) ? result : result.content || []);
            } catch (error) {
                console.error("Failed to load contributions:", error);
                setContributions([]);
            } finally {
                setContributionsLoading(false);
            }
        }
        
        if (!staticLoading) {
            loadContributions();
        }
    }, [selectedCampus, selectedCollege, selectedYear, staticLoading, reload]);

    if (staticLoading || authLoading) return <CvSULoading />
    
    return (
        <section className="stack-md reveal">
            <AppHeader label="Monthly Contributions" />
            <div className="text-lg font-bold">
                Contributions for month of <span className="text-darkgreen">{ selectedMonth.toUpperCase() }</span>
            </div>
            <div className="flex-center-y justify-between">
                <div className="flex-center-y bg-slate-50 w-fit rounded-t-lg shadow-sx border-slate-200 p-2">
                    <Select 
                        value={selectedMonth} 
                        onValueChange={setSelectedMonth} 
                    >
                        <SelectTrigger className="w-35 font-semibold rounded-b-none text-[15px] rounded-t-lg p-4">
                            <SelectValue placeholder='Select Month' />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((item, i) => (
                                <SelectItem value={item} key={i}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select 
                        value={selectedYear} 
                        onValueChange={setSelectedYear}
                    >
                        <SelectTrigger className="w-35 font-semibold rounded-b-none text-[15px] rounded-t-lg p-4">
                            <SelectValue placeholder='Select Year' />
                        </SelectTrigger>
                        <SelectContent>
                            {pastFiveYears.map((item, i) => (
                                <SelectItem value={String(item)} key={i}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select 
                        value={selectedCampus} 
                        onValueChange={setSelectedCampus}
                        disabled={claims.role !== "ADMIN"}
                    >
                        <SelectTrigger className="font-semibold rounded-b-none text-[15px] rounded-t-lg p-4">
                            <SelectValue placeholder='All Campuses' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Campuses</SelectItem>
                            {campuses.map((item, i) => (
                                <SelectItem value={String(item.id)} key={i}>
                                    {item.name.match(/-\s*(.*?)\s*Campus/i)?.[1]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select 
                        value={selectedCollege} 
                        onValueChange={setSelectedCollege}
                        disabled={claims.role !== "ADMIN"}
                    >
                        <SelectTrigger className="font-semibold rounded-b-none text-[15px] rounded-t-lg p-4">
                            <SelectValue placeholder='All Colleges' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Colleges</SelectItem>
                            {colleges.map((item, i) => (
                                <SelectItem value={String(item.id)} key={i}>
                                    {item.abbreviations}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="ms-auto flex-center-y gap-1.5">
                    <button className="rounded-full p-2 bg-slate-50 shadow-sm">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                    <Button className="rounded-full bg-slate-50 shadow-sm text-black" size="sm">
                        <FileUp /> Export
                    </Button>
                </div>
            </div>
            {contributionsLoading ? (
                <SectionLoading />
            ) : (
                <div className="bg-slate-50 -mt-2">
                    <div className="thead grid grid-cols-4">
                        <div className="th">Member Name</div>
                        <div className="th">Status</div>
                        <div className="th col-span-2">Contribution for {selectedYear}</div>
                    </div>
                    <Separator className="h-3 bg-slate-300" />
                    {contributions.length === 0 && (
                        <div className="py-16 flex flex-col items-center justify-center text-slate-500">
                            <FileQuestion className="w-12 h-12 mb-3 opacity-50" />
                            <p className="text-sm">No contributions found.</p>
                        </div>
                    )}
                    {contributions.map((item, i) => {
                        const monthData = item.contributions.find(
                            (c) => c.month.slice(0, 3).toUpperCase() === selectedMonth.slice(0,3).toUpperCase() && 
                                   String(c.year) === selectedYear
                        );
                        const isContributed = monthData?.contributed === 1;
                        
                        return (
                            <div className="tdata grid grid-cols-4" key={i}>
                                <div className="td">
                                    <div>{`${item.first_name}, ${item.last_name}`}</div>
                                    <div className="text-gray text-xs">{item.college_name}</div>
                                </div>
                                <div className="td">
                                    {monthData ? (
                                        <Fragment>
                                            <Button
                                                onClick={ () => setUpdate({
                                                    first_name: item.first_name,
                                                    last_name: item.last_name,
                                                    id: monthData!.id,
                                                    month: monthData!.month,
                                                    year: String(monthData!.year),
                                                    contributed: monthData!.contributed
                                                }) }
                                                className={`bg-darkgreen font-semibold w-25 opacity-30 rounded-none ${isContributed && '!opacity-100'}`}
                                                disabled={isContributed}
                                            >
                                                PAID
                                            </Button>
                                            <Button
                                                onClick={ () => setUpdate({
                                                    first_name: item.first_name,
                                                    last_name: item.last_name,
                                                    id: monthData!.id,
                                                    month: monthData!.month,
                                                    year: String(monthData!.year),
                                                    contributed: monthData!.contributed
                                                }) }
                                                className={`bg-darkred font-semibold w-25 opacity-30 rounded-none ${!isContributed && '!opacity-100'}`}
                                                disabled={!isContributed}
                                            >
                                                UNPAID
                                            </Button>
                                        </Fragment>
                                    ) : (
                                        <Button className="w-50 rounded-none bg-gray-600 hover:bg-gray-700">
                                            NO CONTRIBUTION
                                        </Button>
                                    )}
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
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {toUpdate && (
                <UpdateContribution
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}