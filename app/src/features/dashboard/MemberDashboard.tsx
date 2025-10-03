"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { Announcements } from "./components/Announcements";
import { useEffect, useState } from "react";

export function MemberDashboard() {
    const [atTop, setAtTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setAtTop(window.scrollY === 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="stack-md">
            
            <div className="row-md">
                <div className="w-full">
                    
                    <Announcements />
                </div>
                
                <div className="w-full border-1 h-50">
                    
                </div>
            </div>
       
        </section>
    )
}