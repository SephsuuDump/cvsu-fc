"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { AppSelect } from "@/components/shared/AppSelect";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { campusesMock } from "../../../public/mock/campuses";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { MembersSection } from "./components/MembersSection";
import { EventsSection } from "./components/EventsSection";
import { AnnouncementsSection } from "./components/AnnouncementSection";

const tabs = ['Coordinators', 'Members', 'Job Offers', 'Events', 'Announcements']

export function CampusesPage() {
    const [tab, setTab] = useState(tabs[0]);
    const [selectedCampus, setSelectedCampus] = useState(campusesMock[0])
    return (
        <section className="stack-md reveal">
            <AppHeader label="CvSU Campuses" />
            <div className="flex-center-y justify-between">
                <div className="text-lg font-bold">{ selectedCampus.name }</div>
                <AppSelect
                    items={campusesMock.map((item) => ({
                        label: item.name,
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
                <MembersSection />
            )}
            {tab === tabs[3] && (
                <EventsSection />
            )}
            {tab === tabs[4] && (
                <AnnouncementsSection />
            )}
        </section>
    )
}