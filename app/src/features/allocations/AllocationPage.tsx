"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileUp, HandCoins, Landmark, Plus, RefreshCcw, Search, University } from "lucide-react";
import { AppHeader } from "@/components/shared/AppHeader";
import { Campus } from "@/types/campus";
import { useFetchData } from "@/hooks/use-fetch-data";
import { CampusService } from "@/services/campus.service";
import { CollegeService } from "@/services/college.service";
import { Skeleton } from "@/components/ui/skeleton";
import { AllocationService } from "@/services/allocation.service";
import { useCrudState } from "@/hooks/use-crud-state";
import { CreateAllocation } from "./components/CreateAllocation";
import { CvSULoading, SectionLoading } from "@/components/ui/loader";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { match } from "assert";
import { formatToPeso } from "@/lib/helper";
import { useAuth } from "@/hooks/use-auth";
import { AllocationExportMonthRange } from "./components/ExportDateRange";

type AllocationLevel = "COLLEGE" | "CAMPUS";
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();
const pastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function AllocationPage() {
    const { claims, loading: authLoading } = useAuth();
    const [refreshFilter, setRefreshFilter] = useState(false);
    const [reload, setReload] = useState(false);
    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState<AllocationLevel | "ALL">("ALL");
    const [selectedCampus, setSelectedCampus] = useState(0);
    const [selectedCollege, setSelectedCollege] = useState(0);

    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toLocaleString("default", { month: "long" })
    );
    const [selectedYear, setSelectedYear] = useState(String(currentYear));

    const { data: campuses, loading: campusesLoading } = useFetchData<Campus>(CampusService.getAllCampus, []);
    const { data: colleges, loading: collegesLoading } = useFetchData<College>(CollegeService.getAllColleges, []);
    const { data: allocations, loading: allocationLoading } = useFetchData(
        AllocationService.getAllocations,
        [refreshFilter],
        [selectedCampus, selectedCollege, selectedYear, selectedMonth]
    )
    const { data: budget, loading: budgetLoading } = useFetchOne(
        AllocationService.getCollegeBudget,
        [refreshFilter],
        [selectedCampus, selectedCollege, selectedYear, selectedMonth]
    )
    
    const { open, setOpen } = useCrudState();
    const { open: openExport, setOpen: setOpenExport } = useCrudState();

    useEffect(() => {
        if (claims.role === "ADMIN") return
        setSelectedCampus(claims.campus.id)
        setSelectedCollege(claims.college.id)
    }, [claims])

    const filteredAllocations = useMemo(() => {
        if (!allocations) return [];

        return allocations.filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase());

            const matchesLevel =
                levelFilter === "ALL"
                    ? true
                    : item.level === levelFilter;

            return matchesSearch && matchesLevel;
        });
    }, [allocations, search, levelFilter]);


    if (authLoading) return <CvSULoading />
    return (
        <section className="stack-md reveal">

            <AppHeader label="Allocations"/>
            
            <div className="flex-center-y justify-between">
                <div className="flex-center-y gap-2">
                    {campusesLoading && (
                        <Skeleton className="h-9 rounded-full w-40 bg-green-200" />
                    )}
                    {collegesLoading && (
                        <Skeleton className="h-9 rounded-full w-40 bg-green-200" />
                    )}
                
                    {campuses.length > 0 && (
                        <Select 
                            value={ String(selectedCampus) }
                            onValueChange={(value) => setSelectedCampus(Number(value))}
                            disabled={ claims.role !== "ADMIN" }
                        >
                            <SelectTrigger className="rounded-full w-40 truncate reveal">
                                <SelectValue placeholder="Select Campus" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Colleges</SelectLabel>
                                    <SelectItem value="0">All Colleges</SelectItem>
                                    {campuses.map((col) => (
                                        <SelectItem key={col.id} value={String(col.id)}>
                                            {col.name.match(/University\s*-\s*(.+)/i)?.[1]}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                    {colleges.length > 0 && (
                        <Select 
                            value={ String(selectedCollege) }
                            onValueChange={(value) => setSelectedCollege(Number(value))}
                            disabled={ claims.role !== "ADMIN" }
                        >
                            <SelectTrigger className="rounded-full w-40 truncate reveal">
                                <SelectValue placeholder="Select College" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Colleges</SelectLabel>
                                    <SelectItem value="0">All Colleges</SelectItem>
                                    {colleges.map((col) => (
                                        <SelectItem key={col.id} value={String(col.id)}>
                                            {col.abbreviations}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}

                    <Select 
                        value={selectedMonth} 
                        onValueChange={setSelectedMonth} 
                    >
                        <SelectTrigger className="w-40 rounded-full">
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
                        <SelectTrigger className="w-40 rounded-full">
                            <SelectValue placeholder='Select Year' />
                        </SelectTrigger>
                        <SelectContent>
                            {pastFiveYears.map((item, i) => (
                                <SelectItem value={String(item)} key={i}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={ () => setRefreshFilter(prev => !prev) }
                        className="!bg-darkgreen hover:opacity-90 rounded-full shadow"
                        size="sm"
                    >
                        <RefreshCcw /> Refresh Filter
                    </Button>
                </div>
                <div className="flex-center-y gap-2">
                    <Button 
                        onClick={ () => setOpenExport(true) }
                        className="bg-slate-50 shadow-sm text-black" 
                    >
                        <FileUp /> Export
                    </Button>
                    {["ADMIN", "COORDINATOR"].includes(claims.role) && (
                        <Button
                            onClick={ () => setOpen(true) }
                            className="!bg-darkgreen hover:opacity-90"
                            size="sm"
                        >
                            <Plus className="w-4 h-4" /> Add Allocation
                        </Button>
                    )}
                </div>
                
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="rounded-lg border-[1.5px] border-darkgreen bg-white p-4 shadow-sm hover:shadow-sm hover:shadow-darkgreen">
                    <div className="text-xs text-muted-foreground reveal">
                        Total budget of { campuses?.find(i => i.id === selectedCampus)?.name.match(/University\s*-\s*(.+)/i)?.[1] ?? "All Campuses" } ({ colleges.find(i => i.id === selectedCollege)?.abbreviations ?? "All Colleges"})
                    </div>
                    {budgetLoading ? (
                        <Skeleton className="w-40 bg-green-200 h-12" />
                    ) : (
                        <div className="text-2xl scale-x-110 origin-left font-bold text-darkgreen reveal">
                            { formatToPeso(budget.active_budget)  }
                        </div>
                    )}
                </div>

                <div className="rounded-lg border-[1.5px] border-darkgreen bg-white p-4 shadow-sm hover:shadow-sm hover:shadow-darkgreen">
                    <div className="text-xs text-muted-foreground reveal">
                        Total allocations for { campuses?.find(i => i.id === selectedCampus)?.name.match(/University\s*-\s*(.+)/i)?.[1] ?? "All Campuses" } ({ colleges.find(i => i.id === selectedCollege)?.abbreviations ?? "All Colleges"})
                    </div>
                    {allocationLoading ? (
                        <Skeleton className="w-15 bg-green-200 h-12" />
                    ) : (
                        <div className="text-2xl scale-x-110 origin-left font-bold reveal">
                            { allocations.length }
                        </div>
                    )}
                </div>

            </div>

            <div className="flex flex-col md:flex-row gap-3 items-center">

                {/* SEARCH */}
                <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Search allocation..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* LEVEL SELECT */}
                <Select
                    value={levelFilter}
                    onValueChange={(value) =>
                        setLevelFilter(value as AllocationLevel | "ALL")
                    }
                >
                    <SelectTrigger className="w-[180px] rounded-full ms-auto">
                        <SelectValue placeholder="Filter Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Levels</SelectItem>
                        <SelectItem value="CAMPUS">Campus</SelectItem>
                        <SelectItem value="COLLEGE">College</SelectItem>
                    </SelectContent>
                </Select>

            </div>

          
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {!allocationLoading && filteredAllocations.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500">
                        <HandCoins className="h-12 w-12 mb-3 opacity-60" />
                        <p className="text-sm font-medium">No allocations found</p>
                        <p className="text-xs text-slate-400 mt-1">
                            Try adjusting your campus, college, or filters.
                        </p>
                    </div>
                )}

                {!allocationLoading ? (
                    filteredAllocations.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-lg bg-white p-4 shadow-xs shadow-darkgreen reveal"
                        >
                          
                            <div className="font-semibold text-sm">
                                {item.title}
                            </div>
                          

                            <div className="mt-1 text-xs text-muted-foreground">
                                {item.description}
                            </div>

                            <div className="mt-3 text-sm space-y-1">
                                <div className="flex-center-y gap-2">
                                    <Landmark className="w-4 h-4" />
                                    <div className="text-sm">{item.campus.name }</div>
                                </div>
                                <div className="flex-center-y gap-2">
                                    <University className="w-4 h-4" />
                                    <div className="text-sm">{item.college ? item.college.name : "All Colleges"}</div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm font-bold text-darkgreen">
                                    ₱ {item.amount.toLocaleString()}
                                </div>
                                <Badge
                                    variant={item.level === "CAMPUS" ? "default" : "secondary"}
                                    className={`bg-slate-50 border-[1.5px] border-darkgreen text-darkgreen ${item.level === "CAMPUS" && "shadow-xs shadow-darkgreen"}`}
                                >
                                    {item.level}
                                </Badge>
                            </div>
                        </div>
                    ))
                ) : (
                    <SectionLoading className="col-span-10" />
                )}
            </div>

            {open && (
                <CreateAllocation 
                    claims={ claims }
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {openExport && (
                <AllocationExportMonthRange 
                    setOpen={ setOpenExport }
                />
            )}
        </section>
    );
}
