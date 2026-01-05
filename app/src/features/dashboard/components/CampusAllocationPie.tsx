"use client";

import { SectionLoading } from "@/components/ui/loader";
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

const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const currentYear = new Date().getFullYear();
const pastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

const GREEN_COLORS = [
    "#14532d",
    "#166534",
    "#15803d",
    "#16a34a",
    "#22c55e",
    "#4ade80",
    "#86efac",
    "#bbf7d0",
];

const peso = (value: number) => `₱${value.toLocaleString()}`;

type ChartItem = {
    name: string;
    value: number;
};

function ScrollLegend({
    items,
    title = "Legend",
}: {
    items: ChartItem[];
    title?: string;
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
                                    GREEN_COLORS[i % GREEN_COLORS.length],
                            }}
                        />
                        <div className="min-w-0">
                            <div className="text-xs text-gray-900 font-medium truncate">
                                {it.name}
                            </div>
                            <div className="text-[11px] text-gray-600">
                                {peso(it.value)}
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
    const [refreshFilter, setRefreshFilter] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toLocaleString("default", { month: "long" })
    );
    const [selectedYear, setSelectedYear] = useState(String(currentYear));
    const [selectedCampus, setSelectedCampus] = useState<string>("0");

    const { data: campuses = [] } = useFetchData<Campus>(
        CampusService.getAllCampus,
        []
    );

    const { data: allocations = [], loading } = useFetchData(
        AllocationService.getAllocations,
        [refreshFilter],
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

    const collegeTotal = collegeChartData.reduce((a, b) => a + b.value, 0);

    return (
        <section className="space-y-6">
            {/* ===== FILTERS ===== */}
            <div className="flex-center-y gap-2">
                <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                    <SelectTrigger className="rounded-full w-44 truncate">
                        <SelectValue placeholder="Select Campus" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Campuses</SelectLabel>
                            <SelectItem value="0">All Campuses</SelectItem>
                            {campuses.map((campus) => (
                                <SelectItem key={campus.id} value={String(campus.id)}>
                                    {campus.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-40 rounded-full">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-32 rounded-full">
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
                    className="!bg-darkgreen hover:opacity-90 rounded-full shadow"
                    size="sm"
                >
                    <RefreshCcw /> Refresh Filter
                </Button>
            </div>

            {loading ? (
                <SectionLoading />
            ) : (
                <div className="grid grid-cols-1 gap-4 reveal">
                    {/* CAMPUS CARD */}
                    <div className="h-[380px] bg-slate-50 rounded-xl shadow-md p-4 overflow-hidden">
                        <AppHeader label="Total Allocation per Campus" />

                        <div className="flex flex-col md:flex-row gap-4 h-[320px]">
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

                            {/* Scrollable legend */}
                            <ScrollLegend items={campusChartData} title="Campuses" />
                        </div>
                    </div>

                    {/* COLLEGE CARD */}
                    <div className="h-[380px] bg-slate-50 rounded-xl shadow-md p-4 overflow-hidden">
                        <AppHeader label="Allocation per College" />

                        <div className="flex flex-col md:flex-row gap-4 h-[320px]">
                            {/* Chart area */}
                            <div className="flex-1 min-w-0">
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

                            {/* Scrollable legend */}
                            <ScrollLegend items={collegeChartData} title="Colleges / Campus-level" />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
