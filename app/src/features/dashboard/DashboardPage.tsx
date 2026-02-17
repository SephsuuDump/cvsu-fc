"use client"

import { useAuth } from "@/hooks/use-auth";
import { CvSULoading, SectionLoading } from "@/components/ui/loader";
import { Announcements } from "./components/Announcements";
import { Calendar } from "../events/components/Calendar";
import { AuthPage } from "../auth/AuthPage";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import CampusAllocationPie from "./components/CampusAllocationPie";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { UserService } from "@/services/user.service";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppHeader } from "@/components/shared/AppHeader";

const tabs = ["Announcements", "Allocations/Events"]

export function DashboardPage() {
    const { claims, loading } = useAuth();
    const isMobile = useIsMobile();
    const [tab, setTab] = useState(tabs[0]);

    if (!claims || claims.role === '') return <AuthPage />
    if (loading) return <CvSULoading />
    return (
        <>

            {isMobile ? (
                <section className="relative stack-md reveal mt-15 h-screen overflow-y-auto">
                    <div className={`sticky top-0 bg-slate-100 z-50 flex justify-evenly gap-4 font-semibold text-gray pb-2`}>
                        {tabs.map((item) => (
                            <button
                                key={item}
                                className={`pb-2 ${tab === item ? "text-darkgreen border-b-darkgreen border-b-2" : ""}`}
                                onClick={() => setTab(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <AppHeader label={tab === tabs[0] ? "Announcements" : "Allocations/Events"} />
                    {tab === tabs[0] ? (
                        <Announcements 
                            claims={ claims }
                            className="w-full"
                        />
                    ) : (
                        <>
                            <CampusAllocationPie />
                            <Calendar
                                className="w-full mt-4 pb-24"
                            />
                        </>
                    )}
                </section>
                
            ) : (
                <section className="stack-md reveal">
                    <div className="grid grid-cols-2 gap-4 reveal">
                        <Announcements 
                            claims={ claims }
                            className="w-full h-screen overflow-y-auto"
                        />
                            
                        <ScrollArea className="h-screen">
                            <CampusAllocationPie />
                            <Calendar
                                className="w-full mt-4"
                            />
                        </ScrollArea>
                    </div>
                </section>
            )}

            
        </>
    )
}