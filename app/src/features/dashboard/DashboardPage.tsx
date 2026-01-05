"use client"

import { useAuth } from "@/hooks/use-auth";
import { CvSULoading } from "@/components/ui/loader";
import { Announcements } from "./components/Announcements";
import { Calendar } from "../events/components/Calendar";
import { AuthPage } from "../auth/AuthPage";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import CampusAllocationPie from "./components/CampusAllocationPie";
import { ScrollArea } from "@/components/ui/scroll-area";

const tabs = ["Events and Announcements", "Allocations Graph"]

export function DashboardPage() {
    const { claims, loading } = useAuth();
    const [tab, setTab] = useState(tabs[0]);

    if (!claims) return <AuthPage />
    if (loading) return <CvSULoading />
    return (
        <section className="stack-md reveal">
            <div className="flex-center-y gap-8">
                {/* {tabs.map((item) => (
                    <button 
                        key={item}
                        onClick={ () => setTab(item) }
                        className={`font-semibold text-gray text-lg ${tab === item && "!text-darkgreen "}`}           
                    >
                        { item }
                    </button>
                ))} */}
            </div>

            {/* <Separator className="h-2 bg-gray-300" /> */}

            {tab === tabs[0] && (
                <div className="grid grid-cols-2 gap-4 reveal">
                    <Announcements 
                        claims={ claims }
                        className="w-full"
                    />
                        
                    <ScrollArea className="h-screen">
                        <CampusAllocationPie />
                        <Calendar
                            className="w-full mt-4"
                        />
                    </ScrollArea>
                </div>
            )}

            {tab === tabs[1] && (
                <div className="reveal">
                    <CampusAllocationPie />
                </div>
            )}
           
            
        </section>
    )
}