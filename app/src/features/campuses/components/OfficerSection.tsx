"use client"

import { useCrudState } from "@/hooks/use-crud-state";
import { Officer, Position } from "@/types/officer";
import { CreateOfficer } from "./CreateOfficer";
import { Inbox, Plus, UserRoundPen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useFetchData } from "@/hooks/use-fetch-data";
import { OfficerService, PositionService } from "@/services/officer.service";
import { SectionLoading } from "@/components/ui/loader";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { OfficerList } from "./OfficerList";
import { PositionList } from "./PositionList";
import { Button } from "@/components/ui/button";

export function OfficersSection({ campusId }: {
    campusId: number
}) {
    const [reload, setReload] = useState(false);
    const [tab, setTab] = useState("OFFICER LIST");

    const {
        data: officers,
        loading: officersLoading
    } = useFetchOne<Officer>(
        OfficerService.getOfficersByCampus,
        [campusId, reload],
        [campusId]
    );

    const {
        data: positions,
        loading: positionsLoading
    } = useFetchData<Position>(
        PositionService.getAllPositions,
        [reload]
    );

    const loading =
    tab === "OFFICER LIST"
        ? officersLoading
        : positionsLoading;

    const { open: openOfficer, setOpen: setOpenOfficer } = useCrudState<Partial<Officer>>();
    const { open: openPosition, setOpen: setOpenPosition } = useCrudState<Partial<Position>>();

    if (loading) return <SectionLoading />
    return (
        <section className="stack-md reveal">
            <div className="flex">
                <div className="bg-slate-50 w-fit rounded-t-lg shadow-sx border-slate-200">
                    {["OFFICER LIST", "POSITIONS"].map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setTab(item)}
                            className={`w-40 text-[14px] p-2.5 rounded-t-lg ${item === tab && 'bg-green-200 font-semibold'}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <div className="ms-auto flex-center-y gap-1.5">
                    <Button
                        onClick={ () => {tab === "OFFICER LIST" ? setOpenOfficer(!openOfficer) : setOpenPosition(!openPosition)} }
                        className="!bg-darkgreen hover:opacity-90"
                    >
                        <Plus />{tab === "OFFICER LIST" ? "Assign an officer" : "Add position"}
                    </Button>
                </div>
            </div>

            {tab === "OFFICER LIST" && (
                <OfficerList 
                    items={ officers! }
                />
            )}

            {tab === "POSITIONS" && (
                <PositionList 
                    items={ positions }
                />
            )}

            
            
            {openOfficer && (
                <CreateOfficer  
                    setOpen={ setOpenOfficer }
                    setReload={ setReload }
                />
            )}

        </section>
    )
}
