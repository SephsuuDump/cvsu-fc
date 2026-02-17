import { AppRUDSelection } from "@/components/shared/AppRUDSelection";
import { Separator } from "@/components/ui/separator";
import { useCrudState } from "@/hooks/use-crud-state";
import { formatDateToWord } from "@/lib/helper";
import { Officer } from "@/types/officer";
import { Inbox } from "lucide-react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { DeactivateOfficer } from "./DeleteOfficer";

export function OfficerList({ items, setReload }: {
    items: Officer;
    setReload: Dispatch<SetStateAction<boolean>>;
}) {
    const { toDelete, setDelete } = useCrudState<{
        id: number;
        name: string;
        assigned_date: string;
    }>();
    return (
        <div className="bg-slate-50 -mt-2 table-wrapper">
            <div className="thead flex-center-y">
                <div className="w-full grid grid-cols-3">
                    <div className="th">Position</div>
                    <div className="th">Name</div>
                    <div className="th">Date Assigned</div>
                </div>
                <div className="th w-10"></div>
            </div>
            <Separator className="h-3 bg-slate-300" />
            {items?.organization.length === 0 && (
                <div className="py-10 flex-center flex-col gap-2 text-gray-500">
                    <Inbox className="text-gray w-10 h-10" />
                    <div>No officers found.</div>
                </div>
            )}

            {items?.organization.map((item, i) => (
                <div className="tdata flex-center-y" key={i}>
                    <div className="w-full grid grid-cols-3">
                        <div className="td">{ item.position_name }</div>
                        <div className="td stack-lg">
                            { item.assignments.length === 0 && (<div className="text-gray">N/A</div>)}
                            { item.assignments.map((subItem) => (
                                <div key={subItem.id}>{ subItem.name }</div>
                            )) }
                        </div>
                        <div className="td stack-lg">
                            { item.assignments.length === 0 && (<div className="text-gray">N/A</div>)}
                            { item.assignments.map((subItem) => (
                                <div key={subItem.id}>{ formatDateToWord(subItem.assigned_date) }</div>
                            )) }
                        </div>
                    </div>
                    <div className="stack-lg">
                        { item.assignments.length === 0 && (<div className="w-10"></div>)}
                        {item.assignments.map((subItem) => (
                            <AppRUDSelection 
                                key={subItem.id}
                                className="mx-auto w-10"
                                item={ subItem }
                                setDelete={ setDelete }
                            />
                        ))}
                    </div>
                    
                </div>
            ))}

            {toDelete && (
                <DeactivateOfficer 
                    setDeactivate={ setDelete }
                    toDeactivate={ toDelete }
                    setReload={ setReload }
                />
            )}
        </div>
    )
}