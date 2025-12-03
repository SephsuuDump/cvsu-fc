"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { AppSelect } from "@/components/shared/AppSelect";
import { campusesMock } from "../../../public/mock/campuses";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { FacultySection } from "./components/FacultySection";
import { EventsSection } from "./components/EventsSection";
import { AnnouncementsSection } from "./components/AnnouncementSection";
import { CampusService } from "@/services/campus.service";
import { useFetchData } from "@/hooks/use-fetch-data";
import { CvSULoading } from "@/components/ui/loader";
import { Campus } from "@/types/campus";

const tabs = ['Faculty', 'Events', 'Announcements']

export function CampusesPage() {
    const { data: campuses, loading } = useFetchData<Campus>(CampusService.getAllCampus);
    const [tab, setTab] = useState(tabs[0]);
    const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);

    useEffect(() => {
        if (campuses && campuses.length > 0 && !selectedCampus) {
        setSelectedCampus(campuses[0]);
        }
    }, [campuses, selectedCampus]);
    
    if (loading || !selectedCampus) return <CvSULoading />
    return (
        <section className="stack-md reveal">
            <AppHeader label="CvSU Campuses" />
            <div className="flex-center-y justify-between">
                <div className="text-lg font-bold">{ selectedCampus.name ?? '...' }</div>
                <AppSelect
                    items={campuses.map((item) => ({
                        label: item.name.match(/University\s*-\s*(.+)/i)?.[1]!,
                        value: String(item.id),
                    }))}
                    value={String(selectedCampus.id)}
                    onChange={(value) => {
                        const campus = campusesMock.find((c) => String(c.id) === value)
                        if (campus) setSelectedCampus(campus)
                    }}
                />
            </div>
            <div className="flex-center-y gap-8">
                {tabs.map((item, i) => (
                    <button
                        onClick={ () => setTab(item) }
                        key={i}
                        className={`pl-1 text-sm text-gray uppercase font-semibold ${tab === item && "!text-darkgreen"}`}
                    >
                        { item }
                    </button>
                ))}
            </div>
            <Separator className="bg-slate-400" />

            {tab === tabs[0] && (
                <FacultySection 
                    campusId={ selectedCampus.id }
                />
            )}
            {tab === tabs[1] && (
                <EventsSection 
                    campusId={ selectedCampus.id }
                />
            )}
            {tab === tabs[2] && (
                <AnnouncementsSection 
                    campusId={ selectedCampus.id }
                />
            )}
        </section>
    )
}