"use client";

import { CvSULoading, SectionLoading } from "@/components/ui/loader";
import { useFetchData } from "@/hooks/use-fetch-data";
import { AllocationService } from "@/services/allocation.service";
import { useMemo, useState } from "react";
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Campus } from "@/types/campus";
import { CampusService } from "@/services/campus.service";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { UserService } from "@/services/user.service";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { formatToPeso } from "@/lib/helper";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const currentYear = new Date().getFullYear();
const pastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

const GREEN_COLORS = [
    "#14532d",
    "#385DFF",
    "#00F12E",
    "#0DD7FF",
    "#E41010",
    "#E49C20",
    "#F6F605",
    "#9B2CF6",
    "#D5EADB",
    "#E4A4EA",
    "#EA8981",
    "#9283EA"
];
const SEX_COLORS = ["#6495ed", "#ec4899"]; 

const peso = (value: number) => `₱${value.toLocaleString()}`;

type ChartItem = {
    name: string;
    value: number;
};

function ScrollLegend({
    items,
    title = "Legend",
    sexColors
}: {
    items: ChartItem[];
    title?: string;
    sexColors?: string[]
}) {
    return (
        <div className="w-full md:w-[42%] lg:w-[40%]">
            <div className="text-xs font-semibold text-gray-600 mb-2">
                {title}
            </div>

            {/* Scrollable legend container */}
            <div className="max-h-[260px] overflow-auto pr-2 space-y-2">
                {items.map((it, i) => (
                    <div key={`${it.name}-${i}`} className="flex items-start gap-2">
                        <span
                            className="mt-1 inline-block h-3 w-3 rounded-sm flex-shrink-0"
                            style={{
                                backgroundColor:
                                    sexColors ? sexColors[i % sexColors.length]
                                    : GREEN_COLORS[i % GREEN_COLORS.length],
                            }}
                        />
                        <div className="min-w-0">
                            <div className="text-xs text-gray-900 font-medium truncate">
                                {it.name}
                            </div>
                            <div className="text-[11px] text-gray-600">
                                {sexColors ? it.value : formatToPeso(it.value)}
                            </div>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-xs text-gray-500">
                        No data found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CampusAndCollegeAllocationPie() {
    const isMobile = useIsMobile();
    const { claims, loading: authLoading } = useAuth();

    const [refreshFilter, setRefreshFilter] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toLocaleString("default", { month: "long" })
    );
    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [selectedCampus, setSelectedCampus] = useState<string>(
        claims.role === "ADMIN" ? "0" : String(claims.campus.id)
    );

    const { data: genderCounts, loading: loadingGenderCounts } = useFetchOne(
        UserService.getGenderCount,
        [claims.campus.id],
        [claims.role === "ADMIN" ? 0 : claims.campus.id]
    )

    const { data: campuses = [] } = useFetchData<Campus>(
        CampusService.getAllCampus,
        []
    );

    const { data: allocations = [], loading } = useFetchData(
        AllocationService.getAllocations,
        [refreshFilter, claims.campus.id],
        [Number(selectedCampus), 0, selectedYear, selectedMonth]
    );

    const campusShortName = (fullName: string) =>
        fullName.match(/University\s*-\s*(.+)/i)?.[1] ?? fullName;

    const campusChartData: ChartItem[] = useMemo(() => {
        const totals: Record<string, number> = {};

        allocations.forEach((item) => {
            const campusName = campusShortName(item.campus.name);
            totals[campusName] =
                (totals[campusName] || 0) + parseFloat(item.amount);
        });

        return Object.entries(totals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [allocations]);

    const campusTotal = campusChartData.reduce((a, b) => a + b.value, 0);

    const collegeChartData: ChartItem[] = useMemo(() => {
        const totals: Record<string, number> = {};
        allocations.forEach((item) => {
            const label = item.college
                ? `${item.college.abbreviations}`
                : `Campus Level (${item.campus.name.match(/University\s*-\s*(.+)/i)?.[1]})`;

            totals[label] = (totals[label] || 0) + parseFloat(item.amount);
        });

        return Object.entries(totals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [allocations]);

    const genderChartData = [
        { name: "Male", value: genderCounts?.Male ?? 0 },
        { name: "Female", value: genderCounts?.Female ?? 0 },
    ];

    const collegeTotal = collegeChartData.reduce((a, b) => a + b.value, 0);
    const totalGender = genderChartData.reduce((sum, d) => sum + d.value, 0);

    console.log(collegeChartData);
    

    if (authLoading) return <CvSULoading />
    return (
        <section className="space-y-6">
            {/* ===== FILTERS ===== */}
            <div className="flex-center-y gap-2 max-sm:grid! max-md:grid-cols-2">
                <Select value={selectedCampus} onValueChange={setSelectedCampus} disabled={ claims.role !== "ADMIN" }>
                    <SelectTrigger className="rounded-full w-44 truncate disabled:text-gray max-sm:w-full">
                        <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Campuses</SelectLabel>
                            <SelectItem value="0">All Campuses</SelectItem>
                            {campuses.map((campus) => (
                                <SelectItem key={campus.id} value={String(campus.id)}>
                                    {campus.name.match(/University\s*-\s*(.+)/i)?.[1] ?? campus?.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-40 rounded-full max-sm:w-full">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-32 rounded-full max-sm:w-full">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {pastFiveYears.map((y) => (
                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    onClick={ () => setRefreshFilter(prev => !prev) }
                    className="!bg-darkgreen hover:opacity-90 rounded-full shadow max-sm:w-full"
                    size="sm"
                >
                    <RefreshCcw /> Refresh Filter
                </Button>
            </div>
            
            {loadingGenderCounts ? (
                <SectionLoading />
            ) : (
                <div className="h-[380px] bg-slate-50 rounded-xl shadow-md p-4 overflow-hidden max-md:h-150">
                    <AppHeader label="Gender Distribution" />

                    <div className="flex flex-col md:flex-row gap-4 h-[320px] max-md:h-100">
                        {/* Chart */}
                        <div className="flex-1 min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={genderChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius="55%"
                                        outerRadius="80%"
                                        stroke="#fff"
                                        strokeWidth={2}
                                        isAnimationActive={false}
                                    >
                                        {genderChartData.map((_, i) => (
                                            <Cell
                                                key={i}
                                                fill={SEX_COLORS[i % SEX_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip formatter={(v) => v} />
                                </PieChart>
                            </ResponsiveContainer>

                            <p className="text-center text-sm text-gray-600 mt-2">
                                Total:{" "}
                                <span className="font-semibold">
                                    {totalGender}
                                </span>
                            </p>
                        </div>
                        {!isMobile && (
                            <ScrollLegend 
                                items={genderChartData}
                                title="Sex" 
                                sexColors={ SEX_COLORS } 
                            />
                        )}
                    </div>

                    {isMobile && (
                        <ScrollLegend 
                            items={genderChartData}
                            title="Sex" 
                            sexColors={ SEX_COLORS } 
                        />
                    )}
                </div>

            )}

            {loading ? (
                <SectionLoading />
            ) : (
                <div className="grid grid-cols-1 gap-4 reveal">
                    {/* CAMPUS CARD */}
                    <div className="h-[380px] bg-slate-50 rounded-xl shadow-md p-4 max-md:h-full">
                        <AppHeader label="Total Allocation per Campus" />

                        <div className="flex flex-col md:flex-row gap-4 h-[320px] max-md:h-100">
                            {/* Chart area */}
                            <div className="flex-1 min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={campusChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius="55%"
                                            outerRadius="80%"
                                            stroke="#fff"
                                            strokeWidth={2}
                                            isAnimationActive={false}
                                        >
                                            {campusChartData.map((_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={GREEN_COLORS[i % GREEN_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip
                                            formatter={(v) =>
                                                typeof v === "number" ? peso(v) : v
                                            }
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <p className="text-center text-sm text-gray-600 mt-2">
                                    Total:{" "}
                                    <span className="font-semibold">
                                        {peso(campusTotal)}
                                    </span>
                                </p>
                            </div>
                            {!isMobile && (
                                <ScrollLegend 
                                    items={campusChartData} 
                                    title="Campuses" 
                                />
                            )}
                        </div>
                        
                        {isMobile && (
                            <ScrollLegend items={campusChartData} title="Campuses" />
                        )}
                    </div>

                    {/* COLLEGE CARD */}
                    <div className="h-[380px] bg-slate-50 rounded-xl shadow-md p-4 max-md:h-fit">
                        <AppHeader label="Allocation per College" />

                        <div className="flex flex-col md:flex-row gap-4 h-[320px] max-md:h-100">
                            {/* Chart area */}
                            <div className="flex-1 min-w-0 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={collegeChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius="55%"
                                            outerRadius="80%"
                                            stroke="#fff"
                                            strokeWidth={2}
                                            isAnimationActive={false}
                                        >
                                            {collegeChartData.map((_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={GREEN_COLORS[i % GREEN_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip
                                            formatter={(v) =>
                                                typeof v === "number" ? peso(v) : v
                                            }
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <p className="text-center text-sm text-gray-600 mt-2">
                                    Total:{" "}
                                    <span className="font-semibold">
                                        {peso(collegeTotal)}
                                    </span>
                                </p>
                            </div> 
                            {!isMobile && (
                                <ScrollLegend 
                                    items={collegeChartData} 
                                    title="Campuses" 
                                />
                            )}
                        </div>

                        {isMobile && (
                            <ScrollLegend items={collegeChartData} title="Campuses" />
                        )}
                        
                    </div>
                </div>
            )}
        </section>
    );
}
