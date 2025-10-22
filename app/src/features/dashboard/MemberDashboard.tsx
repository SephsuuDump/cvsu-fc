"use client"
import { Announcements } from "./components/Announcements";

export function MemberDashboard() {
    return (
        <section className="stack-md reveal">
            
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